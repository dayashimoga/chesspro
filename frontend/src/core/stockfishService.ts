export interface PVLine {
  depth: number;
  multipv: number;
  score: number;
  scoreType: string;
  displayScore: string;
  pv: string[];
}

export interface AnalysisResult {
  bestMove: string | null;
  lines: PVLine[];
}

class StockfishService {
  private worker: Worker | null = null;
  private status: 'idle' | 'loading' | 'ready' | 'error' = 'idle';
  private analysisResolve: ((res: AnalysisResult) => void) | null = null;
  private analysisReject: ((err: Error) => void) | null = null;
  private currentLines: PVLine[] = [];
  private bestMoveFound: string | null = null;
  private onInfoCallback: ((lines: PVLine[]) => void) | null = null;

  public init(): Promise<void> {
    if (this.worker) return Promise.resolve();
    this.status = 'loading';

    return new Promise<void>((resolve, reject) => {
      try {
        const blobCode = `
          self.onmessage = function(e) {
            // Forward messages to Stockfish instance inside worker
          };
          try {
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');
            if (typeof STOCKFISH === 'function') {
              const sf = STOCKFISH();
              sf.onmessage = function(line) {
                self.postMessage(line);
              };
              self.onmessage = function(e) {
                sf.postMessage(e.data);
              };
              self.postMessage('worker_ready');
            } else {
              self.postMessage('worker_error: STOCKFISH function not found');
            }
          } catch(err) {
            self.postMessage('worker_error: ' + err.message);
          }
        `;
        const blob = new Blob([blobCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        this.worker = new Worker(workerUrl);

        this.worker.onmessage = (e: MessageEvent) => {
          const line = e.data as string;
          
          if (line === 'worker_ready') {
            this.status = 'ready';
            this.send('uci');
            this.send('setoption name MultiPV value 5');
            resolve();
          } else if (line.startsWith('worker_error')) {
            this.status = 'error';
            console.error('Stockfish worker error:', line);
            reject(new Error(line));
          } else {
            this.handleStockfishOutput(line);
          }
        };

        this.worker.onerror = (err) => {
          this.status = 'error';
          console.error('Stockfish worker runtime error:', err);
          reject(err);
        };
      } catch (err) {
        this.status = 'error';
        console.error('Failed to initialize Stockfish worker:', err);
        reject(err as Error);
      }
    });
  }

  public send(cmd: string): void {
    if (this.worker && this.status === 'ready') {
      this.worker.postMessage(cmd);
    }
  }

  public stop(): void {
    this.send('stop');
    this.resolveAnalysis();
  }

  public analyze(fen: string, depth = 15, onInfo: ((lines: PVLine[]) => void) | null = null): Promise<AnalysisResult> {
    this.onInfoCallback = onInfo;
    this.currentLines = [];
    this.bestMoveFound = null;

    return this.init().then(() => {
      this.send('stop');

      return new Promise<AnalysisResult>((resolve, reject) => {
        this.analysisResolve = resolve;
        this.analysisReject = reject;

        this.send(`position fen ${fen}`);
        this.send(`go depth ${depth}`);
      });
    });
  }

  private resolveAnalysis(): void {
    if (this.analysisResolve) {
      const sortedLines = [...this.currentLines].sort((a, b) => b.score - a.score);
      this.analysisResolve({
        bestMove: this.bestMoveFound,
        lines: sortedLines
      });
    }
    this.analysisResolve = null;
    this.analysisReject = null;
  }

  private handleStockfishOutput(line: string): void {
    if (line.startsWith('info') && line.includes('pv')) {
      const parsed = this.parseInfoLine(line);
      if (parsed) {
        const existingIdx = this.currentLines.findIndex(l => l.multipv === parsed.multipv);
        if (existingIdx >= 0) {
          this.currentLines[existingIdx] = parsed;
        } else {
          this.currentLines.push(parsed);
        }

        if (this.onInfoCallback) {
          this.onInfoCallback(this.currentLines);
        }
      }
    } else if (line.startsWith('bestmove')) {
      const parts = line.split(' ');
      this.bestMoveFound = parts[1];
      this.resolveAnalysis();
    }
  }

  private parseInfoLine(line: string): PVLine | null {
    const parts = line.split(' ');
    
    const depthIdx = parts.indexOf('depth');
    const scoreIdx = parts.indexOf('score');
    const pvIdx = parts.indexOf('pv');
    const multipvIdx = parts.indexOf('multipv');

    if (depthIdx === -1 || scoreIdx === -1 || pvIdx === -1) return null;

    const depth = parseInt(parts[depthIdx + 1]);
    const multipv = multipvIdx !== -1 ? parseInt(parts[multipvIdx + 1]) : 1;
    
    const scoreType = parts[scoreIdx + 1];
    let scoreVal = parseInt(parts[scoreIdx + 2]);
    let displayScore = '';

    if (scoreType === 'mate') {
      displayScore = `M${scoreVal}`;
      scoreVal = scoreVal > 0 ? 100000 - scoreVal : -100000 - scoreVal;
    } else {
      displayScore = (scoreVal / 100).toFixed(2);
      if (scoreVal > 0) displayScore = `+${displayScore}`;
    }

    const pv = parts.slice(pvIdx + 1);

    return {
      depth,
      multipv,
      score: scoreVal,
      scoreType,
      displayScore,
      pv
    };
  }
}

export const stockfishService = new StockfishService();
export default stockfishService;
