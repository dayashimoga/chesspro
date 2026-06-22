import 'dart:math';
import 'dart:isolate';
import 'dart:async';
import 'package:chess/chess.dart' as chess_lib;
import 'package:flutter/foundation.dart';


/// ChessOS Chess Engine — Wraps the `chess` package for move validation,
/// legal move generation, AI opponent, and post-game analysis.
class ChessEngine {
  late chess_lib.Chess _game;
  final List<MoveRecord> _moveHistory = [];
  final Random _rng = Random();
  final Map<String, _TranspositionTableEntry> _transpositionTable = {};


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
    _transpositionTable.clear();
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
    final moves = _game.generate_moves();
    if (moves.isEmpty) return null;

    // At low difficulties, sometimes make suboptimal moves
    if (difficulty <= 2 && _rng.nextDouble() < (difficulty == 1 ? 0.4 : 0.2)) {
      final randomMove = moves[_rng.nextInt(moves.length)];
      return _game.move_to_san(randomMove);
    }

    // Check transposition table for the root position
    final fenKey = _game.fen;
    final entry = _transpositionTable[fenKey];
    if (entry != null && entry.depth >= depth && entry.bestMove != null) {
      for (final move in moves) {
        if (_game.move_to_san(move) == entry.bestMove) {
          return entry.bestMove;
        }
      }
    }

    dynamic bestMoveObj;
    int bestScore = -999999;
    final isMaximizing = _game.turn == chess_lib.Color.WHITE;

    // Shuffle moves for variety
    final shuffled = List<dynamic>.from(moves)..shuffle(_rng);

    // Sort using raw flags
    shuffled.sort((a, b) {
      final aFlags = a.flags as int;
      final bFlags = b.flags as int;
      int scoreA = 0;
      int scoreB = 0;
      if ((aFlags & 12) != 0) scoreA += 10;
      if ((aFlags & 16) != 0) scoreA += 8;
      if ((bFlags & 12) != 0) scoreB += 10;
      if ((bFlags & 16) != 0) scoreB += 8;
      return scoreB.compareTo(scoreA);
    });

    for (final move in shuffled) {
      _game.make_move(move);
      final score = _minimax(depth - 1, -1000000, 1000000, !isMaximizing);
      _game.undo_move();

      final adjustedScore = isMaximizing ? score : -score;
      if (adjustedScore > bestScore) {
        bestScore = adjustedScore;
        bestMoveObj = move;
      }
    }

    // Add randomness for lower difficulties
    if (difficulty <= 3 && _rng.nextDouble() < 0.15) {
      final candidates = <MapEntry<dynamic, int>>[];
      for (final move in shuffled.take(8)) {
        _game.make_move(move);
        final score = _minimax(depth - 1, -1000000, 1000000, !isMaximizing);
        _game.undo_move();
        candidates.add(MapEntry(move, isMaximizing ? score : -score));
      }
      candidates.sort((a, b) => b.value.compareTo(a.value));
      if (candidates.length > 1) {
        bestMoveObj = candidates[min(1, candidates.length - 1)].key;
      }
    }

    final bestMove = bestMoveObj != null ? _game.move_to_san(bestMoveObj) : null;

    // Store in Transposition Table
    _transpositionTable[fenKey] = _TranspositionTableEntry(
      depth: depth,
      score: isMaximizing ? bestScore : -bestScore,
      flag: 0, // EXACT
      bestMove: bestMove,
    );

    return bestMove;
  }

  /// Async version that runs AI in a background isolate to avoid UI jank
  Future<String?> getBestMoveAsync(int difficulty) async {
    final fen = _game.fen;
    final manager = await _PersistentIsolateManager.instance;
    return manager.getBestMove(fen, difficulty);
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
    final fenKey = _game.fen;
    final entry = _transpositionTable[fenKey];
    if (entry != null && entry.depth >= depth) {
      if (entry.flag == 0) { // EXACT
        return entry.score;
      } else if (entry.flag == 1) { // ALPHA
        if (entry.score <= alpha) return entry.score;
      } else if (entry.flag == 2) { // BETA
        if (entry.score >= beta) return entry.score;
      }
    }

    if (depth == 0) {
      return _evaluateFast();
    }

    final moves = _game.generate_moves();
    if (moves.isEmpty) {
      if (_game.in_check) {
        return isMaximizing ? -100000 - depth : 100000 + depth;
      }
      return 0; // Stalemate
    }

    // Move ordering: sort captures and promotions first using raw flags
    moves.sort((a, b) {
      final aFlags = a.flags as int;
      final bFlags = b.flags as int;
      int scoreA = 0;
      int scoreB = 0;
      if ((aFlags & 12) != 0) scoreA += 10;
      if ((aFlags & 16) != 0) scoreA += 8;
      if ((bFlags & 12) != 0) scoreB += 10;
      if ((bFlags & 16) != 0) scoreB += 8;
      return scoreB.compareTo(scoreA);
    });

    int alphaOriginal = alpha;
    int bestScore = isMaximizing ? -999999 : 999999;
    dynamic bestMoveObj;

    if (isMaximizing) {
      for (final move in moves) {
        _game.make_move(move);
        final eval = _minimax(depth - 1, alpha, beta, false);
        _game.undo_move();
        if (eval > bestScore) {
          bestScore = eval;
          bestMoveObj = move;
        }
        alpha = max(alpha, eval);
        if (beta <= alpha) break;
      }
    } else {
      for (final move in moves) {
        _game.make_move(move);
        final eval = _minimax(depth - 1, alpha, beta, true);
        _game.undo_move();
        if (eval < bestScore) {
          bestScore = eval;
          bestMoveObj = move;
        }
        beta = min(beta, eval);
        if (beta <= alpha) break;
      }
    }

    int flag = 0; // EXACT
    if (bestScore <= alphaOriginal) {
      flag = 1; // ALPHA
    } else if (bestScore >= beta) {
      flag = 2; // BETA
    }

    final bestMoveSan = bestMoveObj != null ? _game.move_to_san(bestMoveObj) : null;

    if (_transpositionTable.length > 50000) {
      _transpositionTable.clear();
    }
    _transpositionTable[fenKey] = _TranspositionTableEntry(
      depth: depth,
      score: bestScore,
      flag: flag,
      bestMove: bestMoveSan,
    );

    return bestScore;
  }

  int _evaluateFast() {
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

  int _evaluate() {
    return _evaluateFast();
  }

  /// Get the current position evaluation in centipawns/100 (pawn units)
  double getEvaluation() {
    return _evaluateFast() / 100.0;
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
// Top-level isolate function for compute() - kept for compatibility
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
// Persistent background isolate configuration
// ============================================================================
class _PersistentAiRequest {
  final String requestId;
  final String fen;
  final int difficulty;
  _PersistentAiRequest(this.requestId, this.fen, this.difficulty);
}

class _PersistentAiResponse {
  final String requestId;
  final String? bestMove;
  _PersistentAiResponse(this.requestId, this.bestMove);
}

class _PersistentIsolateManager {
  static _PersistentIsolateManager? _instance;

  static Future<_PersistentIsolateManager> get instance async {
    if (_instance == null) {
      _instance = _PersistentIsolateManager._();
      await _instance!._init();
    }
    return _instance!;
  }

  _PersistentIsolateManager._();

  Isolate? _isolate;
  SendPort? _sendPort;
  final ReceivePort _receivePort = ReceivePort();
  final Map<String, Completer<String?>> _pendingRequests = {};
  bool _initialized = false;

  Future<void> _init() async {
    if (_initialized) return;

    _isolate = await Isolate.spawn(_isolateEntryPoint, _receivePort.sendPort);

    final completer = Completer<void>();
    _receivePort.listen((message) {
      if (message is SendPort) {
        _sendPort = message;
        if (!completer.isCompleted) {
          completer.complete();
        }
      } else if (message is _PersistentAiResponse) {
        final pendingCompleter = _pendingRequests.remove(message.requestId);
        if (pendingCompleter != null) {
          pendingCompleter.complete(message.bestMove);
        }
      }
    });

    await completer.future;
    _initialized = true;
  }

  Future<String?> getBestMove(String fen, int difficulty) async {
    final requestId = '${DateTime.now().microsecondsSinceEpoch}_${Random().nextInt(1000)}';
    final completer = Completer<String?>();
    _pendingRequests[requestId] = completer;

    _sendPort?.send(_PersistentAiRequest(requestId, fen, difficulty));
    return completer.future;
  }

  static void _isolateEntryPoint(SendPort mainSendPort) {
    final isolateReceivePort = ReceivePort();
    mainSendPort.send(isolateReceivePort.sendPort);

    final ChessEngine isolateEngine = ChessEngine();

    isolateReceivePort.listen((message) {
      if (message is _PersistentAiRequest) {
        isolateEngine.loadFen(message.fen);
        final bestMove = isolateEngine.getBestMove(message.difficulty);
        mainSendPort.send(_PersistentAiResponse(message.requestId, bestMove));
      }
    });
  }
}

// ============================================================================
// Transposition Table Types
// ============================================================================
class _TranspositionTableEntry {
  final int depth;
  final int score;
  final int flag; // 0 = EXACT, 1 = ALPHA, 2 = BETA
  final String? bestMove;

  _TranspositionTableEntry({
    required this.depth,
    required this.score,
    required this.flag,
    this.bestMove,
  });
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
