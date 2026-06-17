import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'core/data_repository.dart';

// ChessOS Pro — Main Entry Point
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive for local storage
  await Hive.initFlutter();

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

  // Preferred orientations
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
  static const Color primary = Color(0xFF10B981); // Emerald
  static const Color secondary = Color(0xFFF59E0B); // Amber
  static const Color surface = Color(0xFF0C0C14);
  static const Color background = Color(0xFF06060B);
  static const Color card = Color(0xFF111119);
  static const Color error = Color(0xFFEF4444);
  static const Color onSurface = Color(0xFFE2E8F0);
  static const Color onSurfaceVariant = Color(0xFF94A3B8);
  static const Color outline = Color(0x1AFFFFFF); // white/10

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
      ).apply(
        bodyColor: onSurface,
        displayColor: onSurface,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: surface,
        foregroundColor: onSurface,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 18,
          fontWeight: FontWeight.w800,
          color: Colors.white,
        ),
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
          GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: background,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w700,
          ),
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
        GoRoute(path: '/foundations', builder: (_, __) => const UniversityPage(title: 'Foundations')),
        GoRoute(path: '/tactics', builder: (_, __) => const UniversityPage(title: 'Tactics')),
        GoRoute(path: '/calculation', builder: (_, __) => const UniversityPage(title: 'Calculation')),
        GoRoute(path: '/openings', builder: (_, __) => const UniversityPage(title: 'Openings')),
        GoRoute(path: '/middlegame', builder: (_, __) => const UniversityPage(title: 'Middlegame')),
        GoRoute(path: '/endgames', builder: (_, __) => const UniversityPage(title: 'Endgames')),
        GoRoute(path: '/master-games', builder: (_, __) => const UniversityPage(title: 'Master Games')),
        GoRoute(path: '/puzzles', builder: (_, __) => const PuzzlePage()),
        GoRoute(path: '/play', builder: (_, __) => const PlayPage()),
        GoRoute(path: '/coach', builder: (_, __) => const CoachPage()),
      ],
    ),
  ],
);

// ============================================================================
// Main App Widget
// ============================================================================
class ChessOSApp extends StatelessWidget {
  const ChessOSApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'ChessOS Pro',
      debugShowCheckedModeBanner: false,
      theme: ChessOSTheme.darkTheme,
      routerConfig: _router,
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
  int _currentIndex = 0;

  static const _navItems = [
    ('Dashboard', Icons.dashboard_rounded, '/'),
    ('University', Icons.school_rounded, '/foundations'),
    ('Puzzles', Icons.extension_rounded, '/puzzles'),
    ('Play', Icons.sports_esports_rounded, '/play'),
    ('Coach', Icons.psychology_rounded, '/coach'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
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
// Dashboard Page
// ============================================================================
class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'ChessOS Pro',
                      style: GoogleFonts.inter(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      'GM MASTERY PLATFORM',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 3,
                        color: ChessOSTheme.primary,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: ChessOSTheme.secondary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: ChessOSTheme.secondary.withOpacity(0.2)),
                  ),
                  child: Row(
                    children: [
                      const Text('🔥', style: TextStyle(fontSize: 14)),
                      const SizedBox(width: 4),
                      Text(
                        '0 Day Streak',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: ChessOSTheme.secondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Stats Row
            Row(
              children: [
                _StatCard(title: 'Rating', value: '800', icon: '📊', color: ChessOSTheme.primary),
                const SizedBox(width: 12),
                _StatCard(title: 'XP', value: '0', icon: '💎', color: ChessOSTheme.primary),
                const SizedBox(width: 12),
                _StatCard(title: 'Level', value: '1', icon: '⭐', color: ChessOSTheme.secondary),
              ],
            ),
            const SizedBox(height: 24),

            // Quick Actions
            Text(
              'CHESS UNIVERSITY',
              style: GoogleFonts.inter(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                letterSpacing: 2,
                color: ChessOSTheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 12),

            // University Grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.4,
              children: const [
                _UniversityCard(title: 'Foundations', icon: '🏫', route: '/foundations', color: Color(0xFF10B981)),
                _UniversityCard(title: 'Tactics', icon: '🧩', route: '/tactics', color: Color(0xFFF59E0B)),
                _UniversityCard(title: 'Calculation', icon: '🧠', route: '/calculation', color: Color(0xFF8B5CF6)),
                _UniversityCard(title: 'Openings', icon: '🌳', route: '/openings', color: Color(0xFF3B82F6)),
                _UniversityCard(title: 'Middlegame', icon: '⚔️', route: '/middlegame', color: Color(0xFFEF4444)),
                _UniversityCard(title: 'Endgames', icon: '👑', route: '/endgames', color: Color(0xFFF97316)),
                _UniversityCard(title: 'Master Games', icon: '🏆', route: '/master-games', color: Color(0xFFEC4899)),
                _UniversityCard(title: 'Puzzles', icon: '🎯', route: '/puzzles', color: Color(0xFF06B6D4)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final String icon;
  final Color color;

  const _StatCard({required this.title, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: ChessOSTheme.card,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: ChessOSTheme.outline),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(icon, style: const TextStyle(fontSize: 20)),
            const SizedBox(height: 8),
            Text(
              value,
              style: GoogleFonts.inter(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: Colors.white,
              ),
            ),
            Text(
              title,
              style: GoogleFonts.inter(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: ChessOSTheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
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
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.15)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(icon, style: const TextStyle(fontSize: 28)),
            Text(
              title,
              style: GoogleFonts.inter(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// Data-Driven Pages
// ============================================================================
class UniversityPage extends StatelessWidget {
  final String title;
  const UniversityPage({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    final course = DataRepository().getCourseByTitle(title);

    return Scaffold(
      appBar: AppBar(title: Text('$title University')),
      body: course == null
          ? const Center(child: Text('Course not found'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: (course['modules'] as List).length,
              itemBuilder: (context, index) {
                final module = course['modules'][index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: ChessOSTheme.primary.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        '${index + 1}',
                        style: TextStyle(
                          color: ChessOSTheme.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    title: Text(
                      module['title'] ?? 'Module',
                      style: GoogleFonts.inter(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text(
                      module['theory'] ?? '',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                    onTap: () {
                      // Navigate to lesson detail...
                    },
                  ),
                );
              },
            ),
    );
  }
}

class PuzzlePage extends StatelessWidget {
  const PuzzlePage({super.key});

  @override
  Widget build(BuildContext context) {
    final puzzles = DataRepository().puzzles;

    return Scaffold(
      appBar: AppBar(title: const Text('Puzzle Trainer')),
      body: puzzles.isEmpty
          ? const Center(child: Text('No puzzles loaded'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: puzzles.length > 50 ? 50 : puzzles.length, // Show top 50 for now
              itemBuilder: (context, index) {
                final puzzle = puzzles[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: const Icon(Icons.extension, color: ChessOSTheme.secondary),
                    title: Text(
                      puzzle['theme'] ?? 'Puzzle',
                      style: GoogleFonts.inter(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text('Rating: ${puzzle['rating']} • ${puzzle['difficulty']}'),
                    trailing: const Icon(Icons.play_arrow, color: ChessOSTheme.primary),
                    onTap: () {
                      // Launch puzzle...
                    },
                  ),
                );
              },
            ),
    );
  }
}

class PlayPage extends StatelessWidget {
  const PlayPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Play vs AI')),
      body: const Center(child: Text('♟️ Play vs AI (Board Engine Coming Soon)', style: TextStyle(fontSize: 18, color: Colors.white))),
    );
  }
}

class CoachPage extends StatelessWidget {
  const CoachPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI Chess Coach')),
      body: const Center(child: Text('🎙️ AI Coach (Chat Coming Soon)', style: TextStyle(fontSize: 18, color: Colors.white))),
    );
  }
}
