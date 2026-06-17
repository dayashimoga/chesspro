import { Hono } from 'hono';

interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

// CORS: Allow all origins in development; restrict in production via env
app.use('*', async (c, next) => {
  const origin = c.req.header('Origin') || '*';
  c.header('Access-Control-Allow-Origin', origin);
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Credentials', 'true');

  // Security Headers
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (c.req.method === 'OPTIONS') {
    return c.text('', 204);
  }

  await next();
});

// ============================================================================
// Crypto Helpers
// ============================================================================

async function hashPassword(password: string, salt?: string): Promise<string> {
  if (!salt) {
    const saltBuffer = new Uint8Array(32);
    crypto.getRandomValues(saltBuffer);
    salt = Array.from(saltBuffer).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );

  const hash = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `pbkdf2:100000:${salt}:${hash}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash.startsWith('pbkdf2:')) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const legacyHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    return legacyHash === storedHash;
  }
  const [, , salt] = storedHash.split(':');
  const computed = await hashPassword(password, salt);
  return computed === storedHash;
}

function generateSecureToken(): string {
  const tokenBytes = new Uint8Array(48);
  crypto.getRandomValues(tokenBytes);
  return Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateUserId(): string {
  const idBytes = new Uint8Array(12);
  crypto.getRandomValues(idBytes);
  return 'usr_' + Array.from(idBytes).map(b => b.toString(36).padStart(2, '0')).join('').substring(0, 16);
}

// Input validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function isValidPassword(password: string): boolean {
  return typeof password === 'string' && password.length >= 8 && password.length <= 128;
}

// ============================================================================
// D1-backed Session Management
// ============================================================================

async function createSession(db: D1Database, userId: string): Promise<string> {
  const token = generateSecureToken();
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  await db.prepare(
    'INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)'
  ).bind(token, userId, expiresAt, Date.now()).run();
  return token;
}

async function getSessionUserId(db: D1Database, authHeader: string | undefined): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '');

  const session: any = await db.prepare(
    'SELECT user_id, expires_at FROM sessions WHERE token = ?'
  ).bind(token).first();

  if (!session) return null;
  if (Date.now() > session.expires_at) {
    // Clean up expired session
    await db.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return null;
  }
  return session.user_id;
}

// ============================================================================
// Routes
// ============================================================================

// Health check
app.get('/', (c) => c.json({ message: 'ChessOS Backend API', version: '3.0.0' }));

app.get('/api/health', (c) => c.json({
  status: 'ok',
  version: '3.0.0',
  timestamp: Date.now(),
}));

// ============================================================================
// Auth
// ============================================================================

app.post('/api/auth/register', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ error: 'Email and password are required' }, 400);
    if (!isValidEmail(email)) return c.json({ error: 'Invalid email format' }, 400);
    if (!isValidPassword(password)) return c.json({ error: 'Password must be 8-128 characters' }, 400);

    const userId = generateUserId();
    const passwordHash = await hashPassword(password);
    const now = Date.now();

    await c.env.DB.prepare(
      'INSERT INTO users (id, email, password_hash, xp, level, puzzle_rating, streak, last_active_date, created_at, last_modified) VALUES (?, ?, ?, 0, 1, 800, 0, ?, ?, ?)'
    ).bind(userId, email.toLowerCase().trim(), passwordHash, '', now, now).run();

    const token = await createSession(c.env.DB, userId);

    return c.json({
      token,
      user: { id: userId, email: email.toLowerCase().trim(), xp: 0, level: 1, puzzleRating: 800, streak: 0 }
    });
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) return c.json({ error: 'User already exists' }, 400);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ error: 'Email and password are required' }, 400);

    const user: any = await c.env.DB.prepare(
      'SELECT id, email, password_hash, xp, level, puzzle_rating as puzzleRating, streak FROM users WHERE email = ?'
    ).bind(email.toLowerCase().trim()).first();

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Upgrade legacy hash on login
    if (!user.password_hash.startsWith('pbkdf2:')) {
      const upgradedHash = await hashPassword(password);
      await c.env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(upgradedHash, user.id).run();
    }

    const token = await createSession(c.env.DB, user.id);

    return c.json({
      token,
      user: { id: user.id, email: user.email, xp: user.xp, level: user.level, puzzleRating: user.puzzleRating, streak: user.streak }
    });
  } catch {
    return c.json({ error: 'Login failed' }, 500);
  }
});

app.post('/api/auth/logout', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    await c.env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
  }
  return c.json({ success: true });
});

// Auth helper
const getUserId = async (c: any): Promise<string | null> => {
  return getSessionUserId(c.env.DB, c.req.header('Authorization'));
};

// ============================================================================
// Progress Sync (with conflict resolution via last_modified)
// ============================================================================

app.post('/api/progress/sync', async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { xp, level, puzzleRating, streak, completedLessons, puzzleHistory, lastSyncTimestamp } = await c.req.json();
    const now = Date.now();

    // Update user stats with last_modified
    await c.env.DB.prepare(
      'UPDATE users SET xp = MAX(xp, ?), level = MAX(level, ?), puzzle_rating = ?, streak = MAX(streak, ?), last_modified = ? WHERE id = ?'
    ).bind(xp || 0, level || 1, puzzleRating || 800, streak || 0, now, userId).run();

    // Batch insert completed lessons
    if (Array.isArray(completedLessons) && completedLessons.length > 0) {
      const stmts = completedLessons.map((lessonId: string) =>
        c.env.DB.prepare(
          'INSERT OR IGNORE INTO completed_lessons (user_id, lesson_id, completed_at, last_modified) VALUES (?, ?, ?, ?)'
        ).bind(userId, lessonId, now, now)
      );
      // D1 batch — executes all in a single roundtrip
      await c.env.DB.batch(stmts);
    }

    // Batch insert puzzle history
    if (Array.isArray(puzzleHistory) && puzzleHistory.length > 0) {
      const stmts = puzzleHistory.map((item: any) =>
        c.env.DB.prepare(
          'INSERT OR IGNORE INTO puzzle_history (user_id, puzzle_id, correct, category, timestamp, last_modified) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(userId, item.id, item.correct ? 1 : 0, item.category || '', item.timestamp || now, now)
      );
      await c.env.DB.batch(stmts);
    }

    return c.json({ success: true, syncTimestamp: now });
  } catch (err: any) {
    return c.json({ error: err.message || 'Sync failed' }, 500);
  }
});

app.get('/api/progress', async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const sinceParam = c.req.query('since');
    const since = sinceParam ? Number(sinceParam) : 0;

    const user: any = await c.env.DB.prepare(
      'SELECT xp, level, puzzle_rating as puzzleRating, streak FROM users WHERE id = ?'
    ).bind(userId).first();

    if (!user) return c.json({ error: 'User not found' }, 404);

    const completed = await c.env.DB.prepare(
      'SELECT lesson_id FROM completed_lessons WHERE user_id = ? AND last_modified > ?'
    ).bind(userId, since).all();

    const history = await c.env.DB.prepare(
      'SELECT puzzle_id as id, correct, category, timestamp FROM puzzle_history WHERE user_id = ? AND last_modified > ?'
    ).bind(userId, since).all();

    return c.json({
      xp: user.xp,
      level: user.level,
      puzzleRating: user.puzzleRating,
      streak: user.streak,
      completedLessons: completed.results.map((r: any) => r.lesson_id),
      puzzleHistory: history.results.map((r: any) => ({
        id: r.id, correct: r.correct === 1, category: r.category, timestamp: r.timestamp
      })),
      syncTimestamp: Date.now()
    });
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to retrieve progress' }, 500);
  }
});

// ============================================================================
// Puzzles
// ============================================================================

app.get('/api/puzzles', async (c) => {
  try {
    const category = c.req.query('category');
    const difficulty = c.req.query('difficulty');
    const minRating = Number(c.req.query('minRating') || '0');
    const maxRating = Number(c.req.query('maxRating') || '3000');
    const limit = Math.min(Number(c.req.query('limit') || '50'), 200);

    let query = 'SELECT * FROM puzzles WHERE rating >= ? AND rating <= ?';
    const params: any[] = [minRating, maxRating];

    if (category) { query += ' AND category = ?'; params.push(category); }
    if (difficulty) { query += ' AND difficulty = ?'; params.push(difficulty); }
    query += ' LIMIT ?';
    params.push(limit);

    const result = await c.env.DB.prepare(query).bind(...params).all();
    const formatted = result.results.map((row: any) => ({
      ...row,
      solution: JSON.parse(row.solution),
      commonErrors: row.common_errors ? JSON.parse(row.common_errors) : [],
      alternatives: row.alternatives ? JSON.parse(row.alternatives) : []
    }));
    return c.json(formatted);
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to retrieve puzzles' }, 500);
  }
});

app.get('/api/puzzles/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const row: any = await c.env.DB.prepare('SELECT * FROM puzzles WHERE id = ?').bind(id).first();
    if (!row) return c.json({ error: 'Puzzle not found' }, 404);
    return c.json({
      ...row,
      solution: JSON.parse(row.solution),
      commonErrors: row.common_errors ? JSON.parse(row.common_errors) : [],
      alternatives: row.alternatives ? JSON.parse(row.alternatives) : []
    });
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to retrieve puzzle' }, 500);
  }
});

// ============================================================================
// Openings
// ============================================================================

app.get('/api/openings', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT id, name, category, difficulty FROM opening_exercises').all();
    return c.json(result.results);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/openings/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const row: any = await c.env.DB.prepare('SELECT * FROM opening_exercises WHERE id = ?').bind(id).first();
    if (!row) return c.json({ error: 'Opening not found' }, 404);
    return c.json({
      ...row,
      moves: JSON.parse(row.moves),
      model_games: row.model_games ? JSON.parse(row.model_games) : []
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ============================================================================
// Tactics / Middlegames / Endgames / Master Games
// ============================================================================

app.get('/api/tactics/:theme', async (c) => {
  const theme = c.req.param('theme');
  try {
    const result = await c.env.DB.prepare('SELECT * FROM tactical_exercises WHERE theme = ?').bind(theme).all();
    return c.json(result.results.map((row: any) => ({ ...row, solution: JSON.parse(row.solution) })));
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/middlegames', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT * FROM middlegame_exercises').all();
    return c.json(result.results.map((row: any) => ({ ...row, solution: JSON.parse(row.solution) })));
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/endgames', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT * FROM endgame_exercises').all();
    return c.json(result.results.map((row: any) => ({
      ...row,
      solution: JSON.parse(row.solution),
      conversion_moves: row.conversion_moves ? JSON.parse(row.conversion_moves) : [],
      defense_moves: row.defense_moves ? JSON.parse(row.defense_moves) : []
    })));
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/master-games', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT id, white, black, result FROM master_games').all();
    return c.json(result.results);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/master-games/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const row: any = await c.env.DB.prepare('SELECT * FROM master_games WHERE id = ?').bind(id).first();
    if (!row) return c.json({ error: 'Master game not found' }, 404);
    return c.json({
      ...row,
      annotations: row.annotations ? JSON.parse(row.annotations) : {},
      critical_moments: row.critical_moments ? JSON.parse(row.critical_moments) : [],
      alternatives: row.alternatives ? JSON.parse(row.alternatives) : []
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ============================================================================
// User Statistics & Coach
// ============================================================================

app.post('/api/progress/statistics', async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { tacticalAccuracy, openingKnowledge, endgameKnowledge, calculationDepth, strategicUnderstanding, puzzleAccuracy, timeUsage } = await c.req.json();

    await c.env.DB.prepare(
      `INSERT INTO user_statistics (user_id, tactical_accuracy, opening_knowledge, endgame_knowledge, calculation_depth, strategic_understanding, puzzle_accuracy, time_usage, last_updated)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         tactical_accuracy = excluded.tactical_accuracy,
         opening_knowledge = excluded.opening_knowledge,
         endgame_knowledge = excluded.endgame_knowledge,
         calculation_depth = excluded.calculation_depth,
         strategic_understanding = excluded.strategic_understanding,
         puzzle_accuracy = excluded.puzzle_accuracy,
         time_usage = excluded.time_usage,
         last_updated = excluded.last_updated`
    ).bind(userId, tacticalAccuracy, openingKnowledge, endgameKnowledge, calculationDepth, strategicUnderstanding, puzzleAccuracy, timeUsage, Date.now()).run();

    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/progress/statistics', async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const row: any = await c.env.DB.prepare('SELECT * FROM user_statistics WHERE user_id = ?').bind(userId).first();
    if (!row) {
      return c.json({
        tacticalAccuracy: 0.5, openingKnowledge: 0.5, endgameKnowledge: 0.5,
        calculationDepth: 3, strategicUnderstanding: 0.5, puzzleAccuracy: 0.5, timeUsage: 15
      });
    }
    return c.json({
      tacticalAccuracy: row.tactical_accuracy, openingKnowledge: row.opening_knowledge,
      endgameKnowledge: row.endgame_knowledge, calculationDepth: row.calculation_depth,
      strategicUnderstanding: row.strategic_understanding, puzzleAccuracy: row.puzzle_accuracy,
      timeUsage: row.time_usage
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// SRS Repertoire
app.post('/api/coach/repertoire', async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { moveId, pgnLine, interval, easeFactor, repetitions, nextReview } = await c.req.json();
    await c.env.DB.prepare(
      `INSERT INTO srs_repertoire (user_id, move_id, pgn_line, interval, ease_factor, repetitions, next_review)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, move_id) DO UPDATE SET
         interval = excluded.interval, ease_factor = excluded.ease_factor,
         repetitions = excluded.repetitions, next_review = excluded.next_review`
    ).bind(userId, moveId, pgnLine, interval, easeFactor, repetitions, nextReview).run();
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/coach/repertoire', async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const result = await c.env.DB.prepare('SELECT * FROM srs_repertoire WHERE user_id = ?').bind(userId).all();
    return c.json(result.results.map((row: any) => ({
      moveId: row.move_id, pgnLine: row.pgn_line, interval: row.interval,
      easeFactor: row.ease_factor, repetitions: row.repetitions, nextReview: row.next_review
    })));
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default app;
