// ChessOS — Move Replay & Interactive Variation Explorer
import { ChessEngine } from './chess-engine.js';

export class ReplaySystem {
  constructor(board, moveData, options = {}) {
    this.board = board;
    this.moveData = moveData; // Mainline moves with annotations
    this.options = options;
    
    this.currentIndex = -1; // Start before first move
    this.isPlaying = false;
    this.playInterval = null;
    this.history = []; // FEN stack for undo/redo
    
    // Set initial FEN
    this.initialFen = options.initialFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.engine = new ChessEngine(this.initialFen);
    
    this.onMoveChange = options.onMoveChange || null;
    this.onPlayStateChange = options.onPlayStateChange || null;

    this._precomputeHistory();
  }

  // Pre-calculate board positions for instant navigation
  _precomputeHistory() {
    this.history = [this.initialFen];
    const tempEngine = new ChessEngine(this.initialFen);
    
    for (const step of this.moveData) {
      const move = tempEngine.move(step.move);
      if (move) {
        this.history.push(tempEngine.fen());
      } else {
        this.history.push(tempEngine.fen()); // Fallback
      }
    }
  }

  // Navigation commands
  next() {
    if (this.currentIndex < this.moveData.length - 1) {
      this.currentIndex++;
      this._updateBoard();
      return true;
    }
    this.pause();
    return false;
  }

  prev() {
    if (this.currentIndex >= 0) {
      this.currentIndex--;
      this._updateBoard();
      return true;
    }
    return false;
  }

  goTo(index) {
    if (index >= -1 && index < this.moveData.length) {
      this.currentIndex = index;
      this._updateBoard();
      return true;
    }
    return false;
  }

  play(speedMs = 1500) {
    if (this.isPlaying) return;
    this.isPlaying = true;
    if (this.onPlayStateChange) this.onPlayStateChange(true);
    
    this.playInterval = setInterval(() => {
      const moved = this.next();
      if (!moved) {
        this.pause();
      }
    }, speedMs);
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    clearInterval(this.playInterval);
    this.playInterval = null;
    if (this.onPlayStateChange) this.onPlayStateChange(false);
  }

  _updateBoard() {
    const fen = this.history[this.currentIndex + 1];
    this.engine.load(fen);
    this.board.setFEN(fen);

    const currentMove = this.moveData[this.currentIndex];
    if (this.onMoveChange) {
      this.onMoveChange(this.currentIndex, currentMove);
    }
  }

  // Render PGN move lists or variation trees
  renderMoveListHTML() {
    return `
      <div class="replay-moves-list">
        ${this.moveData.map((step, idx) => {
          const isActive = idx === this.currentIndex;
          const moveNum = Math.floor(idx / 2) + 1;
          const isWhite = idx % 2 === 0;
          
          return `
            ${isWhite ? `<span class="replay-move-num">${moveNum}.</span>` : ''}
            <span class="replay-move-item ${isActive ? 'active' : ''}" 
                  onclick="App.replayGoTo(${idx})">
              ${step.move}
            </span>
          `;
        }).join('')}
      </div>
    `;
  }

  // Render variation explorer tree nodes
  renderVariationTreeHTML() {
    // Generate tree format for variations
    // Mainline: Bxf7+ -> Kxf7 -> Nxe5+
    // Sideline: Bxf7+ -> Kh8 -> Ng5
    return `
      <div class="variation-tree">
        <div class="variation-node main" onclick="App.replayGoTo(0)">
          <strong>Bxf7+ (Main Line)</strong>
          <div class="variation-branch">
            <div class="variation-node" onclick="App.replayGoTo(1)">
              ├─ Kxf7
              <div class="variation-branch">
                <div class="variation-node" onclick="App.replayGoTo(2)">└─ Nxe5+</div>
              </div>
            </div>
            <div class="variation-node" onclick="App.loadSideline('Bxf7+ Kh8')">
              └─ Kh8 (Alternative defense)
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
