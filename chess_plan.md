# Chess Mastery Platform (ChessOS) — Implementation Plan

## Goal
Build a complete, production-grade, self-contained chess learning platform that takes learners from absolute beginner to advanced competitive player. Includes a full chess player, interactive labs, structured curriculum, progress tracking, and Cloudflare Pages deployment.

## Architecture Decision

> [!IMPORTANT]
> **Single-Page Application (Vite + Vanilla JS)** deployed as a static site to **Cloudflare Pages** (free tier).
> All content is embedded in the app — no backend needed. Progress stored in localStorage.

### Why This Approach
- **Zero cost**: Cloudflare Pages free tier (unlimited bandwidth)
- **No backend**: All chess logic, AI, content runs client-side
- **Fast iteration**: Vite dev server + hot reload
- **Easy deploy**: `npm run build` → push to Cloudflare

### Technology Stack
| Component | Technology |
|-----------|-----------|
| Build Tool | Vite 6 |
| Language | Vanilla JS (ES modules) |
| Styling | Vanilla CSS (modern, premium design) |
| Chess Logic | chess.js (game rules, validation, PGN/FEN) |
| Chess AI | Custom minimax with alpha-beta pruning |
| Board Rendering | Custom SVG chessboard (interactive) |
| Routing | Hash-based SPA router |
| Storage | localStorage (progress, settings, SRS) |
| Deployment | Cloudflare Pages |
| Font | Inter (Google Fonts) |

---

## Proposed Changes

### 1. Project Scaffold

#### [NEW] package.json, vite.config.js, index.html
- Vite project with chess.js dependency
- Single entry point `index.html` with app shell
- Build config optimized for static deployment

---

### 2. Core Engine (`src/core/`)

#### [NEW] src/core/chess-engine.js
- Wrapper around chess.js for game state management
- FEN/PGN import/export
- Move validation, legal move generation

#### [NEW] src/core/ai-engine.js
- Minimax with alpha-beta pruning (adjustable depth 1-6)
- Piece-square tables for positional evaluation
- Multiple difficulty levels (Beginner → Expert)

#### [NEW] src/core/board-renderer.js
- SVG-based interactive chessboard
- Drag-and-drop piece movement
- Move highlighting, legal move indicators
- Arrow drawing for annotations
- Board flip, coordinates toggle
- Animation support for piece movement

#### [NEW] src/core/router.js
- Hash-based SPA router
- Lazy content loading
- Navigation state management

#### [NEW] src/core/storage.js
- localStorage wrapper for progress tracking
- Spaced repetition algorithm (SM-2)
- User preferences and settings

---

### 3. Content System (`src/content/`)

All content is structured as JS modules with real chess content — no placeholders.

#### [NEW] src/content/00-foundations.js
Complete modules: Board setup, piece movement, special rules (castling, en passant, promotion), notation (algebraic, FEN, PGN), check/checkmate/stalemate, draw conditions. Each with interactive board demos.

#### [NEW] src/content/01-tactics.js
18 tactical motifs (forks, pins, skewers, discovered attacks, double check, attraction, deflection, decoy, clearance, interference, overloading, zwischenzug, x-ray, back-rank mates, smothered mates, mating nets). Each with 10+ puzzles, GM examples, explanations.

#### [NEW] src/content/02-calculation.js
Candidate moves, forcing moves, move trees, visualization training. Progressive calculation exercises (2-ply through 10-ply).

#### [NEW] src/content/03-endgames.js
K+P endings, opposition, triangulation, zugzwang, Lucena/Philidor positions, rook endings, minor piece endings, queen endings, fortresses. Interactive endgame trainers.

#### [NEW] src/content/04-strategy.js
Pawn structures (isolated, hanging, doubled, backward), outposts, weak squares, open files, space advantage, piece activity, initiative, prophylaxis, bishop evaluation, dynamic imbalances.

#### [NEW] src/content/05-openings.js
White: Italian, Ruy Lopez, Queen's Gambit, London. Black: Sicilian, Caro-Kann, French, KID, Nimzo-Indian. Main lines, sidelines, traps, plans. Interactive opening explorer/tree.

#### [NEW] src/content/06-master-games.js
Annotated games from Morphy, Steinitz, Capablanca, Alekhine, Tal, Fischer, Kasparov, Carlsen. Strategic/tactical themes, critical positions, exercises.

#### [NEW] src/content/07-middlegame.js
Piece coordination, attack strategies, defensive techniques, transitions, pawn breaks, positional sacrifices.

#### [NEW] src/content/08-tournament-prep.js
Time management, opening preparation, practical decision-making, psychology, pre-game routine.

#### [NEW] src/content/09-advanced.js
Exchange sacrifices, positional sacrifices, dynamic compensation, fortress construction, modern engine concepts.

---

### 4. UI Components (`src/components/`)

#### [NEW] src/components/navigation.js
- Sidebar with curriculum tree
- Progress indicators per module
- Search functionality

#### [NEW] src/components/lesson-viewer.js
- Renders lesson content with interactive boards
- Theory/examples/exercises tabs
- Difficulty level selector

#### [NEW] src/components/puzzle-trainer.js
- Interactive puzzle solving interface
- Hint system (progressive hints)
- Solution reveal with explanation
- Rating system (Elo-like)

#### [NEW] src/components/chess-player.js
- Full chess game interface
- Play vs AI (multiple levels)
- Move history panel
- Game controls (undo, new game, flip board)
- PGN export

#### [NEW] src/components/opening-explorer.js
- Interactive opening tree visualization
- Click-through variations
- Statistics and win rates

#### [NEW] src/components/progress-dashboard.js
- Visual progress across all modules
- Tactics accuracy charts
- Study streak tracker
- Spaced repetition queue

#### [NEW] src/components/assessment.js
- Timed quiz system
- Multiple question types (find the move, evaluate position, choose the plan)
- Scoring and feedback

#### [NEW] src/components/spaced-repetition.js
- Flashcard interface for tactical motifs, positions, openings
- SM-2 algorithm scheduling
- Review queue management

---

### 5. Styling (`src/styles/`)

#### [NEW] src/styles/main.css
- Premium dark theme with chess-inspired color palette
- Glassmorphism elements
- Smooth animations and transitions
- Responsive layout (mobile-friendly)
- Custom chess piece SVGs
- Typography with Inter font

---

### 6. Pages (`src/pages/`)

#### [NEW] src/pages/home.js — Landing/dashboard page
#### [NEW] src/pages/learn.js — Curriculum browser + lesson viewer
#### [NEW] src/pages/play.js — Chess player vs AI
#### [NEW] src/pages/puzzles.js — Puzzle trainer
#### [NEW] src/pages/labs.js — Interactive labs
#### [NEW] src/pages/review.js — Spaced repetition review
#### [NEW] src/pages/progress.js — Progress dashboard
#### [NEW] src/pages/openings.js — Opening explorer
#### [NEW] src/pages/games.js — Master game study

---

### 7. Deployment

#### [NEW] wrangler.toml (optional) or manual Cloudflare Pages setup
- Connect GitHub repo → Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- No environment variables needed (fully static)

---

## Content Volume Targets

| Module | Lessons | Puzzles/Exercises | Interactive Demos |
|--------|---------|-------------------|-------------------|
| Foundations | 13 | 50+ | 15+ |
| Tactics | 18 | 200+ | 20+ |
| Calculation | 6 | 80+ | 10+ |
| Endgames | 12 | 100+ | 15+ |
| Strategy | 14 | 60+ | 10+ |
| Openings | 9 | 90+ | 9 trees |
| Master Games | 16+ | 50+ | 16+ |
| Middlegame | 8 | 40+ | 8+ |
| Advanced | 6 | 30+ | 6+ |
| **Total** | **100+** | **700+** | **100+** |

---

## Execution Strategy

> [!TIP]
> To maximize efficiency, I'll build in this order:
> 1. **Core engine + board** (foundation everything depends on)
> 2. **App shell + routing + styling** (visual framework)
> 3. **Content modules** (all 9 content areas in parallel structure)
> 4. **Interactive components** (puzzles, labs, player, explorer)
> 5. **Progress + SRS systems** (tracking layer)
> 6. **Polish + deploy config** (final touches)

Each step builds on the previous — no wasted work, no circular dependencies.

---

## Verification Plan

### Automated
- `npm run build` — Verify production build succeeds
- Vite dev server — Test all routes and interactions

### Manual Verification
- Navigate all curriculum modules
- Play a full game vs AI
- Solve puzzles at various difficulty levels
- Verify progress tracking persists across sessions
- Test responsive layout on mobile viewport
- Verify Cloudflare Pages deployment config

---

## Open Questions

> [!IMPORTANT]
> 1. **Chess piece style**: Should I use standard chess piece SVGs (Merida/CBurnett style) or a more modern/stylized set?
> 2. **Color scheme**: Dark theme with emerald/gold accents (chess-inspired), or would you prefer a different palette?
> 3. **AI difficulty**: The built-in AI will range from very easy (random legal moves) to moderate (depth-4 minimax). True engine-level play would require Stockfish WASM which adds ~2MB. Include it?
> 4. **Cloudflare deployment**: Should I include a GitHub Actions workflow for auto-deploy, or just the manual `wrangler` config?
