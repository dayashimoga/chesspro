import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/content_renderer.dart';
import '../widgets/chess_board.dart';
import '../core/data_repository.dart';

/// Full interactive lesson experience with theory, examples, exercises, puzzles
class LessonPage extends StatefulWidget {
  final String courseId;
  final String moduleId;

  const LessonPage({super.key, required this.courseId, required this.moduleId});

  @override
  State<LessonPage> createState() => _LessonPageState();
}

class _LessonPageState extends State<LessonPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  int _completedExercises = 0;
  int _totalExercises = 0;
  bool _lessonComplete = false;

  Map<String, dynamic>? get _module => DataRepository().getModule(widget.courseId, widget.moduleId);

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _calculateTotalExercises();
  }

  void _calculateTotalExercises() {
    final m = _module;
    if (m == null) return;
    final exercises = (m['exercises'] as List?) ?? [];
    final puzzles = (m['puzzles'] as List?) ?? [];
    _totalExercises = exercises.length + puzzles.length;
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _onExerciseComplete() {
    setState(() {
      _completedExercises++;
      if (_completedExercises >= _totalExercises && _totalExercises > 0) {
        _lessonComplete = true;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final module = _module;

    if (module == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Lesson')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('📚', style: TextStyle(fontSize: 48)),
              const SizedBox(height: 16),
              Text(
                'Loading lesson...',
                style: GoogleFonts.inter(fontSize: 16, color: Colors.white.withOpacity(0.6)),
              ),
            ],
          ),
        ),
      );
    }

    final theory = module['theory'] as String? ?? '';
    final examples = (module['examples'] as List?)?.cast<Map<String, dynamic>>() ?? [];
    final exercises = (module['exercises'] as List?)?.cast<Map<String, dynamic>>() ?? [];
    final puzzles = (module['puzzles'] as List?)?.cast<Map<String, dynamic>>() ?? [];

    return Scaffold(
      appBar: AppBar(
        title: Text(module['title'] ?? 'Lesson'),
        actions: [
          if (_totalExercises > 0)
            Container(
              margin: const EdgeInsets.only(right: 12),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    _lessonComplete ? Icons.check_circle : Icons.radio_button_unchecked,
                    size: 14,
                    color: const Color(0xFF10B981),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '$_completedExercises/$_totalExercises',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF10B981),
                    ),
                  ),
                ],
              ),
            ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700),
          unselectedLabelStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w400),
          indicatorColor: const Color(0xFF10B981),
          labelColor: const Color(0xFF10B981),
          unselectedLabelColor: Colors.white.withOpacity(0.4),
          tabAlignment: TabAlignment.start,
          tabs: [
            Tab(text: '📖 Theory${theory.isNotEmpty ? "" : " (empty)"}'),
            Tab(text: '♟️ Examples (${examples.length})'),
            Tab(text: '✏️ Exercises (${exercises.length})'),
            Tab(text: '🧩 Puzzles (${puzzles.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Tab 1: Theory
          _buildTheoryTab(theory),

          // Tab 2: Examples
          _buildExamplesTab(examples),

          // Tab 3: Exercises
          _buildExercisesTab(exercises),

          // Tab 4: Puzzles
          _buildPuzzlesTab(puzzles),
        ],
      ),
      bottomNavigationBar: _lessonComplete
          ? Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF0C0C14),
                border: Border(top: BorderSide(color: Colors.white.withOpacity(0.06))),
              ),
              child: SafeArea(
                child: ElevatedButton.icon(
                  onPressed: () {
                    // Mark complete and return
                    Navigator.of(context).pop(true);
                  },
                  icon: const Icon(Icons.check_circle_rounded, size: 20),
                  label: Text(
                    'Complete Lesson (+25 XP)',
                    style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w800),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: const Color(0xFF06060B),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ),
            )
          : null,
    );
  }

  Widget _buildTheoryTab(String theory) {
    if (theory.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('📝', style: TextStyle(fontSize: 48)),
            const SizedBox(height: 12),
            Text(
              'Theory content loading...',
              style: GoogleFonts.inter(fontSize: 14, color: Colors.white.withOpacity(0.5)),
            ),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: ContentRenderer(htmlContent: theory),
    );
  }

  Widget _buildExamplesTab(List<Map<String, dynamic>> examples) {
    if (examples.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('♟️', style: TextStyle(fontSize: 48)),
            const SizedBox(height: 12),
            Text(
              'No examples for this lesson',
              style: GoogleFonts.inter(fontSize: 14, color: Colors.white.withOpacity(0.5)),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: examples.length,
      itemBuilder: (context, index) {
        return ExampleBoardWidget(example: examples[index]);
      },
    );
  }

  Widget _buildExercisesTab(List<Map<String, dynamic>> exercises) {
    if (exercises.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('✏️', style: TextStyle(fontSize: 48)),
            const SizedBox(height: 12),
            Text(
              'No exercises for this lesson',
              style: GoogleFonts.inter(fontSize: 14, color: Colors.white.withOpacity(0.5)),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: exercises.length,
      itemBuilder: (context, index) {
        final exercise = exercises[index];
        final type = exercise['type'] as String? ?? 'quiz';

        if (type == 'find-move' || type == 'find-candidates') {
          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: FindMoveWidget(
              exercise: exercise,
              onComplete: _onExerciseComplete,
            ),
          );
        }

        return Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: QuizWidget(
            exercise: exercise,
            onComplete: _onExerciseComplete,
          ),
        );
      },
    );
  }

  Widget _buildPuzzlesTab(List<Map<String, dynamic>> puzzles) {
    if (puzzles.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('🧩', style: TextStyle(fontSize: 48)),
            const SizedBox(height: 12),
            Text(
              'No puzzles for this lesson',
              style: GoogleFonts.inter(fontSize: 14, color: Colors.white.withOpacity(0.5)),
            ),
          ],
        ),
      );
    }

    return _PuzzleSequence(
      puzzles: puzzles,
      onSolved: _onExerciseComplete,
    );
  }
}

/// Puzzle sequence — presents puzzles one at a time
class _PuzzleSequence extends StatefulWidget {
  final List<Map<String, dynamic>> puzzles;
  final VoidCallback? onSolved;

  const _PuzzleSequence({required this.puzzles, this.onSolved});

  @override
  State<_PuzzleSequence> createState() => _PuzzleSequenceState();
}

class _PuzzleSequenceState extends State<_PuzzleSequence> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    if (_currentIndex >= widget.puzzles.length) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('🎉', style: TextStyle(fontSize: 56)),
            const SizedBox(height: 16),
            Text(
              'All puzzles complete!',
              style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
            ),
            const SizedBox(height: 8),
            Text(
              '${widget.puzzles.length} puzzles solved',
              style: GoogleFonts.inter(fontSize: 14, color: Colors.white.withOpacity(0.5)),
            ),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Progress
          Row(
            children: [
              Text(
                'Puzzle ${_currentIndex + 1} of ${widget.puzzles.length}',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Colors.white.withOpacity(0.5),
                ),
              ),
              const Spacer(),
              Text(
                '${((_currentIndex / widget.puzzles.length) * 100).toInt()}%',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF10B981),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          LinearProgressIndicator(
            value: _currentIndex / widget.puzzles.length,
            backgroundColor: Colors.white.withOpacity(0.05),
            valueColor: const AlwaysStoppedAnimation(Color(0xFF10B981)),
            borderRadius: BorderRadius.circular(4),
          ),
          const SizedBox(height: 16),

          PuzzleSolveWidget(
            key: ValueKey(_currentIndex),
            puzzle: widget.puzzles[_currentIndex],
            onSolved: () {
              widget.onSolved?.call();
            },
            onNext: () {
              setState(() => _currentIndex++);
            },
          ),
        ],
      ),
    );
  }
}
