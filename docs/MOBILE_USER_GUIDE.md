# ChessOS Mobile — User Guide

Welcome to the ChessOS Mobile client! This guide covers user interfaces, navigation paths, and offline learning workflows.

---

## 1. System Requirements & Support

*   **Android**: version 8.0 (API level 26) and newer.
*   **iOS**: version 14.0 and newer.
*   **Devices**: Optimized for standard smartphones, 7–13" tablets, and foldable devices (adaptive layout support).

---

## 2. Main Navigation & Shell Routes

The app features a bottom navigation bar managing routes via GoRouter:

*   **Dashboard (`/`)**: Main landing page displaying rating trends, daily streak, and active learning quests.
*   **University (`/foundations`, `/tactics`, etc.)**: Tabbed access to all 7 Chess University curriculum departments.
*   **Puzzle Trainer (`/puzzles`)**: Interactive puzzle board with step-by-step solver modes.
*   **AI Coach (`/coach`)**: AI coach insights, weaknesses diagnostics, and generated study schedules.
*   **Play vs AI (`/play`)**: Play matches against Stockfish with variable strength levels.

---

## 3. Interactive Chess Board Gestures

The custom SVG board in the Flutter client supports:
*   **Tap-to-Move**: Tap a piece to highlight legal destination squares, then tap a target square to execute the move.
*   **Drag-and-Drop**: Drag a piece directly to its destination square.
*   **Move History Bar**: Swipe left/right on the moves tape below the board to step forward or backward in the game tree.
*   **Evaluation Bar**: Displays real-time engine evaluation on the side of the board.

---

## 4. Spaced Repetition & Offline Sync

ChessOS Mobile is designed for offline-first learning, using **Hive** and **SQLite** databases:

### 4.1 Automatic Offline Cache
*   All puzzle sets, opening repertoires, and active learning courses are cached locally when online.
*   If your network drops, the app automatically switches to read from local Hive/SQLite databases. You can continue training without interruption.

### 4.2 Synchronization Queue
*   When you complete exercises offline, your progress is added to a local sync queue.
*   Once internet connectivity is restored, the `ApiClient` background sync service automatically flushes the queue, uploading records to the Cloudflare Worker backend to update your D1 profile.
