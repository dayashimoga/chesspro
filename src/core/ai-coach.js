// ChessOS — Personalized AI Chess Coach & Roadmap Generator
import { Storage } from './storage.js';

export class AICoach {
  static getTrainingPlan() {
    const progress = Storage.getProgress();
    const stats = this._analyzeStrengthsAndWeaknesses(progress);

    // Generate daily training items based on weaknesses
    const plan = [];
    
    if (stats.weaknesses.includes('tactics')) {
      plan.push({
        id: 'daily_tactics',
        title: 'Tactics Refinement',
        desc: 'Solve 5 fork or pin puzzles to build visual recognition.',
        action: '/puzzles',
        completed: false
      });
    }

    if (stats.weaknesses.includes('calculation')) {
      plan.push({
        id: 'daily_calc',
        title: 'Mental Math Calculation',
        desc: 'Complete 3 calculation trainer exercises without moving pieces.',
        action: '#/trainer/calculation',
        completed: false
      });
    }

    if (stats.weaknesses.includes('endgames')) {
      plan.push({
        id: 'daily_endgame',
        title: 'Endgame Mastery',
        desc: 'Play out a theoretical King & Pawn endgame vs Stockfish.',
        action: '#/trainer/endgame',
        completed: false
      });
    }

    // Default recommendation if doing well
    if (plan.length === 0) {
      plan.push({
        id: 'daily_play',
        title: 'AI Sparring Match',
        desc: 'Play a standard game vs AI Level 3 with a focus on king safety.',
        action: '/play',
        completed: false
      });
    }

    return {
      plan,
      stats,
      weeklyGoal: 'Complete 10 tactical solves & study 1 master game',
      weeklyProgress: Math.min(100, Math.round(((progress.puzzlesSolved % 10) / 10) * 100))
    };
  }

  static _analyzeStrengthsAndWeaknesses(progress) {
    const weaknesses = [];
    const strengths = [];

    // Analyze puzzles accuracy
    const accuracy = progress.puzzlesAttempted > 0 
      ? (progress.puzzlesSolved / progress.puzzlesAttempted) 
      : 1.0;

    if (accuracy < 0.65) {
      weaknesses.push('tactics');
    } else {
      strengths.push('tactics');
    }

    // Analyze completed curriculum modules
    const lessonsCount = progress.completedLessons.length;
    if (lessonsCount < 5) {
      weaknesses.push('fundamentals');
    } else {
      strengths.push('fundamentals');
    }

    // Heuristics for Calculation & Endgames based on module IDs completed
    const hasCalc = progress.completedLessons.some(l => l.startsWith('calculation/'));
    const hasEndgame = progress.completedLessons.some(l => l.startsWith('endgames/'));

    if (!hasCalc) weaknesses.push('calculation');
    else strengths.push('calculation');

    if (!hasEndgame) weaknesses.push('endgames');
    else strengths.push('endgames');

    return {
      strengths,
      weaknesses,
      ratingLevel: this._getRatingDescription(progress.puzzleRating)
    };
  }

  static _getRatingDescription(rating) {
    if (rating < 1000) return 'Beginner (~800)';
    if (rating < 1400) return 'Intermediate (~1200)';
    if (rating < 1800) return 'Advanced (~1600)';
    if (rating < 2200) return 'Expert (~2000)';
    return 'Master (2200+)';
  }
}
