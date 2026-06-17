# ChessOS Android — Complete Mobile-First Chess University Rebuild

## Problem Summary

The current Android app is a **scaffolded shell**, not a production application. The entire codebase is ~5 files totaling ~48KB of Dart with critical architectural failures:

| Issue | Severity | Root Cause |
|-------|----------|------------|
| "Course Not Found" for Openings, Middlegame, Master Games | 🔴 Critical | Routes use `getCourseByTitle()` fuzzy match but courses.json has no matching titles |
| Raw HTML rendered as text in theory fields | 🔴 Critical | `ListTile.subtitle` dumps HTML strings directly — no parser exists |
| Play vs AI shows "Coming Soon" | 🔴 Critical | `PlayPage` is a placeholder `Center(child: Text(...))` |
| AI Coach shows "Coming Soon" | 🔴 Critical | `CoachPage` is a placeholder `Center(child: Text(...))` |
| Puzzle tapping does nothing | 🔴 Critical | `onTap` callback is empty `// Launch puzzle...` |
| Module tapping does nothing | 🔴 Critical | `onTap` callback is empty `// Navigate to lesson detail...` |
| Only 868 puzzles (target: 10,000+) | 🟠 Major | Insufficient puzzle generation |
| Only 10 master games (target: 1000+) | 🟠 Major | Minimal seed data |
| No lesson detail screen exists | 🔴 Critical | UniversityPage only shows module list — no drill-down |
| No rich text/markdown renderer | 🔴 Critical | No content rendering pipeline |
| No interactive board in lessons | 🔴 Critical | ChessBoardWidget exists but is never used in any page |
| No assessment/quiz UI | 🔴 Critical | Exercises exist in JSON but no rendering widget |
| No spaced repetition | 🟠 Major | No SRS logic at all |
| No progress tracking | 🟠 Major | UserBloc has XP fields but never persists or loads |
| No offline support | 🟠 Major | Hive initialized but no caching of course data |
| BLoC providers never wired | 🔴 Critical | `UserBloc`, `PuzzleBloc`, `NavigationBloc` defined but never provided |

---

## Architecture Approach — Maximum Efficiency

> [!IMPORTANT]
> Rather than creating dozens of scattered files, this rebuild follows a **monolithic-first architecture** — a small number of large, well-organized files that deliver maximum functionality with minimal iteration. The entire rebuild touches **6 core files** plus **3 asset files**.

### File Architecture

```
android/lib/
├── main.dart                    # App entry, theme, router, shell, dashboard (REWRITE)
├── core/
│   ├── data_repository.dart     # Singleton data layer + offline cache (REWRITE)
│   ├── api_client.dart          # Keep as-is (working)
│   └── chess_engine.dart        # [NEW] Chess logic engine (move validation, AI)
├── blocs/
│   └── app_bloc.dart            # All BLoCs + state (REWRITE)
├── widgets/
│   ├── chess_board.dart          # Keep + enhance (working)
│   └── content_renderer.dart    # [NEW] HTML→Widget renderer, quiz UI, exercise UI
├── pages/
│   ├── lesson_page.dart         # [NEW] Full lesson experience
│   ├── puzzle_page.dart         # [NEW] Interactive puzzle trainer
│   ├── play_page.dart           # [NEW] Play vs AI with analysis
│   └── coach_page.dart          # [NEW] AI Coach dashboard
android/assets/
├── university/courses.json      # EXPAND — add openings, middlegame, master-games courses
├── puzzles/puzzles.json         # EXPAND — 10,000+ puzzles
└── games/master_games.json      # EXPAND — 1,000+ games
```

---

## Proposed Changes

### Component 1: Content Data (Assets)

> [!IMPORTANT]
> This is the **root cause** of most "Course Not Found" errors. The route `/openings` searches for a course with "Openings" in the title, but no such course exists.

#### [MODIFY] [courses.json](file:///h:/chessmastery/android/assets/university/courses.json)
- Add 3 missing courses: **Openings** (id: `openings`), **Middlegame** (id: `middlegame`), **Master Games** (id: `master-games`)
- Each with full module structure matching the format of existing courses (theory, examples, exercises, puzzles)
- Middlegame course: 7 modules (Pawn Structures, Weak Squares, Initiative, Piece Activity, Prophylaxis, Attack & Defense, Transformation)
- Openings course: 6+ modules covering major systems (Italian, Sicilian, French, Caro-Kann, Queen's Gambit, Indian Systems)
- Master Games course: 6+ modules organized by era/player
- Total after expansion: 9 courses, 50+ modules

#### [MODIFY] [puzzles.json](file:///h:/chessmastery/android/assets/puzzles/puzzles.json)
- Expand from 868 to 10,000+ puzzles using procedural generation
- Cover all tactical themes: forks, pins, skewers, discovered attacks, deflection, sacrifices, mates in 1-5, endgame tactics
- Each puzzle: `id`, `fen`, `solution` (array), `theme`, `difficulty`, `rating`, `explanation`

#### [MODIFY] [master_games.json](file:///h:/chessmastery/android/assets/games/master_games.json)
- Expand from 10 to 1,000+ annotated games
- Cover Morphy, Steinitz, Capablanca, Alekhine, Tal, Fischer, Karpov, Kasparov, Anand, Carlsen
- Each game: PGN, annotations, critical moments, coaching commentary

---

### Component 2: Content Renderer

#### [NEW] [content_renderer.dart](file:///h:/chessmastery/android/lib/widgets/content_renderer.dart)
The **single most critical missing piece**. Converts HTML theory strings to native Flutter widgets:

- `ContentRenderer` — master widget that parses HTML and renders:
  - `<h2>`, `<h3>` → styled `Text` with proper hierarchy
  - `<p>` → body text with proper spacing
  - `<ul>`, `<ol>`, `<li>` → indented list with bullets/numbers
  - `<strong>`, `<em>`, `<code>` → inline text styles
  - `<pre>` → monospace code block
  - `<div class="key-concept">` → styled callout card with emerald accent
  - `<div class="warning-box">` → styled warning card with amber accent
- `QuizWidget` — renders quiz exercises with animated option selection, feedback, and scoring
- `FindMoveWidget` — renders find-move exercises with interactive board
- `ExerciseListWidget` — presents all exercises for a module with progress tracking
- `PuzzleCard` — interactive puzzle with board, hint system, move validation

---

### Component 3: Chess Engine

#### [NEW] [chess_engine.dart](file:///h:/chessmastery/android/lib/core/chess_engine.dart)
- FEN parser and board state manager
- Legal move generator using the `chess` package
- AI opponent using minimax with alpha-beta pruning (depths 1-8 for difficulty levels)
- Position evaluation (material, piece-square tables, king safety, pawn structure)
- Move validation for puzzle solving
- Post-game analysis (accuracy %, blunders, missed tactics)

---

### Component 4: Pages

#### [NEW] [lesson_page.dart](file:///h:/chessmastery/android/lib/pages/lesson_page.dart)
Full lesson experience screen:
- Theory section rendered via `ContentRenderer`
- Interactive examples with `ChessBoardWidget`  
- Exercises section with `QuizWidget` / `FindMoveWidget`
- Puzzles section with interactive solving
- Progress tracking per lesson
- "Mark Complete" with XP reward
- Smooth page transitions with Hero animations

#### [NEW] [puzzle_page.dart](file:///h:/chessmastery/android/lib/pages/puzzle_page.dart)  
Complete puzzle trainer:
- Interactive chess board with piece dragging
- Guided solve mode (step-by-step solution validation)
- Hint system (3 levels: theme → target square → full move)
- Coach feedback on wrong moves
- Rating system (Elo-based, adjusts per solve)
- Category filtering (fork, pin, mate, etc.)
- Difficulty progression
- Streak tracking

#### [NEW] [play_page.dart](file:///h:/chessmastery/android/lib/pages/play_page.dart)
Play vs AI:
- Full chess game with legal move highlighting
- 5 difficulty levels (Beginner → Master)
- Move history with notation
- Post-game analysis report:
  - Accuracy percentage
  - Blunders, mistakes, inaccuracies
  - Critical moments
  - Improvement suggestions

#### [NEW] [coach_page.dart](file:///h:/chessmastery/android/lib/pages/coach_page.dart)
AI Coach dashboard:
- Skill radar chart (Tactics, Strategy, Endgame, Opening, Calculation)
- Daily training plan based on weaknesses
- Weekly progress report
- Puzzle accuracy trends
- Personalized exercise recommendations
- Achievement badges and milestones

---

### Component 5: App Shell & Navigation (main.dart)

#### [MODIFY] [main.dart](file:///h:/chessmastery/android/lib/main.dart)
Complete rewrite:
- Wire BLoC providers (`MultiBlocProvider` wrapping the app)
- Add routes for lesson detail: `/lesson/:courseId/:moduleId`
- Add route for puzzle solve: `/puzzle/:puzzleId`
- Fix navigation index tracking to sync with GoRouter
- Expand Dashboard with:
  - Daily challenge card
  - Continue learning card (last lesson)
  - Quick stats (rating, XP, level, streak)
  - University grid with progress indicators
  - Puzzle rush quick-start
- University page with proper course loading + fallback
- Animated transitions between pages

---

### Component 6: State Management

#### [MODIFY] [app_bloc.dart](file:///h:/chessmastery/android/lib/blocs/app_bloc.dart)
- Wire `UserBloc` to Hive for persistence (save/load XP, rating, streak, completed lessons)
- Enhance `PuzzleBloc` with hint system, rating adjustment, streak tracking
- Add `CoachBloc` for training plan generation and skill tracking
- Add `GameBloc` for Play vs AI state management
- Add `LessonBloc` for lesson progress and exercise state

---

### Component 7: Data Repository Enhancement

#### [MODIFY] [data_repository.dart](file:///h:/chessmastery/android/lib/core/data_repository.dart)
- Add proper course lookup by ID (not just fuzzy title match)
- Add `getCourseById(String id)` 
- Add `getModule(String courseId, String moduleId)`
- Add `getPuzzlesByTheme(String theme)`
- Add `getPuzzlesByDifficulty(String difficulty)`
- Add `getMasterGame(String id)`
- Add offline caching to Hive
- Add puzzle shuffling and selection algorithms

---

### Component 8: Documentation & Verification

#### [NEW] [MOBILE_GAP_ANALYSIS.md](file:///h:/chessmastery/docs/MOBILE_GAP_ANALYSIS.md)
Complete gap analysis with root cause, severity, fix strategy, verification for every issue found.

#### [MODIFY] [MOBILE_RELEASE_READINESS.md](file:///h:/chessmastery/docs/MOBILE_RELEASE_READINESS.md)
Updated with objective evidence of every fix applied.

---

## Execution Order (Maximum Efficiency)

| Step | Component | Rationale |
|------|-----------|-----------|
| 1 | Gap Analysis Doc | Document findings objectively |
| 2 | Content Data (courses.json expansion) | Fixes root cause of "Course Not Found" |
| 3 | Puzzle expansion (puzzles.json) | Fills content gap to 10,000+ |
| 4 | Master games expansion | Fills to 1,000+ games |
| 5 | Content Renderer widget | Eliminates all raw HTML rendering |
| 6 | Chess Engine | Enables Play vs AI and puzzle validation |
| 7 | Lesson Page | Makes courses interactive and functional |
| 8 | Puzzle Page | Makes puzzle trainer fully functional |
| 9 | Play Page | Replaces "Coming Soon" with real game |
| 10 | Coach Page | Replaces "Coming Soon" with real dashboard |
| 11 | Data Repository Enhancement | Proper data access layer |
| 12 | App BLoC Wiring + Main.dart | Connects everything together |
| 13 | Release Readiness Report | Verification evidence |

---

## Zero Placeholder Policy Enforcement

Every forbidden pattern will be eliminated:
- `Coming Soon` → Real functionality
- `Course not found` → Guaranteed course existence via proper ID lookup
- Empty `onTap` callbacks → Real navigation/interaction
- HTML strings in Text widgets → Rendered rich content
- Placeholder architecture → Complete functional implementation

---

## Verification Plan

### Automated Verification
- Content scan: grep for forbidden strings ("Coming Soon", "Course not found", "placeholder", "demo content")
- Route verification: every route resolves to a real page with real content
- Puzzle validation: every puzzle has FEN, solution, and theme
- Course validation: every course has modules, every module has theory + exercises

### Manual Verification
- Navigate every route in the app
- Complete a lesson end-to-end
- Solve puzzles across all difficulty levels
- Play a full game vs AI
- Review coach dashboard
- Test on phone and tablet layouts
