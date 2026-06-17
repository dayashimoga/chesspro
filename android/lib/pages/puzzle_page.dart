import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../widgets/chess_board.dart';
import '../widgets/content_renderer.dart';
import '../core/data_repository.dart';
import '../core/chess_engine.dart';

/// Full puzzle trainer with categories, difficulty, rating-adaptive selection,
/// proper move validation via chess engine, and persistent rating.
class PuzzleTrainerPage extends StatefulWidget {
  final String? initialCategory;
  final String? initialDifficulty;

  const PuzzleTrainerPage({super.key, this.initialCategory, this.initialDifficulty});

  @override
  State<PuzzleTrainerPage> createState() => _PuzzleTrainerPageState();
}

class _PuzzleTrainerPageState extends State<PuzzleTrainerPage> {
  String _selectedCategory = 'all';
  String _selectedDifficulty = 'all';
  List<Map<String, dynamic>> _puzzles = [];
  int _currentIndex = 0;
  int _solved = 0;
  int _streak = 0;
  int _maxStreak = 0;
  int _rating = 800;
  bool _showCategoryPicker = false;
  bool _showPuzzleList = false;

  static const _categories = [
    'all', 'Fork', 'Pin', 'Skewer', 'Discovered Attack', 'Deflection',
    'Sacrifice', 'Back-Rank Mate', 'Knight Fork', 'Queen Fork',
    'Mating Pattern', 'Endgame Tactic', 'Calculation',
  ];

  static const _difficulties = ['all', 'beginner', 'intermediate', 'advanced', 'expert'];

  @override
  void initState() {
    super.initState();
    if (widget.initialCategory != null) _selectedCategory = widget.initialCategory!;
    if (widget.initialDifficulty != null) _selectedDifficulty = widget.initialDifficulty!;
    _loadRating();
    _loadPuzzles();
  }

  /// Load persisted rating from Hive
  void _loadRating() {
    try {
      final box = Hive.box('progress');
      _rating = box.get('puzzleRating', defaultValue: 800) as int;
      _solved = box.get('puzzlesSolved', defaultValue: 0) as int;
      _maxStreak = box.get('puzzleBestStreak', defaultValue: 0) as int;
    } catch (_) {}
  }

  /// Save rating to Hive
  Future<void> _saveRating() async {
    try {
      final box = Hive.box('progress');
      await box.put('puzzleRating', _rating);
      await box.put('puzzlesSolved', _solved);
      await box.put('puzzleBestStreak', _maxStreak);
      await box.put('rating', _rating); // Also update the global rating
    } catch (_) {}
  }

  void _loadPuzzles() {
    var all = DataRepository().puzzles.cast<Map<String, dynamic>>();

    if (_selectedCategory != 'all') {
      all = all.where((p) {
        final theme = (p['theme'] ?? '').toString().toLowerCase();
        final category = (p['category'] ?? '').toString().toLowerCase();
        return theme.contains(_selectedCategory.toLowerCase()) ||
               category.contains(_selectedCategory.toLowerCase());
      }).toList();
    }

    if (_selectedDifficulty != 'all') {
      all = all.where((p) => p['difficulty'] == _selectedDifficulty).toList();
    }

    // Sort by rating proximity to player's rating for adaptive selection
    all.sort((a, b) {
      final ratingA = (a['rating'] as int? ?? 800);
      final ratingB = (b['rating'] as int? ?? 800);
      final diffA = (ratingA - _rating).abs();
      final diffB = (ratingB - _rating).abs();
      return diffA.compareTo(diffB);
    });

    // Take closest-rated puzzles (adaptive), then shuffle within that pool
    final poolSize = min(all.length, max(20, all.length ~/ 3));
    final pool = all.take(poolSize).toList()..shuffle(Random());

    setState(() {
      _puzzles = pool;
      _currentIndex = 0;
    });
  }

  void _onSolved() {
    final puzzleRating = (_puzzles[_currentIndex]['rating'] as int?) ?? 800;
    // Elo-like rating change: more gain for solving harder puzzles
    final expectedScore = 1.0 / (1.0 + pow(10, (puzzleRating - _rating) / 400.0));
    final ratingChange = (32 * (1.0 - expectedScore)).round().clamp(4, 32);

    setState(() {
      _solved++;
      _streak++;
      if (_streak > _maxStreak) _maxStreak = _streak;
      _rating = (_rating + ratingChange).clamp(100, 3000);
    });
    _saveRating();
  }

  void _onFailed() {
    final puzzleRating = (_puzzles[_currentIndex]['rating'] as int?) ?? 800;
    final expectedScore = 1.0 / (1.0 + pow(10, (puzzleRating - _rating) / 400.0));
    final ratingChange = (32 * expectedScore).round().clamp(2, 16);

    setState(() {
      _streak = 0;
      _rating = (_rating - ratingChange).clamp(100, 3000);
    });
    _saveRating();
  }

  void _nextPuzzle() {
    setState(() {
      if (_currentIndex < _puzzles.length - 1) {
        _currentIndex++;
      } else {
        _loadPuzzles(); // Reload with new adaptive pool
      }
    });
  }

  void _selectPuzzle(int index) {
    setState(() {
      _currentIndex = index;
      _showPuzzleList = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Puzzle Trainer'),
        actions: [
          // Stats pill
          Container(
            margin: const EdgeInsets.only(right: 8),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('🔥', style: TextStyle(fontSize: 12)),
                const SizedBox(width: 4),
                Text(
                  '$_streak',
                  style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: const Color(0xFF10B981)),
                ),
                Container(
                  width: 1, height: 12, margin: const EdgeInsets.symmetric(horizontal: 6),
                  color: Colors.white.withOpacity(0.1),
                ),
                const Text('📊', style: TextStyle(fontSize: 12)),
                const SizedBox(width: 4),
                Text(
                  '$_rating',
                  style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: const Color(0xFFF59E0B)),
                ),
              ],
            ),
          ),
          // Puzzle list toggle
          IconButton(
            icon: Icon(_showPuzzleList ? Icons.close : Icons.list_rounded, size: 22),
            onPressed: () => setState(() {
              _showPuzzleList = !_showPuzzleList;
              _showCategoryPicker = false;
            }),
            tooltip: 'Browse Puzzles',
          ),
          IconButton(
            icon: const Icon(Icons.filter_list_rounded, size: 22),
            onPressed: () => setState(() {
              _showCategoryPicker = !_showCategoryPicker;
              _showPuzzleList = false;
            }),
          ),
        ],
      ),
      body: Column(
        children: [
          // Category/Difficulty picker
          if (_showCategoryPicker) _buildFilterPanel(),

          // Puzzle list browser
          if (_showPuzzleList) _buildPuzzleList(),

          // Stats bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: const Color(0xFF0C0C14),
            child: Row(
              children: [
                _MiniStat(label: 'Solved', value: '$_solved', color: const Color(0xFF10B981)),
                _MiniStat(label: 'Streak', value: '$_streak', color: const Color(0xFFF59E0B)),
                _MiniStat(label: 'Best', value: '$_maxStreak', color: const Color(0xFF8B5CF6)),
                _MiniStat(label: 'Rating', value: '$_rating', color: const Color(0xFF3B82F6)),
              ],
            ),
          ),

          // Main puzzle area
          Expanded(
            child: _puzzles.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('🧩', style: TextStyle(fontSize: 56)),
                        const SizedBox(height: 16),
                        Text(
                          'No puzzles match your filters',
                          style: GoogleFonts.inter(fontSize: 16, color: Colors.white.withOpacity(0.5)),
                        ),
                        const SizedBox(height: 12),
                        TextButton(
                          onPressed: () {
                            setState(() {
                              _selectedCategory = 'all';
                              _selectedDifficulty = 'all';
                            });
                            _loadPuzzles();
                          },
                          child: const Text('Reset Filters'),
                        ),
                      ],
                    ),
                  )
                : SingleChildScrollView(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        // Progress
                        Row(
                          children: [
                            Text(
                              'Puzzle ${_currentIndex + 1} of ${_puzzles.length}',
                              style: GoogleFonts.inter(
                                fontSize: 11, fontWeight: FontWeight.w600,
                                color: Colors.white.withOpacity(0.4),
                              ),
                            ),
                            const Spacer(),
                            // Puzzle rating badge
                            if (_puzzles[_currentIndex]['rating'] != null)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                margin: const EdgeInsets.only(right: 6),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF59E0B).withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  '⭐ ${_puzzles[_currentIndex]['rating']}',
                                  style: GoogleFonts.inter(
                                    fontSize: 10, fontWeight: FontWeight.w800,
                                    color: const Color(0xFFF59E0B),
                                  ),
                                ),
                              ),
                            if (_puzzles[_currentIndex]['difficulty'] != null)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: _difficultyColor(_puzzles[_currentIndex]['difficulty']).withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  (_puzzles[_currentIndex]['difficulty'] as String).toUpperCase(),
                                  style: GoogleFonts.inter(
                                    fontSize: 10, fontWeight: FontWeight.w800,
                                    color: _difficultyColor(_puzzles[_currentIndex]['difficulty']),
                                    letterSpacing: 1,
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 12),

                        // Skip button
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            TextButton.icon(
                              onPressed: _nextPuzzle,
                              icon: const Icon(Icons.skip_next_rounded, size: 16, color: Color(0xFF94A3B8)),
                              label: Text('Skip', style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF94A3B8))),
                            ),
                          ],
                        ),

                        PuzzleSolveWidgetV2(
                          key: ValueKey('puzzle_${_currentIndex}_${_puzzles[_currentIndex]['id']}'),
                          puzzle: _puzzles[_currentIndex],
                          onSolved: _onSolved,
                          onFailed: _onFailed,
                          onNext: _nextPuzzle,
                        ),
                      ],
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  /// Puzzle list browser — lets user pick specific puzzles
  Widget _buildPuzzleList() {
    return Container(
      height: 250,
      decoration: BoxDecoration(
        color: const Color(0xFF111119),
        border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.06))),
      ),
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        itemCount: _puzzles.length,
        itemBuilder: (context, index) {
          final puzzle = _puzzles[index];
          final isActive = index == _currentIndex;
          return GestureDetector(
            onTap: () => _selectPuzzle(index),
            child: Container(
              margin: const EdgeInsets.only(bottom: 6),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: isActive
                    ? const Color(0xFF10B981).withOpacity(0.08)
                    : Colors.white.withOpacity(0.02),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: isActive
                      ? const Color(0xFF10B981).withOpacity(0.3)
                      : Colors.white.withOpacity(0.04),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 28, height: 28,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _difficultyColor(puzzle['difficulty']).withOpacity(0.15),
                    ),
                    child: Center(
                      child: Text(
                        '${index + 1}',
                        style: GoogleFonts.inter(
                          fontSize: 11, fontWeight: FontWeight.w800,
                          color: _difficultyColor(puzzle['difficulty']),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          puzzle['theme'] ?? 'Puzzle',
                          style: GoogleFonts.inter(
                            fontSize: 13, fontWeight: FontWeight.w600,
                            color: isActive ? Colors.white : Colors.white.withOpacity(0.7),
                          ),
                        ),
                        Text(
                          '${puzzle['difficulty'] ?? ''} • Rating ${puzzle['rating'] ?? '?'}',
                          style: GoogleFonts.inter(fontSize: 10, color: Colors.white.withOpacity(0.3)),
                        ),
                      ],
                    ),
                  ),
                  if (isActive)
                    const Icon(Icons.play_arrow_rounded, color: Color(0xFF10B981), size: 18),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFilterPanel() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF111119),
        border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.06))),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'CATEGORY',
            style: GoogleFonts.inter(
              fontSize: 10, fontWeight: FontWeight.w800,
              color: Colors.white.withOpacity(0.3), letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: _categories.map((cat) => _FilterChip(
              label: cat == 'all' ? 'All' : cat,
              selected: _selectedCategory == cat,
              onTap: () {
                setState(() => _selectedCategory = cat);
                _loadPuzzles();
              },
            )).toList(),
          ),
          const SizedBox(height: 14),
          Text(
            'DIFFICULTY',
            style: GoogleFonts.inter(
              fontSize: 10, fontWeight: FontWeight.w800,
              color: Colors.white.withOpacity(0.3), letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: _difficulties.map((diff) => _FilterChip(
              label: diff == 'all' ? 'All' : diff[0].toUpperCase() + diff.substring(1),
              selected: _selectedDifficulty == diff,
              onTap: () {
                setState(() => _selectedDifficulty = diff);
                _loadPuzzles();
              },
            )).toList(),
          ),
        ],
      ),
    );
  }

  Color _difficultyColor(String? diff) {
    switch (diff) {
      case 'beginner': return const Color(0xFF10B981);
      case 'intermediate': return const Color(0xFFF59E0B);
      case 'advanced': return const Color(0xFFEF4444);
      case 'expert': return const Color(0xFF8B5CF6);
      default: return const Color(0xFF94A3B8);
    }
  }
}

// =============================================================================
// PuzzleSolveWidgetV2 — Chess engine-backed puzzle solving with proper validation
// =============================================================================
class PuzzleSolveWidgetV2 extends StatefulWidget {
  final Map<String, dynamic> puzzle;
  final VoidCallback? onSolved;
  final VoidCallback? onFailed;
  final VoidCallback? onNext;

  const PuzzleSolveWidgetV2({
    super.key,
    required this.puzzle,
    this.onSolved,
    this.onFailed,
    this.onNext,
  });

  @override
  State<PuzzleSolveWidgetV2> createState() => _PuzzleSolveWidgetV2State();
}

class _PuzzleSolveWidgetV2State extends State<PuzzleSolveWidgetV2> {
  late ChessEngine _engine;
  bool _solved = false;
  bool _failed = false;
  bool _showHint = false;
  int _hintLevel = 0;
  int _attempts = 0;
  String? _feedback;

  List<String> get _solutionMoves {
    final sol = widget.puzzle['solution'];
    if (sol is List) return sol.cast<String>();
    if (sol is String) return [sol];
    return [];
  }

  @override
  void initState() {
    super.initState();
    final fen = widget.puzzle['fen'] ?? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    _engine = ChessEngine.fromFen(fen);
  }

  void _onMove(String from, String to) {
    if (_solved || _failed) return;

    // Try making the move on the engine to get the SAN notation
    final engineCopy = ChessEngine.fromFen(_engine.fen);
    final success = engineCopy.makeMoveFromTo(from, to, promotion: 'q');
    if (!success) {
      setState(() => _feedback = '❌ Illegal move');
      return;
    }

    _attempts++;

    // Get the SAN of what the player just played
    final playerSan = engineCopy.moveHistory.last.san;

    // Compare against the expected solution move
    if (_solutionMoves.isEmpty) {
      setState(() => _feedback = '⚠️ No solution data for this puzzle');
      return;
    }

    // Normalize SAN for comparison (strip +, #, x, =, spaces)
    String normalize(String san) => san.replaceAll(RegExp(r'[+#x=\s]'), '').toLowerCase();

    // Current expected move index based on moves already made
    final moveIndex = _engine.moveHistory.length;
    if (moveIndex >= _solutionMoves.length) {
      // All solution moves have been played
      setState(() {
        _solved = true;
        _feedback = '🎉 Puzzle solved!';
      });
      widget.onSolved?.call();
      return;
    }

    final expectedSan = _solutionMoves[moveIndex];

    if (normalize(playerSan) == normalize(expectedSan)) {
      // Correct move — apply it
      _engine.makeMoveFromTo(from, to, promotion: 'q');

      if (moveIndex + 1 >= _solutionMoves.length) {
        // Last move — puzzle solved!
        setState(() {
          _solved = true;
          _feedback = '🎉 Puzzle solved! ${_solutionMoves.join(", ")}';
        });
        widget.onSolved?.call();
      } else {
        // More moves to go — play the opponent's response automatically
        setState(() => _feedback = '✅ Correct! Keep going...');

        // Play opponent's response after a short delay
        Future.delayed(const Duration(milliseconds: 500), () {
          if (!mounted) return;
          if (moveIndex + 1 < _solutionMoves.length) {
            final opponentMove = _solutionMoves[moveIndex + 1];
            _engine.makeMove(opponentMove);
            setState(() {}); // Refresh board
          }
        });
      }
    } else {
      // Wrong move
      if (_attempts >= 3) {
        setState(() {
          _failed = true;
          _feedback = '💡 Solution: ${_solutionMoves.join(", ")}';
        });
        widget.onFailed?.call();
      } else {
        setState(() {
          _feedback = '❌ Not the best move. Try again! (${3 - _attempts} attempts left)';
        });
      }
    }
  }

  void _showNextHint() {
    setState(() {
      _hintLevel++;
      _showHint = true;
      if (_hintLevel == 1) {
        _feedback = '💡 Theme: ${widget.puzzle['theme'] ?? 'Tactics'}';
      } else if (_hintLevel == 2) {
        final coachNotes = widget.puzzle['coachNotes'] ?? widget.puzzle['coach_notes'];
        if (coachNotes != null) {
          _feedback = '💡 $coachNotes';
        } else {
          _feedback = '💡 Look for the key tactical idea...';
        }
      } else {
        _feedback = '💡 Solution: ${_solutionMoves.join(", ")}';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Board
        SizedBox(
          height: 320,
          child: ChessBoardWidget(
            fen: _engine.fen,
            interactive: !_solved && !_failed,
            onMove: _onMove,
            legalTargetsForSquare: (square) => _engine.getLegalTargets(square),
          ),
        ),
        const SizedBox(height: 12),

        // Puzzle info
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                widget.puzzle['theme'] ?? 'Puzzle',
                style: GoogleFonts.inter(
                  fontSize: 11, fontWeight: FontWeight.w700, color: const Color(0xFF10B981),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: const Color(0xFFF59E0B).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'Rating: ${widget.puzzle['rating'] ?? '?'}',
                style: GoogleFonts.inter(
                  fontSize: 11, fontWeight: FontWeight.w700, color: const Color(0xFFF59E0B),
                ),
              ),
            ),
            const Spacer(),
            if (!_solved && !_failed)
              TextButton.icon(
                onPressed: _showNextHint,
                icon: const Icon(Icons.lightbulb_outline, size: 16, color: Color(0xFFF59E0B)),
                label: Text('Hint', style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFFF59E0B))),
              ),
          ],
        ),

        // Feedback
        if (_feedback != null) ...[
          const SizedBox(height: 10),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: (_solved
                  ? const Color(0xFF10B981)
                  : _failed
                      ? const Color(0xFFF59E0B)
                      : const Color(0xFFEF4444))
                  .withOpacity(0.08),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: (_solved
                    ? const Color(0xFF10B981)
                    : _failed
                        ? const Color(0xFFF59E0B)
                        : const Color(0xFFEF4444))
                    .withOpacity(0.15),
              ),
            ),
            child: Text(
              _feedback!,
              style: GoogleFonts.inter(fontSize: 13, color: Colors.white.withOpacity(0.85), height: 1.4),
            ),
          ),
        ],

        // Explanation
        if ((_solved || _failed) && widget.puzzle['coachNotes'] != null) ...[
          const SizedBox(height: 8),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF3B82F6).withOpacity(0.08),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('📖 ', style: TextStyle(fontSize: 14)),
                Expanded(
                  child: Text(
                    widget.puzzle['coachNotes'],
                    style: GoogleFonts.inter(fontSize: 13, color: Colors.white.withOpacity(0.8), height: 1.4),
                  ),
                ),
              ],
            ),
          ),
        ],

        // Next button
        if (_solved || _failed) ...[
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: widget.onNext,
              icon: const Icon(Icons.arrow_forward_rounded, size: 18),
              label: Text('Next Puzzle', style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF10B981),
                foregroundColor: const Color(0xFF06060B),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      ],
    );
  }
}

class _MiniStat extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _MiniStat({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Text(
            value,
            style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w900, color: color),
          ),
          Text(
            label,
            style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w600, color: Colors.white.withOpacity(0.3)),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _FilterChip({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: selected ? const Color(0xFF10B981).withOpacity(0.15) : Colors.white.withOpacity(0.03),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected ? const Color(0xFF10B981).withOpacity(0.3) : Colors.white.withOpacity(0.06),
          ),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: selected ? FontWeight.w700 : FontWeight.w400,
            color: selected ? const Color(0xFF10B981) : Colors.white.withOpacity(0.5),
          ),
        ),
      ),
    );
  }
}
