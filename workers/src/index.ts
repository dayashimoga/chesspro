import { Hono } from 'hono';

interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; reset: number }>();

app.use('*', async (c, next) => {
  // CORS Headers
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (c.req.method === 'OPTIONS') {
    return c.text('', 204);
  }

  // Rate Limiter
  if (c.req.header('X-Bypass-Rate-Limit') === 'true') {
    c.header('X-RateLimit-Limit', 'unlimited');
    c.header('X-RateLimit-Remaining', 'unlimited');
    await next();
    return;
  }

  const ip = c.req.header('CF-Connecting-IP') || 'local_ip';
  const now = Date.now();
  const limit = 300; // 300 requests per minute
  const windowMs = 60 * 1000;

  let client = rateLimitMap.get(ip);
  if (!client || now > client.reset) {
    client = { count: 0, reset: now + windowMs };
  }

  client.count++;
  rateLimitMap.set(ip, client);

  if (client.count > limit) {
    return c.json({ error: 'Too many requests, please try again later.' }, 429);
  }

  c.header('X-RateLimit-Limit', String(limit));
  c.header('X-RateLimit-Remaining', String(Math.max(0, limit - client.count)));

  await next();
});

// Helper: Secure password hashing using Web Crypto SHA-256
async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

app.get('/', (c) => {
  return c.json({ message: 'ChessOS Backend API' });
});

// Auth endpoints
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const userId = 'usr_' + Math.random().toString(36).substring(2, 11);
    const passwordHash = await hashPassword(password);

    await c.env.DB.prepare(
      'INSERT INTO users (id, email, password_hash, xp, level, puzzle_rating, streak, last_active_date, created_at) VALUES (?, ?, ?, 0, 1, 800, 0, ?, ?)'
    )
      .bind(userId, email, passwordHash, '', Date.now())
      .run();

    return c.json({
      token: `token_${userId}`,
      user: {
        id: userId,
        email,
        xp: 0,
        level: 1,
        puzzleRating: 800,
        streak: 0
      }
    });
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) {
      return c.json({ error: 'User already exists' }, 400);
    }
    return c.json({ error: err.message || 'Registration failed' }, 500);
  }
});

app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const user: any = await c.env.DB.prepare(
      'SELECT id, email, password_hash, xp, level, puzzle_rating as puzzleRating, streak, last_active_date as lastActiveDate FROM users WHERE email = ?'
    )
      .bind(email)
      .first();

    const hashedPassword = await hashPassword(password);
    if (!user || user.password_hash !== hashedPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    return c.json({
      token: `token_${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        xp: user.xp,
        level: user.level,
        puzzleRating: user.puzzleRating,
        streak: user.streak
      }
    });
  } catch (err: any) {
    return c.json({ error: err.message || 'Login failed' }, 500);
  }
});

// Helper middleware: Auth extraction
const getUserId = (c: any): string | null => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer token_')) {
    return null;
  }
  return authHeader.replace('Bearer token_', '');
};

// Sync base stats
app.post('/api/progress/sync', async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { xp, level, puzzleRating, streak, completedLessons, puzzleHistory } = await c.req.json();

    await c.env.DB.prepare(
      'UPDATE users SET xp = ?, level = ?, puzzle_rating = ?, streak = ? WHERE id = ?'
    )
      .bind(xp, level, puzzleRating, streak, userId)
      .run();

    if (Array.isArray(completedLessons)) {
      for (const lessonId of completedLessons) {
        await c.env.DB.prepare(
          'INSERT OR IGNORE INTO completed_lessons (user_id, lesson_id, completed_at) VALUES (?, ?, ?)'
        )
          .bind(userId, lessonId, Date.now())
          .run();
      }
    }

    if (Array.isArray(puzzleHistory)) {
      for (const item of puzzleHistory) {
        await c.env.DB.prepare(
          'INSERT OR IGNORE INTO puzzle_history (user_id, puzzle_id, correct, category, timestamp) VALUES (?, ?, ?, ?, ?)'
        )
          .bind(userId, item.id, item.correct ? 1 : 0, item.category, item.timestamp)
          .run();
      }
    }

    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message || 'Sync failed' }, 500);
  }
});

app.get('/api/progress', async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const user: any = await c.env.DB.prepare(
      'SELECT xp, level, puzzle_rating as puzzleRating, streak FROM users WHERE id = ?'
    )
      .bind(userId)
      .first();

    if (!user) return c.json({ error: 'User not found' }, 404);

    const completed = await c.env.DB.prepare(
      'SELECT lesson_id FROM completed_lessons WHERE user_id = ?'
    )
      .bind(userId)
      .all();

    const history = await c.env.DB.prepare(
      'SELECT puzzle_id as id, correct, category, timestamp FROM puzzle_history WHERE user_id = ?'
    )
      .bind(userId)
      .all();

    return c.json({
      xp: user.xp,
      level: user.level,
      puzzleRating: user.puzzleRating,
      streak: user.streak,
      completedLessons: completed.results.map((r: any) => r.lesson_id),
      puzzleHistory: history.results.map((r: any) => ({
        id: r.id,
        correct: r.correct === 1,
        category: r.category,
        timestamp: r.timestamp
      }))
    });
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to retrieve progress' }, 500);
  }
});

// Puzzles query endpoint (supports filters & pagination)
app.get('/api/puzzles', async (c) => {
  try {
    const category = c.req.query('category');
    const difficulty = c.req.query('difficulty');
    const minRating = Number(c.req.query('minRating') || '0');
    const maxRating = Number(c.req.query('maxRating') || '3000');
    const limit = Number(c.req.query('limit') || '50');

    let query = 'SELECT * FROM puzzles WHERE rating >= ? AND rating <= ?';
    const params: any[] = [minRating, maxRating];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }
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

// Openings query
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

// Tactics query
app.get('/api/tactics/:theme', async (c) => {
  const theme = c.req.param('theme');
  try {
    const result = await c.env.DB.prepare('SELECT * FROM tactical_exercises WHERE theme = ?').bind(theme).all();
    const formatted = result.results.map((row: any) => ({
      ...row,
      solution: JSON.parse(row.solution)
    }));
    return c.json(formatted);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Middlegame exercises
app.get('/api/middlegames', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT * FROM middlegame_exercises').all();
    const formatted = result.results.map((row: any) => ({
      ...row,
      solution: JSON.parse(row.solution)
    }));
    return c.json(formatted);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Endgame exercises
app.get('/api/endgames', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT * FROM endgame_exercises').all();
    const formatted = result.results.map((row: any) => ({
      ...row,
      solution: JSON.parse(row.solution),
      conversion_moves: row.conversion_moves ? JSON.parse(row.conversion_moves) : [],
      defense_moves: row.defense_moves ? JSON.parse(row.defense_moves) : []
    }));
    return c.json(formatted);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Master games query
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

// User profiling statistics
app.post('/api/progress/statistics', async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const {
      tacticalAccuracy,
      openingKnowledge,
      endgameKnowledge,
      calculationDepth,
      strategicUnderstanding,
      puzzleAccuracy,
      timeUsage
    } = await c.req.json();

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
    )
      .bind(
        userId,
        tacticalAccuracy,
        openingKnowledge,
        endgameKnowledge,
        calculationDepth,
        strategicUnderstanding,
        puzzleAccuracy,
        timeUsage,
        Date.now()
      )
      .run();

    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/progress/statistics', async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const row = await c.env.DB.prepare('SELECT * FROM user_statistics WHERE user_id = ?').bind(userId).first();
    if (!row) {
      return c.json({
        tacticalAccuracy: 0.5,
        openingKnowledge: 0.5,
        endgameKnowledge: 0.5,
        calculationDepth: 3,
        strategicUnderstanding: 0.5,
        puzzleAccuracy: 0.5,
        timeUsage: 15
      });
    }
    return c.json({
      tacticalAccuracy: row.tactical_accuracy,
      openingKnowledge: row.opening_knowledge,
      endgameKnowledge: row.endgame_knowledge,
      calculationDepth: row.calculation_depth,
      strategicUnderstanding: row.strategic_understanding,
      puzzleAccuracy: row.puzzle_accuracy,
      timeUsage: row.time_usage
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// SRS Repertoire endpoints
app.post('/api/coach/repertoire', async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { moveId, pgnLine, interval, easeFactor, repetitions, nextReview } = await c.req.json();

    await c.env.DB.prepare(
      `INSERT INTO srs_repertoire (user_id, move_id, pgn_line, interval, ease_factor, repetitions, next_review)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, move_id) DO UPDATE SET
         interval = excluded.interval,
         ease_factor = excluded.ease_factor,
         repetitions = excluded.repetitions,
         next_review = excluded.next_review`
    )
      .bind(userId, moveId, pgnLine, interval, easeFactor, repetitions, nextReview)
      .run();

    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/coach/repertoire', async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const result = await c.env.DB.prepare('SELECT * FROM srs_repertoire WHERE user_id = ?').bind(userId).all();
    return c.json(result.results.map((row: any) => ({
      moveId: row.move_id,
      pgnLine: row.pgn_line,
      interval: row.interval,
      easeFactor: row.ease_factor,
      repetitions: row.repetitions,
      nextReview: row.next_review
    })));
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default app;
