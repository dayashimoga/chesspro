import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/chess_board.dart';
import '../widgets/content_renderer.dart';
import '../core/data_repository.dart';

/// Full puzzle trainer with categories, difficulty, hints, streaks, and ratings
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
    _loadPuzzles();
  }

  void _loadPuzzles() {
    var all = DataRepository().puzzles.cast<Map<String, dynamic>>();

    if (_selectedCategory != 'all') {
      all = all.where((p) {
        final theme = (p['theme'] ?? '').toString().toLowerCase();
        return theme.contains(_selectedCategory.toLowerCase());
      }).toList();
    }

    if (_selectedDifficulty != 'all') {
      all = all.where((p) => p['difficulty'] == _selectedDifficulty).toList();
    }

    all.shuffle(Random());
    setState(() {
      _puzzles = all;
      _currentIndex = 0;
    });
  }

  void _onSolved() {
    setState(() {
      _solved++;
      _streak++;
      if (_streak > _maxStreak) _maxStreak = _streak;
      _rating = (_rating + 8).clamp(100, 3000);
    });
  }

  void _onFailed() {
    setState(() {
      _streak = 0;
      _rating = (_rating - 4).clamp(100, 3000);
    });
  }

  void _nextPuzzle() {
    setState(() {
      if (_currentIndex < _puzzles.length - 1) {
        _currentIndex++;
      } else {
        _loadPuzzles(); // Reshuffle
      }
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
          IconButton(
            icon: const Icon(Icons.filter_list_rounded, size: 22),
            onPressed: () => setState(() => _showCategoryPicker = !_showCategoryPicker),
          ),
        ],
      ),
      body: Column(
        children: [
          // Category/Difficulty picker
          if (_showCategoryPicker) _buildFilterPanel(),

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

                        PuzzleSolveWidget(
                          key: ValueKey('puzzle_$_currentIndex'),
                          puzzle: _puzzles[_currentIndex],
                          onSolved: _onSolved,
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
