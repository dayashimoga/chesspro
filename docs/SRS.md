# Software Requirements Specification (SRS) — ChessOS Pro

## 1. Functional Requirements

### 1.1 Guided Solver Interface
- **FR-1.1:** The system shall restrict direct access to solutions.
- **FR-1.2:** The system shall prompt the user with a multiple-choice question comparing White vs Black king safety.
- **FR-1.3:** The system shall calculate king area attacker counts to verify the correct answer.
- **FR-1.4:** The system shall allow the user to input up to 3 candidate moves by playing them on the board.
- **FR-1.5:** The system shall rank candidate moves as Excellent, Interesting, or Too Slow using the engine.
- **FR-1.6:** The system shall force the calculation of opponent replies before completing the solve.

### 1.2 Training Laboratories
- **FR-2.1:** **Calculation Trainer:** The system shall support hiding board pieces and evaluating target coordinate clicks.
- **FR-2.2:** **Blindfold Trainer:** The system shall render a blank board, display/speak algebraic moves, and process input move text.
- **FR-2.3:** **Endgame Trainer:** The system shall support playing critical endgame FENs against Stockfish.

---

## 2. Non-Functional Requirements

### 2.1 Security & Access Control
- **NFR-1.1:** Authentication tokens must be securely stored in HttpOnly cookies to mitigate XSS-based token theft.
- **NFR-1.2:** Double-Submit Cookie patterns or custom headers must protect mutating endpoints from CSRF.
- **NFR-1.3:** Input validation must sterilize all inputs to prevent SQL Injection and XSS inside comments.

### 2.2 Performance & Reliability
- **NFR-2.1:** The client application must achieve a Lighthouse Performance score >= 95.
- **NFR-2.2:** First Contentful Paint (FCP) must be less than 1.5 seconds.
- **NFR-2.3:** API response latencies must be under 250ms under typical loads.
- **NFR-2.4:** Local Stockfish Worker analysis must run asynchronously and not block the browser's UI thread.

---

## 3. Data Models (TypeScript/SQL Interfaces)

### User Profile Schema
```typescript
interface UserProfile {
  id: string;
  email: string;
  xp: number;
  level: number;
  puzzleRating: number;
  streak: number;
  completedLessons: string[];
  unlockedSkills: string[];
  unlockedAchievements: string[];
  lastStudyDate: string;
}
```

### Puzzle Data Schema
```typescript
interface Puzzle {
  id: string;
  fen: string;
  solution: string; // SAN list e.g. "Bxf7+ Kxf7 Ng5+"
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master' | 'grandmaster';
  motif: string;
}
```
