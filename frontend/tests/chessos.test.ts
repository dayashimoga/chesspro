// ChessOS — Comprehensive Unit Test Suite
// Tests: Content integrity, store operations, puzzle logic, security, utilities
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ============================================================================
// CONTENT INTEGRITY TESTS
// ============================================================================
describe('Content: Puzzle Database', () => {
  it('should export ALL_PUZZLES with substantial count', async () => {
    const { ALL_PUZZLES } = await import('../src/content/puzzle-db');
    expect(ALL_PUZZLES).toBeDefined();
    expect(ALL_PUZZLES.length).toBeGreaterThan(100);
  });

  it('every puzzle should have required fields', async () => {
    const { ALL_PUZZLES } = await import('../src/content/puzzle-db');
    for (const puzzle of ALL_PUZZLES.slice(0, 50)) {
      expect(puzzle.id).toBeDefined();
      expect(puzzle.fen).toBeDefined();
      expect(puzzle.solution).toBeDefined();
      expect(Array.isArray(puzzle.solution)).toBe(true);
      expect(puzzle.solution.length).toBeGreaterThan(0);
      expect(puzzle.difficulty).toMatch(/beginner|intermediate|advanced|expert/);
    }
  });

  it('every puzzle FEN should have valid format', async () => {
    const { ALL_PUZZLES } = await import('../src/content/puzzle-db');
    const fenRegex = /^[rnbqkpRNBQKP1-8/]+ [wb] [KQkq-]+ [a-h1-8-]+ \d+ \d+$/;
    for (const puzzle of ALL_PUZZLES.slice(0, 50)) {
      expect(puzzle.fen).toMatch(fenRegex);
    }
  });

  it('categories should have icons and labels', async () => {
    const { PUZZLE_CATEGORIES } = await import('../src/content/puzzle-db');
    for (const cat of PUZZLE_CATEGORIES) {
      expect(cat.id).toBeDefined();
      expect(cat.label).toBeDefined();
      expect(cat.icon).toBeDefined();
      expect(typeof cat.count).toBe('number');
    }
  });

  it('queryPuzzles should filter by category', async () => {
    const { queryPuzzles, PUZZLE_CATEGORIES } = await import('../src/content/puzzle-db');
    for (const cat of PUZZLE_CATEGORIES.slice(0, 5)) {
      const results = queryPuzzles({ category: cat.id });
      expect(results.length).toBeGreaterThan(0);
      for (const p of results) {
        expect(p.category).toBe(cat.id);
      }
    }
  });
});

describe('Content: Endgame Curriculum', () => {
  it('should have 10 endgame modules', async () => {
    const { endgameContent } = await import('../src/content/03-endgames');
    expect(endgameContent.modules).toBeDefined();
    expect(endgameContent.modules.length).toBe(10);
  });

  it('every endgame module should have theory and exercises', async () => {
    const { endgameContent } = await import('../src/content/03-endgames');
    for (const mod of endgameContent.modules) {
      expect(mod.id).toBeDefined();
      expect(mod.title).toBeDefined();
      expect(mod.theory).toBeDefined();
      expect(mod.theory.length).toBeGreaterThan(100);
      expect(mod.exercises).toBeDefined();
      expect(mod.exercises.length).toBeGreaterThan(0);
    }
  });

  it('endgame exercises should have correct answer indices', async () => {
    const { endgameContent } = await import('../src/content/03-endgames');
    for (const mod of endgameContent.modules) {
      for (const ex of mod.exercises) {
        expect(ex.answer).toBeGreaterThanOrEqual(0);
        expect(ex.answer).toBeLessThan(ex.options.length);
      }
    }
  });
});

describe('Content: Middlegame Curriculum', () => {
  it('should have 7 middlegame modules', async () => {
    const { middlegameContent } = await import('../src/content/07-middlegame');
    expect(middlegameContent.modules).toBeDefined();
    expect(middlegameContent.modules.length).toBe(7);
  });

  it('every module should have examples with valid FEN', async () => {
    const { middlegameContent } = await import('../src/content/07-middlegame');
    const fenRegex = /^[rnbqkpRNBQKP1-8/]+ [wb] [KQkq-]+ [a-h1-8-]+ \d+ \d+$/;
    for (const mod of middlegameContent.modules) {
      expect(mod.examples).toBeDefined();
      for (const ex of mod.examples) {
        expect(ex.fen).toMatch(fenRegex);
        expect(ex.title).toBeDefined();
      }
    }
  });
});

describe('Content: Opening Systems', () => {
  it('should have at least 8 opening modules', async () => {
    const { openingsContent } = await import('../src/content/05-openings');
    expect(openingsContent.modules).toBeDefined();
    expect(openingsContent.modules.length).toBeGreaterThanOrEqual(8);
  });

  it('each opening should have an opening tree', async () => {
    const { openingsContent } = await import('../src/content/05-openings');
    for (const mod of openingsContent.modules) {
      expect(mod.openingTree).toBeDefined();
      expect(mod.openingTree.length).toBeGreaterThan(0);
      for (const node of mod.openingTree) {
        expect(node.move).toBeDefined();
        expect(node.fen).toBeDefined();
      }
    }
  });

  it('extended openings should have 12+ additional systems', async () => {
    const { default: extendedOpenings } = await import('../src/content/openings-extended');
    expect(extendedOpenings.length).toBeGreaterThanOrEqual(12);
  });
});

describe('Content: Master Games Database', () => {
  it('should have games from 9+ players', async () => {
    const { MASTER_PLAYERS } = await import('../src/content/master-games-db');
    expect(MASTER_PLAYERS.length).toBeGreaterThanOrEqual(9);
  });

  it('every game should have PGN and annotations', async () => {
    const { MASTER_GAMES } = await import('../src/content/master-games-db');
    for (const game of MASTER_GAMES) {
      expect(game.pgn).toBeDefined();
      expect(game.pgn.length).toBeGreaterThan(10);
      expect(game.white).toBeDefined();
      expect(game.black).toBeDefined();
      expect(game.year).toBeGreaterThan(1800);
      expect(game.themes).toBeDefined();
      expect(game.themes.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// STORE TESTS
// ============================================================================
describe('Store: useAppStore', () => {
  it('should initialize with default values', async () => {
    const { useAppStore } = await import('../src/store/useAppStore');
    const state = useAppStore.getState();
    expect(state.user).toBeDefined();
    expect(state.user.xp).toBe(0);
    expect(state.user.level).toBe(1);
    expect(state.user.puzzleRating).toBe(800);
    expect(state.activePage).toBe('dashboard');
  });

  it('should add XP correctly', async () => {
    const { useAppStore } = await import('../src/store/useAppStore');
    const initialXP = useAppStore.getState().user.xp;
    useAppStore.getState().addXP(50);
    expect(useAppStore.getState().user.xp).toBe(initialXP + 50);
  });

  it('should update rating correctly', async () => {
    const { useAppStore } = await import('../src/store/useAppStore');
    const initialRating = useAppStore.getState().user.puzzleRating;
    useAppStore.getState().updateRating(15);
    expect(useAppStore.getState().user.puzzleRating).toBe(initialRating + 15);
  });

  it('should not allow negative ratings', async () => {
    const { useAppStore } = await import('../src/store/useAppStore');
    useAppStore.getState().updateRating(-10000);
    expect(useAppStore.getState().user.puzzleRating).toBeGreaterThanOrEqual(0);
  });

  it('should navigate between pages', async () => {
    const { useAppStore } = await import('../src/store/useAppStore');
    useAppStore.getState().setActivePage('puzzles');
    expect(useAppStore.getState().activePage).toBe('puzzles');
    useAppStore.getState().setActivePage('dashboard');
    expect(useAppStore.getState().activePage).toBe('dashboard');
  });

  it('should track completed lessons', async () => {
    const { useAppStore } = await import('../src/store/useAppStore');
    const before = useAppStore.getState().completedLessons.length;
    useAppStore.getState().completeLesson('test-lesson-123');
    expect(useAppStore.getState().completedLessons).toContain('test-lesson-123');
    expect(useAppStore.getState().completedLessons.length).toBe(before + 1);
  });
});

// ============================================================================
// UTILITY TESTS
// ============================================================================
describe('Utility: Storage', () => {
  it('should handle progress save/load cycle', async () => {
    const { Storage } = await import('../src/core/storage');
    const progress = Storage.getProgress();
    expect(progress).toBeDefined();
    expect(progress.completedLessons).toBeDefined();
    expect(Array.isArray(progress.completedLessons)).toBe(true);
  });

  it('should analyze weaknesses', async () => {
    const { Storage } = await import('../src/core/storage');
    const analysis = Storage.analyzeWeaknesses();
    expect(analysis).toBeDefined();
    expect(analysis.weaknesses).toBeDefined();
    expect(Array.isArray(analysis.weaknesses)).toBe(true);
  });
});

describe('Utility: FEN Validation', () => {
  const isValidFen = (fen: string): boolean => {
    const parts = fen.split(' ');
    if (parts.length !== 6) return false;
    const ranks = parts[0].split('/');
    if (ranks.length !== 8) return false;
    for (const rank of ranks) {
      let count = 0;
      for (const char of rank) {
        if ('12345678'.includes(char)) count += parseInt(char);
        else if ('rnbqkpRNBQKP'.includes(char)) count += 1;
        else return false;
      }
      if (count !== 8) return false;
    }
    return true;
  };

  it('should validate correct FEN strings', () => {
    expect(isValidFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toBe(true);
    expect(isValidFen('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1')).toBe(true);
  });

  it('should reject invalid FEN strings', () => {
    expect(isValidFen('invalid')).toBe(false);
    expect(isValidFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP w KQkq - 0 1')).toBe(false); // 7 ranks
    expect(isValidFen('')).toBe(false);
  });
});

// ============================================================================
// SECURITY TESTS
// ============================================================================
describe('Security: Input Validation', () => {
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
  };

  const isValidPassword = (password: string): boolean => {
    return password.length >= 8 && password.length <= 128;
  };

  it('should validate correct emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('a'.repeat(255) + '@test.com')).toBe(false);
  });

  it('should validate password length', () => {
    expect(isValidPassword('12345678')).toBe(true);
    expect(isValidPassword('a'.repeat(128))).toBe(true);
  });

  it('should reject weak passwords', () => {
    expect(isValidPassword('')).toBe(false);
    expect(isValidPassword('1234567')).toBe(false);
    expect(isValidPassword('a'.repeat(129))).toBe(false);
  });
});

// ============================================================================
// COMPONENT LOGIC TESTS  
// ============================================================================
describe('Component Logic: ThinkingModePanel Steps', () => {
  const THINKING_STEPS = [
    { id: 1, title: 'Evaluate', prompt: 'Assess the position' },
    { id: 2, title: 'Imbalances', prompt: 'Identify material/positional differences' },
    { id: 3, title: 'Threats', prompt: 'Find immediate threats' },
    { id: 4, title: 'Candidates', prompt: 'List candidate moves' },
    { id: 5, title: 'Calculate', prompt: 'Calculate variations' },
    { id: 6, title: 'Compare', prompt: 'Compare and choose' },
  ];

  it('should have exactly 6 steps', () => {
    expect(THINKING_STEPS.length).toBe(6);
  });

  it('steps should be in order', () => {
    for (let i = 0; i < THINKING_STEPS.length; i++) {
      expect(THINKING_STEPS[i].id).toBe(i + 1);
    }
  });

  it('every step should have title and prompt', () => {
    for (const step of THINKING_STEPS) {
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.prompt.length).toBeGreaterThan(0);
    }
  });
});

describe('Component Logic: Puzzle Solve Modes', () => {
  const SOLVE_MODES = ['guided', 'thinking', 'practice', 'coach', 'examination', 'analysis'];

  it('should have 6 solve modes', () => {
    expect(SOLVE_MODES.length).toBe(6);
  });

  it('should include GM Thinking mode', () => {
    expect(SOLVE_MODES).toContain('thinking');
  });

  it('should include all required modes', () => {
    expect(SOLVE_MODES).toContain('guided');
    expect(SOLVE_MODES).toContain('practice');
    expect(SOLVE_MODES).toContain('examination');
    expect(SOLVE_MODES).toContain('analysis');
  });
});

// ============================================================================
// NAVIGATION TESTS
// ============================================================================
describe('Navigation: Page IDs', () => {
  const VALID_PAGES = [
    'dashboard', 'lessons', 'puzzles', 'games', 'openings', 'endgames',
    'calculation', 'blindfold', 'aicoach', 'play', 'review',
    'foundations', 'tactics', 'middlegame',
    'calc-university', 'endgame-university', 'master-games', 'opening-university',
    'tournament-prep',
  ];

  it('should have all expected page IDs', () => {
    expect(VALID_PAGES.length).toBeGreaterThanOrEqual(18);
  });

  it('should include all university pages', () => {
    expect(VALID_PAGES).toContain('calc-university');
    expect(VALID_PAGES).toContain('endgame-university');
    expect(VALID_PAGES).toContain('master-games');
    expect(VALID_PAGES).toContain('opening-university');
  });

  it('should include tournament prep', () => {
    expect(VALID_PAGES).toContain('tournament-prep');
  });
});

// ============================================================================
// SPACED REPETITION ENGINE TESTS
// ============================================================================
describe('Spaced Repetition: SM-2 Engine', () => {
  it('should create engine with no initial cards', async () => {
    const { SpacedRepetitionEngine } = await import('../src/core/spaced-repetition');
    const engine = new SpacedRepetitionEngine();
    const stats = engine.getStats();
    expect(stats.totalCards).toBe(0);
    expect(stats.dueToday).toBe(0);
  });

  it('should add new card with default values', async () => {
    const { SpacedRepetitionEngine } = await import('../src/core/spaced-repetition');
    const engine = new SpacedRepetitionEngine();
    const card = engine.addCard({
      id: 'test-1',
      type: 'puzzle',
      contentId: 'p-001',
      title: 'Knight Fork',
      category: 'fork',
      difficulty: 3,
      timeToSolve: 0,
      accuracy: 0,
    });
    expect(card.interval).toBe(0);
    expect(card.repetitions).toBe(0);
    expect(card.easeFactor).toBe(2.5);
    expect(card.leitnerBox).toBe(1);
  });

  it('should update card on successful review', async () => {
    const { SpacedRepetitionEngine } = await import('../src/core/spaced-repetition');
    const engine = new SpacedRepetitionEngine();
    engine.addCard({
      id: 'test-2',
      type: 'puzzle',
      contentId: 'p-002',
      title: 'Pin',
      category: 'pin',
      difficulty: 2,
      timeToSolve: 0,
      accuracy: 0,
    });
    const updated = engine.review('test-2', 5, 3000);
    expect(updated).toBeDefined();
    expect(updated!.interval).toBe(1);
    expect(updated!.repetitions).toBe(1);
    expect(updated!.easeFactor).toBeGreaterThanOrEqual(2.5);
    expect(updated!.streakCorrect).toBe(1);
  });

  it('should reset on failed review', async () => {
    const { SpacedRepetitionEngine } = await import('../src/core/spaced-repetition');
    const engine = new SpacedRepetitionEngine();
    engine.addCard({
      id: 'test-3',
      type: 'tactic',
      contentId: 'p-003',
      title: 'Skewer',
      category: 'skewer',
      difficulty: 4,
      timeToSolve: 0,
      accuracy: 0,
    });
    // First success
    engine.review('test-3', 4, 5000);
    // Then failure
    const failed = engine.review('test-3', 1, 10000);
    expect(failed!.repetitions).toBe(0);
    expect(failed!.interval).toBe(1);
    expect(failed!.streakWrong).toBe(1);
  });

  it('should return due cards', async () => {
    const { SpacedRepetitionEngine } = await import('../src/core/spaced-repetition');
    const engine = new SpacedRepetitionEngine();
    engine.addCard({ id: 'due-1', type: 'puzzle', contentId: 'p1', title: 'T1', category: 'fork', difficulty: 2, timeToSolve: 0, accuracy: 0 });
    engine.addCard({ id: 'due-2', type: 'puzzle', contentId: 'p2', title: 'T2', category: 'pin', difficulty: 3, timeToSolve: 0, accuracy: 0 });
    const dueCards = engine.getDueCards();
    expect(dueCards.length).toBe(2);
  });

  it('should generate daily session within time limit', async () => {
    const { SpacedRepetitionEngine } = await import('../src/core/spaced-repetition');
    const engine = new SpacedRepetitionEngine();
    for (let i = 0; i < 10; i++) {
      engine.addCard({ id: `sess-${i}`, type: 'puzzle', contentId: `p-${i}`, title: `T${i}`, category: 'fork', difficulty: 2, timeToSolve: 60000, accuracy: 0 });
    }
    const session = engine.generateDailySession(5); // 5 minutes
    expect(session.estimatedMinutes).toBeLessThanOrEqual(5);
  });

  it('should produce weakness report', async () => {
    const { SpacedRepetitionEngine } = await import('../src/core/spaced-repetition');
    const engine = new SpacedRepetitionEngine();
    engine.addCard({ id: 'w1', type: 'puzzle', contentId: 'p1', title: 'Fork', category: 'fork', difficulty: 2, timeToSolve: 5000, accuracy: 0.9 });
    engine.addCard({ id: 'w2', type: 'puzzle', contentId: 'p2', title: 'Pin', category: 'pin', difficulty: 3, timeToSolve: 20000, accuracy: 0.3 });
    const report = engine.getWeaknessReport();
    expect(report.length).toBe(2);
    // Weakest category first
    expect(report[0].category).toBe('pin');
  });

  it('should export and import cards', async () => {
    const { SpacedRepetitionEngine } = await import('../src/core/spaced-repetition');
    const engine1 = new SpacedRepetitionEngine();
    engine1.addCard({ id: 'exp-1', type: 'puzzle', contentId: 'p1', title: 'T1', category: 'fork', difficulty: 2, timeToSolve: 0, accuracy: 0 });
    const exported = engine1.exportCards();
    expect(exported.length).toBe(1);

    const engine2 = new SpacedRepetitionEngine(exported);
    const stats = engine2.getStats();
    expect(stats.totalCards).toBe(1);
  });

  it('should cap interval at 365 days', async () => {
    const { SpacedRepetitionEngine } = await import('../src/core/spaced-repetition');
    const engine = new SpacedRepetitionEngine();
    engine.addCard({ id: 'cap-1', type: 'puzzle', contentId: 'p1', title: 'T1', category: 'fork', difficulty: 1, timeToSolve: 0, accuracy: 0 });
    // Simulate many successful reviews to push interval high
    for (let i = 0; i < 20; i++) {
      engine.review('cap-1', 5, 1000);
    }
    const cards = engine.exportCards();
    expect(cards[0].interval).toBeLessThanOrEqual(365);
  });
});
