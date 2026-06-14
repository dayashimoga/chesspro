# API Specification — ChessOS Pro

## 1. REST Endpoints

### 1.1 Authentication
- **POST `/api/auth/register`**
  - Payload: `{ "email": "user@test.com", "password": "securepassword" }`
  - Response: `201 Created` with JWT token inside HttpOnly cookie.
- **POST `/api/auth/login`**
  - Payload: `{ "email": "user@test.com", "password": "securepassword" }`
  - Response: `200 OK` + JWT token cookie.

### 1.2 Puzzles
- **GET `/api/puzzles`**
  - Query: `?category=forks&difficulty=beginner`
  - Response: `200 OK` returning an array of compact puzzle metadata elements.
- **POST `/api/puzzles/:id/solve`**
  - Payload: `{ "correct": true, "durationMs": 45000 }`
  - Response: `200 OK` returning updated rating and awarded XP:
    ```json
    { "awardedXP": 15, "newRating": 815, "unlockedAchievements": [] }
    ```

### 1.3 Progress & Lessons
- **POST `/api/lessons/:id/complete`**
  - Response: `200 OK` returning completed array indices and level progression state.

---

## 2. WebSocket Coach Channel

Gateway connection: `ws://localhost:3000/coach`

### Client Events
- **`analyze_position`**
  - Payload: `{ "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }`
- **`request_hint`**
  - Payload: `{ "puzzleId": "fork_01", "plyDepth": 1 }`

### Server Messages
- **`position_analysis`**
  - Payload: `{ "bestMove": "e2e4", "score": "+0.35", "pv": ["e2e4", "e7e5"] }`
- **`coach_hint`**
  - Payload: `{ "hint": "Look at the alignment of Black's King and Rook on the e-file." }`
