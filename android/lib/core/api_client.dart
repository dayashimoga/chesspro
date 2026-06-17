import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

/// ChessOS API Client — Handles all server communication
/// Features: Auth, retry, offline queue, token management
class ApiClient {
  static const String _devBaseUrl = 'http://localhost:8787';
  static const String _prodBaseUrl = 'https://chessos-api.workers.dev';

  late final Dio _dio;
  String? _token;
  final List<Map<String, dynamic>> _offlineQueue = [];

  // Singleton
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  ApiClient._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: const bool.fromEnvironment('dart.vm.product') ? _prodBaseUrl : _devBaseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'Content-Type': 'application/json'},
    ));

    // Auth interceptor
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        if (_token != null) {
          options.headers['Authorization'] = 'Bearer $_token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          _token = null;
          await LocalStorage.clearToken();
        }
        // Retry logic
        if (_shouldRetry(error) && (error.requestOptions.extra['retryCount'] ?? 0) < 3) {
          error.requestOptions.extra['retryCount'] = (error.requestOptions.extra['retryCount'] ?? 0) + 1;
          await Future.delayed(Duration(milliseconds: 500 * (error.requestOptions.extra['retryCount'] as int)));
          final response = await _dio.fetch(error.requestOptions);
          return handler.resolve(response);
        }
        return handler.next(error);
      },
    ));
  }

  bool _shouldRetry(DioException error) {
    return error.type == DioExceptionType.connectionTimeout ||
           error.type == DioExceptionType.receiveTimeout ||
           (error.response?.statusCode ?? 0) >= 500;
  }

  void setToken(String token) {
    _token = token;
    LocalStorage.saveToken(token);
  }

  // ---- Auth ----
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _dio.post('/api/auth/login', data: {'email': email, 'password': password});
    final data = response.data as Map<String, dynamic>;
    setToken(data['token'] as String);
    return data;
  }

  Future<Map<String, dynamic>> register(String email, String password) async {
    final response = await _dio.post('/api/auth/register', data: {'email': email, 'password': password});
    final data = response.data as Map<String, dynamic>;
    setToken(data['token'] as String);
    return data;
  }

  // ---- Progress ----
  Future<void> syncProgress(Map<String, dynamic> progressData) async {
    if (await _isOnline()) {
      await _dio.post('/api/progress/sync', data: progressData);
      await _flushOfflineQueue();
    } else {
      _offlineQueue.add({'endpoint': '/api/progress/sync', 'data': progressData});
      await LocalStorage.saveOfflineQueue(_offlineQueue);
    }
  }

  Future<Map<String, dynamic>> getStatistics() async {
    final response = await _dio.get('/api/progress/statistics');
    return response.data as Map<String, dynamic>;
  }

  // ---- Puzzles ----
  Future<void> recordPuzzleAttempt(String puzzleId, bool correct, int timeMs, String category) async {
    final data = {'puzzleId': puzzleId, 'correct': correct, 'timeMs': timeMs, 'category': category};
    if (await _isOnline()) {
      await _dio.post('/api/puzzles/record', data: data);
    } else {
      _offlineQueue.add({'endpoint': '/api/puzzles/record', 'data': data});
      await LocalStorage.saveOfflineQueue(_offlineQueue);
    }
  }

  // ---- Offline Queue ----
  Future<bool> _isOnline() async {
    final result = await Connectivity().checkConnectivity();
    return result.isNotEmpty && !result.contains(ConnectivityResult.none);
  }

  Future<void> _flushOfflineQueue() async {
    final queue = List<Map<String, dynamic>>.from(_offlineQueue);
    _offlineQueue.clear();
    for (final item in queue) {
      try {
        await _dio.post(item['endpoint'] as String, data: item['data']);
      } catch (_) {
        _offlineQueue.add(item); // Re-queue failed items
      }
    }
    await LocalStorage.saveOfflineQueue(_offlineQueue);
  }

  Future<void> loadAndFlushQueue() async {
    final savedQueue = await LocalStorage.getOfflineQueue();
    _offlineQueue.addAll(savedQueue);
    if (await _isOnline()) {
      await _flushOfflineQueue();
    }
  }
}

/// Local storage using Hive for offline-first data persistence
class LocalStorage {
  static const String _tokenBoxName = 'auth';
  static const String _progressBoxName = 'progress';
  static const String _queueBoxName = 'offline_queue';

  static Future<void> init() async {
    await Hive.initFlutter();
    await Hive.openBox(_tokenBoxName);
    await Hive.openBox(_progressBoxName);
    await Hive.openBox(_queueBoxName);
  }

  // Token management
  static Future<void> saveToken(String token) async {
    final box = Hive.box(_tokenBoxName);
    await box.put('token', token);
  }

  static String? getToken() {
    final box = Hive.box(_tokenBoxName);
    return box.get('token') as String?;
  }

  static Future<void> clearToken() async {
    final box = Hive.box(_tokenBoxName);
    await box.delete('token');
  }

  // Progress storage
  static Future<void> saveProgress(Map<String, dynamic> progress) async {
    final box = Hive.box(_progressBoxName);
    await box.put('userProgress', jsonEncode(progress));
  }

  static Map<String, dynamic>? getProgress() {
    final box = Hive.box(_progressBoxName);
    final data = box.get('userProgress') as String?;
    if (data == null) return null;
    return jsonDecode(data) as Map<String, dynamic>;
  }

  // Offline queue
  static Future<void> saveOfflineQueue(List<Map<String, dynamic>> queue) async {
    final box = Hive.box(_queueBoxName);
    await box.put('queue', jsonEncode(queue));
  }

  static Future<List<Map<String, dynamic>>> getOfflineQueue() async {
    final box = Hive.box(_queueBoxName);
    final data = box.get('queue') as String?;
    if (data == null) return [];
    return (jsonDecode(data) as List).cast<Map<String, dynamic>>();
  }

  // Completed lessons tracking
  static Future<void> markLessonComplete(String lessonId) async {
    final box = Hive.box(_progressBoxName);
    final existing = box.get('completedLessons', defaultValue: <String>[]) as List<dynamic>;
    if (!existing.contains(lessonId)) {
      existing.add(lessonId);
      await box.put('completedLessons', existing);
    }
  }

  static List<String> getCompletedLessons() {
    final box = Hive.box(_progressBoxName);
    return (box.get('completedLessons', defaultValue: <String>[]) as List<dynamic>).cast<String>();
  }
}
