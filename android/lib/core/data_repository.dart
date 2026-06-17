import 'dart:convert';
import 'package:flutter/services.dart';

class DataRepository {
  static final DataRepository _instance = DataRepository._internal();
  factory DataRepository() => _instance;
  DataRepository._internal();

  List<dynamic> _courses = [];
  List<dynamic> _puzzles = [];
  List<dynamic> _masterGames = [];

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

      _isInitialized = true;
    } catch (e) {
      print('Error loading data assets: $e');
    }
  }

  List<dynamic> get courses => _courses;
  List<dynamic> get puzzles => _puzzles;
  List<dynamic> get masterGames => _masterGames;

  dynamic getCourse(String id) {
    return _courses.firstWhere((c) => c['id'] == id, orElse: () => null);
  }

  dynamic getCourseByTitle(String title) {
    return _courses.firstWhere((c) => c['title'].toString().toLowerCase().contains(title.toLowerCase()), orElse: () => null);
  }
}
