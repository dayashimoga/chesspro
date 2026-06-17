# ChessOS API Documentation

## Base URL
- **Development**: `http://localhost:8787`
- **Production**: `https://chessos-api.workers.dev`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are returned from `/api/auth/register` and `/api/auth/login`. Tokens expire after **7 days**.

---

## Endpoints

### Auth

#### `POST /api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "minimum8chars"
}
```

**Validation:**
- Email: valid format, max 254 characters
- Password: 8–128 characters

**Response (201):**
```json
{
  "token": "a1b2c3d4e5...",
  "user": {
    "id": "usr_abc123def456",
    "email": "user@example.com",
    "xp": 0,
    "level": 1,
    "puzzleRating": 800,
    "streak": 0
  }
}
```

**Errors:**
- `400` — Missing fields, invalid email, password too short/long, user exists
- `500` — Server error

---

#### `POST /api/auth/login`
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "minimum8chars"
}
```

**Response (200):**
```json
{
  "token": "a1b2c3d4e5...",
  "user": {
    "id": "usr_abc123def456",
    "email": "user@example.com",
    "xp": 1250,
    "level": 5,
    "puzzleRating": 1200,
    "streak": 7
  }
}
```

**Errors:**
- `400` — Missing fields
- `401` — Invalid credentials
- `500` — Server error

**Security Notes:**
- Passwords are hashed with PBKDF2 (100k iterations + 32-byte salt)
- Legacy SHA-256 hashes are auto-upgraded on successful login
- Tokens are 48-byte cryptographically random hex strings

---

### Progress

#### `POST /api/progress/sync` 🔒
Sync user progress from client to server.

**Request Body:**
```json
{
  "xp": 1250,
  "level": 5,
  "puzzleRating": 1200,
  "streak": 7,
  "completedLessons": ["lesson-1", "lesson-2"],
  "puzzleHistory": {
    "total": 150,
    "correct": 120,
    "categories": {
      "mate_in_1": { "total": 50, "correct": 45 },
      "fork": { "total": 30, "correct": 22 }
    }
  }
}
```

**Response (200):**
```json
{ "ok": true }
```

---

#### `GET /api/progress/statistics` 🔒
Get computed statistics for the AI Coach dashboard.

**Response (200):**
```json
{
  "tacticalAccuracy": 0.78,
  "openingKnowledge": 0.65,
  "endgameKnowledge": 0.55,
  "calculationDepth": 4,
  "strategicUnderstanding": 0.60,
  "puzzleAccuracy": 0.80,
  "timeUsage": 12
}
```

---

### Puzzles

#### `GET /api/puzzles/:id` 🔒
Get a specific puzzle by ID.

#### `POST /api/puzzles/record` 🔒
Record a puzzle attempt.

**Request Body:**
```json
{
  "puzzleId": "puzzle-001",
  "correct": true,
  "timeMs": 15000,
  "category": "fork"
}
```

---

### Games

#### `POST /api/games/save` 🔒
Save a completed game (PGN + metadata).

#### `GET /api/games/history` 🔒
Get user's game history.

---

## Rate Limiting

- **Limit**: 300 requests per minute per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`
- **429 Response**: `{ "error": "Too many requests, please try again later." }`

## Security Headers

All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'`

## CORS

Allowed origins:
- `http://localhost:3105`
- `http://localhost:5173`
- `https://chessos.pages.dev`
