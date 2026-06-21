import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'core/data_repository.dart';
import 'blocs/app_bloc.dart';
import 'widgets/content_renderer.dart';
import 'widgets/chess_board.dart';
import 'pages/lesson_page.dart';
import 'pages/puzzle_page.dart';
import 'pages/play_page.dart';
import 'pages/coach_page.dart';

// ============================================================================
// ChessOS Pro — Main Entry Point
// ============================================================================
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive for local storage
  await Hive.initFlutter();
  await Hive.openBox('auth');
  await Hive.openBox('progress');
  await Hive.openBox('offline_queue');

  // Initialize Data Repository (JSON Assets)
  await DataRepository().init();

  // System UI overlay style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF06060B),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);

  runApp(const ChessOSApp());
}

// ============================================================================
// App Theme — Material Design 3 Dark Mode
// ============================================================================
class ChessOSTheme {
  static const Color primary = Color(0xFF10B981);
  static const Color secondary = Color(0xFFF59E0B);
  static const Color surface = Color(0xFF0C0C14);
  static const Color background = Color(0xFF06060B);
  static const Color card = Color(0xFF111119);
  static const Color error = Color(0xFFEF4444);
  static const Color onSurface = Color(0xFFE2E8F0);
  static const Color onSurfaceVariant = Color(0xFF94A3B8);
  static const Color outline = Color(0x1AFFFFFF);

  static ThemeData get darkTheme {
    final colorScheme = ColorScheme.dark(
      primary: primary,
      secondary: secondary,
      surface: surface,
      error: error,
      onPrimary: background,
      onSecondary: background,
      onSurface: onSurface,
      onError: Colors.white,
      outline: outline,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: background,
      textTheme: GoogleFonts.interTextTheme(
        ThemeData.dark().textTheme,
      ).apply(bodyColor: onSurface, displayColor: onSurface),
      appBarTheme: AppBarTheme(
        backgroundColor: surface,
        foregroundColor: onSurface,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
      ),
      cardTheme: CardTheme(
        color: card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: outline),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: surface,
        indicatorColor: primary.withOpacity(0.1),
        labelTextStyle: WidgetStateProperty.all(
          GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: background,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}

// ============================================================================
// Router Configuration
// ============================================================================
final _router = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (context, state, child) => MainShell(child: child),
      routes: [
        GoRoute(path: '/', builder: (_, __) => const DashboardPage()),
        GoRoute(path: '/foundations', builder: (_, __) => const UniversityPage(title: 'Foundations', courseId: 'foundations')),
        GoRoute(path: '/tactics', builder: (_, __) => const UniversityPage(title: 'Tactics', courseId: 'tactics')),
        GoRoute(path: '/calculation', builder: (_, __) => const UniversityPage(title: 'Calculation', courseId: 'calculation')),
        GoRoute(path: '/openings', builder: (_, __) => const UniversityPage(title: 'Openings', courseId: 'openings')),
        GoRoute(path: '/middlegame', builder: (_, __) => const UniversityPage(title: 'Middlegame', courseId: 'middlegame')),
        GoRoute(path: '/endgames', builder: (_, __) => const UniversityPage(title: 'Endgames', courseId: 'endgames')),
        GoRoute(path: '/master-games', builder: (_, __) => const UniversityPage(title: 'Master Games', courseId: 'master-games')),
        GoRoute(path: '/puzzles', builder: (_, __) => const PuzzleTrainerPage()),
        GoRoute(path: '/play', builder: (_, __) => const PlayAIPage()),
        GoRoute(path: '/coach', builder: (_, __) => const CoachDashboardPage()),
      ],
    ),
    // Lesson detail (outside shell — no bottom nav)
    GoRoute(
      path: '/lesson/:courseId/:moduleId',
      builder: (_, state) => LessonPage(
        courseId: state.pathParameters['courseId']!,
        moduleId: state.pathParameters['moduleId']!,
      ),
    ),
  ],
);

// ============================================================================
// Main App Widget — with BLoC providers
// ============================================================================
class ChessOSApp extends StatelessWidget {
  const ChessOSApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => UserBloc()),
        BlocProvider(create: (_) => PuzzleBloc()),
        BlocProvider(create: (_) => NavigationBloc()),
      ],
      child: MaterialApp.router(
        title: 'ChessOS Pro',
        debugShowCheckedModeBanner: false,
        theme: ChessOSTheme.darkTheme,
        routerConfig: _router,
      ),
    );
  }
}

// ============================================================================
// Main Shell — Bottom Navigation
// ============================================================================
class MainShell extends StatefulWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  static const _navItems = [
    ('Dashboard', Icons.dashboard_rounded, '/'),
    ('University', Icons.school_rounded, '/foundations'),
    ('Puzzles', Icons.extension_rounded, '/puzzles'),
    ('Play', Icons.sports_esports_rounded, '/play'),
    ('Coach', Icons.psychology_rounded, '/coach'),
  ];

  int _getSelectedIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.toString();
    if (location == '/') return 0;
    if (location.startsWith('/puzzles')) return 2;
    if (location.startsWith('/play')) return 3;
    if (location.startsWith('/coach')) return 4;
    // Any university route
    if (location.startsWith('/foundations') ||
        location.startsWith('/tactics') ||
        location.startsWith('/calculation') ||
        location.startsWith('/openings') ||
        location.startsWith('/middlegame') ||
        location.startsWith('/endgames') ||
        location.startsWith('/master-games')) return 1;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final selectedIndex = _getSelectedIndex(context);

    return Scaffold(
      body: widget.child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: selectedIndex,
        onDestinationSelected: (index) {
          context.go(_navItems[index].$3);
        },
        destinations: _navItems
            .map((item) => NavigationDestination(
                  icon: Icon(item.$2),
                  label: item.$1,
                ))
            .toList(),
      ),
    );
  }
}

// ============================================================================
// Dashboard Page — Premium Design with Hero Banner, XP, Challenges
// ============================================================================
class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(vsync: this, duration: const Duration(milliseconds: 800));
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  @override
  Widget build(BuildContext context) {
    final repo = DataRepository();
    final stats = repo.loadStats();
    final xp = stats['xp'] ?? 0;
    final level = stats['level'] ?? 1;
    final streak = stats['streak'] ?? 0;
    final rating = stats['rating'] ?? 800;
    final xpForNext = 250;
    final xpProgress = (xp % xpForNext) / xpForNext;

    return SafeArea(
      child: FadeTransition(
        opacity: _fadeAnim,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ===== Hero Banner =====
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      ChessOSTheme.primary.withOpacity(0.12),
                      ChessOSTheme.primary.withOpacity(0.04),
                      ChessOSTheme.secondary.withOpacity(0.06),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                  boxShadow: [
                    BoxShadow(
                      color: ChessOSTheme.primary.withOpacity(0.08),
                      blurRadius: 24,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${_getGreeting()}, Champion ♚',
                      style: GoogleFonts.inter(
                        fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Continue your journey to mastery.',
                      style: GoogleFonts.inter(fontSize: 13, color: Colors.white.withOpacity(0.45)),
                    ),
                    const SizedBox(height: 16),
                    // Stats chips
                    Row(
                      children: [
                        _HeroChip(icon: '📊', label: 'Rating', value: '$rating', color: ChessOSTheme.primary),
                        const SizedBox(width: 10),
                        _HeroChip(icon: '🔥', label: 'Streak', value: '$streak', color: ChessOSTheme.secondary),
                        const SizedBox(width: 10),
                        _HeroChip(icon: '⭐', label: 'Lv$level', value: '$xp XP', color: const Color(0xFF8B5CF6)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),

              // ===== XP Progress Bar =====
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: ChessOSTheme.card,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: ChessOSTheme.outline),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 42, height: 42,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF10B981), Color(0xFF059669)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(color: ChessOSTheme.primary.withOpacity(0.3), blurRadius: 8),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          'Lv$level',
                          style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w900, color: ChessOSTheme.background),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Experience', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white)),
                              Text('${xp % xpForNext}/$xpForNext XP', style: GoogleFonts.inter(fontSize: 10, color: Colors.white.withOpacity(0.35))),
                            ],
                          ),
                          const SizedBox(height: 6),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(6),
                            child: LinearProgressIndicator(
                              value: xpProgress,
                              backgroundColor: Colors.white.withOpacity(0.06),
                              valueColor: const AlwaysStoppedAnimation(Color(0xFF10B981)),
                              minHeight: 8,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // ===== Quick Actions =====
              Text(
                'QUICK ACTIONS',
                style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: Colors.white.withOpacity(0.25), letterSpacing: 2),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  _QuickAction(icon: '📅', label: 'Daily Plan', route: '/coach', color: const Color(0xFF8B5CF6), context: context),
                  const SizedBox(width: 10),
                  _QuickAction(icon: '🧩', label: 'Puzzles', route: '/puzzles', color: const Color(0xFF10B981), context: context),
                  const SizedBox(width: 10),
                  _QuickAction(icon: '♟️', label: 'Play AI', route: '/play', color: const Color(0xFFF59E0B), context: context),
                  const SizedBox(width: 10),
                  _QuickAction(icon: '📖', label: 'Learn', route: '/foundations', color: const Color(0xFF3B82F6), context: context),
                ],
              ),
              const SizedBox(height: 18),

              // ===== Daily Challenges =====
              Text(
                'DAILY CHALLENGES',
                style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: Colors.white.withOpacity(0.25), letterSpacing: 2),
              ),
              const SizedBox(height: 10),
              _DailyChallengeCard(icon: '🧩', title: 'Solve 5 Puzzles', progress: 0.6, target: '3/5', color: const Color(0xFF10B981)),
              const SizedBox(height: 8),
              _DailyChallengeCard(icon: '📖', title: 'Complete 1 Lesson', progress: 0.0, target: '0/1', color: const Color(0xFF3B82F6)),
              const SizedBox(height: 8),
              _DailyChallengeCard(icon: '♟️', title: 'Play a Game', progress: 0.0, target: '0/1', color: const Color(0xFFF59E0B)),
              const SizedBox(height: 18),

              // ===== Content Stats =====
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      ChessOSTheme.primary.withOpacity(0.06),
                      ChessOSTheme.primary.withOpacity(0.02),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: ChessOSTheme.primary.withOpacity(0.1)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _ContentStat('${repo.totalCourses}', 'Courses'),
                    _ContentStat('${repo.totalModules}', 'Modules'),
                    _ContentStat('${repo.totalPuzzles}', 'Puzzles'),
                    _ContentStat('${repo.totalMasterGames}', 'Games'),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // ===== University Grid =====
              Text(
                'CHESS UNIVERSITY',
                style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: Colors.white.withOpacity(0.25), letterSpacing: 2),
              ),
              const SizedBox(height: 12),
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                childAspectRatio: 1.45,
                children: const [
                  _UniversityCard(title: 'Foundations', icon: '🏫', route: '/foundations', color: Color(0xFF10B981)),
                  _UniversityCard(title: 'Tactics', icon: '⚔️', route: '/tactics', color: Color(0xFFF59E0B)),
                  _UniversityCard(title: 'Calculation', icon: '🧠', route: '/calculation', color: Color(0xFF8B5CF6)),
                  _UniversityCard(title: 'Openings', icon: '🌳', route: '/openings', color: Color(0xFF3B82F6)),
                  _UniversityCard(title: 'Middlegame', icon: '🏰', route: '/middlegame', color: Color(0xFFEF4444)),
                  _UniversityCard(title: 'Endgames', icon: '👑', route: '/endgames', color: Color(0xFFF97316)),
                  _UniversityCard(title: 'Master Games', icon: '🏆', route: '/master-games', color: Color(0xFFEC4899)),
                  _UniversityCard(title: 'Puzzles', icon: '🧩', route: '/puzzles', color: Color(0xFF06B6D4)),
                ],
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}

// ===== Hero Chip =====
class _HeroChip extends StatelessWidget {
  final String icon, label, value;
  final Color color;
  const _HeroChip({required this.icon, required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.15)),
        ),
        child: Column(
          children: [
            Text(icon, style: const TextStyle(fontSize: 14)),
            const SizedBox(height: 4),
            Text(value, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w900, color: Colors.white)),
            Text(label, style: GoogleFonts.inter(fontSize: 8, fontWeight: FontWeight.w600, color: color.withOpacity(0.8))),
          ],
        ),
      ),
    );
  }
}

// ===== Quick Action =====
class _QuickAction extends StatelessWidget {
  final String icon, label, route;
  final Color color;
  final BuildContext context;
  const _QuickAction({required this.icon, required this.label, required this.route, required this.color, required this.context});

  @override
  Widget build(BuildContext _) {
    return Expanded(
      child: GestureDetector(
        onTap: () => GoRouter.of(context).go(route),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [color.withOpacity(0.12), color.withOpacity(0.04)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: color.withOpacity(0.15)),
          ),
          child: Column(
            children: [
              Text(icon, style: const TextStyle(fontSize: 22)),
              const SizedBox(height: 6),
              Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white)),
            ],
          ),
        ),
      ),
    );
  }
}

// ===== Daily Challenge Card =====
class _DailyChallengeCard extends StatelessWidget {
  final String icon, title, target;
  final double progress;
  final Color color;
  const _DailyChallengeCard({required this.icon, required this.title, required this.progress, required this.target, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: ChessOSTheme.card,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: progress >= 1.0 ? color.withOpacity(0.3) : ChessOSTheme.outline),
      ),
      child: Row(
        children: [
          Container(
            width: 36, height: 36,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: color.withOpacity(progress >= 1.0 ? 0.2 : 0.08),
            ),
            child: Center(child: Text(icon, style: const TextStyle(fontSize: 16))),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white)),
                const SizedBox(height: 4),
                ClipRRect(
                  borderRadius: BorderRadius.circular(3),
                  child: LinearProgressIndicator(
                    value: progress,
                    backgroundColor: Colors.white.withOpacity(0.05),
                    valueColor: AlwaysStoppedAnimation(color),
                    minHeight: 4,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Text(target, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: color)),
        ],
      ),
    );
  }
}

class _ContentStat extends StatelessWidget {
  final String value;
  final String label;
  const _ContentStat(this.value, this.label);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white)),
        Text(label, style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w600, color: Colors.white.withOpacity(0.3))),
      ],
    );
  }
}

class _UniversityCard extends StatelessWidget {
  final String title;
  final String icon;
  final String route;
  final Color color;

  const _UniversityCard({required this.title, required this.icon, required this.route, required this.color});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.go(route),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [color.withOpacity(0.1), color.withOpacity(0.03)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.15)),
          boxShadow: [
            BoxShadow(color: color.withOpacity(0.05), blurRadius: 12, offset: const Offset(0, 4)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(icon, style: const TextStyle(fontSize: 28)),
            Row(
              children: [
                Expanded(
                  child: Text(title, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
                ),
                Icon(Icons.arrow_forward_ios_rounded, size: 12, color: color.withOpacity(0.5)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// University Page — Data-Driven with proper course lookup + lesson navigation
// ============================================================================
class UniversityPage extends StatelessWidget {
  final String title;
  final String courseId;
  const UniversityPage({super.key, required this.title, required this.courseId});

  @override
  Widget build(BuildContext context) {
    final course = DataRepository().getCourseById(courseId);

    return Scaffold(
      appBar: AppBar(title: Text('$title University')),
      body: course == null
          ? _buildNoCourse(context)
          : _buildCourseContent(context, course),
    );
  }

  Widget _buildNoCourse(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('📚', style: TextStyle(fontSize: 56)),
          const SizedBox(height: 16),
          Text(
            'Loading $title content...',
            style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white),
          ),
          const SizedBox(height: 8),
          Text(
            'This course is being prepared',
            style: GoogleFonts.inter(fontSize: 13, color: Colors.white.withOpacity(0.4)),
          ),
        ],
      ),
    );
  }

  Widget _buildCourseContent(BuildContext context, Map<String, dynamic> course) {
    final modules = (course['modules'] as List?) ?? [];
    final description = course['description'] as String? ?? '';
    final difficulty = course['difficulty'] as String? ?? '';

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Course header
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                ChessOSTheme.primary.withOpacity(0.08),
                ChessOSTheme.primary.withOpacity(0.02),
              ],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: ChessOSTheme.primary.withOpacity(0.1)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(course['icon'] ?? '📖', style: const TextStyle(fontSize: 28)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          course['title'] ?? title,
                          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
                        ),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: ChessOSTheme.primary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                '${modules.length} modules',
                                style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: ChessOSTheme.primary),
                              ),
                            ),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: ChessOSTheme.secondary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                difficulty.toUpperCase(),
                                style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: ChessOSTheme.secondary),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              if (description.isNotEmpty) ...[
                const SizedBox(height: 10),
                Text(
                  description,
                  style: GoogleFonts.inter(fontSize: 12, color: Colors.white.withOpacity(0.5), height: 1.4),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Module list
        ...modules.asMap().entries.map((entry) {
          final index = entry.key;
          final module = entry.value as Map<String, dynamic>;
          final moduleId = module['id'] as String? ?? 'module_$index';
          final moduleDifficulty = module['difficulty'] as String? ?? '';
          final isComplete = DataRepository().isLessonComplete(courseId, moduleId);
          final exerciseCount = ((module['exercises'] as List?)?.length ?? 0) +
              ((module['puzzles'] as List?)?.length ?? 0);

          return Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: GestureDetector(
              onTap: () {
                context.push('/lesson/$courseId/$moduleId');
              },
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isComplete
                      ? ChessOSTheme.primary.withOpacity(0.04)
                      : ChessOSTheme.card,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: isComplete
                        ? ChessOSTheme.primary.withOpacity(0.15)
                        : ChessOSTheme.outline,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 36, height: 36,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isComplete
                            ? ChessOSTheme.primary.withOpacity(0.15)
                            : ChessOSTheme.primary.withOpacity(0.08),
                      ),
                      child: Center(
                        child: isComplete
                            ? const Icon(Icons.check_rounded, size: 18, color: ChessOSTheme.primary)
                            : Text(
                                '${index + 1}',
                                style: GoogleFonts.inter(
                                  fontSize: 14, fontWeight: FontWeight.w800,
                                  color: ChessOSTheme.primary,
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            module['title'] ?? 'Module',
                            style: GoogleFonts.inter(
                              fontSize: 14, fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              if (moduleDifficulty.isNotEmpty) ...[
                                Text(
                                  moduleDifficulty,
                                  style: GoogleFonts.inter(
                                    fontSize: 10, fontWeight: FontWeight.w600,
                                    color: Colors.white.withOpacity(0.3),
                                  ),
                                ),
                                Text(' • ', style: TextStyle(color: Colors.white.withOpacity(0.2))),
                              ],
                              Text(
                                '$exerciseCount exercises',
                                style: GoogleFonts.inter(
                                  fontSize: 10, fontWeight: FontWeight.w600,
                                  color: Colors.white.withOpacity(0.3),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      Icons.chevron_right_rounded,
                      size: 20,
                      color: Colors.white.withOpacity(0.2),
                    ),
                  ],
                ),
              ),
            ),
          );
        }),
      ],
    );
  }
}
