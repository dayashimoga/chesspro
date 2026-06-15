// ChessOS — Chess Engine Wrapper (TypeScript)
import { Chess, Move, Square, Color } from 'chess.js';

export class ChessEngine {
  private game: Chess;

  constructor(fen?: string) {
    if (fen) {
      try {
        this.game = new Chess(fen);
      } catch {
        this.game = new Chess();
      }
    } else {
      this.game = new Chess();
    }
  }

  // Core
  fen(): string { return this.game.fen(); }
  turn(): Color { return this.game.turn(); }
  board() { return this.game.board(); }
  isGameOver(): boolean { return this.game.isGameOver(); }
  isCheck(): boolean { return this.game.isCheck(); }
  isCheckmate(): boolean { return this.game.isCheckmate(); }
  isDraw(): boolean { return this.game.isDraw(); }
  isStalemate(): boolean { return this.game.isStalemate(); }
  history(): string[] { return this.game.history(); }

  load(fen: string): boolean {
    try { this.game.load(fen); return true; }
    catch { return false; }
  }

  reset(): void { this.game.reset(); }

  move(moveInput: string | { from: string; to: string; promotion?: string }): Move | null {
    try {
      return this.game.move(moveInput as any);
    } catch {
      return null;
    }
  }

  undo(): Move | null {
    return this.game.undo();
  }

  legalMoves(square?: string): Move[] {
    if (square) {
      return this.game.moves({ square: square as Square, verbose: true });
    }
    return this.game.moves({ verbose: true });
  }

  get(square: string) {
    return this.game.get(square as Square) || null;
  }

  lastMove(): { from: string; to: string } | null {
    const hist = this.game.history({ verbose: true });
    if (hist.length === 0) return null;
    const last = hist[hist.length - 1];
    return { from: last.from, to: last.to };
  }

  statusText(): string {
    if (this.isCheckmate()) {
      return this.turn() === 'w' ? 'Black wins by checkmate!' : 'White wins by checkmate!';
    }
    if (this.isStalemate()) return 'Draw by stalemate';
    if (this.isDraw()) return 'Draw';
    if (this.isCheck()) return `${this.turn() === 'w' ? 'White' : 'Black'} is in check`;
    return `${this.turn() === 'w' ? 'White' : 'Black'} to move`;
  }

  // Basic material evaluation
  evaluate(): number {
    const values: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
    let score = 0;
    const b = this.board();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = b[r][f];
        if (piece) {
          const val = values[piece.type] || 0;
          score += piece.color === 'w' ? val : -val;
        }
      }
    }
    return this.turn() === 'w' ? score : -score;
  }

  // Minimax AI for play-vs-AI
  findBestMove(depth: number = 3): string | null {
    if (this.game.isGameOver()) return null;
    const moves = this.game.moves();
    if (moves.length === 0) return null;

    let bestMove = moves[0];
    let bestScore = -Infinity;

    for (const move of moves) {
      this.game.move(move);
      const score = -this.minimax(depth - 1, -Infinity, Infinity, false);
      this.game.undo();
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  private minimax(depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
    if (depth === 0 || this.game.isGameOver()) {
      return this.evaluate();
    }
    const moves = this.game.moves();
    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const move of moves) {
        this.game.move(move);
        const score = this.minimax(depth - 1, alpha, beta, false);
        this.game.undo();
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const move of moves) {
        this.game.move(move);
        const score = this.minimax(depth - 1, alpha, beta, true);
        this.game.undo();
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
      return minScore;
    }
  }
}

export default ChessEngine;
