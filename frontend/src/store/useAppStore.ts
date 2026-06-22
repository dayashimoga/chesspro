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
  tacticalRating: number;
  strategicRating: number;
  openingRating: number;
  middlegameRating: number;
  endgameRating: number;
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
  favorites: string[];
  toggleFavorite: (moduleId: string) => void;

  // Puzzle state
  activePuzzleId: string | null;
  setActivePuzzle: (puzzleId: string | null) => void;

  // Board preferences
  boardFlipped: boolean;
  toggleBoardFlip: () => void;

  // Theme preferences
  theme: 'dark' | 'light' | 'tournament' | 'focus';
  setTheme: (theme: 'dark' | 'light' | 'tournament' | 'focus') => void;
  boardTheme: 'green' | 'brown' | 'blue' | 'tournament';
  setBoardTheme: (boardTheme: 'green' | 'brown' | 'blue' | 'tournament') => void;
  pieceSet: 'standard' | 'neo' | 'alpha' | 'merida';
  setPieceSet: (pieceSet: 'standard' | 'neo' | 'alpha' | 'merida') => void;

  // Actions
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  updateRating: (change: number) => void;
  recordPuzzle: (id: string, correct: boolean, category: string) => void;
  syncFromStorage: () => void;
  syncToCloud: () => Promise<void>;
  syncFromCloud: () => Promise<void>;
  calculateAndSyncStatistics: () => Promise<void>;
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
        tacticalRating: data.user.tacticalRating || 800,
        strategicRating: data.user.strategicRating || 800,
        openingRating: data.user.openingRating || 800,
        middlegameRating: data.user.middlegameRating || 800,
        endgameRating: data.user.endgameRating || 800,
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
        tacticalRating: data.user.tacticalRating || 800,
        strategicRating: data.user.strategicRating || 800,
        openingRating: data.user.openingRating || 800,
        middlegameRating: data.user.middlegameRating || 800,
        endgameRating: data.user.endgameRating || 800,
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
      user: { id: 'local_user', email: 'Learner', xp: stored.xp, level: stored.level, puzzleRating: stored.puzzleRating, streak: stored.streak, tacticalRating: stored.tacticalRating || 800, strategicRating: stored.strategicRating || 800, openingRating: stored.openingRating || 800, middlegameRating: stored.middlegameRating || 800, endgameRating: stored.endgameRating || 800 },
    });
  },

  // User (initialized from storage or saved auth)
  user: savedUser
    ? (() => { try { const u = JSON.parse(savedUser); return { id: u.id || 'local_user', email: u.email || 'Learner', xp: u.xp ?? stored.xp, level: u.level ?? stored.level, puzzleRating: u.puzzleRating ?? stored.puzzleRating, streak: u.streak ?? stored.streak, tacticalRating: u.tacticalRating ?? stored.tacticalRating ?? 800, strategicRating: u.strategicRating ?? stored.strategicRating ?? 800, openingRating: u.openingRating ?? stored.openingRating ?? 800, middlegameRating: u.middlegameRating ?? stored.middlegameRating ?? 800, endgameRating: u.endgameRating ?? stored.endgameRating ?? 800 }; } catch { return { id: 'local_user', email: 'Learner', xp: stored.xp, level: stored.level, puzzleRating: stored.puzzleRating, streak: stored.streak, tacticalRating: stored.tacticalRating || 800, strategicRating: stored.strategicRating || 800, openingRating: stored.openingRating || 800, middlegameRating: stored.middlegameRating || 800, endgameRating: stored.endgameRating || 800 }; } })()
    : { id: 'local_user', email: 'Learner', xp: stored.xp, level: stored.level, puzzleRating: stored.puzzleRating, streak: stored.streak, tacticalRating: stored.tacticalRating || 800, strategicRating: stored.strategicRating || 800, openingRating: stored.openingRating || 800, middlegameRating: stored.middlegameRating || 800, endgameRating: stored.endgameRating || 800 },
  completedLessons: stored.completedLessons,
  favorites: stored.favorites || [],

  // Puzzle
  activePuzzleId: null,
  setActivePuzzle: (activePuzzleId) => set({ activePuzzleId }),

  // Board
  boardFlipped: false,
  toggleBoardFlip: () => set(s => ({ boardFlipped: !s.boardFlipped })),

  // Theme
  theme: typeof localStorage !== 'undefined' ? (localStorage.getItem('chessos_theme') as any || 'dark') : 'dark',
  setTheme: (theme) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('chessos_theme', theme);
    }
    if (typeof document !== 'undefined') {
      document.body.classList.remove('theme-light', 'theme-tournament', 'theme-focus');
      if (theme !== 'dark') {
        document.body.classList.add(`theme-${theme}`);
      }
    }
    set({ theme });
  },
  boardTheme: typeof localStorage !== 'undefined' ? (localStorage.getItem('chessos_board_theme') as any || 'green') : 'green',
  setBoardTheme: (boardTheme) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('chessos_board_theme', boardTheme);
    }
    set({ boardTheme });
  },
  pieceSet: typeof localStorage !== 'undefined' ? (localStorage.getItem('chessos_piece_set') as any || 'standard') : 'standard',
  setPieceSet: (pieceSet) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('chessos_piece_set', pieceSet);
    }
    set({ pieceSet });
  },

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

  toggleFavorite: (moduleId) => {
    const p = Storage.getProgress();
    const currentFavs = p.favorites || [];
    const updated = currentFavs.includes(moduleId)
      ? currentFavs.filter(id => id !== moduleId)
      : [...currentFavs, moduleId];
    Storage.saveProgress({ favorites: updated });
    set({ favorites: updated });
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
      user: {
        ...s.user,
        xp: p.xp,
        level: p.level,
        puzzleRating: p.puzzleRating,
        tacticalRating: p.tacticalRating || 800,
        strategicRating: p.strategicRating || 800,
        openingRating: p.openingRating || 800,
        middlegameRating: p.middlegameRating || 800,
        endgameRating: p.endgameRating || 800,
      },
    }));
    get().calculateAndSyncStatistics();
    get().syncToCloud();
  },

  syncFromStorage: () => {
    const p = Storage.getProgress();
    const theme = typeof localStorage !== 'undefined' ? (localStorage.getItem('chessos_theme') as any || 'dark') : 'dark';
    const boardTheme = typeof localStorage !== 'undefined' ? (localStorage.getItem('chessos_board_theme') as any || 'green') : 'green';
    const pieceSet = typeof localStorage !== 'undefined' ? (localStorage.getItem('chessos_piece_set') as any || 'standard') : 'standard';
    if (typeof document !== 'undefined') {
      document.body.classList.remove('theme-light', 'theme-tournament', 'theme-focus');
      if (theme !== 'dark') {
        document.body.classList.add(`theme-${theme}`);
      }
    }
    set(s => ({
      user: {
        ...s.user,
        xp: p.xp,
        level: p.level,
        puzzleRating: p.puzzleRating,
        streak: p.streak,
        tacticalRating: p.tacticalRating || 800,
        strategicRating: p.strategicRating || 800,
        openingRating: p.openingRating || 800,
        middlegameRating: p.middlegameRating || 800,
        endgameRating: p.endgameRating || 800,
      },
      completedLessons: p.completedLessons,
      favorites: p.favorites || [],
      theme,
      boardTheme,
      pieceSet,
    }));
  },

  syncToCloud: async () => {
    const { authToken } = get();
    if (!authToken) return;

    const p = Storage.getProgress();
    try {
      const res = await fetch(`${API_BASE}/api/progress/sync`, {
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
      if (res.ok) {
        Storage.clearOfflineQueue();
        get().calculateAndSyncStatistics();
      }
    } catch {
      // Offline — will retry next time
    }
  },

  syncFromCloud: async () => {
    const { authToken } = get();
    if (!authToken) return;

    const lastSync = typeof localStorage !== 'undefined' ? Number(localStorage.getItem('chessos_last_sync') || '0') : 0;

    try {
      const res = await fetch(`${API_BASE}/api/progress?since=${lastSync}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) return;
      const data = await res.json();

      if (data.syncTimestamp && typeof localStorage !== 'undefined') {
        localStorage.setItem('chessos_last_sync', String(data.syncTimestamp));
      }

      const localProgress = Storage.getProgress();
      const mergedLessons = [...new Set([...localProgress.completedLessons, ...(data.completedLessons || [])])];
      
      Storage.saveProgress({
        xp: Math.max(localProgress.xp, data.xp || 0),
        level: Math.max(localProgress.level, data.level || 1),
        puzzleRating: data.puzzleRating || localProgress.puzzleRating,
        streak: Math.max(localProgress.streak, data.streak || 0),
        completedLessons: mergedLessons,
      });

      set(s => ({
        user: {
          ...s.user,
          xp: Math.max(s.user.xp, data.xp || 0),
          level: Math.max(s.user.level, data.level || 1),
          puzzleRating: data.puzzleRating || s.user.puzzleRating,
          streak: Math.max(s.user.streak, data.streak || 0),
        },
        completedLessons: mergedLessons,
      }));
    } catch {
      // Offline
    }
  },

  calculateAndSyncStatistics: async () => {
    const { authToken } = get();
    if (!authToken) return;

    const p = Storage.getProgress();
    const catStats: Record<string, { solved: number; attempted: number }> = {};
    for (const entry of p.puzzleHistory || []) {
      if (!catStats[entry.category]) catStats[entry.category] = { solved: 0, attempted: 0 };
      catStats[entry.category].attempted++;
      if (entry.correct) catStats[entry.category].solved++;
    }

    const getAccuracy = (cats: string[]) => {
      let solved = 0;
      let attempted = 0;
      for (const cat of cats) {
        if (catStats[cat]) {
          solved += catStats[cat].solved;
          attempted += catStats[cat].attempted;
        }
      }
      return attempted > 0 ? solved / attempted : 0.5;
    };

    const tacticalAccuracy = getAccuracy(['forks', 'pins', 'skewers', 'double_attacks', 'discovered_attacks', 'discovered_checks', 'double_checks', 'deflection', 'decoy', 'attraction', 'clearance', 'interference', 'overloading', 'x_ray', 'zwischenzug', 'mating_nets', 'back_rank', 'smothered_mates', 'sacrifices', 'tactics']);
    const openingKnowledge = getAccuracy(['openings', 'opening', 'repertoire']);
    const endgameKnowledge = getAccuracy(['endgames', 'endgame']);
    const strategicUnderstanding = getAccuracy(['middlegames', 'middlegame', 'strategy', 'positional']);
    const puzzleAccuracy = p.puzzlesAttempted > 0 ? p.puzzlesSolved / p.puzzlesAttempted : 0.5;
    const calculationDepth = Math.max(3, Math.min(10, 3 + Math.floor(p.puzzlesSolved / 15)));

    try {
      await fetch(`${API_BASE}/api/progress/statistics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          tacticalAccuracy,
          openingKnowledge,
          endgameKnowledge,
          calculationDepth,
          strategicUnderstanding,
          puzzleAccuracy,
          timeUsage: 15
        })
      });
    } catch {
      // Offline
    }
  },
}));

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().syncToCloud();
    useAppStore.getState().syncFromCloud();
  });
}
