import { create } from 'zustand';

export interface UserProfile {
  id: string;
  email: string;
  xp: number;
  level: number;
  puzzleRating: number;
  streak: number;
}

interface AppState {
  token: string | null;
  user: UserProfile | null;
  completedLessons: string[];
  activePuzzleId: string | null;
  
  // Actions
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  setActivePuzzle: (puzzleId: string | null) => void;
  updateRating: (change: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  token: null,
  user: null,
  completedLessons: [],
  activePuzzleId: null,

  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
  
  addXP: (amount) => set((state) => {
    if (!state.user) return {};
    const newXp = state.user.xp + amount;
    const newLevel = Math.floor(newXp / 250) + 1;
    return {
      user: {
        ...state.user,
        xp: newXp,
        level: newLevel
      }
    };
  }),

  completeLesson: (lessonId) => set((state) => {
    if (state.completedLessons.includes(lessonId)) return {};
    return {
      completedLessons: [...state.completedLessons, lessonId]
    };
  }),

  setActivePuzzle: (activePuzzleId) => set({ activePuzzleId }),

  updateRating: (change) => set((state) => {
    if (!state.user) return {};
    return {
      user: {
        ...state.user,
        puzzleRating: Math.max(100, Math.round(state.user.puzzleRating + change))
      }
    };
  })
}));
