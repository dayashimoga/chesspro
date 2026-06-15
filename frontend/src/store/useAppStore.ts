import { create } from 'zustand';
import { Storage, SpacedRepetition } from '../core/storage';

export interface UserProfile {
  id: string;
  email: string;
  xp: number;
  level: number;
  puzzleRating: number;
  streak: number;
}

type PageId =
  | 'dashboard' | 'lessons' | 'puzzles' | 'games' | 'openings'
  | 'endgames' | 'calculation' | 'blindfold' | 'aicoach'
  | 'play' | 'review' | 'settings' | 'lesson-detail'
  | 'foundations' | 'tactics' | 'middlegame';

interface AppState {
  // Navigation
  activePage: PageId;
  activeModuleId: string | null;
  activeLessonId: string | null;
  setActivePage: (page: PageId) => void;
  navigateToLesson: (moduleId: string, lessonId: string) => void;

  // User
  user: UserProfile;
  completedLessons: string[];

  // Puzzle state
  activePuzzleId: string | null;
  setActivePuzzle: (puzzleId: string | null) => void;

  // Board preferences
  boardFlipped: boolean;
  toggleBoardFlip: () => void;

  // Actions
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  updateRating: (change: number) => void;
  recordPuzzle: (id: string, correct: boolean, category: string) => void;
  syncFromStorage: () => void;
}

// Load initial state from localStorage
const stored = Storage.getProgress();

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  activePage: 'dashboard',
  activeModuleId: null,
  activeLessonId: null,
  setActivePage: (page) => set({ activePage: page, activeModuleId: null, activeLessonId: null }),
  navigateToLesson: (moduleId, lessonId) => set({
    activePage: 'lesson-detail',
    activeModuleId: moduleId,
    activeLessonId: lessonId,
  }),

  // User (initialized from storage)
  user: {
    id: 'local_user',
    email: 'Learner',
    xp: stored.xp,
    level: stored.level,
    puzzleRating: stored.puzzleRating,
    streak: stored.streak,
  },
  completedLessons: stored.completedLessons,

  // Puzzle
  activePuzzleId: null,
  setActivePuzzle: (activePuzzleId) => set({ activePuzzleId }),

  // Board
  boardFlipped: false,
  toggleBoardFlip: () => set(s => ({ boardFlipped: !s.boardFlipped })),

  // Actions
  addXP: (amount) => {
    Storage.addXP(amount);
    const p = Storage.getProgress();
    set(s => ({
      user: { ...s.user, xp: p.xp, level: p.level },
    }));
  },

  completeLesson: (lessonId) => {
    Storage.completeLesson(lessonId);
    const p = Storage.getProgress();
    set(s => ({
      completedLessons: p.completedLessons,
      user: { ...s.user, xp: p.xp, level: p.level },
    }));
  },

  updateRating: (change) => {
    const p = Storage.getProgress();
    p.puzzleRating = Math.max(100, Math.round(p.puzzleRating + change));
    Storage.saveProgress(p);
    set(s => ({
      user: { ...s.user, puzzleRating: p.puzzleRating },
    }));
  },

  recordPuzzle: (id, correct, category) => {
    Storage.recordPuzzleAttempt(id, correct, category);
    const p = Storage.getProgress();
    set(s => ({
      user: { ...s.user, xp: p.xp, level: p.level, puzzleRating: p.puzzleRating },
    }));
  },

  syncFromStorage: () => {
    const p = Storage.getProgress();
    set(s => ({
      user: { ...s.user, xp: p.xp, level: p.level, puzzleRating: p.puzzleRating, streak: p.streak },
      completedLessons: p.completedLessons,
    }));
  },
}));
