// ChessOS — AI Engine (Minimax with Alpha-Beta Pruning)
import { Chess } from 'chess.js';

// Piece-Square Tables (from White's perspective, flipped for Black)
const PST = {
  p: [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [ 5,  5, 10, 25, 25, 10,  5,  5],
    [ 0,  0,  0, 20, 20,  0,  0,  0],
    [ 5, -5,-10,  0,  0,-10, -5,  5],
    [ 5, 10, 10,-20,-20, 10, 10,  5],
    [ 0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10, 10,  5, 10, 10,  5, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [ 0,  0,  0,  5,  5,  0,  0,  0]
  ],
  q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [ -5,  0,  5,  5,  5,  5,  0, -5],
    [  0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [ 20, 20,  0,  0,  0,  0, 20, 20],
    [ 20, 30, 10,  0,  0, 10, 30, 20]
  ],
  k_endgame: [
    [-50,-40,-30,-20,-20,-30,-40,-50],
    [-30,-20,-10,  0,  0,-10,-20,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-30,  0,  0,  0,  0,-30,-30],
    [-50,-30,-30,-30,-30,-30,-30,-50]
  ]
};

const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

export class AIEngine {
  constructor() {
    this.nodes = 0;
    this.maxTime = 5000;
    this.startTime = 0;
  }

  // Difficulty levels
  static LEVELS = {
    beginner:     { depth: 1, randomness: 40, name: 'Beginner (~800)' },
    casual:       { depth: 2, randomness: 20, name: 'Casual (~1200)' },
    intermediate: { depth: 3, randomness: 10, name: 'Intermediate (~1500)' },
    advanced:     { depth: 4, randomness: 3,  name: 'Advanced (~1800)' },
    expert:       { depth: 5, randomness: 0,  name: 'Expert (~2000)' },
    master:       { depth: 6, randomness: 0,  name: 'Master (~2200)' }
  };

  // Find best move
  findBestMove(fen, level = 'intermediate') {
    const config = AIEngine.LEVELS[level] || AIEngine.LEVELS.intermediate;
    const game = new Chess(fen);
    this.nodes = 0;
    this.startTime = Date.now();

    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return null;
    if (moves.length === 1) return moves[0];

    // Order moves for better pruning
    const orderedMoves = this._orderMoves(moves, game);
    
    let bestMove = null;
    let bestScore = -Infinity;
    const isWhite = game.turn() === 'w';

    for (const move of orderedMoves) {
      game.move(move);
      let score = -this._search(game, config.depth - 1, -Infinity, Infinity, !isWhite);
      
      // Add randomness for lower levels
      if (config.randomness > 0) {
        score += (Math.random() - 0.5) * config.randomness * 2;
      }
      
      game.undo();

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  // Negamax with alpha-beta
  _search(game, depth, alpha, beta, isMaximizing) {
    this.nodes++;

    if (depth === 0) return this._quiesce(game, alpha, beta, isMaximizing, 4);
    
    if (game.isGameOver()) {
      if (game.isCheckmate()) return isMaximizing ? -30000 - depth : 30000 + depth;
      return 0; // draw
    }

    const moves = this._orderMoves(game.moves({ verbose: true }), game);
    let bestScore = -Infinity;

    for (const move of moves) {
      game.move(move);
      const score = -this._search(game, depth - 1, -beta, -alpha, !isMaximizing);
      game.undo();

      if (score > bestScore) bestScore = score;
      if (score > alpha) alpha = score;
      if (alpha >= beta) break; // Beta cutoff
    }

    return bestScore;
  }

  // Quiescence search - evaluate captures to avoid horizon effect
  _quiesce(game, alpha, beta, isMaximizing, depth) {
    const standPat = this._evaluate(game) * (isMaximizing ? 1 : -1);
    
    if (depth === 0) return standPat;
    if (standPat >= beta) return beta;
    if (standPat > alpha) alpha = standPat;

    const captures = game.moves({ verbose: true }).filter(m => m.captured);
    
    for (const move of captures) {
      game.move(move);
      const score = -this._quiesce(game, -beta, -alpha, !isMaximizing, depth - 1);
      game.undo();

      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }

    return alpha;
  }

  // Static evaluation
  _evaluate(game) {
    if (game.isCheckmate()) return game.turn() === 'w' ? -30000 : 30000;
    if (game.isDraw()) return 0;

    let score = 0;
    const board = game.board();
    let totalMaterial = 0;

    // Count total material for endgame detection
    for (const row of board) {
      for (const piece of row) {
        if (piece && piece.type !== 'k') {
          totalMaterial += PIECE_VALUES[piece.type];
        }
      }
    }

    const isEndgame = totalMaterial < 2600;

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (!piece) continue;

        // Material value
        let value = PIECE_VALUES[piece.type];

        // Positional value from PST
        let pstKey = piece.type;
        if (piece.type === 'k' && isEndgame) pstKey = 'k_endgame';
        
        const pst = PST[pstKey];
        if (pst) {
          if (piece.color === 'w') {
            value += pst[r][f];
          } else {
            value += pst[7 - r][f];
          }
        }

        score += piece.color === 'w' ? value : -value;
      }
    }

    // Mobility bonus
    const currentMoves = game.moves().length;
    score += (game.turn() === 'w' ? 1 : -1) * currentMoves * 2;

    // Check bonus
    if (game.isCheck()) {
      score += game.turn() === 'w' ? -30 : 30;
    }

    return score;
  }

  // Move ordering for better alpha-beta pruning
  _orderMoves(moves, game) {
    return moves.sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      
      // Captures first (MVV-LVA)
      if (a.captured) scoreA += 10 * PIECE_VALUES[a.captured] - PIECE_VALUES[a.piece];
      if (b.captured) scoreB += 10 * PIECE_VALUES[b.captured] - PIECE_VALUES[b.piece];
      
      // Promotions
      if (a.promotion) scoreA += PIECE_VALUES[a.promotion];
      if (b.promotion) scoreB += PIECE_VALUES[b.promotion];
      
      // Checks
      game.move(a);
      if (game.isCheck()) scoreA += 500;
      game.undo();
      
      game.move(b);
      if (game.isCheck()) scoreB += 500;
      game.undo();
      
      return scoreB - scoreA;
    });
  }

  // Get evaluation bar value (-1 to 1, for UI display)
  getEvalBar(fen) {
    const game = new Chess(fen);
    const raw = this._evaluate(game);
    // Sigmoid-like mapping
    return Math.tanh(raw / 500);
  }

  // Analyze position - returns top moves with evaluations
  analyzePosition(fen, depth = 3, topN = 3) {
    const game = new Chess(fen);
    const moves = game.moves({ verbose: true });
    const analyzed = [];

    for (const move of moves) {
      game.move(move);
      const score = -this._search(game, depth - 1, -Infinity, Infinity, game.turn() === 'w');
      game.undo();
      analyzed.push({ move, score });
    }

    analyzed.sort((a, b) => b.score - a.score);
    return analyzed.slice(0, topN);
  }
}

export default AIEngine;
