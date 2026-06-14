# ChessOS — Chess Mastery Platform

> **Complete chess learning platform from beginner to grandmaster.** Interactive lessons, puzzles, AI opponent, opening explorer, progress tracking, and mastery-based progression.

![ChessOS](https://img.shields.io/badge/ChessOS-v1.0-emerald?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Deploy-Cloudflare_Pages-orange?style=for-the-badge)

## ✨ Features

- 🎮 **Full Chess Player** — Play against AI with 6 difficulty levels (Beginner ~800 to Master ~2200)
- 📚 **Complete Curriculum** — 30+ lessons across 9 modules (Foundations → Advanced Chess)
- 🧩 **75+ Puzzles** — Categorized by tactical theme with solutions and explanations
- 🌳 **Opening Explorer** — Interactive opening trees for Italian, Ruy Lopez, Sicilian, and more
- 🏆 **Master Games** — Annotated games from Morphy, Fischer, Kasparov, Carlsen, Tal
- 📊 **Progress Tracking** — Track lessons, puzzles, rating, and study streaks
- 🔄 **Spaced Repetition** — SM-2 algorithm for long-term retention
- 🎨 **Premium Design** — Dark theme with emerald/gold accents, glassmorphism, animations
- 📱 **Responsive** — Works on desktop, tablet, and mobile
- ☁️ **Free Hosting** — Deploy to Cloudflare Pages (zero cost)

## 🚀 Quick Start

### Using Docker (no local Node.js needed)
```bash
# Install dependencies
docker run --rm -v $(pwd):/app -w /app node:22-alpine npm install

# Start dev server
docker run --rm -v $(pwd):/app -w /app -p 3000:3000 node:22-alpine npx vite --host 0.0.0.0

# Build for production
docker run --rm -v $(pwd):/app -w /app node:22-alpine npx vite build
```

### Using Node.js
```bash
npm install
npm run dev     # Development server
npm run build   # Production build
```

## 📁 Structure

```
chessos/
├── index.html              # App shell
├── src/
│   ├── main.js             # App entry point (components + pages + routing)
│   ├── core/
│   │   ├── chess-engine.js  # Chess.js wrapper
│   │   ├── ai-engine.js    # Minimax AI with alpha-beta pruning
│   │   ├── board-renderer.js # Interactive SVG chessboard
│   │   ├── router.js       # Hash-based SPA router
│   │   └── storage.js      # LocalStorage + SM-2 spaced repetition
│   ├── content/
│   │   ├── 00-foundations.js # Board, pieces, rules, notation
│   │   ├── 01-tactics.js    # Forks, pins, skewers, mates...
│   │   ├── 02-calculation.js # CCT method, depth training
│   │   ├── 03-endgames.js   # K+P, rook endings, Lucena/Philidor
│   │   ├── 04-strategy.js   # Pawn structures, piece activity
│   │   ├── 05-openings.js   # Italian, Ruy Lopez, Sicilian...
│   │   ├── 06-master-games.js # Annotated GM games
│   │   ├── 07-middlegame.js # Attack, defense, planning
│   │   └── 08-advanced.js   # Sacrifices, psychology, engines
│   └── styles/
│       └── main.css        # Premium dark theme design system
├── DEPLOY.md               # Cloudflare Pages deployment guide
├── package.json
└── vite.config.js
```

## 🎯 Curriculum

| Module | Topics | Difficulty |
|--------|--------|-----------|
| Foundations | Board, pieces, rules, notation, basic mates | Beginner |
| Tactics | Forks, pins, skewers, discovered attacks, mating patterns | Beginner-Advanced |
| Calculation | Candidate moves, CCT method, visualization | Intermediate |
| Endgames | K+P, rook endings, Lucena, Philidor, fortresses | Intermediate-Expert |
| Strategy | Pawn structures, outposts, space, initiative | Intermediate |
| Openings | Italian, Ruy Lopez, Queen's Gambit, Sicilian, London | Beginner-Advanced |
| Master Games | Morphy, Fischer, Kasparov, Carlsen, Tal | Advanced-Expert |
| Middlegame | King attacks, defense, planning | Advanced |
| Advanced | Sacrifices, tournament psychology, engine analysis | Expert |

## ☁️ Deploy to Cloudflare Pages

See [DEPLOY.md](./DEPLOY.md) for step-by-step instructions. TL;DR:
1. Push to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Build command: `npm install && npx vite build`, Output: `dist`

## 🛠️ Technology

- **Vanilla JS** — No framework, maximum performance
- **chess.js** — Chess rules and move validation
- **Custom AI** — Minimax with alpha-beta pruning, piece-square tables
- **SVG Board** — Custom interactive chess board renderer
- **Vite** — Fast build tool
- **CSS** — Custom design system, no Tailwind dependency

## 📄 License

MIT
