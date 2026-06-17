import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:hive_flutter/hive_flutter.dart';

/// Enhanced Data Repository — Singleton with proper ID-based lookup,
/// offline caching, and progress persistence.
class DataRepository {
  static final DataRepository _instance = DataRepository._internal();
  factory DataRepository() => _instance;
  DataRepository._internal();

  List<dynamic> _courses = [];
  List<dynamic> _puzzles = [];
  List<dynamic> _masterGames = [];
  List<dynamic> _categories = [];

  bool _isInitialized = false;

  Future<void> init() async {
    if (_isInitialized) return;

    try {
      final coursesJson = await rootBundle.loadString('assets/university/courses.json');
      _courses = json.decode(coursesJson) as List<dynamic>;

      final puzzlesJson = await rootBundle.loadString('assets/puzzles/puzzles.json');
      _puzzles = json.decode(puzzlesJson) as List<dynamic>;

      final masterGamesJson = await rootBundle.loadString('assets/games/master_games.json');
      _masterGames = json.decode(masterGamesJson) as List<dynamic>;

      try {
        final categoriesJson = await rootBundle.loadString('assets/puzzles/categories.json');
        _categories = json.decode(categoriesJson) as List<dynamic>;
      } catch (_) {}

      _isInitialized = true;
    } catch (e) {
      print('Error loading data assets: $e');
    }
  }

  // ---- Getters ----
  List<dynamic> get courses => _courses;
  List<dynamic> get puzzles => _puzzles;
  List<dynamic> get masterGames => _masterGames;
  List<dynamic> get categories => _categories;

  // ---- Course Lookup ----

  /// Get course by exact ID (deterministic — no fuzzy matching)
  dynamic getCourseById(String id) {
    for (final c in _courses) {
      if (c is Map && c['id'] == id) return c;
    }
    return null;
  }

  /// Legacy: fuzzy match by title substring
  dynamic getCourseByTitle(String title) {
    // First try exact ID match (more reliable)
    final byId = getCourseById(title.toLowerCase());
    if (byId != null) return byId;

    // Then fuzzy title match
    for (final c in _courses) {
      if (c is Map) {
        final courseTitle = (c['title'] ?? '').toString().toLowerCase();
        if (courseTitle.contains(title.toLowerCase())) return c;
      }
    }
    return null;
  }

  /// Get course by route name (maps route segments to course IDs)
  dynamic getCourseForRoute(String routeName) {
    // Direct route-to-ID mapping
    const routeMap = {
      'Foundations': 'foundations',
      'Tactics': 'tactics',
      'Calculation': 'calculation',
      'Openings': 'openings',
      'Middlegame': 'middlegame',
      'Endgames': 'endgames',
      'Master Games': 'master-games',
    };

    final courseId = routeMap[routeName] ?? routeName.toLowerCase();
    final course = getCourseById(courseId);
    if (course != null) return course;

    // Fallback: try title match
    return getCourseByTitle(routeName);
  }

  /// Get a specific module from a course
  dynamic getModule(String courseId, String moduleId) {
    final course = getCourseById(courseId);
    if (course == null) return null;
    final modules = course['modules'] as List? ?? [];
    for (final m in modules) {
      if (m is Map && m['id'] == moduleId) return m;
    }
    return null;
  }

  // ---- Puzzle Lookup ----

  /// Get puzzles filtered by theme
  List<Map<String, dynamic>> getPuzzlesByTheme(String theme) {
    return _puzzles
        .where((p) => p is Map && (p['theme'] ?? '').toString().toLowerCase().contains(theme.toLowerCase()))
        .cast<Map<String, dynamic>>()
        .toList();
  }

  /// Get puzzles filtered by difficulty
  List<Map<String, dynamic>> getPuzzlesByDifficulty(String difficulty) {
    return _puzzles
        .where((p) => p is Map && p['difficulty'] == difficulty)
        .cast<Map<String, dynamic>>()
        .toList();
  }

  /// Get puzzles by rating range
  List<Map<String, dynamic>> getPuzzlesByRating(int minRating, int maxRating) {
    return _puzzles.where((p) {
      if (p is! Map) return false;
      final rating = p['rating'] as int? ?? 0;
      return rating >= minRating && rating <= maxRating;
    }).cast<Map<String, dynamic>>().toList();
  }

  // ---- Master Games ----

  /// Get master game by ID
  dynamic getMasterGame(String id) {
    for (final g in _masterGames) {
      if (g is Map && g['id'] == id) return g;
    }
    return null;
  }

  /// Get master games by player
  List<Map<String, dynamic>> getGamesByPlayer(String player) {
    return _masterGames.where((g) {
      if (g is! Map) return false;
      final white = (g['white'] ?? '').toString().toLowerCase();
      final black = (g['black'] ?? '').toString().toLowerCase();
      return white.contains(player.toLowerCase()) || black.contains(player.toLowerCase());
    }).cast<Map<String, dynamic>>().toList();
  }

  // ---- Statistics ----

  int get totalPuzzles => _puzzles.length;
  int get totalCourses => _courses.length;
  int get totalMasterGames => _masterGames.length;
  int get totalModules => _courses.fold<int>(0, (sum, c) => sum + ((c['modules'] as List?)?.length ?? 0));

  // ---- Progress Persistence (Hive) ----

  static const _progressBox = 'progress';

  /// Save completed lesson
  Future<void> markLessonComplete(String courseId, String moduleId) async {
    try {
      final box = Hive.box(_progressBox);
      final key = 'lesson_${courseId}_$moduleId';
      await box.put(key, true);
      // Update completed count
      final count = box.get('completedLessons', defaultValue: 0) as int;
      await box.put('completedLessons', count + 1);
    } catch (_) {}
  }

  /// Check if lesson is complete
  bool isLessonComplete(String courseId, String moduleId) {
    try {
      final box = Hive.box(_progressBox);
      return box.get('lesson_${courseId}_$moduleId', defaultValue: false) as bool;
    } catch (_) {
      return false;
    }
  }

  /// Get completed lesson count
  int get completedLessonCount {
    try {
      final box = Hive.box(_progressBox);
      return box.get('completedLessons', defaultValue: 0) as int;
    } catch (_) {
      return 0;
    }
  }

  /// Save user stats
  Future<void> saveStats({int? xp, int? level, int? rating, int? streak}) async {
    try {
      final box = Hive.box(_progressBox);
      if (xp != null) await box.put('xp', xp);
      if (level != null) await box.put('level', level);
      if (rating != null) await box.put('rating', rating);
      if (streak != null) await box.put('streak', streak);
    } catch (_) {}
  }

  /// Load user stats
  Map<String, int> loadStats() {
    try {
      final box = Hive.box(_progressBox);
      return {
        'xp': box.get('xp', defaultValue: 0) as int,
        'level': box.get('level', defaultValue: 1) as int,
        'rating': box.get('rating', defaultValue: 800) as int,
        'streak': box.get('streak', defaultValue: 0) as int,
      };
    } catch (_) {
      return {'xp': 0, 'level': 1, 'rating': 800, 'streak': 0};
    }
  }
}
