// ChessOS — Advanced Spaced Repetition Engine (SM-2 Algorithm + Chess Adaptations)
// Implements: Leitner boxes, SM-2 intervals, chess-specific weighting, auto-scheduling

export interface ReviewCard {
  id: string;
  type: 'puzzle' | 'opening' | 'endgame' | 'middlegame' | 'tactic';
  contentId: string;
  title: string;
  category: string;
  difficulty: number; // 0-5 scale

  // SM-2 fields
  interval: number;       // days until next review
  repetitions: number;    // successful review count
  easeFactor: number;     // 1.3-2.5 range
  nextReview: number;     // timestamp
  lastReview: number;     // timestamp

  // Chess-specific
  timeToSolve: number;    // average ms to complete
  accuracy: number;       // 0-1 correct rate
  streakCorrect: number;  // consecutive correct
  streakWrong: number;    // consecutive wrong
  leitnerBox: number;     // 1-5 Leitner box
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = complete blackout   1 = incorrect, remembered after hint
// 2 = incorrect, correct seemed easy  3 = correct with difficulty
// 4 = correct with hesitation  5 = perfect recall

export class SpacedRepetitionEngine {
  private cards: Map<string, ReviewCard> = new Map();
  private readonly MIN_EASE = 1.3;
  private readonly DEFAULT_EASE = 2.5;

  constructor(savedCards?: ReviewCard[]) {
    if (savedCards) {
      for (const card of savedCards) {
        this.cards.set(card.id, card);
      }
    }
  }

  // Add a new card to the review queue
  addCard(card: Omit<ReviewCard, 'interval' | 'repetitions' | 'easeFactor' | 'nextReview' | 'lastReview' | 'streakCorrect' | 'streakWrong' | 'leitnerBox'>): ReviewCard {
    const newCard: ReviewCard = {
      ...card,
      interval: 0,
      repetitions: 0,
      easeFactor: this.DEFAULT_EASE,
      nextReview: Date.now(),
      lastReview: 0,
      streakCorrect: 0,
      streakWrong: 0,
      leitnerBox: 1,
    };
    this.cards.set(newCard.id, newCard);
    return newCard;
  }

  // Core SM-2 algorithm with chess-specific modifications
  review(cardId: string, quality: ReviewQuality, timeMs: number): ReviewCard | null {
    const card = this.cards.get(cardId);
    if (!card) return null;

    const now = Date.now();
    card.lastReview = now;

    // Update time tracking
    card.timeToSolve = card.timeToSolve > 0
      ? (card.timeToSolve * 0.7 + timeMs * 0.3) // exponential moving average
      : timeMs;

    // Update accuracy
    const isCorrect = quality >= 3;
    const totalReviews = card.repetitions + 1;
    card.accuracy = ((card.accuracy * card.repetitions) + (isCorrect ? 1 : 0)) / totalReviews;

    // Update streaks
    if (isCorrect) {
      card.streakCorrect++;
      card.streakWrong = 0;
    } else {
      card.streakWrong++;
      card.streakCorrect = 0;
    }

    // SM-2 ease factor update
    card.easeFactor = Math.max(
      this.MIN_EASE,
      card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    // Chess-specific ease adjustment
    // If solving time is consistently fast, increase interval
    if (card.timeToSolve < 5000 && quality >= 4) {
      card.easeFactor = Math.min(3.0, card.easeFactor + 0.1);
    }
    // If solving time is slow even when correct, decrease interval
    if (card.timeToSolve > 30000 && quality <= 3) {
      card.easeFactor = Math.max(this.MIN_EASE, card.easeFactor - 0.1);
    }

    // Calculate interval
    if (quality < 3) {
      // Failed: reset repetitions, go back to box 1
      card.repetitions = 0;
      card.interval = 1;
      card.leitnerBox = Math.max(1, card.leitnerBox - 1);
    } else {
      // Success
      if (card.repetitions === 0) {
        card.interval = 1;
      } else if (card.repetitions === 1) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.easeFactor);
      }
      card.repetitions++;

      // Leitner box advancement
      if (quality >= 4 && card.streakCorrect >= 2) {
        card.leitnerBox = Math.min(5, card.leitnerBox + 1);
      }
    }

    // Cap interval at 365 days
    card.interval = Math.min(365, card.interval);

    // Set next review
    card.nextReview = now + card.interval * 24 * 60 * 60 * 1000;

    this.cards.set(cardId, card);
    return card;
  }

  // Get cards due for review, sorted by priority
  getDueCards(limit: number = 20): ReviewCard[] {
    const now = Date.now();
    const dueCards: ReviewCard[] = [];

    for (const card of this.cards.values()) {
      if (card.nextReview <= now) {
        dueCards.push(card);
      }
    }

    // Priority sort: overdue items first, then by difficulty and weakness
    dueCards.sort((a, b) => {
      // How overdue (in days)
      const overdueA = (now - a.nextReview) / (24 * 60 * 60 * 1000);
      const overdueB = (now - b.nextReview) / (24 * 60 * 60 * 1000);

      // Lower accuracy = higher priority (weakness targeting)
      const weaknessScoreA = (1 - a.accuracy) * 3;
      const weaknessScoreB = (1 - b.accuracy) * 3;

      // Wrong streak = urgent
      const urgencyA = a.streakWrong * 2;
      const urgencyB = b.streakWrong * 2;

      const priorityA = overdueA + weaknessScoreA + urgencyA;
      const priorityB = overdueB + weaknessScoreB + urgencyB;

      return priorityB - priorityA; // Descending priority
    });

    return dueCards.slice(0, limit);
  }

  // Get cards by category for targeted review
  getCardsByCategory(category: string): ReviewCard[] {
    const cards: ReviewCard[] = [];
    for (const card of this.cards.values()) {
      if (card.category === category) cards.push(card);
    }
    return cards;
  }

  // Get weakness analysis
  getWeaknessReport(): { category: string; accuracy: number; count: number; avgTime: number }[] {
    const categories = new Map<string, { total: number; correct: number; totalTime: number; count: number }>();

    for (const card of this.cards.values()) {
      const existing = categories.get(card.category) || { total: 0, correct: 0, totalTime: 0, count: 0 };
      existing.total++;
      existing.correct += card.accuracy * card.repetitions;
      existing.totalTime += card.timeToSolve;
      existing.count += card.repetitions;
      categories.set(card.category, existing);
    }

    const report: { category: string; accuracy: number; count: number; avgTime: number }[] = [];
    for (const [category, data] of categories) {
      report.push({
        category,
        accuracy: data.count > 0 ? data.correct / data.count : 0,
        count: data.total,
        avgTime: data.total > 0 ? data.totalTime / data.total : 0,
      });
    }

    return report.sort((a, b) => a.accuracy - b.accuracy); // Weakest first
  }

  // Generate daily training session
  generateDailySession(targetMinutes: number = 30): { cards: ReviewCard[]; estimatedMinutes: number } {
    const dueCards = this.getDueCards(50);
    const session: ReviewCard[] = [];
    let estimatedMs = 0;
    const targetMs = targetMinutes * 60 * 1000;

    for (const card of dueCards) {
      const cardTime = card.timeToSolve > 0 ? card.timeToSolve : 30000; // default 30s
      if (estimatedMs + cardTime <= targetMs) {
        session.push(card);
        estimatedMs += cardTime;
      }
    }

    return {
      cards: session,
      estimatedMinutes: Math.round(estimatedMs / 60000),
    };
  }

  // Get study statistics
  getStats(): {
    totalCards: number;
    dueToday: number;
    masteredCards: number;
    learningCards: number;
    newCards: number;
    averageEase: number;
  } {
    const now = Date.now();
    let dueToday = 0;
    let mastered = 0;
    let learning = 0;
    let newCards = 0;
    let totalEase = 0;

    for (const card of this.cards.values()) {
      if (card.nextReview <= now) dueToday++;
      if (card.leitnerBox >= 4 && card.accuracy > 0.85) mastered++;
      else if (card.repetitions > 0) learning++;
      else newCards++;
      totalEase += card.easeFactor;
    }

    return {
      totalCards: this.cards.size,
      dueToday,
      masteredCards: mastered,
      learningCards: learning,
      newCards,
      averageEase: this.cards.size > 0 ? totalEase / this.cards.size : this.DEFAULT_EASE,
    };
  }

  // Export for persistence
  exportCards(): ReviewCard[] {
    return Array.from(this.cards.values());
  }
}

export default SpacedRepetitionEngine;
