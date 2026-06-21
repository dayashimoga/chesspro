import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/chess_board.dart';
import '../core/chess_engine.dart';

/// Play vs AI — Full chess game with difficulty levels and post-game analysis
class PlayAIPage extends StatefulWidget {
  const PlayAIPage({super.key});

  @override
  State<PlayAIPage> createState() => _PlayAIPageState();
}

class _PlayAIPageState extends State<PlayAIPage> {
  late ChessEngine _engine;
  int _difficulty = 2; // 1-5
  bool _gameStarted = false;
  bool _gameOver = false;
  bool _isThinking = false;
  bool _showAnalysis = false;
  bool _playerIsWhite = true;
  GameAnalysis? _analysis;
  String? _lastFeedback;

  static const _difficultyLabels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
  static const _difficultyColors = [
    Colors.transparent,
    Color(0xFF10B981),
    Color(0xFF3B82F6),
    Color(0xFFF59E0B),
    Color(0xFFEF4444),
    Color(0xFF8B5CF6),
  ];

  @override
  void initState() {
    super.initState();
    _engine = ChessEngine();
  }

  void _startGame() {
    setState(() {
      _engine = ChessEngine();
      _gameStarted = true;
      _gameOver = false;
      _showAnalysis = false;
      _analysis = null;
      _lastFeedback = null;
    });

    if (!_playerIsWhite) {
      _makeAIMove();
    }
  }

  void _onPlayerMove(String from, String to) {
    if (_gameOver || _isThinking) return;

    // Check it's the player's turn
    final isWhiteTurn = _engine.turn == 'w';
    if (isWhiteTurn != _playerIsWhite) return;

    final success = _engine.makeMoveFromTo(from, to, promotion: 'q');
    if (!success) {
      setState(() => _lastFeedback = 'Illegal move');
      return;
    }

    setState(() => _lastFeedback = null);

    if (_engine.isGameOver) {
      _endGame();
      return;
    }

    _makeAIMove();
  }

  Future<void> _makeAIMove() async {
    setState(() => _isThinking = true);

    // Use isolate-based async computation to keep UI responsive
    final aiMove = await _engine.getBestMoveAsync(_difficulty);
    if (aiMove != null) {
      _engine.makeMove(aiMove);
    }

    if (!mounted) return;
    setState(() => _isThinking = false);

    if (_engine.isGameOver) {
      _endGame();
    }
  }

  void _endGame() {
    setState(() {
      _gameOver = true;
      _analysis = _engine.analyzeGame();
    });
  }

  void _resign() {
    setState(() {
      _gameOver = true;
      _analysis = _engine.analyzeGame();
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!_gameStarted) {
      return _buildSetupScreen();
    }

    if (_showAnalysis && _analysis != null) {
      return _buildAnalysisScreen();
    }

    return _buildGameScreen();
  }

  // ====================== Setup Screen ======================
  Widget _buildSetupScreen() {
    return Scaffold(
      appBar: AppBar(title: const Text('Play vs AI')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              Center(
                child: Column(
                  children: [
                    const Text('♟️', style: TextStyle(fontSize: 64)),
                    const SizedBox(height: 16),
                    Text(
                      'Play vs AI',
                      style: GoogleFonts.inter(fontSize: 28, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Choose your difficulty and color',
                      style: GoogleFonts.inter(fontSize: 14, color: Colors.white.withOpacity(0.4)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),

              // Color picker
              Text(
                'PLAY AS',
                style: GoogleFonts.inter(
                  fontSize: 10, fontWeight: FontWeight.w800,
                  color: Colors.white.withOpacity(0.3), letterSpacing: 2,
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: _ColorChoice(
                      label: 'White',
                      icon: '♔',
                      selected: _playerIsWhite,
                      onTap: () => setState(() => _playerIsWhite = true),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _ColorChoice(
                      label: 'Black',
                      icon: '♚',
                      selected: !_playerIsWhite,
                      onTap: () => setState(() => _playerIsWhite = false),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Difficulty picker
              Text(
                'DIFFICULTY',
                style: GoogleFonts.inter(
                  fontSize: 10, fontWeight: FontWeight.w800,
                  color: Colors.white.withOpacity(0.3), letterSpacing: 2,
                ),
              ),
              const SizedBox(height: 10),
              ...List.generate(5, (i) {
                final level = i + 1;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: GestureDetector(
                    onTap: () => setState(() => _difficulty = level),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        color: _difficulty == level
                            ? _difficultyColors[level].withOpacity(0.08)
                            : Colors.white.withOpacity(0.02),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: _difficulty == level
                              ? _difficultyColors[level].withOpacity(0.3)
                              : Colors.white.withOpacity(0.05),
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 28, height: 28,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: _difficulty == level
                                  ? _difficultyColors[level]
                                  : Colors.white.withOpacity(0.05),
                            ),
                            child: Center(
                              child: Text(
                                '$level',
                                style: GoogleFonts.inter(
                                  fontSize: 13, fontWeight: FontWeight.w900,
                                  color: _difficulty == level ? const Color(0xFF06060B) : Colors.white.withOpacity(0.3),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            _difficultyLabels[level],
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: _difficulty == level ? FontWeight.w700 : FontWeight.w400,
                              color: _difficulty == level ? Colors.white : Colors.white.withOpacity(0.5),
                            ),
                          ),
                          const Spacer(),
                          Text(
                            'Depth $level',
                            style: GoogleFonts.inter(
                              fontSize: 11, color: Colors.white.withOpacity(0.2),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
              const SizedBox(height: 40),

              // Start button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _startGame,
                  icon: const Icon(Icons.play_arrow_rounded, size: 22),
                  label: Text(
                    'Start Game',
                    style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w800),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: const Color(0xFF06060B),
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ====================== Game Screen ======================
  Widget _buildGameScreen() {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Text('vs AI ${_difficultyLabels[_difficulty]}'),
            if (_isThinking) ...[
              const SizedBox(width: 8),
              SizedBox(
                width: 14, height: 14,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: const Color(0xFF10B981).withOpacity(0.5),
                ),
              ),
            ],
          ],
        ),
        actions: [
          if (!_gameOver)
            TextButton(
              onPressed: _resign,
              child: Text('Resign', style: GoogleFonts.inter(color: const Color(0xFFEF4444), fontSize: 12)),
            ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Opponent info
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  Container(
                    width: 32, height: 32,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _difficultyColors[_difficulty].withOpacity(0.15),
                    ),
                    child: const Center(child: Text('🤖', style: TextStyle(fontSize: 16))),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'AI ${_difficultyLabels[_difficulty]}',
                        style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                      Text(
                        _playerIsWhite ? 'Black' : 'White',
                        style: GoogleFonts.inter(fontSize: 10, color: Colors.white.withOpacity(0.3)),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Chess Board
            Expanded(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: ChessBoardWidget(
                    fen: _engine.fen,
                    interactive: !_gameOver && !_isThinking,
                    flipped: !_playerIsWhite,
                    onMove: _onPlayerMove,
                    legalTargetsForSquare: (square) => _engine.getLegalTargets(square),
                  ),
                ),
              ),
            ),

            // Player info
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  Container(
                    width: 32, height: 32,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: const Color(0xFF10B981).withOpacity(0.15),
                    ),
                    child: const Center(child: Text('👤', style: TextStyle(fontSize: 16))),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'You',
                        style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                      Text(
                        _playerIsWhite ? 'White' : 'Black',
                        style: GoogleFonts.inter(fontSize: 10, color: Colors.white.withOpacity(0.3)),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Move History
            if (_engine.moveHistory.isNotEmpty)
              Container(
                height: 40,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: MoveHistoryWidget(
                  moves: _engine.moveHistory.map((m) => m.san).toList(),
                  currentMoveIndex: _engine.moveHistory.length - 1,
                ),
              ),

            // Status / Feedback
            if (_lastFeedback != null || _gameOver)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: _gameOver
                      ? const Color(0xFFF59E0B).withOpacity(0.08)
                      : const Color(0xFFEF4444).withOpacity(0.08),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  _gameOver
                      ? (_engine.isCheckmate
                          ? '${_engine.turn == "w" ? "Black" : "White"} wins by checkmate!'
                          : _engine.isStalemate ? 'Draw by stalemate' : 'Game over')
                      : _lastFeedback!,
                  style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white),
                  textAlign: TextAlign.center,
                ),
              ),

            // Game over actions
            if (_gameOver)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
                child: Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => setState(() => _showAnalysis = true),
                        icon: const Icon(Icons.analytics_rounded, size: 18),
                        label: Text('Analysis', style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 13)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF3B82F6),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _startGame,
                        icon: const Icon(Icons.replay_rounded, size: 18),
                        label: Text('Rematch', style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 13)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF10B981),
                          foregroundColor: const Color(0xFF06060B),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  // ====================== Analysis Screen ======================
  Widget _buildAnalysisScreen() {
    final a = _analysis!;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Game Analysis'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => setState(() => _showAnalysis = false),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Result
            Center(
              child: Column(
                children: [
                  Text(
                    a.result,
                    style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${a.totalMoves} moves',
                    style: GoogleFonts.inter(fontSize: 13, color: Colors.white.withOpacity(0.4)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Accuracy
            Center(
              child: Container(
                width: 120, height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: _accuracyColor(a.accuracy),
                    width: 4,
                  ),
                ),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '${a.accuracy.toStringAsFixed(1)}%',
                        style: GoogleFonts.inter(
                          fontSize: 28, fontWeight: FontWeight.w900,
                          color: _accuracyColor(a.accuracy),
                        ),
                      ),
                      Text(
                        'Accuracy',
                        style: GoogleFonts.inter(fontSize: 10, color: Colors.white.withOpacity(0.4)),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Move quality breakdown
            _AnalysisStat(icon: '🌟', label: 'Brilliant Moves', value: a.brilliantMoves, color: const Color(0xFF06B6D4)),
            _AnalysisStat(icon: '✅', label: 'Good Moves', value: a.goodMoves, color: const Color(0xFF10B981)),
            _AnalysisStat(icon: '⚠️', label: 'Inaccuracies', value: a.inaccuracies, color: const Color(0xFFF59E0B)),
            _AnalysisStat(icon: '❌', label: 'Mistakes', value: a.mistakes, color: const Color(0xFFF97316)),
            _AnalysisStat(icon: '💥', label: 'Blunders', value: a.blunders, color: const Color(0xFFEF4444)),

            const SizedBox(height: 24),

            // Improvement suggestions
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.06),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF10B981).withOpacity(0.12)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Text('💡', style: TextStyle(fontSize: 16)),
                      const SizedBox(width: 8),
                      Text(
                        'Improvement Plan',
                        style: GoogleFonts.inter(
                          fontSize: 14, fontWeight: FontWeight.w800, color: const Color(0xFF10B981),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  if (a.blunders > 0) _ImprovementTip('Practice tactical puzzles to reduce blunders'),
                  if (a.mistakes > 1) _ImprovementTip('Focus on candidate moves — check all forcing moves before deciding'),
                  if (a.accuracy < 60) _ImprovementTip('Work on calculation depth exercises'),
                  if (a.accuracy >= 80) _ImprovementTip('Great accuracy! Try a higher difficulty level'),
                  _ImprovementTip('Review critical moments in the game to learn from your decisions'),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Action buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _startGame,
                    icon: const Icon(Icons.replay_rounded, size: 18),
                    label: Text('Play Again', style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      foregroundColor: const Color(0xFF06060B),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _accuracyColor(double accuracy) {
    if (accuracy >= 90) return const Color(0xFF10B981);
    if (accuracy >= 70) return const Color(0xFF3B82F6);
    if (accuracy >= 50) return const Color(0xFFF59E0B);
    return const Color(0xFFEF4444);
  }
}

class _ColorChoice extends StatelessWidget {
  final String label;
  final String icon;
  final bool selected;
  final VoidCallback onTap;

  const _ColorChoice({required this.label, required this.icon, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(
          color: selected ? const Color(0xFF10B981).withOpacity(0.08) : Colors.white.withOpacity(0.02),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: selected ? const Color(0xFF10B981).withOpacity(0.3) : Colors.white.withOpacity(0.05),
            width: selected ? 2 : 1,
          ),
        ),
        child: Column(
          children: [
            Text(icon, style: const TextStyle(fontSize: 36)),
            const SizedBox(height: 8),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: selected ? FontWeight.w700 : FontWeight.w400,
                color: selected ? Colors.white : Colors.white.withOpacity(0.4),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AnalysisStat extends StatelessWidget {
  final String icon;
  final String label;
  final int value;
  final Color color;

  const _AnalysisStat({required this.icon, required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Text(icon, style: const TextStyle(fontSize: 16)),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              label,
              style: GoogleFonts.inter(fontSize: 14, color: Colors.white.withOpacity(0.7)),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              '$value',
              style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w800, color: color),
            ),
          ),
        ],
      ),
    );
  }
}

class _ImprovementTip extends StatelessWidget {
  final String text;
  const _ImprovementTip(this.text);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 6, right: 8),
            child: Container(
              width: 4, height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.5),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          Expanded(
            child: Text(
              text,
              style: GoogleFonts.inter(fontSize: 13, color: Colors.white.withOpacity(0.7), height: 1.4),
            ),
          ),
        ],
      ),
    );
  }
}
