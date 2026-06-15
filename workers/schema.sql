-- ChessOS — Cloudflare D1 Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  puzzle_rating INTEGER DEFAULT 800,
  streak INTEGER DEFAULT 0,
  last_active_date TEXT DEFAULT '',
  created_at INTEGER NOT NULL
);

-- Completed lessons tracking
CREATE TABLE IF NOT EXISTS completed_lessons (
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Puzzle history tracking
CREATE TABLE IF NOT EXISTS puzzle_history (
  user_id TEXT NOT NULL,
  puzzle_id TEXT NOT NULL,
  correct INTEGER NOT NULL, -- 0 for false, 1 for true
  category TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  PRIMARY KEY (user_id, puzzle_id, timestamp),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
