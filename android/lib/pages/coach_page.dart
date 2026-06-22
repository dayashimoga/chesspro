import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hive/hive.dart';
import '../widgets/content_renderer.dart';
import '../core/data_repository.dart';
import '../core/daily_coach_plan_service.dart';

/// AI Coach Dashboard — Skill tracking, training plans, and personalized exercises
class CoachDashboardPage extends StatefulWidget {
  const CoachDashboardPage({super.key});

  @override
  State<CoachDashboardPage> createState() => _CoachDashboardPageState();
}

class _CoachDashboardPageState extends State<CoachDashboardPage> {
  Map<String, double> _skills = {
    'Tactics': 0.65,
    'Strategy': 0.40,
    'Endgame': 0.35,
    'Opening': 0.50,
    'Calculation': 0.45,
  };

  int _puzzlesSolved = 47;
  int _lessonsCompleted = 12;
  int _gamesPlayed = 8;
  double _puzzleAccuracy = 72.3;
  int _currentStreak = 3;
  int _rating = 1050;
  List<Map<String, dynamic>> _dailyTasks = [];

  @override
  void initState() {
    super.initState();
    _initPlanAndLoad();
  }

  Future<void> _initPlanAndLoad() async {
    await DailyCoachPlanService.generateDailyPlanIfNeeded();
    _loadData();
  }

  void _loadData() {
    try {
      final box = Hive.box('progress');
      setState(() {
        _rating = box.get('rating', defaultValue: 1050) as int;
        _puzzlesSolved = box.get('puzzles_solved', defaultValue: 47) as int;
        _lessonsCompleted = box.get('lessons_completed', defaultValue: 12) as int;
        _gamesPlayed = box.get('games_played', defaultValue: 8) as int;
        _currentStreak = box.get('streak', defaultValue: 3) as int;
        _puzzleAccuracy = box.get('puzzle_accuracy', defaultValue: 72.3) as double;

        final skillsRaw = box.get('skills');
        if (skillsRaw != null) {
          _skills = Map<String, double>.from(skillsRaw as Map);
        }

        final tasksRaw = box.get(DailyCoachPlanService.keyPlan);
        if (tasksRaw != null) {
          _dailyTasks = List<Map<dynamic, dynamic>>.from(tasksRaw as List)
              .map((t) => Map<String, dynamic>.from(t))
              .toList();
        }
      });
    } catch (_) {}
  }

  Future<void> _toggleTask(int index) async {
    try {
      final box = Hive.box('progress');
      final list = List<Map<dynamic, dynamic>>.from(box.get(DailyCoachPlanService.keyPlan) as List);
      final task = Map<String, dynamic>.from(list[index]);

      final oldCompleted = task['completed'] as bool;
      task['completed'] = !oldCompleted;
      list[index] = task;
      await box.put(DailyCoachPlanService.keyPlan, list);

      // Award or deduct XP
      final currentXp = box.get('xp', defaultValue: 250) as int;
      final xpDiff = task['xp'] as int? ?? 50;
      await box.put('xp', max(0, currentXp + (oldCompleted ? -xpDiff : xpDiff)));

      // If all completed, award bonus rating and ELO
      final allCompleted = list.every((t) => t['completed'] == true);
      if (allCompleted && !oldCompleted) {
        final currentRating = box.get('rating', defaultValue: 1050) as int;
        await box.put('rating', currentRating + 15);

        // Also boost weakest skill slightly
        final skills = Map<String, double>.from(box.get('skills', defaultValue: {
          'Tactics': 0.65,
          'Strategy': 0.40,
          'Endgame': 0.35,
          'Opening': 0.50,
          'Calculation': 0.45,
        }) as Map);
        String weakest = 'Tactics';
        double lowestVal = 1.0;
        skills.forEach((k, v) {
          if (v < lowestVal) {
            lowestVal = v;
            weakest = k;
          }
        });
        skills[weakest] = min(1.0, (skills[weakest] ?? 0.0) + 0.05);
        await box.put('skills', skills);

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Text('🔥 ', style: TextStyle(fontSize: 16)),
                Expanded(
                  child: Text(
                    'Daily training fully complete! Bonus +15 Rating & +5% $weakest skill!',
                    style: GoogleFonts.inter(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            backgroundColor: const Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              task['completed'] as bool
                  ? 'Task completed! +$xpDiff XP'
                  : 'Task unmarked.',
              style: GoogleFonts.inter(fontWeight: FontWeight.bold),
            ),
            backgroundColor: task['completed'] as bool ? const Color(0xFF10B981) : Colors.grey[800],
            duration: const Duration(seconds: 1),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }

      _loadData();
    } catch (_) {}
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Chess Coach'),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 12),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                const Text('📊', style: TextStyle(fontSize: 12)),
                const SizedBox(width: 4),
                Text(
                  '$_rating',
                  style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: const Color(0xFF10B981)),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Greeting
            Text(
              'Good ${_getTimeGreeting()}! 👋',
              style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
            ),
            const SizedBox(height: 4),
            Text(
              'Here\'s your personalized training plan',
              style: GoogleFonts.inter(fontSize: 13, color: Colors.white.withOpacity(0.4)),
            ),
            const SizedBox(height: 20),

            // Stats Row
            Row(
              children: [
                _CoachStat(icon: '🧩', value: '$_puzzlesSolved', label: 'Puzzles'),
                const SizedBox(width: 10),
                _CoachStat(icon: '📖', value: '$_lessonsCompleted', label: 'Lessons'),
                const SizedBox(width: 10),
                _CoachStat(icon: '♟️', value: '$_gamesPlayed', label: 'Games'),
                const SizedBox(width: 10),
                _CoachStat(icon: '🔥', value: '$_currentStreak', label: 'Streak'),
              ],
            ),
            const SizedBox(height: 24),

            // Skill Radar
            _SectionTitle('SKILL PROFILE'),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF111119),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.06)),
              ),
              child: Column(
                children: [
                  Center(
                    child: SizedBox(
                      width: 220,
                      height: 220,
                      child: SkillRadarChart(skills: _skills),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Skill bars
                  ..._skills.entries.map((entry) => _SkillBar(
                    name: entry.key,
                    value: entry.value,
                  )),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Accuracy trend
            _SectionTitle('PUZZLE ACCURACY'),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF111119),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.06)),
              ),
              child: Column(
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '${_puzzleAccuracy.toStringAsFixed(1)}%',
                        style: GoogleFonts.inter(
                          fontSize: 36, fontWeight: FontWeight.w900,
                          color: _puzzleAccuracy >= 70 ? const Color(0xFF10B981) : const Color(0xFFF59E0B),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Padding(
                        padding: const EdgeInsets.only(bottom: 6),
                        child: Row(
                          children: [
                            Icon(
                              Icons.trending_up_rounded,
                              size: 16,
                              color: const Color(0xFF10B981).withOpacity(0.7),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '+2.4%',
                              style: GoogleFonts.inter(
                                fontSize: 12, fontWeight: FontWeight.w700,
                                color: const Color(0xFF10B981),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Simple bar chart
                  SizedBox(
                    height: 60,
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: List.generate(14, (i) {
                        final value = 0.4 + Random(i * 7).nextDouble() * 0.5;
                        return Expanded(
                          child: Container(
                            margin: const EdgeInsets.symmetric(horizontal: 1.5),
                            height: 60 * value,
                            decoration: BoxDecoration(
                              color: i == 13
                                  ? const Color(0xFF10B981)
                                  : const Color(0xFF10B981).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                        );
                      }),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('2 weeks ago', style: GoogleFonts.inter(fontSize: 9, color: Colors.white.withOpacity(0.2))),
                      Text('Today', style: GoogleFonts.inter(fontSize: 9, color: Colors.white.withOpacity(0.2))),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Daily Training Plan
            _SectionTitle('TODAY\'S TRAINING PLAN'),
            const SizedBox(height: 12),
            if (_dailyTasks.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 20),
                child: Center(
                  child: CircularProgressIndicator(color: Color(0xFF10B981)),
                ),
              )
            else
              ...List.generate(_dailyTasks.length, (i) {
                final task = _dailyTasks[i];
                return GestureDetector(
                  onTap: () => _toggleTask(i),
                  child: _TrainingTaskCard(task: task, index: i),
                );
              }),
            const SizedBox(height: 24),

            // Weakness Report
            _SectionTitle('FOCUS AREAS'),
            const SizedBox(height: 12),
            _FocusAreaCard(
              title: 'Endgame Technique',
              description: 'Your endgame skills are below average. Focus on opposition, Lucena position, and rook endgame principles.',
              icon: '👑',
              color: const Color(0xFFEF4444),
              progress: 0.35,
            ),
            const SizedBox(height: 10),
            _FocusAreaCard(
              title: 'Strategic Planning',
              description: 'Improve your positional understanding. Study pawn structures and piece activity.',
              icon: '🏰',
              color: const Color(0xFFF59E0B),
              progress: 0.40,
            ),
            const SizedBox(height: 10),
            _FocusAreaCard(
              title: 'Calculation Depth',
              description: 'Practice seeing 3-4 moves ahead consistently. Work on visualization exercises.',
              icon: '🧠',
              color: const Color(0xFF8B5CF6),
              progress: 0.45,
            ),
            const SizedBox(height: 24),

            // Achievements
            _SectionTitle('ACHIEVEMENTS'),
            const SizedBox(height: 12),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                _AchievementBadge(icon: '🎯', label: 'First Puzzle', unlocked: true),
                _AchievementBadge(icon: '🔥', label: '3-Day Streak', unlocked: true),
                _AchievementBadge(icon: '📖', label: '10 Lessons', unlocked: true),
                _AchievementBadge(icon: '⭐', label: '1000 Rating', unlocked: true),
                _AchievementBadge(icon: '🏆', label: '100 Puzzles', unlocked: false),
                _AchievementBadge(icon: '💎', label: 'Perfect Game', unlocked: false),
                _AchievementBadge(icon: '🧩', label: '10 Streak', unlocked: false),
                _AchievementBadge(icon: '👑', label: 'Endgame Master', unlocked: false),
              ],
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  String _getTimeGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }
}

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: GoogleFonts.inter(
        fontSize: 10, fontWeight: FontWeight.w800,
        color: Colors.white.withOpacity(0.3), letterSpacing: 2,
      ),
    );
  }
}

class _CoachStat extends StatelessWidget {
  final String icon;
  final String value;
  final String label;

  const _CoachStat({required this.icon, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFF111119),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white.withOpacity(0.06)),
        ),
        child: Column(
          children: [
            Text(icon, style: const TextStyle(fontSize: 18)),
            const SizedBox(height: 6),
            Text(
              value,
              style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
            ),
            Text(
              label,
              style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w600, color: Colors.white.withOpacity(0.3)),
            ),
          ],
        ),
      ),
    );
  }
}

class _SkillBar extends StatelessWidget {
  final String name;
  final double value;

  const _SkillBar({required this.name, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          SizedBox(
            width: 80,
            child: Text(
              name,
              style: GoogleFonts.inter(fontSize: 12, color: Colors.white.withOpacity(0.5)),
            ),
          ),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: value,
                backgroundColor: Colors.white.withOpacity(0.05),
                valueColor: AlwaysStoppedAnimation(
                  value >= 0.6 ? const Color(0xFF10B981)
                      : value >= 0.4 ? const Color(0xFFF59E0B)
                      : const Color(0xFFEF4444),
                ),
                minHeight: 6,
              ),
            ),
          ),
          const SizedBox(width: 10),
          Text(
            '${(value * 100).toInt()}%',
            style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white.withOpacity(0.5)),
          ),
        ],
      ),
    );
  }
}

class _TrainingTaskCard extends StatelessWidget {
  final Map<String, dynamic> task;
  final int index;

  const _TrainingTaskCard({required this.task, required this.index});

  @override
  Widget build(BuildContext context) {
    final bool completed = task['completed'] as bool? ?? false;
    final String icon = task['icon'] as String? ?? '🧩';
    final String title = task['title'] as String? ?? '';
    final String subtitle = task['subtitle'] as String? ?? '';

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: completed
              ? const Color(0xFF10B981).withOpacity(0.05)
              : const Color(0xFF111119),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: completed
                ? const Color(0xFF10B981).withOpacity(0.15)
                : Colors.white.withOpacity(0.06),
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 36, height: 36,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: completed
                    ? const Color(0xFF10B981).withOpacity(0.1)
                    : Colors.white.withOpacity(0.03),
              ),
              child: Center(child: Text(icon, style: const TextStyle(fontSize: 16))),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.inter(
                      fontSize: 13, fontWeight: FontWeight.w600,
                      color: completed ? Colors.white.withOpacity(0.5) : Colors.white,
                      decoration: completed ? TextDecoration.lineThrough : null,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: GoogleFonts.inter(fontSize: 11, color: Colors.white.withOpacity(0.3)),
                  ),
                ],
              ),
            ),
            Icon(
              completed ? Icons.check_circle : Icons.circle_outlined,
              size: 20,
              color: completed ? const Color(0xFF10B981) : Colors.white.withOpacity(0.1),
            ),
          ],
        ),
      ),
    );
  }
}

class _FocusAreaCard extends StatelessWidget {
  final String title;
  final String description;
  final String icon;
  final Color color;
  final double progress;

  const _FocusAreaCard({
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
    required this.progress,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withOpacity(0.04),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(icon, style: const TextStyle(fontSize: 18)),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white),
                ),
              ),
              Text(
                '${(progress * 100).toInt()}%',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: color),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(3),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: Colors.white.withOpacity(0.05),
              valueColor: AlwaysStoppedAnimation(color),
              minHeight: 4,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: GoogleFonts.inter(fontSize: 12, color: Colors.white.withOpacity(0.5), height: 1.4),
          ),
        ],
      ),
    );
  }
}

class _AchievementBadge extends StatelessWidget {
  final String icon;
  final String label;
  final bool unlocked;

  const _AchievementBadge({required this.icon, required this.label, required this.unlocked});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 80,
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        color: unlocked
            ? const Color(0xFFF59E0B).withOpacity(0.06)
            : Colors.white.withOpacity(0.02),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: unlocked
              ? const Color(0xFFF59E0B).withOpacity(0.15)
              : Colors.white.withOpacity(0.04),
        ),
      ),
      child: Column(
        children: [
          Text(
            icon,
            style: TextStyle(
              fontSize: 24,
              color: unlocked ? null : Colors.white.withOpacity(0.2),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 9,
              fontWeight: FontWeight.w600,
              color: unlocked ? const Color(0xFFF59E0B) : Colors.white.withOpacity(0.2),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
