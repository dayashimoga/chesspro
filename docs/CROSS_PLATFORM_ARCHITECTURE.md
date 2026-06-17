# ChessOS Cross-Platform Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────┐
│                    ChessOS Ecosystem                      │
│                                                           │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────────┐  │
│  │  Android App │    │   Web App   │    │ Future: PWA  │  │
│  │  (Flutter)   │    │(React/Vite) │    │   (Offline)  │  │
│  └──────┬───────┘    └──────┬──────┘    └──────┬───────┘  │
│         │                   │                   │         │
│         └─────────┬─────────┴───────────────────┘         │
│                   │                                       │
│         ┌─────────▼─────────┐                             │
│         │  Cloudflare Workers │                            │
│         │    (Hono API)       │                            │
│         └─────────┬──────────┘                            │
│                   │                                       │
│         ┌─────────▼──────────┐                            │
│         │    Cloudflare D1    │                            │
│         │   (SQLite Edge DB) │                            │
│         └────────────────────┘                            │
└──────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
```
Client (Web/Android)
  │
  ├─ POST /api/auth/register  →  Creates user in D1, returns token
  ├─ POST /api/auth/login     →  Verifies PBKDF2 hash, creates D1 session, returns token
  ├─ POST /api/auth/logout    →  Deletes D1 session
  │
  └─ All subsequent requests include: Authorization: Bearer <token>
      └─ Server validates token against `sessions` table in D1
```

### Progress Sync Protocol
```
1. Client authenticates (receives token)
2. On app load:
   - GET /api/progress?since=<lastSyncTimestamp>
   - Merge cloud data with local (take MAX for xp/level/streak, UNION for lessons)
3. On significant action (puzzle solve, lesson complete):
   - POST /api/progress/sync { xp, level, puzzleRating, streak, completedLessons, puzzleHistory }
4. Server response includes syncTimestamp for next incremental fetch
```

### Conflict Resolution Strategy
```
┌──────────────┬──────────────────────────────────────────┐
│ Field        │ Resolution Strategy                       │
├──────────────┼──────────────────────────────────────────┤
│ XP           │ MAX(local, cloud) — XP only increases     │
│ Level        │ MAX(local, cloud) — levels only increase   │
│ Streak       │ MAX(local, cloud)                         │
│ Puzzle Rating│ Latest wins (most recent timestamp)       │
│ Lessons      │ UNION — completed lessons never un-done   │
│ Puzzle History│ INSERT OR IGNORE — deduplicated by PK    │
└──────────────┴──────────────────────────────────────────┘
```

## Database Schema (D1 — v3.0)

### Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts | id, email, password_hash, xp, level, puzzle_rating, streak, last_modified |
| `sessions` | Persistent auth sessions | token (PK), user_id, expires_at |
| `completed_lessons` | Lesson completion tracking | user_id, lesson_id, last_modified |
| `puzzle_history` | Puzzle attempt history | user_id, puzzle_id, correct, category, timestamp, last_modified |
| `puzzles` | Puzzle content | id, fen, solution, category, theme, difficulty, rating |
| `opening_exercises` | Opening training content | id, name, moves, description, category |
| `tactical_exercises` | Tactical positions | id, theme, fen, solution, difficulty, rating |
| `master_games` | Annotated GM games | id, white, black, pgn, annotations, critical_moments |
| `middlegame_exercises` | Positional exercises | id, theme, fen, solution, plan |
| `endgame_exercises` | Endgame positions | id, theme, fen, solution, conversion_moves |
| `user_statistics` | Adaptive profiling | tactical_accuracy, opening_knowledge, calculation_depth, etc. |
| `srs_repertoire` | Spaced repetition data | move_id, pgn_line, interval, ease_factor, next_review |

### Performance Indexes

- `idx_sessions_user` — Fast session lookup by user
- `idx_sessions_expires` — Expired session cleanup
- `idx_completed_lessons_modified` — Incremental sync
- `idx_puzzle_history_modified` — Incremental sync
- `idx_puzzles_category` / `difficulty` / `rating` — Puzzle filtering

## API Endpoints (v3.0)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Sign in |
| POST | `/api/auth/logout` | Yes | Sign out |
| GET | `/api/progress` | Yes | Fetch user progress |
| POST | `/api/progress/sync` | Yes | Sync progress to cloud |
| GET | `/api/puzzles` | No | Query puzzles (with filters) |
| GET | `/api/puzzles/:id` | No | Get single puzzle |
| GET | `/api/openings` | No | List openings |
| GET | `/api/openings/:id` | No | Get opening detail |
| GET | `/api/tactics/:theme` | No | Get tactical exercises |
| GET | `/api/middlegames` | No | Get middlegame exercises |
| GET | `/api/endgames` | No | Get endgame exercises |
| GET | `/api/master-games` | No | List master games |
| GET | `/api/master-games/:id` | No | Get game detail |
| POST | `/api/progress/statistics` | Yes | Update user statistics |
| GET | `/api/progress/statistics` | Yes | Get user statistics |
| POST | `/api/coach/repertoire` | Yes | Update SRS repertoire |
| GET | `/api/coach/repertoire` | Yes | Get SRS repertoire |

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Android | Flutter / Dart | 3.24.0 |
| Web Framework | React | 18.3 |
| Web Build | Vite | 5.3 |
| State Management | Zustand (Web), BLoC (Android) | 4.5 / custom |
| CSS | Tailwind CSS | 3.4 |
| Chess Logic | chess.js (Web), chess.dart (Android) | 1.0.0-beta.8 / 0.8.1 |
| Backend | Hono (Cloudflare Workers) | Latest |
| Database | Cloudflare D1 (SQLite) | Latest |
| Auth | PBKDF2-HMAC-SHA256 (100K iterations) | Custom |
| CI/CD | GitHub Actions | Latest |
| Deployment | Cloudflare Pages (Web) + Workers (API) | Latest |

## Security Architecture

- **Password Hashing**: PBKDF2 with 100,000 iterations, 256-bit derived key, random 32-byte salt
- **Session Tokens**: 48 cryptographically random bytes (384-bit entropy)
- **CORS**: Dynamic origin reflection (configurable per environment)
- **Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy
- **Rate Limiting**: Cloudflare built-in (Worker-level)
- **Input Validation**: Email format + length, password length constraints
