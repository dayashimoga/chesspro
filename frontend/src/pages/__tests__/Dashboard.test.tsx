// ChessOS — Dashboard Component Unit Tests
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { useAppStore } from '../../store/useAppStore';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock Zustand store
vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

// Mock core engines for deterministic tests
vi.mock('../../core/storage', () => ({
  Storage: {
    analyzeWeaknesses: () => ({ weaknesses: ['calculation'] }),
    getProgress: () => ({ lastActiveLesson: 'foundations/rules', favorites: ['foundations/rules'] }),
  },
  SpacedRepetition: {
    getStats: () => ({ due: 3 }),
  },
}));

vi.mock('../../core/adaptive-engine', () => ({
  AdaptiveEngine: {
    analyzeProfile: () => ({
      overallRating: 1200,
      confidence: 0.85,
      weakAreas: ['calculation'],
      trends: [],
    }),
    getRatings: () => ({
      tactical: 1250,
      strategic: 1000,
      opening: 1100,
      middlegame: 1050,
      endgame: 950,
      calculation: 850,
      visualization: 900,
      patternRecognition: 1150,
    }),
  },
}));

vi.mock('../../core/gamification', () => ({
  Gamification: {
    getStats: () => ({ puzzlesSolved: 10, lessonsCompleted: 5 }),
    getDailyChallenges: () => [
      { id: '1', title: 'Solve 3 Puzzles', description: 'Solve 3 puzzles of any rating', target: 3, current: 1, xpReward: 50, completed: false, icon: '🎯' },
    ],
    getAllAchievements: () => [
      { id: 'first_steps', title: 'First Steps', description: 'Complete your first lesson', unlocked: true, icon: '🚀' },
      { id: 'tactician_1', title: 'Tactician I', description: 'Solve 10 puzzles', unlocked: true, icon: '🧩' },
    ],
  },
}));

describe('Dashboard', () => {
  const mockUser = {
    email: 'testuser@chessos.com',
    puzzleRating: 1200,
    streak: 5,
    xp: 320,
    level: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation of useAppStore
    (useAppStore as any).mockImplementation((selector: any) => {
      const state = {
        user: mockUser,
        completedLessons: ['foundations-rules', 'foundations-movement'],
        favorites: ['foundations/rules'],
      };
      return selector(state);
    });
  });

  it('renders user welcome banner and key metrics', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('testuser@chessos.com')).toBeInTheDocument();
    expect(screen.getByText('1200')).toBeInTheDocument(); // Puzzle Elo
    expect(screen.getByText(/🔥 5/i)).toBeInTheDocument(); // Streak
    expect(screen.getByText(/Lv2/i)).toBeInTheDocument(); // Level badge
  });

  it('renders quick action buttons and handles clicks', () => {
    render(<Dashboard />);
    
    const solvePuzzlesBtn = screen.getByText('Solve Puzzles');
    const playAIBtn = screen.getByText('Play vs AI');
    
    expect(solvePuzzlesBtn).toBeInTheDocument();
    expect(playAIBtn).toBeInTheDocument();

    fireEvent.click(solvePuzzlesBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/puzzles');
  });

  it('renders skill tree nodes based on progress', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Chess Foundations')).toBeInTheDocument();
    expect(screen.getByText('Tactical Motifs')).toBeInTheDocument();
  });

  it('renders achievements status', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('First Steps')).toBeInTheDocument();
    expect(screen.getByText('Tactician I')).toBeInTheDocument();
  });
});
