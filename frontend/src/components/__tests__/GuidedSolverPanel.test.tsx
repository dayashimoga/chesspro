// ChessOS — GuidedSolverPanel Component Unit Tests
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GuidedSolverPanel } from '../GuidedSolverPanel';
import { Puzzle } from '../../content/puzzle-db';
import { stockfishService } from '../../core/stockfishService';

// Mock stockfishService
vi.mock('../../core/stockfishService', () => ({
  stockfishService: {
    init: vi.fn().mockResolvedValue(undefined),
    send: vi.fn(),
    stop: vi.fn(),
    analyze: vi.fn().mockResolvedValue({
      bestMove: 'e2e4',
      lines: [
        { depth: 10, multipv: 1, score: 35, scoreType: 'cp', displayScore: '+0.35', pv: ['e2e4'] }
      ]
    })
  }
}));

describe('GuidedSolverPanel', () => {
  const mockPuzzle: Puzzle = {
    id: 'fork-001',
    category: 'forks',
    fen: 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
    solution: ['d5e6', 'f7e6', 'e5g6'],
    difficulty: 'intermediate',
    rating: 1200,
    theme: 'Double Attack',
    coachNotes: 'Look at the f7 square and the g6 fork opportunity.',
    alternatives: [
      { move: 'O-O', eval: '+0.10', reason: 'Castling is safe but slow, missing immediate tactics.' }
    ],
    commonErrors: [
      'Moving the bishop immediately releases the pressure in the center.'
    ]
  };

  const mockProps = {
    puzzle: mockPuzzle,
    onSolved: vi.fn(),
    onSelectHighlight: vi.fn(),
    step: 1,
    setStep: vi.fn(),
    lastMove: null,
    onChangeFen: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Step 1 (Evaluate King Safety) initially', () => {
    render(<GuidedSolverPanel {...mockProps} />);
    expect(screen.getByText(/Evaluate King Safety/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1\/8/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'White' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Black' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Equal' })).toBeInTheDocument();
  });

  it('handles Step 1 submission and advances step', async () => {
    render(<GuidedSolverPanel {...mockProps} />);
    
    // For forks-001, default heuristic might return 'Equal' or 'Black'
    // Click 'Black' which is often vulnerable in tactical puzzles
    const blackBtn = screen.getByRole('button', { name: 'Black' });
    fireEvent.click(blackBtn);
    
    // It should check and show feedback. Let's wait for the setStep callback to be called.
    await waitFor(() => {
      expect(mockProps.setStep).toHaveBeenCalledWith(2);
    }, { timeout: 2500 });
  });

  it('renders Step 2 (Tactical Motifs) and advances on selection', async () => {
    render(<GuidedSolverPanel {...mockProps} step={2} />);
    expect(screen.getByText(/Identify Tactical Motifs/i)).toBeInTheDocument();
    
    const forkMotifBtn = screen.getByText('Forks & Double Attacks');
    fireEvent.click(forkMotifBtn);
    
    await waitFor(() => {
      expect(mockProps.setStep).toHaveBeenCalledWith(3);
    }, { timeout: 2500 });
  });

  it('renders Step 3 (Weaknesses & Overloads) and verifies user input', async () => {
    render(<GuidedSolverPanel {...mockProps} step={3} />);
    expect(screen.getByText(/Spot Weaknesses & Overloads/i)).toBeInTheDocument();
    
    const input = screen.getByPlaceholderText(/e.g. f7, c6, none/i);
    const verifyBtn = screen.getByRole('button', { name: 'Verify' });
    
    // Input overloaded target (e.g. d7, which is the mapped coordinate for fork-001)
    fireEvent.change(input, { target: { value: 'd7' } });
    fireEvent.click(verifyBtn);
    
    await waitFor(() => {
      expect(mockProps.setStep).toHaveBeenCalledWith(4);
    }, { timeout: 2500 });
  });

  it('renders Step 6 (Evaluation Changes) and triggers Stockfish analysis', async () => {
    render(<GuidedSolverPanel {...mockProps} step={6} />);
    expect(screen.getByText(/Evaluation Changes/i)).toBeInTheDocument();
    
    // It should trigger Stockfish analysis
    await waitFor(() => {
      expect(stockfishService.analyze).toHaveBeenCalled();
    }, { timeout: 2500 });
  });
});
