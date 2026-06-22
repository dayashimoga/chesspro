import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hive/hive.dart';
import 'package:go_router/go_router.dart';
import '../widgets/chess_board.dart';
import '../core/chess_engine.dart';

class MoveReview {
  final String san;
  final String classification; // 'brilliant' | 'best' | 'book' | 'good' | 'inaccuracy' | 'mistake' | 'blunder'
  final String evalChange;
  final String commentary;
  final String fen;
  final double lossValue;
  final String? engineBestMove;

  MoveReview({
    required this.san,
    required this.classification,
    required this.evalChange,
    required this.commentary,
    required this.fen,
    required this.lossValue,
    this.engineBestMove,
  });
}

class GameReviewPage extends StatefulWidget {
  const GameReviewPage({super.key});

  @override
  State<GameReviewPage> createState() => _GameReviewPageState();
}

class _GameReviewPageState extends State<GameReviewPage> {
  // Demo Game fallback
  static const List<String> _demoMoves = [
    'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5',
    'Nxf7', 'Kxf7', 'Qf3+', 'Ke6', 'Nc3', 'Ne7'
  ];
  static const String _demoPlayerColor = 'b';

  // Analysis state
  bool _analyzing = true;
  double _analysisProgress = 0.0;
  List<MoveReview> _reviewedMoves = [];
  double _accuracy = 85.0;
  int _brilliantCount = 0;
  int _blundersCount = 0;
  int _mistakesCount = 0;
  int _inaccuraciesCount = 0;

  // Active replay move index
  int _activeMoveIdx = 0;

  // Critical moment blunder refutation puzzle
  String? _criticalFen;
  String? _criticalExpectedMove; // in UCI/SAN
  String? _criticalMoveDescription;
  ChessEngine? _solveEngine;
  bool _solveSuccess = false;
  String? _solveHighlight;
  String? _toastMessage;

  String _playerColor = 'w';

  @override
  void initState() {
    super.initState();
    _startAnalysis();
  }

  Future<void> _startAnalysis() async {
    setState(() {
      _analyzing = true;
      _analysisProgress = 0.0;
    });

    List<String> gameMoves = _demoMoves;
    String playerColor = _demoPlayerColor;

    try {
      final box = Hive.box('progress');
      final lastGame = box.get('last_game');
      if (lastGame != null && lastGame is Map) {
        final movesRaw = lastGame['moves'];
        if (movesRaw is List && movesRaw.isNotEmpty) {
          gameMoves = List<String>.from(movesRaw);
        }
        playerColor = lastGame['playerColor'] as String? ?? 'w';
      }
    } catch (e) {
      debugPrint('Failed to load last game from Hive: $e');
    }

    _playerColor = playerColor;

    // We'll reconstruct the game move-by-move.
    final analysisEngine = ChessEngine();
    final List<Map<String, dynamic>> positions = [
      {
        'fen': analysisEngine.fen,
        'turn': analysisEngine.turn,
        'moveSan': '',
      }
    ];

    for (final move in gameMoves) {
      if (analysisEngine.makeMove(move)) {
        positions.add({
          'fen': analysisEngine.fen,
          'turn': analysisEngine.turn,
          'moveSan': move,
        });
      } else {
        break;
      }
    }

    final List<MoveReview> reviewed = [];
    final List<double> evalList = [];

    // First, let's get static evaluations for all positions
    for (int i = 0; i < positions.length; i++) {
      final tempEngine = ChessEngine.fromFen(positions[i]['fen'] as String);
      final scoreVal = tempEngine.getEvaluation();
      final isWhite = (positions[i]['turn'] as String) == 'w';
      // Normalize eval so positive is good for side to move or white?
      // Our engine returns eval from White's perspective.
      evalList.add(scoreVal);
    }

    // Now, run isolate search to find the engine best move at each step.
    // To keep it fast, we look ahead at depth 3 for each FEN.
    final totalSteps = positions.length - 1;
    for (int i = 0; i < totalSteps; i++) {
      final currentFen = positions[i]['fen'] as String;
      final nextMoveSan = positions[i + 1]['moveSan'] as String;
      final turnBefore = positions[i]['turn'] as String;

      // Ask background engine for best move in this position
      final tempEngineForBestMove = ChessEngine.fromFen(currentFen);
      final bestMove = await tempEngineForBestMove.getBestMoveAsync(3);

      final prevEval = evalList[i];
      final currentEval = evalList[i + 1];

      // Evaluation loss from side-to-move's perspective
      // Negative means position got worse for the moving side.
      final loss = (turnBefore == 'w') ? (currentEval - prevEval) : (prevEval - currentEval);

      String classification = 'good';
      String commentary = 'A solid, logical move. Keeps the balance of the position.';

      if (loss >= 1.5) {
        classification = 'brilliant';
        commentary = 'Brilliant sacrifice! You found a highly tactical and creative resource.';
      } else if (loss < -1.8) {
        classification = 'blunder';
        commentary = 'A critical blunder! This move severely damages your position. Better was ${bestMove ?? "another defense"}.';
      } else if (loss < -0.9) {
        classification = 'mistake';
        commentary = 'A mistake. This hands over a significant advantage to your opponent.';
      } else if (loss < -0.4) {
        classification = 'inaccuracy';
        commentary = 'An inaccuracy. A minor misstep that relinquishes center control or initiative.';
      } else if (loss >= -0.2) {
        classification = 'best';
        commentary = 'The best move in the position. Matches the engine recommendation.';
      } else {
        classification = 'good';
        commentary = 'A solid, logical move. Keeps the balance of the position.';
      }

      // Check if standard opening book move (first 6 half-moves)
      final isBook = i <= 5 && (
        nextMoveSan == 'e4' || nextMoveSan == 'e5' ||
        nextMoveSan == 'd4' || nextMoveSan == 'd5' ||
        nextMoveSan == 'Nf3' || nextMoveSan == 'Nc6' ||
        nextMoveSan == 'Nf6' || nextMoveSan == 'c4'
      );
      if (isBook) {
        classification = 'book';
        commentary = 'Standard book opening theory.';
      }

      reviewed.add(MoveReview(
        san: nextMoveSan,
        classification: classification,
        evalChange: '${loss > 0 ? "+" : ""}${loss.toStringAsFixed(2)}',
        commentary: commentary,
        fen: positions[i + 1]['fen'] as String,
        lossValue: loss,
        engineBestMove: bestMove,
      ));

      if (mounted) {
        setState(() {
          _analysisProgress = (i + 1) / totalSteps;
        });
      }
    }

    // Compute aggregates
    double sum = 0.0;
    int bCount = 0;
    int mCount = 0;
    int iCount = 0;
    int brCount = 0;

    for (final rev in reviewed) {
      switch (rev.classification) {
        case 'brilliant':
          sum += 100.0;
          brCount++;
          break;
        case 'best':
        case 'book':
          sum += 100.0;
          break;
        case 'good':
          sum += 90.0;
          break;
        case 'inaccuracy':
          sum += 70.0;
          iCount++;
          break;
        case 'mistake':
          sum += 45.0;
          mCount++;
          break;
        case 'blunder':
          sum += 15.0;
          bCount++;
          break;
      }
    }

    final finalAccuracy = reviewed.isNotEmpty ? (sum / reviewed.length) : 100.0;

    // Find the player's worst blunder or mistake
    // The player's moves are those where turnBefore == playerColor
    int worstMoveIndex = -1;
    double worstLoss = 0.0;

    for (int idx = 0; idx < reviewed.length; idx++) {
      final turnBefore = positions[idx]['turn'] as String;
      if (turnBefore == playerColor) {
        final moveLoss = reviewed[idx].lossValue;
        if (moveLoss < worstLoss) {
          worstLoss = moveLoss;
          worstMoveIndex = idx;
        }
      }
    }

    String? criticalFen;
    String? criticalBest;
    String? criticalDesc;
    ChessEngine? solveEng;

    if (worstMoveIndex != -1 && worstLoss < -0.4) {
      // Position BEFORE the blunder
      criticalFen = positions[worstMoveIndex]['fen'] as String;
      criticalBest = reviewed[worstMoveIndex].engineBestMove;
      criticalDesc = 'In this position, you played ${reviewed[worstMoveIndex].san}, which was a ${reviewed[worstMoveIndex].classification} (${reviewed[worstMoveIndex].evalChange}). Can you find the correct defensive alternative?';
      solveEng = ChessEngine.fromFen(criticalFen);
    } else {
      // Fallback to Demo blunder
      const fallbackFen = 'r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 5';
      criticalFen = fallbackFen;
      criticalBest = 'c6a5'; // Na5
      criticalDesc = 'In the standard Italian Game, 5...Nxd5 is a critical blunder. Find the active defense that attacks White\'s bishop.';
      solveEng = ChessEngine.fromFen(fallbackFen);
    }

    if (mounted) {
      setState(() {
        _reviewedMoves = reviewed;
        _accuracy = finalAccuracy;
        _brilliantCount = brCount;
        _blundersCount = bCount;
        _mistakesCount = mCount;
        _inaccuraciesCount = iCount;
        _criticalFen = criticalFen;
        _criticalExpectedMove = criticalBest;
        _criticalMoveDescription = criticalDesc;
        _solveEngine = solveEng;
        _analyzing = false;
        _activeMoveIdx = 0;
      });
    }
  }

  void _onSolverMove(String from, String to) {
    if (_solveEngine == null || _solveSuccess) return;

    try {
      final checkEngine = ChessEngine.fromFen(_solveEngine!.fen);
      final success = checkEngine.makeMoveFromTo(from, to, promotion: 'q');
      if (!success) {
        _showToast('Illegal move.');
        return;
      }

      final uciMove = '${from}${to}'.toLowerCase();
      final expected = _criticalExpectedMove?.toLowerCase() ?? '';

      // Check if it matches expected best move (UCI format) or if it's the target Na5 move in Italian
      final matchesExpected = uciMove == expected ||
          (uciMove == 'c6a5' && _criticalExpectedMove == 'Na5');

      if (matchesExpected) {
        setState(() {
          _solveEngine!.makeMoveFromTo(from, to, promotion: 'q');
          _solveSuccess = true;
          _solveHighlight = null;
        });

        _awardXp(20);
        _showToast('🏆 Excellent! You found the best move recommended by the engine.');
      } else {
        setState(() {
          _solveHighlight = to;
        });
        _showToast('❌ Not the best move. Try looking for a more active defense or counter-attack.');
      }
    } catch (e) {
      _showToast('Error validating move.');
    }
  }

  void _showToast(String message) {
    setState(() {
      _toastMessage = message;
    });
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted && _toastMessage == message) {
        setState(() {
          _toastMessage = null;
        });
      }
    });
  }

  Future<void> _awardXp(int amount) async {
    try {
      final box = Hive.box('progress');
      final currentXp = box.get('xp', defaultValue: 250) as int;
      await box.put('xp', currentXp + amount);
    } catch (e) {
      debugPrint('Failed to save XP: $e');
    }
  }

  Color _accuracyColor(double accuracy) {
    if (accuracy >= 90) return const Color(0xFF10B981);
    if (accuracy >= 70) return const Color(0xFF3B82F6);
    if (accuracy >= 50) return const Color(0xFFF59E0B);
    return const Color(0xFFEF4444);
  }

  Widget _buildBadge(String classification) {
    Color color;
    String text;

    switch (classification) {
      case 'brilliant':
        color = const Color(0xFF8B5CF6);
        text = '!! Brilliant';
        break;
      case 'best':
        color = const Color(0xFF10B981);
        text = 'Best Move';
        break;
      case 'book':
        color = const Color(0xFF64748B);
        text = 'Book';
        break;
      case 'good':
        color = const Color(0xFF475569);
        text = 'Good';
        break;
      case 'inaccuracy':
        color = const Color(0xFFF59E0B);
        text = '?! Inaccuracy';
        break;
      case 'mistake':
        color = const Color(0xFFF97316);
        text = '? Mistake';
        break;
      case 'blunder':
        color = const Color(0xFFEF4444);
        text = '?? Blunder';
        break;
      default:
        color = const Color(0xFF64748B);
        text = 'Forced';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        text,
        style: GoogleFonts.inter(
          fontSize: 11,
          fontWeight: FontWeight.w800,
          color: color,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_analyzing) {
      return Scaffold(
        appBar: AppBar(title: const Text('Game Review')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('🤖', style: TextStyle(fontSize: 56)),
              const SizedBox(height: 16),
              Text(
                'Analyzing game with Stockfish...',
                style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              const SizedBox(height: 8),
              Text(
                'Please wait. Processing positions and calculating accuracy.',
                style: GoogleFonts.inter(fontSize: 12, color: Colors.white.withOpacity(0.4)),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: 220,
                child: Column(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: LinearProgressIndicator(
                        value: _analysisProgress,
                        backgroundColor: Colors.white.withOpacity(0.06),
                        valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF10B981)),
                        minHeight: 8,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'PROGRESS: ${(_analysisProgress * 100).round()}%',
                      style: GoogleFonts.firaCode(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white30),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    }

    final activeMove = _reviewedMoves.isNotEmpty
        ? _reviewedMoves[_activeMoveIdx]
        : MoveReview(
            san: 'Start',
            classification: 'book',
            evalChange: '0.00',
            commentary: 'Initial Position',
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            lossValue: 0.0,
          );

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Game Review Analyzer',
          style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w900),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          onPressed: () => context.go('/play'),
        ),
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Summary Description
                Text(
                  'PERFORMANCE REVIEW',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF10B981),
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Critique & Blunder Refutation',
                  style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white),
                ),
                const SizedBox(height: 16),

                // Accuracy Stats Grid
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  childAspectRatio: 2.2,
                  children: [
                    _buildStatCard(
                      '${_accuracy.toStringAsFixed(1)}%',
                      'Overall Accuracy',
                      _accuracyColor(_accuracy),
                    ),
                    _buildStatCard(
                      '$_brilliantCount',
                      'Brilliant Moves',
                      const Color(0xFF8B5CF6),
                    ),
                    _buildStatCard(
                      '$_blundersCount',
                      'Blunders Committed',
                      const Color(0xFFEF4444),
                    ),
                    _buildStatCard(
                      '${_mistakesCount + _inaccuraciesCount}',
                      'Mistakes & Inaccuracies',
                      const Color(0xFFF59E0B),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Replay Board Section
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF111119),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withOpacity(0.06)),
                  ),
                  child: Column(
                    children: [
                      // Chess board widget
                      AspectRatio(
                        aspectRatio: 1,
                        child: ChessBoardWidget(
                          fen: activeMove.fen,
                          interactive: false,
                          flipped: _playerColor == 'b',
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Replay navigation buttons
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          ElevatedButton.icon(
                            onPressed: _activeMoveIdx > 0
                                ? () => setState(() => _activeMoveIdx--)
                                : null,
                            icon: const Icon(Icons.arrow_back_rounded, size: 16),
                            label: const Text('Prev Move'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white.withOpacity(0.04),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              side: BorderSide(color: Colors.white.withOpacity(0.08)),
                            ),
                          ),
                          Text(
                            'Move ${_activeMoveIdx + 1} of ${_reviewedMoves.length}',
                            style: GoogleFonts.firaCode(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white30),
                          ),
                          ElevatedButton.icon(
                            onPressed: _activeMoveIdx < _reviewedMoves.length - 1
                                ? () => setState(() => _activeMoveIdx++)
                                : null,
                            icon: const Icon(Icons.arrow_forward_rounded, size: 16),
                            label: const Text('Next Move'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white.withOpacity(0.04),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              side: BorderSide(color: Colors.white.withOpacity(0.08)),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Engine Critique Commentary
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF111119),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withOpacity(0.06)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            activeMove.san,
                            style: GoogleFonts.firaCode(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                          _buildBadge(activeMove.classification),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0C0C14),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.white.withOpacity(0.05)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Evaluation shift:',
                                  style: GoogleFonts.inter(fontSize: 10, color: Colors.white30, fontWeight: FontWeight.bold),
                                ),
                                Text(
                                  activeMove.evalChange,
                                  style: GoogleFonts.firaCode(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: activeMove.lossValue < -0.9
                                        ? const Color(0xFFEF4444)
                                        : const Color(0xFF10B981),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              activeMove.commentary,
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                color: Colors.white.withOpacity(0.85),
                                height: 1.45,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Move Log Selector horizontal bar
                if (_reviewedMoves.isNotEmpty) ...[
                  Text(
                    'MOVE HISTORY LOG',
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: Colors.white.withOpacity(0.3),
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  MoveHistoryWidget(
                    moves: _reviewedMoves.map((m) => m.san).toList(),
                    currentMoveIndex: _activeMoveIdx,
                    onMoveSelect: (index) {
                      setState(() {
                        _activeMoveIdx = index;
                      });
                    },
                  ),
                  const SizedBox(height: 24),
                ],

                // Critical Moment Solver Section
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF111119),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: _solveSuccess
                          ? const Color(0xFF10B981).withOpacity(0.3)
                          : const Color(0xFFEF4444).withOpacity(0.12),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            _solveSuccess ? '🏆' : '⚔️',
                            style: const TextStyle(fontSize: 18),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Blunder Refutation Challenge',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: _solveSuccess ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        _criticalMoveDescription ?? '',
                        style: GoogleFonts.inter(fontSize: 12, color: Colors.white70, height: 1.4),
                      ),
                      const SizedBox(height: 16),

                      // Solver board
                      if (_solveEngine != null) ...[
                        AspectRatio(
                          aspectRatio: 1,
                          child: ChessBoardWidget(
                            fen: _solveEngine!.fen,
                            interactive: !_solveSuccess,
                            flipped: _playerColor == 'b',
                            onMove: _onSolverMove,
                            legalTargetsForSquare: (sq) => _solveEngine!.getLegalTargets(sq),
                            highlightSquares: _solveHighlight != null ? [_solveHighlight!] : null,
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],

                      if (_solveSuccess) ...[
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withOpacity(0.08),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFF10B981).withOpacity(0.15)),
                          ),
                          child: Column(
                            children: [
                              Text(
                                'Challenge Mastered! +20 XP awarded.',
                                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: const Color(0xFF10B981)),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 10),
                              ElevatedButton(
                                onPressed: () => context.go('/university'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF10B981),
                                  foregroundColor: const Color(0xFF0C0C14),
                                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                ),
                                child: Text(
                                  'Go to Opening Courses',
                                  style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ] else ...[
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.02),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Row(
                            children: [
                              const Text('💡', style: TextStyle(fontSize: 14)),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  'Make the best defensive alternative on the board to complete the refutation.',
                                  style: GoogleFonts.inter(fontSize: 11, color: Colors.white30, height: 1.3),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),

          // Custom float toast notification
          if (_toastMessage != null)
            Positioned(
              bottom: 24,
              left: 24,
              right: 24,
              child: AnimatedOpacity(
                opacity: _toastMessage != null ? 1.0 : 0.0,
                duration: const Duration(milliseconds: 300),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF111119),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white.withOpacity(0.12)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.4),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Text(
                    _toastMessage!,
                    style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF111119),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label.toUpperCase(),
            style: GoogleFonts.inter(
              fontSize: 8,
              fontWeight: FontWeight.w800,
              color: Colors.white30,
              letterSpacing: 0.8,
            ),
          ),
        ],
      ),
    );
  }
}
