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
  evalScore?: number; // centipawns from white's perspective
}

// LRU Cache for position evaluations
class PositionCache {
  private cache = new Map<string, AnalysisResult>();
  private maxSize: number;

  constructor(maxSize = 500) {
    this.maxSize = maxSize;
  }

  get(key: string): AnalysisResult | undefined {
    const val = this.cache.get(key);
    if (val) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, val);
    }
    return val;
  }

  set(key: string, value: AnalysisResult): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove oldest (first entry)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

class StockfishService {
  private worker: Worker | null = null;
  private status: 'idle' | 'loading' | 'ready' | 'error' = 'idle';
  private analysisResolve: ((res: AnalysisResult) => void) | null = null;
  private analysisReject: ((err: Error) => void) | null = null;
  private currentLines: PVLine[] = [];
  private bestMoveFound: string | null = null;
  private onInfoCallback: ((lines: PVLine[]) => void) | null = null;
  private cache = new PositionCache(500);
  private initPromise: Promise<void> | null = null;
  private isWarmedUp = false;

  public init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    if (this.status === 'ready') return Promise.resolve();
    this.status = 'loading';

    this.initPromise = new Promise<void>((resolve, reject) => {
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
            // Use fewer MultiPV lines for faster response
            this.send('setoption name MultiPV value 1');
            // Limit hash to be fast
            this.send('setoption name Hash value 16');
            // Warm up the engine
            this.warmUp();
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

    return this.initPromise;
  }

  // Warm up engine with a quick search from starting position
  private warmUp(): void {
    if (this.isWarmedUp) return;
    this.send('isready');
    this.send('position startpos');
    this.send('go movetime 1');
    this.isWarmedUp = true;
  }

  public send(cmd: string): void {
    if (this.worker && (this.status === 'ready' || this.status === 'loading')) {
      this.worker.postMessage(cmd);
    }
  }

  public stop(): void {
    this.send('stop');
    this.resolveAnalysis();
  }

  /**
   * Quick move for AI play — uses movetime instead of depth for predictable response times.
   * @param fen Current position
   * @param movetime Time in ms for the engine to think
   * @returns Promise with the best move result
   */
  public quickMove(fen: string, movetime: number): Promise<AnalysisResult> {
    // Check cache first
    const cacheKey = `${fen}:mt${movetime}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return Promise.resolve(cached);
    }

    return this.init().then(() => {
      this.send('stop');
      this.currentLines = [];
      this.bestMoveFound = null;
      this.onInfoCallback = null;

      return new Promise<AnalysisResult>((resolve, reject) => {
        this.analysisResolve = (result) => {
          // Cache the result
          this.cache.set(cacheKey, result);
          resolve(result);
        };
        this.analysisReject = reject;

        this.send('isready');
        this.send(`position fen ${fen}`);
        this.send(`go movetime ${movetime}`);
      });
    });
  }

  /**
   * Full analysis with MultiPV — for position analysis and game review.
   * Uses depth-based search with streaming info callback.
   */
  public analyze(fen: string, depth = 15, onInfo: ((lines: PVLine[]) => void) | null = null): Promise<AnalysisResult> {
    this.onInfoCallback = onInfo;
    this.currentLines = [];
    this.bestMoveFound = null;

    return this.init().then(() => {
      this.send('stop');
      // Enable MultiPV for full analysis
      this.send('setoption name MultiPV value 5');

      return new Promise<AnalysisResult>((resolve, reject) => {
        this.analysisResolve = (result) => {
          // Reset to single PV for quick moves
          this.send('setoption name MultiPV value 1');
          resolve(result);
        };
        this.analysisReject = reject;

        this.send(`position fen ${fen}`);
        this.send(`go depth ${depth}`);
      });
    });
  }

  /**
   * Quick eval — get a fast evaluation of a position (for game review).
   * Uses movetime 100ms for speed.
   */
  public quickEval(fen: string): Promise<AnalysisResult> {
    const cacheKey = `eval:${fen}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return Promise.resolve(cached);

    return this.init().then(() => {
      this.send('stop');
      this.currentLines = [];
      this.bestMoveFound = null;
      this.onInfoCallback = null;

      return new Promise<AnalysisResult>((resolve, reject) => {
        this.analysisResolve = (result) => {
          this.cache.set(cacheKey, result);
          resolve(result);
        };
        this.analysisReject = reject;

        this.send(`position fen ${fen}`);
        this.send(`go movetime 100`);
      });
    });
  }

  private resolveAnalysis(): void {
    if (this.analysisResolve) {
      const sortedLines = [...this.currentLines].sort((a, b) => b.score - a.score);
      const evalScore = sortedLines.length > 0 ? sortedLines[0].score : 0;
      this.analysisResolve({
        bestMove: this.bestMoveFound,
        lines: sortedLines,
        evalScore,
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
