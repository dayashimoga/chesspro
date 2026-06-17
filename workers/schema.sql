-- ChessOS — Cloudflare D1 Database Schema (v3.0)

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
  created_at INTEGER NOT NULL,
  last_modified INTEGER DEFAULT 0
);

-- Persistent sessions (replaces in-memory tokenStore)
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Completed lessons tracking
CREATE TABLE IF NOT EXISTS completed_lessons (
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at INTEGER NOT NULL,
  last_modified INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Puzzle history tracking
CREATE TABLE IF NOT EXISTS puzzle_history (
  user_id TEXT NOT NULL,
  puzzle_id TEXT NOT NULL,
  correct INTEGER NOT NULL,
  category TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  last_modified INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, puzzle_id, timestamp),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Puzzles table (10,000+)
CREATE TABLE IF NOT EXISTS puzzles (
  id TEXT PRIMARY KEY,
  fen TEXT NOT NULL,
  solution TEXT NOT NULL,
  category TEXT NOT NULL,
  theme TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  rating INTEGER NOT NULL,
  coach_notes TEXT NOT NULL,
  common_errors TEXT,
  alternatives TEXT
);

-- Opening exercises
CREATE TABLE IF NOT EXISTS opening_exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  moves TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  history TEXT,
  core_ideas TEXT,
  traps TEXT,
  model_games TEXT
);

-- Tactical exercises
CREATE TABLE IF NOT EXISTS tactical_exercises (
  id TEXT PRIMARY KEY,
  theme TEXT NOT NULL,
  fen TEXT NOT NULL,
  solution TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  rating INTEGER NOT NULL,
  coach_notes TEXT NOT NULL
);

-- Master games
CREATE TABLE IF NOT EXISTS master_games (
  id TEXT PRIMARY KEY,
  white TEXT NOT NULL,
  black TEXT NOT NULL,
  result TEXT NOT NULL,
  pgn TEXT NOT NULL,
  annotations TEXT,
  critical_moments TEXT,
  alternatives TEXT
);

-- Middlegame exercises
CREATE TABLE IF NOT EXISTS middlegame_exercises (
  id TEXT PRIMARY KEY,
  theme TEXT NOT NULL,
  fen TEXT NOT NULL,
  solution TEXT NOT NULL,
  description TEXT NOT NULL,
  plan TEXT NOT NULL,
  difficulty TEXT NOT NULL
);

-- Endgame exercises
CREATE TABLE IF NOT EXISTS endgame_exercises (
  id TEXT PRIMARY KEY,
  theme TEXT NOT NULL,
  fen TEXT NOT NULL,
  solution TEXT NOT NULL,
  description TEXT NOT NULL,
  conversion_moves TEXT,
  defense_moves TEXT,
  difficulty TEXT NOT NULL
);

-- User statistics for adaptive profiling
CREATE TABLE IF NOT EXISTS user_statistics (
  user_id TEXT PRIMARY KEY,
  tactical_accuracy REAL DEFAULT 0,
  opening_knowledge REAL DEFAULT 0,
  endgame_knowledge REAL DEFAULT 0,
  calculation_depth INTEGER DEFAULT 0,
  strategic_understanding REAL DEFAULT 0,
  puzzle_accuracy REAL DEFAULT 0,
  time_usage REAL DEFAULT 0,
  last_updated INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- SRS Repertoire Builder
CREATE TABLE IF NOT EXISTS srs_repertoire (
  user_id TEXT NOT NULL,
  move_id TEXT NOT NULL,
  pgn_line TEXT NOT NULL,
  interval INTEGER DEFAULT 1,
  ease_factor REAL DEFAULT 2.5,
  repetitions INTEGER DEFAULT 0,
  next_review INTEGER NOT NULL,
  PRIMARY KEY (user_id, move_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_completed_lessons_modified ON completed_lessons(last_modified);
CREATE INDEX IF NOT EXISTS idx_puzzle_history_modified ON puzzle_history(last_modified);
CREATE INDEX IF NOT EXISTS idx_puzzles_category ON puzzles(category);
CREATE INDEX IF NOT EXISTS idx_puzzles_difficulty ON puzzles(difficulty);
CREATE INDEX IF NOT EXISTS idx_puzzles_rating ON puzzles(rating);
