import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hive/hive.dart';
import '../widgets/chess_board.dart';
import '../core/chess_engine.dart';
import '../core/data_repository.dart';

class LabData {
  final String id;
  final String title;
  final String description;
  final String instructions;
  final String fen;
  final List<String> solution; // List of moves (UCI or SAN)
  final String successMessage;

  LabData({
    required this.id,
    required this.title,
    required this.description,
    required this.instructions,
    required this.fen,
    required this.solution,
    required this.successMessage,
  });
}

class QuizData {
  final String id;
  final String question;
  final List<String> options;
  final int correctIndex;
  final String explanation;

  QuizData({
    required this.id,
    required this.question,
    required this.options,
    required this.correctIndex,
    required this.explanation,
  });
}

class RoadmapTier {
  final String title;
  final int targetElo;
  final String badge;
  final List<LabData> labs;
  final QuizData quiz;

  RoadmapTier({
    required this.title,
    required this.targetElo,
    required this.badge,
    required this.labs,
    required this.quiz,
  });
}

class JourneyRoadmapPage extends StatefulWidget {
  const JourneyRoadmapPage({super.key});

  @override
  State<JourneyRoadmapPage> createState() => _JourneyRoadmapPageState();
}

class _JourneyRoadmapPageState extends State<JourneyRoadmapPage> {
  final List<RoadmapTier> _tiers = [
    RoadmapTier(
      title: 'Novice Journey',
      targetElo: 800,
      badge: '🌱',
      labs: [
        LabData(
          id: 'novice_lab1',
          title: 'Lab 1: Rook Control',
          description: 'Learn how Rooks command straight files.',
          instructions: 'The Rook moves in straight vertical and horizontal lines. Capture the undefended Black rook on e1!',
          fen: '8/8/8/8/4R3/8/8/4r3 w - - 0 1',
          solution: ['e4e1'],
          successMessage: 'Excellent! You captured the rook and controlled the e-file.',
        ),
        LabData(
          id: 'novice_lab2',
          title: 'Lab 2: Back Rank Mate',
          description: 'Punish a trapped King behind its own pawns.',
          instructions: 'The Black King is trapped on the back rank behind its pawns. Move your Rook to d8 to deliver checkmate!',
          fen: '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1',
          solution: ['d1d8'],
          successMessage: 'Checkmate! You executed a classic Back Rank Mate.',
        ),
      ],
      quiz: QuizData(
        id: 'novice_quiz',
        question: 'Which piece can jump over other pieces on the board?',
        options: ['Rook', 'Knight', 'Bishop', 'Queen'],
        correctIndex: 1,
        explanation: 'The Knight is the only piece in chess that can jump over other pieces.',
      ),
    ),
    RoadmapTier(
      title: 'Apprentice Journey',
      targetElo: 1000,
      badge: '⚔️',
      labs: [
        LabData(
          id: 'apprentice_lab1',
          title: 'Lab 3: Knight Fork',
          description: 'Attack two key targets simultaneously.',
          instructions: 'Knights are dangerous double attackers. Move your Knight to c7 to fork the King and Queen!',
          fen: '4k3/8/8/3N4/8/8/6q1/4K3 w - - 0 1',
          solution: ['d5c7'],
          successMessage: 'Great job! You forked the King and Queen, winning the Queen.',
        ),
        LabData(
          id: 'apprentice_lab2',
          title: 'Lab 4: Gaining Opposition',
          description: 'Use the King face-to-face opposition rule.',
          instructions: 'Opposition occurs when Kings face each other with one square between. Move your King to e4 directly opposite Black\'s King!',
          fen: '8/8/8/4k3/8/4K3/8/8 w - - 0 1',
          solution: ['e3e4'],
          successMessage: 'Correct! By gaining the opposition, you force Black\'s King to step aside.',
        ),
      ],
      quiz: QuizData(
        id: 'apprentice_quiz',
        question: 'What is checkmate in chess?',
        options: [
          'When the king is in check and has no legal way to escape',
          'When the king is captured and removed from the board',
          'When a player has no legal moves but their king is not in check'
        ],
        correctIndex: 0,
        explanation: 'Checkmate occurs when the King is threatened with capture (in check) and cannot escape.',
      ),
    ),
    RoadmapTier(
      title: 'Tactician Journey',
      targetElo: 1200,
      badge: '🏹',
      labs: [
        LabData(
          id: 'tactician_lab1',
          title: 'Lab 5: Queen Pin',
          description: 'Pin the enemy Queen to the undefended King.',
          instructions: 'The Queen and King are on the d-file. Pin and capture the Queen with your Rook on d5!',
          fen: '3qk3/8/8/3R4/8/8/8/4K3 w - - 0 1',
          solution: ['d5d8'],
          successMessage: 'Splendid! You pinned and captured the Queen.',
        ),
        LabData(
          id: 'tactician_lab2',
          title: 'Lab 6: Smothered Mate',
          description: 'Trapped by its own defenders.',
          instructions: 'Deliver smothered mate on f7 using your Knight on e5!',
          fen: '6rk/5ppp/8/4N3/8/8/8/6K1 w - - 0 1',
          solution: ['e5f7'],
          successMessage: 'Smothered checkmate! Black\'s King is suffocated by its own pieces.',
        ),
      ],
      quiz: QuizData(
        id: 'tactician_quiz',
        question: 'What is a double attack (fork)?',
        options: [
          'Attacking two or more target pieces simultaneously with a single piece',
          'Checking the king twice in a row',
          'Moving two pieces at the same time'
        ],
        correctIndex: 0,
        explanation: 'A fork attacks multiple pieces at once, forcing the opponent to lose one of them.',
      ),
    ),
    RoadmapTier(
      title: 'Strategist Journey',
      targetElo: 1500,
      badge: '🏰',
      labs: [
        LabData(
          id: 'strategist_lab1',
          title: 'Lab 7: Open File Seizure',
          description: 'Occupy open pathways to attack.',
          instructions: 'Rooks belong on open files. Move your Rook on a1 to the open e-file checking the King!',
          fen: 'r2qk2r/ppp2ppp/2n5/8/8/2N5/PPP2PPP/R4RK1 w kq - 0 1',
          solution: ['a1e1'],
          successMessage: 'Brilliant! Seizing the open file with check paralyzes Black.',
        ),
        LabData(
          id: 'strategist_lab2',
          title: 'Lab 8: Deflection Mate',
          description: 'Deflect the back rank guardian.',
          instructions: 'Deflect Black\'s Rook! Play Queen to b8 check, forcing Black to block and exposing them to mate.',
          fen: '6k1/5ppp/2r5/8/8/8/1Q3PPP/6K1 w - - 0 1',
          solution: ['b2b8', 'c6c8', 'b8c8'],
          successMessage: 'Checkmate! You deflected the defending rook to deliver checkmate.',
        ),
      ],
      quiz: QuizData(
        id: 'strategist_quiz',
        question: 'What is prophylaxis in chess strategy?',
        options: [
          'Aggressive piece sacrificing to start an attack',
          'A preventive move that stops the opponent\'s counterplay threats before they occur',
          'An opening system played with White'
        ],
        correctIndex: 1,
        explanation: 'Prophylaxis is predicting and neutralizing the opponent\'s threats in advance.',
      ),
    ),
    RoadmapTier(
      title: 'Master Candidate',
      targetElo: 1800,
      badge: '💎',
      labs: [
        LabData(
          id: 'master_lab1',
          title: 'Lab 9: Greek Gift Sac',
          description: 'Sacrifice a Bishop to break open the castled King.',
          instructions: 'Sacrifice your Bishop on h7 to expose Black\'s King!',
          fen: 'r1bq1rk1/ppp1bppp/2n1p3/3p4/3P4/3BPN2/PPP2PPP/RNBQK2R w KQ - 0 1',
          solution: ['d3h7'],
          successMessage: 'Bxh7+! A famous sacrifice that tears down the castle walls.',
        ),
        LabData(
          id: 'master_lab2',
          title: 'Lab 10: Breakthrough',
          description: 'Sacrifice/push to create a passed pawn.',
          instructions: 'Push your b-pawn forward to b6 to breakthrough and guarantee promotion!',
          fen: '8/8/8/pPp5/8/8/8/k6K w - - 0 1',
          solution: ['b5b6'],
          successMessage: 'Correct! The passed b-pawn is unstoppable and will promote.',
        ),
      ],
      quiz: QuizData(
        id: 'master_quiz',
        question: 'Which piece is sacrificed in the standard "Greek Gift" pattern?',
        options: ['Rook on a1', 'Knight on f3', 'Bishop on d3', 'Queen on d1'],
        correctIndex: 2,
        explanation: 'The Greek Gift sacrifice involves Bxh7+ (White Bishop on d3 sacrificing itself on h7).',
      ),
    ),
    RoadmapTier(
      title: 'Grandmaster Journey',
      targetElo: 2500,
      badge: '👑',
      labs: [
        LabData(
          id: 'gm_lab1',
          title: 'Lab 11: Smothered Combination',
          description: 'A beautiful sequence of Knight and Queen.',
          instructions: 'Start the combination: Play Knight to f7 check!',
          fen: 'r1b2q1k/pp4pp/2n5/5pN1/2B1p3/8/PPP2PPP/3Q1RK1 w - - 0 1',
          solution: ['g5f7', 'h8g8', 'f7h6', 'g8h8', 'd1g8', 'f8g8', 'h6f7'],
          successMessage: 'Incredible Smothered Checkmate! You calculated the entire sequence perfectly.',
        ),
        LabData(
          id: 'gm_lab2',
          title: 'Lab 12: Active Neutralization',
          description: 'Defuse threats actively.',
          instructions: 'Neutralize the d5 pawn threat by capturing it with your e4 pawn!',
          fen: 'rnbqkbnr/ppp2ppp/8/3pp3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
          solution: ['e4d5'],
          successMessage: 'Correct! You captured the active attacker and resolved the pressure.',
        ),
      ],
      quiz: QuizData(
        id: 'gm_quiz',
        question: 'Under a double check, what is the ONLY legal response for the king?',
        options: [
          'Capture one of the checking pieces',
          'Block the check with a pawn or piece',
          'Move the King to a safe square'
        ],
        correctIndex: 2,
        explanation: 'Since two pieces check the King at once, blocking or capturing is impossible. The King must move.',
      ),
    ),
  ];

  int _unlockedTier = 0;
  List<String> _completedLabs = [];
  bool _isFreeMode = false;


  @override
  void initState() {
    super.initState();
    _loadProgress();
  }

  void _loadProgress() {
    try {
      final box = Hive.box('progress');
      setState(() {
        _unlockedTier = box.get('roadmap_unlocked_tier', defaultValue: 0) as int;
        _completedLabs = List<String>.from(box.get('roadmap_completed_labs', defaultValue: <dynamic>[]) as List);
        _isFreeMode = box.get('roadmap_free_mode', defaultValue: false) as bool;
      });
    } catch (_) {}
  }

  Future<void> _setFreeMode(bool free) async {
    setState(() {
      _isFreeMode = free;
    });
    try {
      final box = Hive.box('progress');
      await box.put('roadmap_free_mode', free);
    } catch (_) {}
  }

  Future<void> _completeLab(String labId, int tierIndex) async {
    if (_completedLabs.contains(labId)) return;

    try {
      final box = Hive.box('progress');
      _completedLabs.add(labId);
      await box.put('roadmap_completed_labs', _completedLabs);

      // Award XP
      final currentXp = box.get('xp', defaultValue: 0) as int;
      await box.put('xp', currentXp + 50);

      // Check if this tier is now fully complete (both labs and the quiz)
      final tier = _tiers[tierIndex];
      final allLabsDone = tier.labs.every((lab) => _completedLabs.contains(lab.id));
      final quizDone = _completedLabs.contains('${tier.quiz.id}_done');

      if (allLabsDone && quizDone && _unlockedTier == tierIndex) {
        _unlockedTier = min(_tiers.length - 1, _unlockedTier + 1);
        await box.put('roadmap_unlocked_tier', _unlockedTier);

        // Save rating bump
        final currentRating = box.get('rating', defaultValue: 800) as int;
        await box.put('rating', max(currentRating, tier.targetElo));
      }

      setState(() {});
    } catch (_) {}
  }

  Future<void> _completeQuiz(String quizId, int tierIndex) async {
    final quizKey = '${quizId}_done';
    if (_completedLabs.contains(quizKey)) return;

    try {
      final box = Hive.box('progress');
      _completedLabs.add(quizKey);
      await box.put('roadmap_completed_labs', _completedLabs);

      // Award XP
      final currentXp = box.get('xp', defaultValue: 0) as int;
      await box.put('xp', currentXp + 50);

      // Check if this tier is now fully complete
      final tier = _tiers[tierIndex];
      final allLabsDone = tier.labs.every((lab) => _completedLabs.contains(lab.id));

      if (allLabsDone && _unlockedTier == tierIndex) {
        _unlockedTier = min(_tiers.length - 1, _unlockedTier + 1);
        await box.put('roadmap_unlocked_tier', _unlockedTier);

        // Save rating bump
        final currentRating = box.get('rating', defaultValue: 800) as int;
        await box.put('rating', max(currentRating, tier.targetElo));
      }

      setState(() {});
    } catch (_) {}
  }

  void _openLab(LabData lab, int tierIndex) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return Dialog(
          backgroundColor: const Color(0xFF0C0C14),
          insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Container(
            padding: const EdgeInsets.all(16),
            width: double.infinity,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          lab.title,
                          style: GoogleFonts.inter(
                            fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white60),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ],
                  ),
                  const Divider(color: Colors.white10),
                  const SizedBox(height: 8),
                  Text(
                    lab.instructions,
                    style: GoogleFonts.inter(fontSize: 13, color: Colors.white70, height: 1.4),
                  ),
                  const SizedBox(height: 16),
                  LabSolverWidget(
                    lab: lab,
                    onComplete: () {
                      _completeLab(lab.id, tierIndex);
                    },
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  void _openQuiz(QuizData quiz, int tierIndex) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return Dialog(
          backgroundColor: const Color(0xFF0C0C14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: QuizSolverWidget(
            quiz: quiz,
            onComplete: () {
              _completeQuiz(quiz.id, tierIndex);
            },
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Hero Header
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                const Color(0xFF10B981).withOpacity(0.08),
                const Color(0xFF10B981).withOpacity(0.01),
              ],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFF10B981).withOpacity(0.12)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Grandmaster Journey Roadmap 👑',
                style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
              ),
              const SizedBox(height: 4),
              Text(
                'Complete interactive board labs and theory checks to progress, increase your Elo rating, and claim rewards.',
                style: GoogleFonts.inter(fontSize: 12, color: Colors.white60, height: 1.4),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Guided vs Free Mode Toggle
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Progression Mode:',
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                color: Colors.white70,
              ),
            ),
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF161622),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              padding: const EdgeInsets.all(2),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => _setFreeMode(false),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: !_isFreeMode ? const Color(0xFF10B981) : Colors.transparent,
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.gps_fixed,
                            size: 12,
                            color: !_isFreeMode ? const Color(0xFF06060B) : Colors.white60,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Guided',
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: !_isFreeMode ? const Color(0xFF06060B) : Colors.white60,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () => _setFreeMode(true),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: _isFreeMode ? const Color(0xFF10B981) : Colors.transparent,
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.lock_open,
                            size: 12,
                            color: _isFreeMode ? const Color(0xFF06060B) : Colors.white60,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Free',
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: _isFreeMode ? const Color(0xFF06060B) : Colors.white60,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // Node Tree
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _tiers.length,
          itemBuilder: (context, idx) {
            final tier = _tiers[idx];
            final isUnlocked = _isFreeMode ? true : (idx <= _unlockedTier);
            final isCompleted = idx < _unlockedTier;
            final isRecommended = idx == _unlockedTier;

            return _buildTierNode(
              tier,
              idx,
              isUnlocked,
              isCompleted,
              isRecommended: isRecommended,
            );
          },
        ),
      ],
    );
  }

  Widget _buildTierNode(RoadmapTier tier, int index, bool isUnlocked, bool isCompleted, {bool isRecommended = false}) {
    Color statusColor;
    if (isCompleted) {
      statusColor = const Color(0xFF10B981); // Green
    } else if (isRecommended) {
      statusColor = const Color(0xFFF59E0B); // Amber
    } else if (isUnlocked) {
      statusColor = const Color(0xFF3B82F6); // Blue for free-unlocked
    } else {
      statusColor = Colors.white10; // Locked in guided
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: const Color(0xFF111119),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: statusColor.withOpacity(0.2),
          width: isRecommended ? 2.0 : 1.0,
        ),
      ),
      child: ExpansionTile(
        initiallyExpanded: _isFreeMode ? isRecommended : (isUnlocked && !isCompleted),
        enabled: isUnlocked,
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: statusColor.withOpacity(0.1),
          ),
          child: Center(
            child: Text(
              isUnlocked ? tier.badge : '🔒',
              style: const TextStyle(fontSize: 18),
            ),
          ),
        ),
        title: Row(
          children: [
            Text(
              tier.title,
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: isUnlocked ? Colors.white : Colors.white24,
              ),
            ),
            if (_isFreeMode && isRecommended) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFFF59E0B).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: const Color(0xFFF59E0B).withOpacity(0.3), width: 0.5),
                ),
                child: Text(
                  'Recommended',
                  style: GoogleFonts.inter(
                    fontSize: 8,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFFF59E0B),
                  ),
                ),
              ),
            ],
          ],
        ),
        subtitle: Text(
          'Target: ${tier.targetElo} Elo',
          style: GoogleFonts.inter(
            fontSize: 11,
            color: isUnlocked ? Colors.white60 : Colors.white24,
          ),
        ),
        trailing: isCompleted
            ? const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 22)
            : const Icon(Icons.keyboard_arrow_down, color: Colors.white30),
        childrenPadding: const EdgeInsets.all(16),
        children: [
          if (isUnlocked) ...[
            // Lab items
            ...tier.labs.map((lab) {
              final done = _completedLabs.contains(lab.id);
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: done ? const Color(0xFF10B981).withOpacity(0.04) : Colors.white.withOpacity(0.02),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: done ? const Color(0xFF10B981).withOpacity(0.15) : Colors.white.withOpacity(0.05),
                  ),
                ),
                child: Row(
                  children: [
                    Text(done ? '✅' : '🔬', style: const TextStyle(fontSize: 15)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            lab.title,
                            style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            lab.description,
                            style: GoogleFonts.inter(fontSize: 10, color: Colors.white60),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () => _openLab(lab, index),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: done ? const Color(0xFF1E293B) : const Color(0xFF10B981),
                        foregroundColor: done ? Colors.white60 : const Color(0xFF06060B),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      child: Text(
                        done ? 'Review' : 'Start Lab',
                        style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ],
                ),
              );
            }),

            // Quiz Item
            (() {
              final done = _completedLabs.contains('${tier.quiz.id}_done');
              return Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: done ? const Color(0xFF10B981).withOpacity(0.04) : Colors.white.withOpacity(0.02),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: done ? const Color(0xFF10B981).withOpacity(0.15) : Colors.white.withOpacity(0.05),
                  ),
                ),
                child: Row(
                  children: [
                    Text(done ? '✅' : '📝', style: const TextStyle(fontSize: 15)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Mastery Test',
                            style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Complete the quiz to verify your Elo level.',
                            style: GoogleFonts.inter(fontSize: 10, color: Colors.white60),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () => _openQuiz(tier.quiz, index),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: done ? const Color(0xFF1E293B) : const Color(0xFF10B981),
                        foregroundColor: done ? Colors.white60 : const Color(0xFF06060B),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      child: Text(
                        done ? 'Done' : 'Take Test',
                        style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ],
                ),
              );
            })(),
          ],
        ],
      ),
    );
  }
}

/// LabSolverWidget — solves specific lab board position with expected solution
class LabSolverWidget extends StatefulWidget {
  final LabData lab;
  final VoidCallback onComplete;

  const LabSolverWidget({super.key, required this.lab, required this.onComplete});

  @override
  State<LabSolverWidget> createState() => _LabSolverWidgetState();
}

class _LabSolverWidgetState extends State<LabSolverWidget> {
  late ChessEngine _engine;
  bool _solved = false;
  String? _feedback;
  int _moveIndex = 0;

  @override
  void initState() {
    super.initState();
    _engine = ChessEngine.fromFen(widget.lab.fen);
  }

  void _onMove(String from, String to) {
    if (_solved) return;

    final copy = ChessEngine.fromFen(_engine.fen);
    final ok = copy.makeMoveFromTo(from, to, promotion: 'q');
    if (!ok) {
      setState(() => _feedback = '❌ Illegal move');
      return;
    }

    final playSan = copy.moveHistory.last.san;
    String normalize(String s) => s.replaceAll(RegExp(r'[+#x=\s]'), '').toLowerCase();

    final expectedMove = widget.lab.solution[_moveIndex];
    final uci = '${from}${to}'.toLowerCase();

    final isCorrect = normalize(playSan) == normalize(expectedMove) || uci == normalize(expectedMove);

    if (isCorrect) {
      _engine.makeMoveFromTo(from, to, promotion: 'q');
      _moveIndex++;

      if (_moveIndex >= widget.lab.solution.length) {
        setState(() {
          _solved = true;
          _feedback = '🎉 Correct! ${widget.lab.successMessage}';
        });
        widget.onComplete();
      } else {
        setState(() {
          _feedback = '✅ Correct! Keep going...';
        });
        Future.delayed(const Duration(milliseconds: 500), () {
          if (!mounted) return;
          final opponentMove = widget.lab.solution[_moveIndex];
          _engine.makeMove(opponentMove);
          _moveIndex++;
          setState(() {});
        });
      }
    } else {
      setState(() {
        _feedback = '❌ Incorrect move. Try again!';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 280,
          child: ChessBoardWidget(
            fen: _engine.fen,
            interactive: !_solved,
            onMove: _onMove,
            legalTargetsForSquare: (square) => _engine.getLegalTargets(square),
          ),
        ),
        const SizedBox(height: 12),
        if (_feedback != null)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: (_solved ? const Color(0xFF10B981) : const Color(0xFFEF4444)).withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: (_solved ? const Color(0xFF10B981) : const Color(0xFFEF4444)).withOpacity(0.2),
              ),
            ),
            child: Text(
              _feedback!,
              style: GoogleFonts.inter(fontSize: 12, color: Colors.white, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
          ),
      ],
    );
  }
}

/// QuizSolverWidget — handles a multiple choice quiz
class QuizSolverWidget extends StatefulWidget {
  final QuizData quiz;
  final VoidCallback onComplete;

  const QuizSolverWidget({super.key, required this.quiz, required this.onComplete});

  @override
  State<QuizSolverWidget> createState() => _QuizSolverWidgetState();
}

class _QuizSolverWidgetState extends State<QuizSolverWidget> {
  int? _selectedIndex;
  bool _submitted = false;
  bool _correct = false;

  void _submit() {
    if (_selectedIndex == null || _submitted) return;
    setState(() {
      _submitted = true;
      _correct = _selectedIndex == widget.quiz.correctIndex;
    });
    if (_correct) {
      widget.onComplete();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Mastery Quiz',
                style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white),
              ),
              IconButton(
                icon: const Icon(Icons.close, color: Colors.white60),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
          const Divider(color: Colors.white10),
          const SizedBox(height: 8),
          Text(
            widget.quiz.question,
            style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white),
          ),
          const SizedBox(height: 16),
          ...List.generate(widget.quiz.options.length, (idx) {
            final option = widget.quiz.options[idx];
            final isSelected = _selectedIndex == idx;

            Color optionBg = Colors.white.withOpacity(0.02);
            Color optionBorder = Colors.white.withOpacity(0.06);

            if (isSelected) {
              optionBg = const Color(0xFF3B82F6).withOpacity(0.08);
              optionBorder = const Color(0xFF3B82F6).withOpacity(0.3);
            }
            if (_submitted) {
              if (idx == widget.quiz.correctIndex) {
                optionBg = const Color(0xFF10B981).withOpacity(0.08);
                optionBorder = const Color(0xFF10B981).withOpacity(0.4);
              } else if (isSelected) {
                optionBg = const Color(0xFFEF4444).withOpacity(0.08);
                optionBorder = const Color(0xFFEF4444).withOpacity(0.4);
              }
            }

            return GestureDetector(
              onTap: _submitted
                  ? null
                  : () {
                      setState(() => _selectedIndex = idx);
                    },
              child: Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  color: optionBg,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: optionBorder),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        option,
                        style: GoogleFonts.inter(fontSize: 13, color: Colors.white70),
                      ),
                    ),
                    if (_submitted && idx == widget.quiz.correctIndex)
                      const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 16),
                    if (_submitted && isSelected && idx != widget.quiz.correctIndex)
                      const Icon(Icons.cancel, color: Color(0xFFEF4444), size: 16),
                  ],
                ),
              ),
            );
          }),
          const SizedBox(height: 12),
          if (_submitted) ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: (_correct ? const Color(0xFF10B981) : const Color(0xFFEF4444)).withOpacity(0.06),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                _correct ? 'Correct! ${widget.quiz.explanation}' : 'Wrong. ${widget.quiz.explanation}',
                style: GoogleFonts.inter(fontSize: 12, color: Colors.white70, height: 1.4),
              ),
            ),
            const SizedBox(height: 12),
          ],
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _selectedIndex == null
                  ? null
                  : (_submitted
                      ? () => Navigator.of(context).pop()
                      : _submit),
              style: ElevatedButton.styleFrom(
                backgroundColor: _submitted
                    ? const Color(0xFF1E293B)
                    : const Color(0xFF10B981),
                foregroundColor: _submitted ? Colors.white60 : const Color(0xFF06060B),
              ),
              child: Text(_submitted ? 'Close' : 'Submit'),
            ),
          ),
        ],
      ),
    );
  }
}
