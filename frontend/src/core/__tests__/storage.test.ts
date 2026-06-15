// ChessOS — Storage & Spaced Repetition Tests
import { describe, it, expect, beforeEach } from 'vitest';
import { Storage, SpacedRepetition } from '../storage';

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getProgress', () => {
    it('should return default progress when nothing stored', () => {
      const p = Storage.getProgress();
      expect(p.xp).toBe(0);
      expect(p.level).toBe(1);
      expect(p.puzzleRating).toBe(800);
      expect(p.streak).toBe(0);
      expect(p.completedLessons).toEqual([]);
      expect(p.puzzleHistory).toEqual([]);
    });

    it('should return stored progress', () => {
      Storage.saveProgress({ xp: 500, level: 3 });
      const p = Storage.getProgress();
      expect(p.xp).toBe(500);
      expect(p.level).toBe(3);
    });
  });

  describe('saveProgress', () => {
    it('should merge with existing progress', () => {
      Storage.saveProgress({ xp: 100 });
      Storage.saveProgress({ puzzleRating: 1200 });
      const p = Storage.getProgress();
      expect(p.xp).toBe(100);
      expect(p.puzzleRating).toBe(1200);
    });
  });

  describe('completeLesson', () => {
    it('should add lesson and award XP', () => {
      Storage.completeLesson('foundations-rules');
      const p = Storage.getProgress();
      expect(p.completedLessons).toContain('foundations-rules');
      expect(p.xp).toBe(50);
      expect(p.level).toBe(1);
    });

    it('should not duplicate completed lessons', () => {
      Storage.completeLesson('foundations-rules');
      Storage.completeLesson('foundations-rules');
      const p = Storage.getProgress();
      expect(p.completedLessons.filter(l => l === 'foundations-rules').length).toBe(1);
      expect(p.xp).toBe(50); // Only 50, not 100
    });

    it('should level up after enough XP', () => {
      for (let i = 0; i < 6; i++) {
        Storage.completeLesson(`lesson-${i}`);
      }
      const p = Storage.getProgress();
      expect(p.xp).toBe(300); // 6 * 50
      expect(p.level).toBe(2); // floor(300/250) + 1 = 2
    });
  });

  describe('recordPuzzleAttempt', () => {
    it('should track correct puzzle attempt', () => {
      Storage.recordPuzzleAttempt('puzzle-1', true, 'mate_in_1');
      const p = Storage.getProgress();
      expect(p.puzzlesSolved).toBe(1);
      expect(p.puzzlesAttempted).toBe(1);
      expect(p.puzzleRating).toBeGreaterThan(800);
      expect(p.xp).toBe(15);
    });

    it('should track incorrect puzzle attempt', () => {
      Storage.recordPuzzleAttempt('puzzle-1', false, 'mate_in_1');
      const p = Storage.getProgress();
      expect(p.puzzlesSolved).toBe(0);
      expect(p.puzzlesAttempted).toBe(1);
      expect(p.puzzleRating).toBe(790); // 800 - 10
      expect(p.xp).toBe(0);
    });

    it('should maintain puzzle history', () => {
      Storage.recordPuzzleAttempt('p1', true, 'forks');
      Storage.recordPuzzleAttempt('p2', false, 'pins');
      const p = Storage.getProgress();
      expect(p.puzzleHistory.length).toBe(2);
      expect(p.puzzleHistory[0].id).toBe('p1');
      expect(p.puzzleHistory[0].correct).toBe(true);
    });

    it('should cap history at 500 entries', () => {
      for (let i = 0; i < 510; i++) {
        Storage.recordPuzzleAttempt(`p-${i}`, true, 'forks');
      }
      const p = Storage.getProgress();
      expect(p.puzzleHistory.length).toBeLessThanOrEqual(500);
    });
  });

  describe('addXP', () => {
    it('should add XP and update level', () => {
      Storage.addXP(300);
      const p = Storage.getProgress();
      expect(p.xp).toBe(300);
      expect(p.level).toBe(2);
    });
  });

  describe('updateStreak', () => {
    it('should start streak at 1 on first activity', () => {
      Storage.updateStreak();
      const p = Storage.getProgress();
      expect(p.streak).toBe(1);
    });

    it('should not increment streak on same day', () => {
      Storage.updateStreak();
      Storage.updateStreak();
      const p = Storage.getProgress();
      expect(p.streak).toBe(1);
    });
  });

  describe('analyzeWeaknesses', () => {
    it('should identify fundamentals as weakness for new users', () => {
      const analysis = Storage.analyzeWeaknesses();
      expect(analysis.weaknesses).toContain('fundamentals');
    });

    it('should identify strengths from good performance', () => {
      // Record many correct attempts in a category
      for (let i = 0; i < 5; i++) {
        Storage.recordPuzzleAttempt(`fork-${i}`, true, 'forks');
      }
      const analysis = Storage.analyzeWeaknesses();
      expect(analysis.strengths).toContain('forks');
    });

    it('should identify weaknesses from poor performance', () => {
      for (let i = 0; i < 5; i++) {
        Storage.recordPuzzleAttempt(`pin-${i}`, false, 'pins');
      }
      const analysis = Storage.analyzeWeaknesses();
      expect(analysis.weaknesses).toContain('pins');
    });
  });
});

describe('SpacedRepetition', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('card management', () => {
    it('should start with no cards', () => {
      expect(SpacedRepetition.getCards()).toEqual([]);
    });

    it('should add a new card', () => {
      SpacedRepetition.addCard({
        id: 'card-1',
        front: 'What is a fork?',
        back: 'A simultaneous attack on two pieces',
        category: 'tactics',
      });
      const cards = SpacedRepetition.getCards();
      expect(cards.length).toBe(1);
      expect(cards[0].id).toBe('card-1');
      expect(cards[0].interval).toBe(1);
      expect(cards[0].easeFactor).toBe(2.5);
      expect(cards[0].repetitions).toBe(0);
    });

    it('should not add duplicate cards', () => {
      SpacedRepetition.addCard({ id: 'card-1', front: 'Q1', back: 'A1', category: 'tactics' });
      SpacedRepetition.addCard({ id: 'card-1', front: 'Q1', back: 'A1', category: 'tactics' });
      expect(SpacedRepetition.getCards().length).toBe(1);
    });
  });

  describe('getDueCards', () => {
    it('should return newly added cards as due', () => {
      SpacedRepetition.addCard({ id: 'card-1', front: 'Q1', back: 'A1', category: 'tactics' });
      const due = SpacedRepetition.getDueCards();
      expect(due.length).toBe(1);
    });
  });

  describe('getStats', () => {
    it('should return correct stats', () => {
      SpacedRepetition.addCard({ id: 'c1', front: 'Q1', back: 'A1', category: 'tactics' });
      const stats = SpacedRepetition.getStats();
      expect(stats.total).toBe(1);
      expect(stats.due).toBe(1);
      expect(stats.mastered).toBe(0);
    });
  });

  describe('SM-2 algorithm - reviewCard', () => {
    it('should reset on poor quality (< 3)', () => {
      SpacedRepetition.addCard({ id: 'c1', front: 'Q1', back: 'A1', category: 'tactics' });
      SpacedRepetition.reviewCard('c1', 2); // Poor quality
      const cards = SpacedRepetition.getCards();
      expect(cards[0].repetitions).toBe(0);
      expect(cards[0].interval).toBe(1);
    });

    it('should advance on good quality (>= 3)', () => {
      SpacedRepetition.addCard({ id: 'c1', front: 'Q1', back: 'A1', category: 'tactics' });
      SpacedRepetition.reviewCard('c1', 4);
      const cards = SpacedRepetition.getCards();
      expect(cards[0].repetitions).toBe(1);
      expect(cards[0].interval).toBe(1); // First review: interval = 1
    });

    it('should set interval to 6 on second good review', () => {
      SpacedRepetition.addCard({ id: 'c1', front: 'Q1', back: 'A1', category: 'tactics' });
      SpacedRepetition.reviewCard('c1', 4);
      SpacedRepetition.reviewCard('c1', 4);
      const cards = SpacedRepetition.getCards();
      expect(cards[0].repetitions).toBe(2);
      expect(cards[0].interval).toBe(6); // Second review: interval = 6
    });

    it('should increase ease factor with perfect quality', () => {
      SpacedRepetition.addCard({ id: 'c1', front: 'Q1', back: 'A1', category: 'tactics' });
      const initialEF = SpacedRepetition.getCards()[0].easeFactor;
      SpacedRepetition.reviewCard('c1', 5); // Perfect quality
      const newEF = SpacedRepetition.getCards()[0].easeFactor;
      expect(newEF).toBeGreaterThan(initialEF);
    });

    it('should decrease ease factor with low quality', () => {
      SpacedRepetition.addCard({ id: 'c1', front: 'Q1', back: 'A1', category: 'tactics' });
      SpacedRepetition.reviewCard('c1', 3); // Minimum passing quality
      const newEF = SpacedRepetition.getCards()[0].easeFactor;
      expect(newEF).toBeLessThan(2.5);
    });

    it('should enforce minimum ease factor of 1.3', () => {
      SpacedRepetition.addCard({ id: 'c1', front: 'Q1', back: 'A1', category: 'tactics' });
      // Many poor reviews to drive ease factor down
      for (let i = 0; i < 20; i++) {
        SpacedRepetition.reviewCard('c1', 0);
      }
      const cards = SpacedRepetition.getCards();
      expect(cards[0].easeFactor).toBeGreaterThanOrEqual(1.3);
    });
  });
});
