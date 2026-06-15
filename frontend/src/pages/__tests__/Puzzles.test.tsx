// ChessOS — Puzzles Page Unit Tests
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Puzzles } from '../Puzzles';
import { useAppStore } from '../../store/useAppStore';

// Mock Board and GuidedSolverPanel to avoid loading full Chess and canvas/animations
vi.mock('../../components/Board', () => ({
  Board: ({ fen, interactive, onMove }: any) => (
    <div data-testid="chess-board" data-fen={fen} data-interactive={interactive ? 'true' : 'false'}>
      <button 
        data-testid="make-move-btn" 
        onClick={() => onMove && onMove('e2', 'e4', 'e4')}
      >
        Make Move e2-e4
      </button>
    </div>
  )
}));

vi.mock('../../components/GuidedSolverPanel', () => ({
  GuidedSolverPanel: ({ puzzle, step, setStep }: any) => (
    <div data-testid="guided-solver">
      Guided Solver Step {step}
      <button onClick={() => setStep(step + 1)}>Next Step</button>
    </div>
  )
}));

// Mock Zustand store
vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

describe('Puzzles Page', () => {
  const mockAddXP = vi.fn();
  const mockUpdateRating = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockImplementation((selector: any) => {
      const state = {
        addXP: mockAddXP,
        updateRating: mockUpdateRating,
      };
      return selector(state);
    });
  });

  it('renders correctly and lists puzzle categories', () => {
    render(<Puzzles />);
    expect(screen.getByText('Tactical Solver Labs')).toBeInTheDocument();
    expect(screen.getByText('Forks')).toBeInTheDocument();
    expect(screen.getByText('Pins')).toBeInTheDocument();
  });

  it('can toggle between different solve modes', () => {
    render(<Puzzles />);
    
    // Check mode selector tabs exist
    expect(screen.getByRole('button', { name: 'Guided Coach' })).toBeInTheDocument();
    
    const practiceTab = screen.getByRole('button', { name: 'Standard Practice' });
    fireEvent.click(practiceTab);
    
    // Practice mode should show its instructions
    expect(screen.getByText('Standard Practice Mode')).toBeInTheDocument();
  });

  it('allows puzzle navigation using Prev and Next buttons', async () => {
    render(<Puzzles />);
    
    const nextBtn = screen.getByRole('button', { name: 'Next ▶' });
    const prevBtn = screen.getByRole('button', { name: '◀ Prev' });
    
    expect(nextBtn).toBeInTheDocument();
    expect(prevBtn).toBeInTheDocument();
    
    fireEvent.click(nextBtn);
    // Should navigate without crashing
  });
});
