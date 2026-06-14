// ChessOS — Storage & Spaced Repetition System

const STORAGE_PREFIX = 'chessos_';

export class Storage {
  // Basic get/set
  static get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage full or unavailable:', e);
    }
  }

  static remove(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
  }

  // Progress tracking
  static getProgress() {
    return this.get('progress', {
      completedLessons: [],
      puzzlesSolved: 0,
      puzzlesAttempted: 0,
      puzzleRating: 800,
      totalStudyMinutes: 0,
      streak: 0,
      lastStudyDate: null,
      moduleProgress: {},
      openingsMastered: [],
      gamesAnalyzed: 0,
      assessmentScores: {},
      startDate: new Date().toISOString()
    });
  }

  static updateProgress(updates) {
    const progress = this.getProgress();
    Object.assign(progress, updates);
    this.set('progress', progress);
    return progress;
  }

  static completeLesson(lessonId) {
    const progress = this.getProgress();
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }
    this.set('progress', progress);
    return progress;
  }

  static getModuleProgress(moduleId) {
    const progress = this.getProgress();
    return progress.moduleProgress[moduleId] || { completed: 0, total: 0, score: 0 };
  }

  static updateModuleProgress(moduleId, data) {
    const progress = this.getProgress();
    progress.moduleProgress[moduleId] = {
      ...(progress.moduleProgress[moduleId] || {}),
      ...data
    };
    this.set('progress', progress);
  }

  // Puzzle stats
  static recordPuzzleAttempt(correct, ratingChange = 0) {
    const progress = this.getProgress();
    progress.puzzlesAttempted++;
    if (correct) progress.puzzlesSolved++;
    progress.puzzleRating = Math.max(100, Math.round(progress.puzzleRating + ratingChange));
    this.set('progress', progress);
    return progress;
  }

  // Streak
  static updateStreak() {
    const progress = this.getProgress();
    const today = new Date().toDateString();
    const lastDate = progress.lastStudyDate;
    
    if (lastDate === today) return progress;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate === yesterday.toDateString()) {
      progress.streak++;
    } else if (lastDate !== today) {
      progress.streak = 1;
    }
    
    progress.lastStudyDate = today;
    this.set('progress', progress);
    return progress;
  }

  // Settings
  static getSettings() {
    return this.get('settings', {
      boardTheme: 'classic',
      pieceSet: 'standard',
      boardFlipped: false,
      soundEnabled: true,
      autoPromote: true,
      showCoordinates: true,
      showLegalMoves: true,
      animationSpeed: 'normal',
      difficulty: 'intermediate'
    });
  }

  static updateSettings(updates) {
    const settings = this.getSettings();
    Object.assign(settings, updates);
    this.set('settings', settings);
    return settings;
  }
}

// SM-2 Spaced Repetition Algorithm
export class SpacedRepetition {
  static getCards() {
    return Storage.get('srs_cards', []);
  }

  static addCard(card) {
    const cards = this.getCards();
    const existing = cards.find(c => c.id === card.id);
    if (!existing) {
      cards.push({
        id: card.id,
        front: card.front,
        back: card.back,
        category: card.category || 'general',
        fen: card.fen || null,
        interval: 1,
        repetition: 0,
        easeFactor: 2.5,
        nextReview: Date.now(),
        created: Date.now()
      });
      Storage.set('srs_cards', cards);
    }
    return cards;
  }

  static reviewCard(cardId, quality) {
    // quality: 0-5 (0=complete fail, 5=perfect recall)
    const cards = this.getCards();
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    if (quality >= 3) {
      if (card.repetition === 0) {
        card.interval = 1;
      } else if (card.repetition === 1) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.easeFactor);
      }
      card.repetition++;
    } else {
      card.repetition = 0;
      card.interval = 1;
    }

    card.easeFactor = Math.max(1.3,
      card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    card.nextReview = Date.now() + card.interval * 24 * 60 * 60 * 1000;
    Storage.set('srs_cards', cards);
    return card;
  }

  static getDueCards(limit = 20) {
    const cards = this.getCards();
    const now = Date.now();
    return cards
      .filter(c => c.nextReview <= now)
      .sort((a, b) => a.nextReview - b.nextReview)
      .slice(0, limit);
  }

  static getStats() {
    const cards = this.getCards();
    const now = Date.now();
    return {
      total: cards.length,
      due: cards.filter(c => c.nextReview <= now).length,
      learning: cards.filter(c => c.repetition < 2).length,
      mature: cards.filter(c => c.interval >= 21).length,
      categories: [...new Set(cards.map(c => c.category))]
    };
  }

  // Auto-generate cards from content
  static generateTacticsCards(puzzles) {
    for (const puzzle of puzzles) {
      this.addCard({
        id: `tactic_${puzzle.id}`,
        front: `Find the best move\nTheme: ${puzzle.theme}`,
        back: `${puzzle.solution}\n${puzzle.explanation}`,
        category: 'tactics',
        fen: puzzle.fen
      });
    }
  }
}

export default Storage;
