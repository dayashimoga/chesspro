# ChessOS Pro — Premium Chess Mastery Platform

<div align="center">

**A Complete Chess University + Personal Coach + Tournament Training Platform**

*Taking students from absolute beginner to advanced tournament-level strength*

[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-brightgreen)](#)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare_Pages-orange)](#)
[![Flutter](https://img.shields.io/badge/Mobile-Flutter_3.24+-blue)](#)

</div>

---

## 🏗 Architecture

```
ChessOS/
├── frontend/          # React + TypeScript + Vite (Web App)
│   ├── src/
│   │   ├── pages/     # 20+ interactive pages
│   │   ├── components/# Reusable UI (Board, GuidedSolver, ThinkingMode)
│   │   ├── content/   # Chess curriculum (puzzles, openings, endgames)
│   │   ├── store/     # Zustand state management
│   │   └── core/      # Storage, utilities
│   ├── tests/         # Vitest unit + Playwright E2E
│   └── playwright.config.ts
├── workers/           # Cloudflare Workers (Hono API)
│   └── src/index.ts   # Auth, progress, puzzles, games
├── android/           # Flutter 3.24+ Mobile App
│   ├── lib/
│   │   ├── main.dart  # Material Design 3 entry
│   │   ├── blocs/     # BLoC state management
│   │   ├── core/      # API client, local storage
│   │   └── widgets/   # Chess board, eval bar
│   └── pubspec.yaml
├── docs/              # Documentation
│   ├── AUDIT_REPORT.md
│   ├── API_DOCUMENTATION.md
│   ├── MOBILE_ARCHITECTURE.md
│   └── RELEASE_READINESS_REPORT.md
└── .github/workflows/ # CI/CD pipeline
```

## 🎓 Chess University (7 Departments)

| Department | Topics | Interactive |
|-----------|--------|-------------|
| **Foundations** | Board basics, piece movement, check/checkmate | ✅ Labs |
| **Tactics** | 19 themes, 6,500+ puzzles, procedural generators | ✅ 6 solve modes |
| **Calculation** | CCT framework, candidate moves, deep visualization | ✅ 5-phase workflow |
| **Openings** | 20 systems (Italian, Sicilian, QG, KID, Grünfeld...) | ✅ Interactive trees |
| **Middlegame** | 7 modules (pawn structures → transformation) | ✅ Theory + quizzes |
| **Endgames** | 10 modules (opposition → practical techniques) | ✅ Assessment |
| **Master Games** | 19 players, 20+ annotated games (Morphy → Carlsen) | ✅ Guess mode |

## 🧠 GM Thinking Mode

The core pedagogical innovation — forces students through a structured thinking process:

1. **Evaluate** — Assess the position objectively
2. **Imbalances** — Identify material/positional differences
3. **Threats** — Find immediate threats (both sides)
4. **Candidates** — List candidate moves
5. **Calculate** — Calculate variations for each candidate
6. **Compare** — Compare results and choose the best move

Board is **locked** until analysis is complete.

## 🏅 Tournament Preparation Center

- ⏱️ **Chess Clock Training** — 10 time controls (Bullet → Classical) with increment
- 📖 **Opening Prep** — Review repertoire under time pressure
- 🧘 **Nerves Management** — 8 GM-level psychological techniques
- 📝 **Pre-Game Routine** — Complete tournament day timeline

## 🤖 AI Chess Coach

- **Weakness Profiler** — Tracks tactical accuracy, calculation depth, opening/endgame knowledge
- **Tailored Recommendations** — Personalized training pathways based on weaknesses
- **Practice Plans** — Daily, weekly, and monthly training schedules
- **Progress Tracking** — XP, rating, streak, completed lessons

## 🔒 Security

| Feature | Implementation |
|---------|---------------|
| Password hashing | PBKDF2 (100k iterations + 32-byte salt) |
| Token generation | 48-byte `crypto.getRandomValues()` |
| Rate limiting | 300 req/min per IP |
| CORS | Restricted to allowed origins |
| Security headers | CSP, X-Frame, X-Content-Type, Referrer-Policy |
| Input validation | Email format + password length (8-128) |
| Legacy migration | Auto-upgrade SHA-256 → PBKDF2 on login |

## 📱 Mobile App (Flutter)

- Material Design 3 dark theme (matches web)
- BLoC state management
- Offline-first with Hive/SQLite
- Dio API client with retry + offline queue
- Interactive chess board widget

## 🚀 Quick Start

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend (Cloudflare Workers)
cd workers && npm install && npx wrangler dev

# Tests
cd frontend && npm test          # Unit tests
cd frontend && npx playwright test  # E2E tests
```

## 📊 Platform Stats

| Metric | Count |
|--------|-------|
| Interactive pages | 20+ |
| Puzzle database | 6,500+ |
| Opening systems | 20 |
| Endgame modules | 10 |
| Middlegame modules | 7 |
| Master games | 20+ |
| Solve modes | 6 |
| Test cases | 70+ |
| Security fixes | 8 critical |

## 📄 License

Proprietary — All rights reserved.
