import 'dart:math';
import 'package:chess/chess.dart' as chess_lib;
import 'package:flutter/foundation.dart';

/// ChessOS Chess Engine — Wraps the `chess` package for move validation,
/// legal move generation, AI opponent, and post-game analysis.
class ChessEngine {
  late chess_lib.Chess _game;
  final List<MoveRecord> _moveHistory = [];
  final Random _rng = Random();

  // Piece-square tables for evaluation
  static const List<List<int>> _pawnTable = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  static const List<List<int>> _knightTable = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ];

  static const List<List<int>> _bishopTable = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ];

  static const List<List<int>> _rookTable = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ];

  static const List<List<int>> _queenTable = [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ];

  static const List<List<int>> _kingMiddleTable = [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ];

  static const Map<String, int> _pieceValues = {
    'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000,
  };

  ChessEngine() {
    _game = chess_lib.Chess();
  }

  /// Create engine from FEN position
  ChessEngine.fromFen(String fen) {
    _game = chess_lib.Chess.fromFEN(fen);
  }

  /// Current FEN string
  String get fen => _game.fen;

  /// Current turn ('w' or 'b')
  String get turn => _game.turn == chess_lib.Color.WHITE ? 'w' : 'b';

  /// Is game over?
  bool get isGameOver => _game.game_over;

  /// Is check?
  bool get isCheck => _game.in_check;

  /// Is checkmate?
  bool get isCheckmate => _game.in_checkmate;

  /// Is stalemate?
  bool get isStalemate => _game.in_stalemate;

  /// Is draw?
  bool get isDraw => _game.in_draw;

  /// Move history
  List<MoveRecord> get moveHistory => List.unmodifiable(_moveHistory);

  /// Get all legal moves as SAN strings
  List<String> getLegalMoves() {
    return List<String>.from(_game.moves());
  }

  /// Get legal moves for a specific square
  List<String> getLegalMovesFrom(String square) {
    return List<String>.from(_game.moves({'square': square}));
  }

  /// Get legal move target squares from a source square
  List<String> getLegalTargets(String fromSquare) {
    final moves = _game.moves({'square': fromSquare, 'verbose': true});
    final targets = <String>[];
    for (final move in moves) {
      if (move is Map) {
        targets.add(move['to'] as String);
      }
    }
    return targets;
  }

  /// Make a move (SAN notation like "e4", "Nf3", "O-O")
  bool makeMove(String san) {
    final result = _game.move(san);
    if (result != null) {
      _moveHistory.add(MoveRecord(
        san: san,
        fen: _game.fen,
        moveNumber: (_moveHistory.length ~/ 2) + 1,
        isWhite: _moveHistory.length % 2 == 0,
      ));
      return true;
    }
    return false;
  }

  /// Make a move by square coordinates
  bool makeMoveFromTo(String from, String to, {String? promotion}) {
    final moveData = <String, String>{'from': from, 'to': to};
    if (promotion != null) moveData['promotion'] = promotion;
    final result = _game.move(moveData);
    if (result != null) {
      final history = _game.getHistory({'verbose': true});
      final lastMove = history.isNotEmpty ? history.last : null;
      final san = (lastMove is Map) ? (lastMove['san'] ?? '$from$to') : '$from$to';
      _moveHistory.add(MoveRecord(
        san: san.toString(),
        fen: _game.fen,
        moveNumber: (_moveHistory.length ~/ 2) + 1,
        isWhite: _moveHistory.length % 2 == 0,
      ));
      return true;
    }
    return false;
  }

  /// Undo last move
  bool undoMove() {
    final result = _game.undo();
    if (result != null && _moveHistory.isNotEmpty) {
      _moveHistory.removeLast();
      return true;
    }
    return false;
  }

  /// Reset to starting position
  void reset() {
    _game = chess_lib.Chess();
    _moveHistory.clear();
  }

  /// Load a FEN position
  void loadFen(String fen) {
    _game = chess_lib.Chess.fromFEN(fen);
    _moveHistory.clear();
  }

  /// Validate if a move is legal
  bool isLegalMove(String from, String to) {
    final moves = _game.moves({'square': from, 'verbose': true});
    for (final move in moves) {
      if (move is Map && move['to'] == to) return true;
    }
    return false;
  }

  // ========================================================================
  // AI Engine — Minimax with Alpha-Beta Pruning
  // ========================================================================

  /// Get best move for the AI at the given difficulty level
  /// Difficulty: 1=Beginner, 2=Intermediate, 3=Advanced, 4=Expert, 5=Master
  String? getBestMove(int difficulty) {
    final depth = _difficultyToDepth(difficulty);
    final moves = _game.moves();
    if (moves.isEmpty) return null;

    // At low difficulties, sometimes make suboptimal moves
    if (difficulty <= 2 && _rng.nextDouble() < (difficulty == 1 ? 0.4 : 0.2)) {
      return moves[_rng.nextInt(moves.length)];
    }

    String? bestMove;
    int bestScore = -999999;
    final isMaximizing = _game.turn == chess_lib.Color.WHITE;

    // Shuffle moves for variety
    final shuffled = List<String>.from(moves)..shuffle(_rng);

    for (final move in shuffled) {
      _game.move(move);
      final score = _minimax(depth - 1, -1000000, 1000000, !isMaximizing);
      _game.undo();

      final adjustedScore = isMaximizing ? score : -score;
      if (adjustedScore > bestScore) {
        bestScore = adjustedScore;
        bestMove = move;
      }
    }

    // Add randomness for lower difficulties
    if (difficulty <= 3 && _rng.nextDouble() < 0.15) {
      // Occasionally pick second-best move
      final candidates = <MapEntry<String, int>>[];
      for (final move in shuffled.take(8)) {
        _game.move(move);
        final score = _minimax(depth - 1, -1000000, 1000000, !isMaximizing);
        _game.undo();
        candidates.add(MapEntry(move, isMaximizing ? score : -score));
      }
      candidates.sort((a, b) => b.value.compareTo(a.value));
      if (candidates.length > 1) {
        return candidates[min(1, candidates.length - 1)].key;
      }
    }

    return bestMove;
  }

  /// Async version that runs AI in a background isolate to avoid UI jank
  Future<String?> getBestMoveAsync(int difficulty) async {
    final fen = _game.fen;
    final result = await compute(_computeBestMove, _AiRequest(fen, difficulty));
    return result;
  }

  int _difficultyToDepth(int difficulty) {
    switch (difficulty) {
      case 1: return 1;
      case 2: return 2;
      case 3: return 3;
      case 4: return 4;
      case 5: return 5;
      default: return 3;
    }
  }

  int _minimax(int depth, int alpha, int beta, bool isMaximizing) {
    if (depth == 0 || _game.game_over) {
      return _evaluate();
    }

    final moves = _game.moves();

    if (isMaximizing) {
      int maxEval = -999999;
      for (final move in moves) {
        _game.move(move);
        final eval = _minimax(depth - 1, alpha, beta, false);
        _game.undo();
        maxEval = max(maxEval, eval);
        alpha = max(alpha, eval);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      int minEval = 999999;
      for (final move in moves) {
        _game.move(move);
        final eval = _minimax(depth - 1, alpha, beta, true);
        _game.undo();
        minEval = min(minEval, eval);
        beta = min(beta, eval);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  int _evaluate() {
    if (_game.in_checkmate) {
      return _game.turn == chess_lib.Color.WHITE ? -100000 : 100000;
    }
    if (_game.in_draw || _game.in_stalemate) return 0;

    int score = 0;
    final board = _game.board;

    for (int r = 0; r < 8; r++) {
      for (int c = 0; c < 8; c++) {
        final piece = board[r * 16 + c];
        if (piece == null) continue;

        final type = piece.type.toString().toLowerCase();
        final value = _pieceValues[type] ?? 0;
        final isWhite = piece.color == chess_lib.Color.WHITE;

        // Material
        score += isWhite ? value : -value;

        // Position bonus
        final tableRow = isWhite ? r : 7 - r;
        int posBonus = 0;
        switch (type) {
          case 'p': posBonus = _pawnTable[tableRow][c]; break;
          case 'n': posBonus = _knightTable[tableRow][c]; break;
          case 'b': posBonus = _bishopTable[tableRow][c]; break;
          case 'r': posBonus = _rookTable[tableRow][c]; break;
          case 'q': posBonus = _queenTable[tableRow][c]; break;
          case 'k': posBonus = _kingMiddleTable[tableRow][c]; break;
        }
        score += isWhite ? posBonus : -posBonus;
      }
    }

    return score;
  }

  // ========================================================================
  // Game Analysis
  // ========================================================================

  /// Analyze the completed game and return a report
  GameAnalysis analyzeGame() {
    int blunders = 0;
    int mistakes = 0;
    int inaccuracies = 0;
    int goodMoves = 0;
    int brilliantMoves = 0;
    final criticalMoments = <int>[];

    // Simplified analysis: random scoring for demonstration
    // In production, this would compare each move against engine best move
    for (int i = 0; i < _moveHistory.length; i++) {
      final quality = _rng.nextDouble();
      if (quality > 0.95) {
        brilliantMoves++;
      } else if (quality > 0.7) {
        goodMoves++;
      } else if (quality > 0.5) {
        inaccuracies++;
      } else if (quality > 0.3) {
        mistakes++;
        criticalMoments.add(i);
      } else if (quality > 0.15) {
        blunders++;
        criticalMoments.add(i);
      } else {
        goodMoves++;
      }
    }

    final totalMoves = _moveHistory.length;
    final accuracy = totalMoves > 0
        ? ((goodMoves + brilliantMoves) / totalMoves * 100).clamp(0.0, 100.0)
        : 0.0;

    return GameAnalysis(
      totalMoves: totalMoves,
      accuracy: accuracy,
      blunders: blunders,
      mistakes: mistakes,
      inaccuracies: inaccuracies,
      goodMoves: goodMoves,
      brilliantMoves: brilliantMoves,
      criticalMoments: criticalMoments,
      result: isCheckmate
          ? (turn == 'w' ? 'Black wins by checkmate' : 'White wins by checkmate')
          : isDraw
              ? 'Draw'
              : isStalemate
                  ? 'Draw by stalemate'
                  : 'Game in progress',
    );
  }
}

// ============================================================================
// Top-level isolate function for compute()
// ============================================================================
class _AiRequest {
  final String fen;
  final int difficulty;
  _AiRequest(this.fen, this.difficulty);
}

String? _computeBestMove(_AiRequest request) {
  final engine = ChessEngine.fromFen(request.fen);
  return engine.getBestMove(request.difficulty);
}

// ============================================================================
// Data Classes
// ============================================================================

class MoveRecord {
  final String san;
  final String fen;
  final int moveNumber;
  final bool isWhite;

  MoveRecord({
    required this.san,
    required this.fen,
    required this.moveNumber,
    required this.isWhite,
  });
}

class GameAnalysis {
  final int totalMoves;
  final double accuracy;
  final int blunders;
  final int mistakes;
  final int inaccuracies;
  final int goodMoves;
  final int brilliantMoves;
  final List<int> criticalMoments;
  final String result;

  GameAnalysis({
    required this.totalMoves,
    required this.accuracy,
    required this.blunders,
    required this.mistakes,
    required this.inaccuracies,
    required this.goodMoves,
    required this.brilliantMoves,
    required this.criticalMoments,
    required this.result,
  });
}
