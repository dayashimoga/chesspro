// ChessOS — Stockfish Engine Integration Service (Client-Side Worker)

class StockfishService {
  constructor() {
    this.worker = null;
    this.status = 'idle'; // 'idle', 'loading', 'ready', 'error'
    this.analysisPromise = null;
    this.analysisResolve = null;
    this.analysisReject = null;
    
    // Cache for analysis lines
    this.currentLines = [];
    this.bestMoveFound = null;
    this.onInfoCallback = null;
  }

  init() {
    if (this.worker) return Promise.resolve();
    this.status = 'loading';

    return new Promise((resolve, reject) => {
      try {
        // Create worker via blob to bypass CORS limitations on local static sites
        const blobCode = `
          self.onmessage = function(e) {
            // Forward messages to Stockfish instance inside worker
          };
          try {
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');
            // Check if stockfish is initialized
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

        this.worker.onmessage = (e) => {
          const line = e.data;
          
          if (line === 'worker_ready') {
            this.status = 'ready';
            // Configure Stockfish with default UCI settings
            this.send('uci');
            this.send('setoption name MultiPV value 5'); // Analyze top 5 lines
            resolve();
          } else if (line.startsWith('worker_error')) {
            this.status = 'error';
            console.error('Stockfish worker error:', line);
            reject(new Error(line));
          } else {
            this._handleStockfishOutput(line);
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
        reject(err);
      }
    });
  }

  send(cmd) {
    if (this.worker && this.status === 'ready') {
      this.worker.postMessage(cmd);
    }
  }

  // Stop current analysis
  stop() {
    this.send('stop');
    if (this.analysisReject) {
      // Don't reject, just resolve current state
      this._resolveAnalysis();
    }
  }

  // Analyze a position
  analyze(fen, depth = 15, onInfo = null) {
    this.onInfoCallback = onInfo;
    this.currentLines = [];
    this.bestMoveFound = null;

    return this.init().then(() => {
      // Stop any running search first
      this.send('stop');

      return new Promise((resolve, reject) => {
        this.analysisResolve = resolve;
        this.analysisReject = reject;

        // Set position and start search
        this.send(`position fen ${fen}`);
        this.send(`go depth ${depth}`);
      });
    });
  }

  _resolveAnalysis() {
    if (this.analysisResolve) {
      // Sort lines by score
      const sortedLines = [...this.currentLines].sort((a, b) => b.score - a.score);
      this.analysisResolve({
        bestMove: this.bestMoveFound,
        lines: sortedLines
      });
    }
    this.analysisResolve = null;
    this.analysisReject = null;
  }

  _handleStockfishOutput(line) {
    // Parse Stockfish UCI lines
    // Example: info depth 10 seldepth 14 score cp -45 nodes 12903 nps 129030 pv e2e4 e7e5 g1f3
    if (line.startsWith('info') && line.includes('pv')) {
      const parsed = this._parseInfoLine(line);
      if (parsed) {
        // Update or insert PV line
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
      // Example: bestmove e2e4 ponder e7e5
      const parts = line.split(' ');
      this.bestMoveFound = parts[1];
      this._resolveAnalysis();
    }
  }

  _parseInfoLine(line) {
    const parts = line.split(' ');
    
    const depthIdx = parts.indexOf('depth');
    const scoreIdx = parts.indexOf('score');
    const pvIdx = parts.indexOf('pv');
    const multipvIdx = parts.indexOf('multipv');

    if (depthIdx === -1 || scoreIdx === -1 || pvIdx === -1) return null;

    const depth = parseInt(parts[depthIdx + 1]);
    const multipv = multipvIdx !== -1 ? parseInt(parts[multipvIdx + 1]) : 1;
    
    // Score type: cp (centipawns) or mate
    const scoreType = parts[scoreIdx + 1];
    let scoreVal = parseInt(parts[scoreIdx + 2]);
    let displayScore = '';

    if (scoreType === 'mate') {
      displayScore = `M${scoreVal}`;
      // Map mate to high centipawn values for sorting
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
