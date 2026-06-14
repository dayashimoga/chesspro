// ChessOS — Chess Engine (wraps chess.js for game logic)
import { Chess } from 'chess.js';

export class ChessEngine {
  constructor(fen) {
    this.game = new Chess(fen || undefined);
    this.history = [];
    this.listeners = [];
  }

  // State
  fen() { return this.game.fen(); }
  turn() { return this.game.turn(); }
  isCheck() { return this.game.isCheck(); }
  isCheckmate() { return this.game.isCheckmate(); }
  isStalemate() { return this.game.isStalemate(); }
  isDraw() { return this.game.isDraw(); }
  isGameOver() { return this.game.isGameOver(); }
  isThreefoldRepetition() { return this.game.isThreefoldRepetition(); }
  isInsufficientMaterial() { return this.game.isInsufficientMaterial(); }

  // Moves
  moves(opts) { return this.game.moves(opts || { verbose: true }); }
  
  move(moveObj) {
    try {
      const result = this.game.move(moveObj);
      if (result) {
        this.history.push(result);
        this._notify('move', result);
      }
      return result;
    } catch (e) {
      return null;
    }
  }

  undo() {
    const result = this.game.undo();
    if (result) {
      this.history.pop();
      this._notify('undo', result);
    }
    return result;
  }

  reset() {
    this.game.reset();
    this.history = [];
    this._notify('reset');
  }

  load(fen) {
    try {
      this.game.load(fen);
      this.history = [];
      this._notify('load');
      return true;
    } catch {
      return false;
    }
  }

  loadPgn(pgn) {
    try {
      this.game.loadPgn(pgn);
      this.history = this.game.history({ verbose: true });
      this._notify('load');
      return true;
    } catch {
      return false;
    }
  }

  pgn() { return this.game.pgn(); }

  // Board state
  board() { return this.game.board(); }
  
  get(square) { return this.game.get(square); }

  squareColor(square) {
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]) - 1;
    return (file + rank) % 2 === 0 ? 'dark' : 'light';
  }

  // Get all pieces of a color
  pieces(color) {
    const result = [];
    const board = this.board();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece && piece.color === color) {
          const file = String.fromCharCode(97 + f);
          const rank = 8 - r;
          result.push({ ...piece, square: `${file}${rank}` });
        }
      }
    }
    return result;
  }

  // Get legal moves for a specific square
  legalMoves(square) {
    return this.moves({ square, verbose: true });
  }

  // Check if a move is legal
  isLegalMove(from, to) {
    const moves = this.legalMoves(from);
    return moves.some(m => m.to === to);
  }

  // Get the last move
  lastMove() {
    return this.history.length > 0 ? this.history[this.history.length - 1] : null;
  }

  // Get formatted move history
  moveHistory() {
    const pairs = [];
    for (let i = 0; i < this.history.length; i += 2) {
      pairs.push({
        number: Math.floor(i / 2) + 1,
        white: this.history[i],
        black: this.history[i + 1] || null
      });
    }
    return pairs;
  }

  // Clone
  clone() {
    const engine = new ChessEngine(this.fen());
    engine.history = [...this.history];
    return engine;
  }

  // Events
  on(event, fn) { this.listeners.push({ event, fn }); }
  off(event, fn) { this.listeners = this.listeners.filter(l => !(l.event === event && l.fn === fn)); }
  _notify(event, data) {
    this.listeners.filter(l => l.event === event).forEach(l => l.fn(data));
  }

  // Material count
  material() {
    const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    let white = 0, black = 0;
    const board = this.board();
    for (const row of board) {
      for (const piece of row) {
        if (piece) {
          const val = values[piece.type] || 0;
          if (piece.color === 'w') white += val;
          else black += val;
        }
      }
    }
    return { white, black, advantage: white - black };
  }

  // Position evaluation (basic)
  evaluate() {
    if (this.isCheckmate()) return this.turn() === 'w' ? -Infinity : Infinity;
    if (this.isDraw()) return 0;
    
    const pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
    let score = 0;
    const board = this.board();
    
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece) {
          const value = pieceValues[piece.type];
          score += piece.color === 'w' ? value : -value;
        }
      }
    }
    return score;
  }

  // Get game status text
  statusText() {
    if (this.isCheckmate()) return `Checkmate! ${this.turn() === 'w' ? 'Black' : 'White'} wins!`;
    if (this.isStalemate()) return 'Stalemate — Draw';
    if (this.isThreefoldRepetition()) return 'Threefold Repetition — Draw';
    if (this.isInsufficientMaterial()) return 'Insufficient Material — Draw';
    if (this.isDraw()) return 'Draw';
    if (this.isCheck()) return `${this.turn() === 'w' ? 'White' : 'Black'} is in check!`;
    return `${this.turn() === 'w' ? 'White' : 'Black'} to move`;
  }
}

export default ChessEngine;
