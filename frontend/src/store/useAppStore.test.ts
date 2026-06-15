import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage globally for node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();
vi.stubGlobal('localStorage', localStorageMock);

// Import store after mocking localStorage
import { useAppStore } from './useAppStore';

describe('useAppStore Zustand Store', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Reset store to initial state before each test
    useAppStore.setState({
      activePage: 'dashboard',
      activeModuleId: null,
      activeLessonId: null,
      user: {
        id: 'local_user',
        email: 'Learner',
        xp: 0,
        level: 1,
        puzzleRating: 800,
        streak: 0,
      },
      completedLessons: [],
      activePuzzleId: null,
      boardFlipped: false
    });
  });

  it('should initialize with default local user and dashboard page', () => {
    const state = useAppStore.getState();
    expect(state.activePage).toBe('dashboard');
    expect(state.user.id).toBe('local_user');
    expect(state.user.xp).toBe(0);
    expect(state.user.level).toBe(1);
    expect(state.user.puzzleRating).toBe(800);
    expect(state.completedLessons).toEqual([]);
    expect(state.activePuzzleId).toBeNull();
  });

  it('should handle navigation successfully', () => {
    useAppStore.getState().setActivePage('puzzles');
    expect(useAppStore.getState().activePage).toBe('puzzles');

    useAppStore.getState().navigateToLesson('foundations', 'the-chessboard');
    expect(useAppStore.getState().activePage).toBe('lesson-detail');
    expect(useAppStore.getState().activeModuleId).toBe('foundations');
    expect(useAppStore.getState().activeLessonId).toBe('the-chessboard');
  });

  it('should toggle board flip', () => {
    expect(useAppStore.getState().boardFlipped).toBe(false);
    useAppStore.getState().toggleBoardFlip();
    expect(useAppStore.getState().boardFlipped).toBe(true);
  });

  it('should update XP and level up correctly', () => {
    useAppStore.getState().addXP(150);
    expect(useAppStore.getState().user.xp).toBe(150);
    expect(useAppStore.getState().user.level).toBe(1); // 150 < 250

    useAppStore.getState().addXP(150); // total 300 XP
    expect(useAppStore.getState().user.xp).toBe(300);
    expect(useAppStore.getState().user.level).toBe(2); // level 2 (300 >= 250)
  });

  it('should complete a lesson and save progress', () => {
    useAppStore.getState().completeLesson('foundations-the-chessboard');
    expect(useAppStore.getState().completedLessons).toContain('foundations-the-chessboard');
    expect(useAppStore.getState().user.xp).toBe(50); // complete lesson gives 50 XP
  });

  it('should adjust puzzle rating successfully', () => {
    useAppStore.getState().updateRating(25);
    expect(useAppStore.getState().user.puzzleRating).toBe(825);

    useAppStore.getState().updateRating(-10);
    expect(useAppStore.getState().user.puzzleRating).toBe(815);
  });

  it('should record puzzle outcomes successfully', () => {
    useAppStore.getState().recordPuzzle('mi1-001', true, 'mate_in_1');
    expect(useAppStore.getState().user.xp).toBe(15); // puzzle success gives 15 XP
    expect(useAppStore.getState().user.puzzleRating).toBeGreaterThan(800); // rating should increase
  });
});
