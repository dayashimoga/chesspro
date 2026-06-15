// ChessOS — Persistent Storage & Spaced Repetition System
const STORAGE_KEY = 'chessos_progress';
const SRS_KEY = 'chessos_srs';

export interface ProgressData {
  completedLessons: string[];
  puzzlesSolved: number;
  puzzlesAttempted: number;
  puzzleRating: number;
  streak: number;
  lastActiveDate: string;
  xp: number;
  level: number;
  achievements: string[];
  puzzleHistory: Array<{ id: string; correct: boolean; timestamp: number; category: string }>;
  weaknesses: string[];
  strengths: string[];
}

export interface SRSCard {
  id: string;
  front: string;
  back: string;
  category: string;
  fen?: string;
  interval: number; // days
  easeFactor: number;
  repetitions: number;
  nextReview: number; // timestamp
}

const createDefaultProgress = (): ProgressData => ({
  completedLessons: [],
  puzzlesSolved: 0,
  puzzlesAttempted: 0,
  puzzleRating: 800,
  streak: 0,
  lastActiveDate: '',
  xp: 0,
  level: 1,
  achievements: [],
  puzzleHistory: [],
  weaknesses: [],
  strengths: [],
});

export class Storage {
  static getProgress(): ProgressData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...createDefaultProgress(), ...JSON.parse(raw) };
    } catch { /* noop */ }
    return createDefaultProgress();
  }

  static saveProgress(data: Partial<ProgressData>): void {
    const current = this.getProgress();
    const merged = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }

  static completeLesson(lessonId: string): void {
    const p = this.getProgress();
    if (!p.completedLessons.includes(lessonId)) {
      p.completedLessons.push(lessonId);
      p.xp += 50;
      p.level = Math.floor(p.xp / 250) + 1;
      this.saveProgress(p);
    }
  }

  static recordPuzzleAttempt(puzzleId: string, correct: boolean, category: string): void {
    const p = this.getProgress();
    p.puzzlesAttempted++;
    if (correct) {
      p.puzzlesSolved++;
      p.puzzleRating = Math.min(3000, p.puzzleRating + Math.round(15 * (1 - p.puzzleRating / 3000)));
      p.xp += 15;
    } else {
      p.puzzleRating = Math.max(100, p.puzzleRating - 10);
    }
    p.level = Math.floor(p.xp / 250) + 1;
    p.puzzleHistory.push({ id: puzzleId, correct, timestamp: Date.now(), category });
    // Keep only last 500 entries
    if (p.puzzleHistory.length > 500) p.puzzleHistory = p.puzzleHistory.slice(-500);
    this.saveProgress(p);
  }

  static addXP(amount: number): void {
    const p = this.getProgress();
    p.xp += amount;
    p.level = Math.floor(p.xp / 250) + 1;
    this.saveProgress(p);
  }

  static updateStreak(): void {
    const p = this.getProgress();
    const today = new Date().toISOString().split('T')[0];
    if (p.lastActiveDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (p.lastActiveDate === yesterday) {
      p.streak++;
    } else if (p.lastActiveDate !== today) {
      p.streak = 1;
    }
    p.lastActiveDate = today;
    this.saveProgress(p);
  }

  static analyzeWeaknesses(): { strengths: string[]; weaknesses: string[] } {
    const p = this.getProgress();
    const catStats: Record<string, { solved: number; attempted: number }> = {};
    for (const entry of p.puzzleHistory.slice(-100)) {
      if (!catStats[entry.category]) catStats[entry.category] = { solved: 0, attempted: 0 };
      catStats[entry.category].attempted++;
      if (entry.correct) catStats[entry.category].solved++;
    }
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    for (const [cat, stats] of Object.entries(catStats)) {
      const accuracy = stats.attempted > 0 ? stats.solved / stats.attempted : 0;
      if (accuracy >= 0.7 && stats.attempted >= 3) strengths.push(cat);
      else if (accuracy < 0.5 && stats.attempted >= 3) weaknesses.push(cat);
    }
    if (p.completedLessons.length < 3) weaknesses.push('fundamentals');
    if (!p.completedLessons.some(l => l.startsWith('endgames'))) weaknesses.push('endgames');
    return { strengths, weaknesses };
  }
}

// SM-2 Spaced Repetition
export class SpacedRepetition {
  static getCards(): SRSCard[] {
    try {
      const raw = localStorage.getItem(SRS_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* noop */ }
    return [];
  }

  static saveCards(cards: SRSCard[]): void {
    localStorage.setItem(SRS_KEY, JSON.stringify(cards));
  }

  static addCard(card: Omit<SRSCard, 'interval' | 'easeFactor' | 'repetitions' | 'nextReview'>): void {
    const cards = this.getCards();
    if (cards.find(c => c.id === card.id)) return;
    cards.push({
      ...card,
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
      nextReview: Date.now(),
    });
    this.saveCards(cards);
  }

  static getDueCards(): SRSCard[] {
    const now = Date.now();
    return this.getCards().filter(c => c.nextReview <= now);
  }

  static getStats(): { total: number; due: number; mastered: number } {
    const cards = this.getCards();
    const now = Date.now();
    return {
      total: cards.length,
      due: cards.filter(c => c.nextReview <= now).length,
      mastered: cards.filter(c => c.repetitions >= 5).length,
    };
  }

  // SM-2 algorithm
  static reviewCard(cardId: string, quality: number): void {
    const cards = this.getCards();
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    if (quality < 3) {
      card.repetitions = 0;
      card.interval = 1;
    } else {
      if (card.repetitions === 0) card.interval = 1;
      else if (card.repetitions === 1) card.interval = 6;
      else card.interval = Math.round(card.interval * card.easeFactor);
      card.repetitions++;
    }

    card.easeFactor = Math.max(1.3,
      card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
    card.nextReview = Date.now() + card.interval * 86400000;
    this.saveCards(cards);
  }
}

export default Storage;
