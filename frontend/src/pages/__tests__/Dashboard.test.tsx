// ChessOS — Dashboard Component Unit Tests
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { useAppStore } from '../../store/useAppStore';

// Mock Zustand store
vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

describe('Dashboard', () => {
  const mockSetActivePage = vi.fn();
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
        setActivePage: mockSetActivePage,
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
    expect(mockSetActivePage).toHaveBeenCalledWith('puzzles');
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
