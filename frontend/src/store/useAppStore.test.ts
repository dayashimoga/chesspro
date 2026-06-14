import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useAppStore';

describe('useAppStore Zustand Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useAppStore.setState({
      token: null,
      user: null,
      completedLessons: [],
      activePuzzleId: null
    });
  });

  it('should initialize with null state', () => {
    const state = useAppStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.completedLessons).toEqual([]);
    expect(state.activePuzzleId).toBeNull();
  });

  it('should handle login successfully', () => {
    const mockUser = {
      id: 'usr_abc',
      email: 'tester@chessos.com',
      xp: 120,
      level: 1,
      puzzleRating: 1200,
      streak: 3
    };

    useAppStore.getState().login('jwt-token-123', mockUser);
    
    const state = useAppStore.getState();
    expect(state.token).toBe('jwt-token-123');
    expect(state.user).toEqual(mockUser);
  });

  it('should handle logout successfully', () => {
    const mockUser = {
      id: 'usr_abc',
      email: 'tester@chessos.com',
      xp: 120,
      level: 1,
      puzzleRating: 1200,
      streak: 3
    };

    useAppStore.getState().login('jwt-token-123', mockUser);
    useAppStore.getState().logout();

    const state = useAppStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('should update XP and level up correctly', () => {
    const mockUser = {
      id: 'usr_abc',
      email: 'tester@chessos.com',
      xp: 100,
      level: 1,
      puzzleRating: 1200,
      streak: 3
    };

    useAppStore.getState().login('jwt-token-123', mockUser);
    useAppStore.getState().addXP(150); // new XP: 250, Level should be: 250 / 250 + 1 = 2

    const state = useAppStore.getState();
    expect(state.user?.xp).toBe(250);
    expect(state.user?.level).toBe(2);
  });

  it('should complete a lesson and add to list without duplicates', () => {
    useAppStore.getState().completeLesson('les_01');
    useAppStore.getState().completeLesson('les_01'); // duplicate check

    const state = useAppStore.getState();
    expect(state.completedLessons).toEqual(['les_01']);
  });

  it('should adjust puzzle rating successfully', () => {
    const mockUser = {
      id: 'usr_abc',
      email: 'tester@chessos.com',
      xp: 100,
      level: 1,
      puzzleRating: 1200,
      streak: 3
    };

    useAppStore.getState().login('jwt-token-123', mockUser);
    useAppStore.getState().updateRating(12);

    const state = useAppStore.getState();
    expect(state.user?.puzzleRating).toBe(1212);
  });
});
