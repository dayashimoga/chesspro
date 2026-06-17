import { create } from 'zustand';
import { Storage, SpacedRepetition } from '../core/storage';

const API_BASE = import.meta.env.VITE_API_URL || 'https://chessos-api.workers.dev';

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
  | 'foundations' | 'tactics' | 'middlegame'
  | 'calc-university' | 'endgame-university' | 'master-games' | 'opening-university'
  | 'tournament-prep';

interface AppState {
  // Navigation
  activePage: PageId;
  activeModuleId: string | null;
  activeLessonId: string | null;
  sidebarOpen: boolean;
  setActivePage: (page: PageId) => void;
  navigateToLesson: (moduleId: string, lessonId: string) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  // Auth
  authToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;

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
  syncToCloud: () => Promise<void>;
  syncFromCloud: () => Promise<void>;
}

// Load initial state from localStorage
const stored = Storage.getProgress();
const savedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('chessos_token') : null;
const savedUser = typeof localStorage !== 'undefined' ? localStorage.getItem('chessos_user') : null;

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  activePage: 'dashboard',
  activeModuleId: null,
  activeLessonId: null,
  sidebarOpen: false,
  setActivePage: (page) => set({ activePage: page, activeModuleId: null, activeLessonId: null, sidebarOpen: false }),
  navigateToLesson: (moduleId, lessonId) => set({
    activePage: 'lesson-detail',
    activeModuleId: moduleId,
    activeLessonId: lessonId,
    sidebarOpen: false,
  }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),

  // Auth
  authToken: savedToken,
  isAuthenticated: !!savedToken,

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('chessos_token', data.token);
    localStorage.setItem('chessos_user', JSON.stringify(data.user));
    set({
      authToken: data.token,
      isAuthenticated: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        xp: data.user.xp,
        level: data.user.level,
        puzzleRating: data.user.puzzleRating,
        streak: data.user.streak,
      },
    });

    // Sync cloud progress to local
    try { await get().syncFromCloud(); } catch { /* silent */ }
  },

  register: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    localStorage.setItem('chessos_token', data.token);
    localStorage.setItem('chessos_user', JSON.stringify(data.user));
    set({
      authToken: data.token,
      isAuthenticated: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        xp: data.user.xp,
        level: data.user.level,
        puzzleRating: data.user.puzzleRating,
        streak: data.user.streak,
      },
    });

    // Push local progress to cloud
    try { await get().syncToCloud(); } catch { /* silent */ }
  },

  logout: () => {
    const token = get().authToken;
    if (token) {
      fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem('chessos_token');
    localStorage.removeItem('chessos_user');
    set({
      authToken: null,
      isAuthenticated: false,
      user: { id: 'local_user', email: 'Learner', xp: stored.xp, level: stored.level, puzzleRating: stored.puzzleRating, streak: stored.streak },
    });
  },

  // User (initialized from storage or saved auth)
  user: savedUser
    ? (() => { try { const u = JSON.parse(savedUser); return { id: u.id || 'local_user', email: u.email || 'Learner', xp: u.xp ?? stored.xp, level: u.level ?? stored.level, puzzleRating: u.puzzleRating ?? stored.puzzleRating, streak: u.streak ?? stored.streak }; } catch { return { id: 'local_user', email: 'Learner', xp: stored.xp, level: stored.level, puzzleRating: stored.puzzleRating, streak: stored.streak }; } })()
    : { id: 'local_user', email: 'Learner', xp: stored.xp, level: stored.level, puzzleRating: stored.puzzleRating, streak: stored.streak },
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
    set(s => ({ user: { ...s.user, xp: p.xp, level: p.level } }));
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
    set(s => ({ user: { ...s.user, puzzleRating: p.puzzleRating } }));
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

  syncToCloud: async () => {
    const { authToken, user, completedLessons } = get();
    if (!authToken) return;

    const p = Storage.getProgress();
    try {
      await fetch(`${API_BASE}/api/progress/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          xp: p.xp,
          level: p.level,
          puzzleRating: p.puzzleRating,
          streak: p.streak,
          completedLessons: p.completedLessons,
          puzzleHistory: p.puzzleHistory || [],
        }),
      });
    } catch {
      // Offline — will retry next time
    }
  },

  syncFromCloud: async () => {
    const { authToken } = get();
    if (!authToken) return;

    try {
      const res = await fetch(`${API_BASE}/api/progress`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) return;
      const data = await res.json();

      set(s => ({
        user: {
          ...s.user,
          xp: Math.max(s.user.xp, data.xp || 0),
          level: Math.max(s.user.level, data.level || 1),
          puzzleRating: data.puzzleRating || s.user.puzzleRating,
          streak: Math.max(s.user.streak, data.streak || 0),
        },
        completedLessons: [...new Set([...s.completedLessons, ...(data.completedLessons || [])])],
      }));
    } catch {
      // Offline
    }
  },
}));
