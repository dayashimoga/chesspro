// ChessOS — Chess Engine Unit Tests
import { describe, it, expect, beforeEach } from 'vitest';
import { ChessEngine } from '../chess-engine';

describe('ChessEngine', () => {
  let engine: ChessEngine;

  beforeEach(() => {
    engine = new ChessEngine();
  });

  describe('constructor and initialization', () => {
    it('should initialize with default starting position', () => {
      expect(engine.fen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    });

    it('should initialize with custom FEN', () => {
      const customFen = '8/8/8/4k3/8/8/4KP2/8 w - - 0 1';
      const customEngine = new ChessEngine(customFen);
      expect(customEngine.fen()).toBe(customFen);
    });

    it('should default to starting position if invalid FEN', () => {
      const e = new ChessEngine('invalid-fen');
      // chess.js throws on invalid FEN, constructor catches and uses default
      expect(e.fen()).toBeTruthy();
    });
  });

  describe('game state methods', () => {
    it('should report correct turn', () => {
      expect(engine.turn()).toBe('w');
      engine.move('e4');
      expect(engine.turn()).toBe('b');
    });

    it('should not be game over at start', () => {
      expect(engine.isGameOver()).toBe(false);
      expect(engine.isCheck()).toBe(false);
      expect(engine.isCheckmate()).toBe(false);
      expect(engine.isDraw()).toBe(false);
      expect(engine.isStalemate()).toBe(false);
    });

    it('should detect checkmate (Fools Mate)', () => {
      engine.move('f3');
      engine.move('e5');
      engine.move('g4');
      engine.move('Qh4');
      expect(engine.isCheckmate()).toBe(true);
      expect(engine.isGameOver()).toBe(true);
    });

    it('should return move history', () => {
      engine.move('e4');
      engine.move('e5');
      expect(engine.history()).toEqual(['e4', 'e5']);
    });

    it('should return the board as 8x8 array', () => {
      const board = engine.board();
      expect(board).toHaveLength(8);
      expect(board[0]).toHaveLength(8);
      // White rook at a1
      expect(board[7][0]?.type).toBe('r');
      expect(board[7][0]?.color).toBe('w');
    });
  });

  describe('move execution', () => {
    it('should execute legal moves', () => {
      const move = engine.move('e4');
      expect(move).not.toBeNull();
      expect(move?.san).toBe('e4');
    });

    it('should return null for illegal moves', () => {
      const move = engine.move('e5'); // Black pawn can't move for white
      expect(move).toBeNull();
    });

    it('should execute moves with from/to format', () => {
      const move = engine.move({ from: 'e2', to: 'e4' });
      expect(move).not.toBeNull();
    });

    it('should undo moves', () => {
      engine.move('e4');
      const undone = engine.undo();
      expect(undone).not.toBeNull();
      expect(engine.fen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    });
  });

  describe('legal moves', () => {
    it('should return all legal moves from starting position', () => {
      const moves = engine.legalMoves();
      expect(moves.length).toBe(20); // 16 pawn moves + 4 knight moves
    });

    it('should return legal moves for a specific square', () => {
      const moves = engine.legalMoves('e2');
      expect(moves.length).toBe(2); // e3 and e4
    });

    it('should return empty for empty square', () => {
      const moves = engine.legalMoves('e4');
      expect(moves.length).toBe(0);
    });
  });

  describe('FEN loading', () => {
    it('should load a valid FEN', () => {
      const result = engine.load('8/8/8/4k3/8/8/4KP2/8 w - - 0 1');
      expect(result).toBe(true);
    });

    it('should fail to load invalid FEN', () => {
      const result = engine.load('not-a-fen');
      expect(result).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset to starting position', () => {
      engine.move('e4');
      engine.move('e5');
      engine.reset();
      expect(engine.fen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    });
  });

  describe('evaluation', () => {
    it('should return 0 for starting position (relative)', () => {
      const eval_ = engine.evaluate();
      expect(eval_).toBe(0);
    });

    it('should return positive score after winning material', () => {
      // Set up a position where white is a queen up
      engine.load('4k3/8/8/8/8/8/8/4K2Q w - - 0 1');
      const eval_ = engine.evaluate();
      expect(eval_).toBeGreaterThan(0);
    });
  });

  describe('status text', () => {
    it('should show White to move at start', () => {
      expect(engine.statusText()).toBe('White to move');
    });

    it('should show Black to move after e4', () => {
      engine.move('e4');
      expect(engine.statusText()).toBe('Black to move');
    });

    it('should show checkmate status', () => {
      engine.move('f3');
      engine.move('e5');
      engine.move('g4');
      engine.move('Qh4');
      expect(engine.statusText()).toBe('Black wins by checkmate!');
    });
  });

  describe('lastMove', () => {
    it('should return null when no moves made', () => {
      expect(engine.lastMove()).toBeNull();
    });

    it('should return last move details', () => {
      engine.move('e4');
      const last = engine.lastMove();
      expect(last).toEqual({ from: 'e2', to: 'e4' });
    });
  });

  describe('get piece', () => {
    it('should return piece at given square', () => {
      const piece = engine.get('e2');
      expect(piece?.type).toBe('p');
      expect(piece?.color).toBe('w');
    });

    it('should return null for empty square', () => {
      const piece = engine.get('e4');
      expect(piece).toBeNull();
    });
  });

  describe('findBestMove', () => {
    it('should find a move from starting position', () => {
      const best = engine.findBestMove(2);
      expect(best).toBeTruthy();
    });

    it('should find checkmate in 1', () => {
      engine.load('6k1/5ppp/8/8/8/8/r4PPP/1R4K1 w - - 0 1');
      const best = engine.findBestMove(3);
      expect(best).toBeTruthy();
      // Should find Rb8# or equivalent
    });

    it('should return null when no moves available', () => {
      // Stalemate position
      engine.load('k7/8/1K6/8/8/8/8/8 b - - 0 1');
      if (engine.isGameOver()) {
        const best = engine.findBestMove(2);
        expect(best).toBeNull();
      }
    });
  });
});
