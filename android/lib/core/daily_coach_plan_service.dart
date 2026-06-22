import 'dart:math';
import 'package:hive/hive.dart';

class DailyCoachPlanService {
  static const String keyPlan = 'daily_coach_plan';
  static const String keyLastGenerated = 'daily_coach_plan_last_generated';

  static Future<void> generateDailyPlanIfNeeded() async {
    try {
      final box = Hive.box('progress');
      final todayStr = DateTime.now().toIso8601String().substring(0, 10);
      final lastGenerated = box.get(keyLastGenerated) as String?;

      // Always initialize basic metrics if missing
      if (!box.containsKey('xp')) await box.put('xp', 250);
      if (!box.containsKey('rating')) await box.put('rating', 1050);
      if (!box.containsKey('puzzles_solved')) await box.put('puzzles_solved', 47);
      if (!box.containsKey('lessons_completed')) await box.put('lessons_completed', 12);
      if (!box.containsKey('games_played')) await box.put('games_played', 8);
      if (!box.containsKey('puzzle_accuracy')) await box.put('puzzle_accuracy', 72.3);
      if (!box.containsKey('streak')) await box.put('streak', 3);
      if (!box.containsKey('skills')) {
        await box.put('skills', {
          'Tactics': 0.65,
          'Strategy': 0.40,
          'Endgame': 0.35,
          'Opening': 0.50,
          'Calculation': 0.45,
        });
      }

      if (lastGenerated != todayStr || !box.containsKey(keyPlan)) {
        // Fetch skills to target the weakest area
        final skillsRaw = box.get('skills');
        final Map<String, double> skills = skillsRaw != null 
            ? Map<String, double>.from(skillsRaw as Map)
            : {
                'Tactics': 0.65,
                'Strategy': 0.40,
                'Endgame': 0.35,
                'Opening': 0.50,
                'Calculation': 0.45,
              };

        // Find weakest category
        String weakest = 'Tactics';
        double lowestVal = 1.0;
        skills.forEach((k, v) {
          if (v < lowestVal) {
            lowestVal = v;
            weakest = k;
          }
        });

        // Generate personalized tasks
        final tasks = [
          {
            'id': 'coach_puzzles',
            'icon': '🧩',
            'title': 'Solve 10 $weakest Puzzles',
            'subtitle': 'Target your weakest area (current progress: 0/10)',
            'completed': false,
            'target': 10,
            'xp': 50,
          },
          {
            'id': 'coach_lesson',
            'icon': '📖',
            'title': 'Complete 1 $weakest Lesson',
            'subtitle': 'Build foundational knowledge in $weakest',
            'completed': false,
            'target': 1,
            'xp': 50,
          },
          {
            'id': 'coach_ai_game',
            'icon': '♟️',
            'title': 'Play 1 Game vs AI',
            'subtitle': 'Apply what you learned against the engine',
            'completed': false,
            'target': 1,
            'xp': 50,
          },
          {
            'id': 'coach_mistakes',
            'icon': '🔄',
            'title': 'Review 5 Previous Mistakes',
            'subtitle': 'Improve by re-solving failed puzzles',
            'completed': false,
            'target': 5,
            'xp': 30,
          },
          {
            'id': 'coach_challenge',
            'icon': '🎯',
            'title': 'Daily Puzzle Challenge',
            'subtitle': 'Solve today\'s curated high-accuracy chess puzzle',
            'completed': false,
            'target': 1,
            'xp': 40,
          },
        ];

        await box.put(keyPlan, tasks);
        await box.put(keyLastGenerated, todayStr);
      }
    } catch (_) {}
  }
}
