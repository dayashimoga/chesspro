import { Hono } from 'hono';

interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

// Enable CORS
app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (c.req.method === 'OPTIONS') {
    return c.text('', 204);
  }
  await next();
});

app.get('/', (c) => {
  return c.json({ message: 'ChessOS Backend API' });
});

// User register endpoint
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const userId = 'usr_' + Math.random().toString(36).substring(2, 11);
    const passwordHash = password; // In production use a library or crypto api to hash

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

// User login endpoint
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

    if (!user || user.password_hash !== password) {
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

// Sync progress endpoint
app.post('/api/progress/sync', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer token_')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const userId = authHeader.replace('Bearer token_', '');
  try {
    const { xp, level, puzzleRating, streak, completedLessons, puzzleHistory } = await c.req.json();

    // Update user base stats
    await c.env.DB.prepare(
      'UPDATE users SET xp = ?, level = ?, puzzle_rating = ?, streak = ? WHERE id = ?'
    )
      .bind(xp, level, puzzleRating, streak, userId)
      .run();

    // Sync completed lessons
    if (Array.isArray(completedLessons)) {
      for (const lessonId of completedLessons) {
        await c.env.DB.prepare(
          'INSERT OR IGNORE INTO completed_lessons (user_id, lesson_id, completed_at) VALUES (?, ?, ?)'
        )
          .bind(userId, lessonId, Date.now())
          .run();
      }
    }

    // Sync puzzle history
    if (Array.isArray(puzzleHistory)) {
      for (const historyItem of puzzleHistory) {
        await c.env.DB.prepare(
          'INSERT OR IGNORE INTO puzzle_history (user_id, puzzle_id, correct, category, timestamp) VALUES (?, ?, ?, ?, ?)'
        )
          .bind(userId, historyItem.id, historyItem.correct ? 1 : 0, historyItem.category, historyItem.timestamp)
          .run();
      }
    }

    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message || 'Sync failed' }, 500);
  }
});

// Get user progress endpoint
app.get('/api/progress', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer token_')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const userId = authHeader.replace('Bearer token_', '');
  try {
    const user: any = await c.env.DB.prepare(
      'SELECT xp, level, puzzle_rating as puzzleRating, streak FROM users WHERE id = ?'
    )
      .bind(userId)
      .first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const completedLessonsRows: any = await c.env.DB.prepare(
      'SELECT lesson_id FROM completed_lessons WHERE user_id = ?'
    )
      .bind(userId)
      .all();

    const puzzleHistoryRows: any = await c.env.DB.prepare(
      'SELECT puzzle_id as id, correct, category, timestamp FROM puzzle_history WHERE user_id = ?'
    )
      .bind(userId)
      .all();

    return c.json({
      xp: user.xp,
      level: user.level,
      puzzleRating: user.puzzleRating,
      streak: user.streak,
      completedLessons: completedLessonsRows.results.map((r: any) => r.lesson_id),
      puzzleHistory: puzzleHistoryRows.results.map((r: any) => ({
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

export default app;
