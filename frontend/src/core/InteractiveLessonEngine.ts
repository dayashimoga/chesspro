// ChessOS — Interactive Lesson Engine
// Manages lesson state machine: Theory → Demo → Practice → Quiz → Mastery
// Validates moves, provides feedback, tracks mastery, awards XP

import { Chess } from 'chess.js';

// ====================================================================
// Types
// ====================================================================

export interface GuidedStep {
  fen: string;
  instruction: string;
  expectedMove: string; // SAN notation
  highlights?: Array<{ square: string; color: string }>;
  arrows?: Array<{ from: string; to: string; color: string }>;
  correctFeedback: string;
  incorrectFeedback: string;
  hints?: string[];
}

export interface DemoStep {
  fen: string;
  move?: string; // SAN move to animate
  commentary: string;
  highlights?: Array<{ square: string; color: string }>;
  arrows?: Array<{ from: string; to: string; color: string }>;
}

export interface MasteryPosition {
  fen: string;
  description: string;
  solution: string[]; // Sequence of SAN moves
  conceptTested: string;
  maxAttempts: number;
}

export type LessonPhase = 'theory' | 'demo' | 'practice' | 'quiz' | 'mastery';

export interface LessonProgress {
  phase: LessonPhase;
  demoStepIndex: number;
  practiceStepIndex: number;
  practiceAttempts: number;
  practiceCorrect: number;
  quizIndex: number;
  quizCorrect: number;
  masteryIndex: number;
  masterySolveStep: number;
  masteryAttempts: number;
  masteryCompleted: boolean;
  hintsUsed: number;
  totalXPEarned: number;
  completed: boolean;
}

export interface MoveResult {
  correct: boolean;
  feedback: string;
  feedbackType: 'success' | 'error' | 'hint' | 'info';
  nextFen?: string;
  completed?: boolean;
  xpAwarded?: number;
  showSolution?: boolean;
}

// ====================================================================
// InteractiveLessonEngine
// ====================================================================

export class InteractiveLessonEngine {
  private progress: LessonProgress;

  constructor() {
    this.progress = this.createInitialProgress();
  }

  private createInitialProgress(): LessonProgress {
    return {
      phase: 'theory',
      demoStepIndex: 0,
      practiceStepIndex: 0,
      practiceAttempts: 0,
      practiceCorrect: 0,
      quizIndex: 0,
      quizCorrect: 0,
      masteryIndex: 0,
      masterySolveStep: 0,
      masteryAttempts: 0,
      masteryCompleted: false,
      hintsUsed: 0,
      totalXPEarned: 0,
      completed: false,
    };
  }

  getProgress(): LessonProgress {
    return { ...this.progress };
  }

  reset(): void {
    this.progress = this.createInitialProgress();
  }

  setPhase(phase: LessonPhase): void {
    this.progress.phase = phase;
    if (phase === 'practice') {
      this.progress.practiceStepIndex = 0;
      this.progress.practiceAttempts = 0;
      this.progress.practiceCorrect = 0;
    }
    if (phase === 'mastery') {
      this.progress.masteryIndex = 0;
      this.progress.masterySolveStep = 0;
      this.progress.masteryAttempts = 0;
      this.progress.masteryCompleted = false;
    }
  }

  // ====================================================================
  // Demo Phase
  // ====================================================================

  advanceDemo(demoSteps: DemoStep[]): { step: DemoStep | null; hasNext: boolean; hasPrev: boolean } {
    if (this.progress.demoStepIndex < demoSteps.length - 1) {
      this.progress.demoStepIndex++;
    }
    return this.getCurrentDemo(demoSteps);
  }

  retreatDemo(demoSteps: DemoStep[]): { step: DemoStep | null; hasNext: boolean; hasPrev: boolean } {
    if (this.progress.demoStepIndex > 0) {
      this.progress.demoStepIndex--;
    }
    return this.getCurrentDemo(demoSteps);
  }

  getCurrentDemo(demoSteps: DemoStep[]): { step: DemoStep | null; hasNext: boolean; hasPrev: boolean } {
    const step = demoSteps[this.progress.demoStepIndex] || null;
    return {
      step,
      hasNext: this.progress.demoStepIndex < demoSteps.length - 1,
      hasPrev: this.progress.demoStepIndex > 0,
    };
  }

  resetDemo(): void {
    this.progress.demoStepIndex = 0;
  }

  // ====================================================================
  // Guided Practice Phase
  // ====================================================================

  validatePracticeMove(
    userMove: string,
    guidedSteps: GuidedStep[]
  ): MoveResult {
    const step = guidedSteps[this.progress.practiceStepIndex];
    if (!step) {
      return { correct: false, feedback: 'No more practice steps.', feedbackType: 'info', completed: true };
    }

    this.progress.practiceAttempts++;
    const normalizedUser = this.normalizeSAN(userMove);
    const normalizedExpected = this.normalizeSAN(step.expectedMove);

    if (normalizedUser === normalizedExpected) {
      this.progress.practiceCorrect++;
      const xp = 5;
      this.progress.totalXPEarned += xp;

      // Advance to next step
      const isLast = this.progress.practiceStepIndex >= guidedSteps.length - 1;
      if (!isLast) {
        this.progress.practiceStepIndex++;
      }

      // Calculate the resulting FEN
      let nextFen: string | undefined;
      try {
        const game = new Chess(step.fen);
        game.move(step.expectedMove);
        nextFen = game.fen();
      } catch {
        // fallback
      }

      return {
        correct: true,
        feedback: step.correctFeedback,
        feedbackType: 'success',
        nextFen,
        xpAwarded: xp,
        completed: isLast,
      };
    } else {
      // Check if the move is at least legal
      let isLegal = false;
      try {
        const game = new Chess(step.fen);
        const moves = game.moves();
        isLegal = moves.includes(userMove);
      } catch { /* noop */ }

      let feedback = step.incorrectFeedback;
      if (!isLegal) {
        feedback = 'That move is not legal in this position. ' + feedback;
      }

      // After 3 failed attempts, offer hint
      const attemptsOnThis = this.progress.practiceAttempts - this.progress.practiceCorrect;
      if (attemptsOnThis >= 3 && step.hints && step.hints.length > 0) {
        const hintIdx = Math.min(attemptsOnThis - 3, step.hints.length - 1);
        feedback += `\n\n💡 Hint: ${step.hints[hintIdx]}`;
        this.progress.hintsUsed++;
      }

      // After 5 failed attempts, show solution
      if (attemptsOnThis >= 5) {
        return {
          correct: false,
          feedback: `The correct move is **${step.expectedMove}**. ${step.correctFeedback}`,
          feedbackType: 'hint',
          showSolution: true,
        };
      }

      return {
        correct: false,
        feedback,
        feedbackType: 'error',
      };
    }
  }

  getCurrentPracticeStep(guidedSteps: GuidedStep[]): GuidedStep | null {
    return guidedSteps[this.progress.practiceStepIndex] || null;
  }

  skipPracticeStep(guidedSteps: GuidedStep[]): boolean {
    if (this.progress.practiceStepIndex < guidedSteps.length - 1) {
      this.progress.practiceStepIndex++;
      return true;
    }
    return false;
  }

  // ====================================================================
  // Mastery Phase
  // ====================================================================

  validateMasteryMove(
    userMove: string,
    masteryPositions: MasteryPosition[]
  ): MoveResult {
    const pos = masteryPositions[this.progress.masteryIndex];
    if (!pos) {
      return { correct: false, feedback: 'No mastery position available.', feedbackType: 'info', completed: true };
    }

    const expectedMove = pos.solution[this.progress.masterySolveStep];
    if (!expectedMove) {
      return { correct: true, feedback: 'Position complete!', feedbackType: 'success', completed: true };
    }

    this.progress.masteryAttempts++;
    const normalizedUser = this.normalizeSAN(userMove);
    const normalizedExpected = this.normalizeSAN(expectedMove);

    if (normalizedUser === normalizedExpected) {
      this.progress.masterySolveStep++;

      // Calculate the FEN after this move (and opponent's reply if exists)
      let nextFen: string | undefined;
      try {
        const game = new Chess(pos.fen);
        for (let i = 0; i <= this.progress.masterySolveStep - 1; i++) {
          game.move(pos.solution[i]);
        }
        // Play opponent's reply if it exists
        if (this.progress.masterySolveStep < pos.solution.length) {
          const opponentReply = pos.solution[this.progress.masterySolveStep];
          if (opponentReply) {
            game.move(opponentReply);
            this.progress.masterySolveStep++;
          }
        }
        nextFen = game.fen();
      } catch { /* noop */ }

      const isComplete = this.progress.masterySolveStep >= pos.solution.length;

      if (isComplete) {
        const xp = 20;
        this.progress.totalXPEarned += xp;
        this.progress.masteryCompleted = true;
        this.progress.completed = true;

        return {
          correct: true,
          feedback: `🏆 Mastery achieved! You demonstrated the concept of **${pos.conceptTested}** perfectly.`,
          feedbackType: 'success',
          nextFen,
          xpAwarded: xp,
          completed: true,
        };
      }

      return {
        correct: true,
        feedback: `Correct! ${this.progress.masterySolveStep}/${pos.solution.length} moves found.`,
        feedbackType: 'success',
        nextFen,
      };
    } else {
      if (this.progress.masteryAttempts >= pos.maxAttempts) {
        return {
          correct: false,
          feedback: `The solution was: ${pos.solution.join(', ')}. Study this concept and try again.`,
          feedbackType: 'hint',
          showSolution: true,
        };
      }

      return {
        correct: false,
        feedback: `Not the best move. Think about how to apply **${pos.conceptTested}** here. (${this.progress.masteryAttempts}/${pos.maxAttempts} attempts)`,
        feedbackType: 'error',
      };
    }
  }

  getCurrentMasteryPosition(masteryPositions: MasteryPosition[]): MasteryPosition | null {
    return masteryPositions[this.progress.masteryIndex] || null;
  }

  getMasteryFen(masteryPositions: MasteryPosition[]): string {
    const pos = masteryPositions[this.progress.masteryIndex];
    if (!pos) return '8/8/8/8/8/8/8/8 w - - 0 1';

    try {
      const game = new Chess(pos.fen);
      for (let i = 0; i < this.progress.masterySolveStep; i++) {
        if (pos.solution[i]) {
          game.move(pos.solution[i]);
        }
      }
      return game.fen();
    } catch {
      return pos.fen;
    }
  }

  // ====================================================================
  // Scoring
  // ====================================================================

  calculateScore(
    guidedSteps: GuidedStep[],
    exercises: Array<{ answer: number }>,
    masteryPositions: MasteryPosition[]
  ): {
    practiceAccuracy: number;
    quizAccuracy: number;
    masteryPassed: boolean;
    totalXP: number;
    grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  } {
    const practiceAccuracy = guidedSteps.length > 0
      ? (this.progress.practiceCorrect / guidedSteps.length) * 100
      : 100;

    const quizAccuracy = exercises.length > 0
      ? (this.progress.quizCorrect / exercises.length) * 100
      : 100;

    const masteryPassed = this.progress.masteryCompleted;

    const avgAccuracy = (practiceAccuracy + quizAccuracy) / 2;
    let grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
    if (avgAccuracy >= 95 && masteryPassed && this.progress.hintsUsed === 0) grade = 'S';
    else if (avgAccuracy >= 85 && masteryPassed) grade = 'A';
    else if (avgAccuracy >= 70) grade = 'B';
    else if (avgAccuracy >= 55) grade = 'C';
    else if (avgAccuracy >= 40) grade = 'D';
    else grade = 'F';

    return {
      practiceAccuracy: Math.round(practiceAccuracy),
      quizAccuracy: Math.round(quizAccuracy),
      masteryPassed,
      totalXP: this.progress.totalXPEarned,
      grade,
    };
  }

  // ====================================================================
  // Helpers
  // ====================================================================

  private normalizeSAN(san: string): string {
    return san.replace(/[+#!?]/g, '').replace(/x/g, '').toLowerCase().trim();
  }

  getAvailablePhases(
    demoSteps: DemoStep[],
    guidedSteps: GuidedStep[],
    exercises: Array<any>,
    masteryPositions: MasteryPosition[]
  ): LessonPhase[] {
    const phases: LessonPhase[] = ['theory'];
    if (demoSteps.length > 0) phases.push('demo');
    if (guidedSteps.length > 0) phases.push('practice');
    if (exercises.length > 0) phases.push('quiz');
    if (masteryPositions.length > 0) phases.push('mastery');
    return phases;
  }
}

export default InteractiveLessonEngine;
