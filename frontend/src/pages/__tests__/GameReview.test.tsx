import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GameReview } from '../GameReview';
import { useAppStore } from '../../store/useAppStore';

// Mock Board to prevent full SVG layout in JSDOM
vi.mock('../../components/Board', () => ({
  Board: ({ fen, onMove, interactive }: any) => (
    <div data-testid="chess-board" data-fen={fen}>
      <button onClick={() => onMove && onMove('c6', 'a5', 'Na5')}>Play Na5</button>
    </div>
  )
}));

// Mock Zustand store
vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

// Mock Stockfish Service
vi.mock('../../core/stockfishService', () => ({
  stockfishService: {
    analyze: vi.fn().mockResolvedValue({
      lines: [{ score: 0, scoreType: 'cp', depth: 5, multipv: 1, displayScore: '0.00', pv: [] }],
      bestMove: 'e2e4',
    }),
    init: vi.fn().mockResolvedValue(undefined),
  },
  default: {
    analyze: vi.fn().mockResolvedValue({
      lines: [{ score: 0, scoreType: 'cp', depth: 5, multipv: 1, displayScore: '0.00', pv: [] }],
      bestMove: 'e2e4',
    }),
    init: vi.fn().mockResolvedValue(undefined),
  }
}));

describe('GameReview Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockImplementation((selector: any) => {
      return 'dark'; // Mock theme as 'dark'
    });
    // Mock local storage
    localStorage.setItem('chessos_last_game', JSON.stringify({
      moves: ['e4', 'e5', 'Nf3', 'Nc6'],
      playerColor: 'w',
      aiLevel: 'intermediate'
    }));
  });

  it('renders GameReview analyzer successfully after analysis completes', async () => {
    render(<MemoryRouter><GameReview /></MemoryRouter>);
    
    // Check loading indicator shows up
    expect(screen.getByText(/Analyzing game with Stockfish/i)).toBeInTheDocument();
    
    // Wait for analysis to complete and loader to disappear
    await waitFor(() => {
      expect(screen.queryByText(/Analyzing game with Stockfish/i)).not.toBeInTheDocument();
    }, { timeout: 8000 });

    // Verify key metrics and titles are rendered
    expect(screen.getByText(/Performance Review/i)).toBeInTheDocument();
    expect(screen.getByText(/Overall Accuracy/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical Moment Replay/i)).toBeInTheDocument();
    expect(screen.getByText(/Engine Critique/i)).toBeInTheDocument();
  });

  it('allows user to interact with the Critical Moment solver', async () => {
    render(<MemoryRouter><GameReview /></MemoryRouter>);
    
    await waitFor(() => {
      expect(screen.queryByText(/Analyzing game with Stockfish/i)).not.toBeInTheDocument();
    }, { timeout: 8000 });

    // Solve blunder
    const playBtn = screen.getAllByRole('button', { name: /Play Na5/i })[1];
    fireEvent.click(playBtn);

    // Verify success banner appears
    await waitFor(() => {
      expect(screen.getByText(/Exercise Solved!/i)).toBeInTheDocument();
    });
  });
});
