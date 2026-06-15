// ChessOS — EndgameTrainer Page Unit Tests
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EndgameTrainer } from '../EndgameTrainer';
import { useAppStore } from '../../store/useAppStore';

// Mock Board dynamically with inputs
vi.mock('../../components/Board', () => ({
  Board: ({ fen, interactive, onMove }: any) => {
    const [fromVal, setFromVal] = React.useState('');
    const [toVal, setToVal] = React.useState('');
    return (
      <div data-testid="chess-board" data-fen={fen} data-interactive={interactive ? 'true' : 'false'}>
        <input 
          data-testid="from-input" 
          value={fromVal} 
          onChange={(e) => setFromVal(e.target.value)} 
        />
        <input 
          data-testid="to-input" 
          value={toVal} 
          onChange={(e) => setToVal(e.target.value)} 
        />
        <button 
          data-testid="submit-move" 
          onClick={() => onMove && onMove(fromVal, toVal)}
        >
          Submit Move
        </button>
      </div>
    );
  }
}));

// Mock Zustand store
vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

describe('EndgameTrainer Page', () => {
  const mockAddXP = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockImplementation((selector: any) => {
      const state = {
        addXP: mockAddXP,
      };
      return selector(state);
    });
  });

  it('renders correctly and lists endgame drills', () => {
    render(<EndgameTrainer />);
    expect(screen.getByText('Theoretical Endgame Drills')).toBeInTheDocument();
    expect(screen.getAllByText('King Opposition Drill')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Triangulation Drill')[0]).toBeInTheDocument();
  });

  it('handles a correct move in King Opposition Drill', () => {
    render(<EndgameTrainer />);
    
    // Default selected drill is King Opposition. Expected move b1 (wait, expected b1? Let's check Kd4/Ke4/Kf4)
    // King opposition step 0 expects: ['Kd4', 'Ke4', 'Kf4']
    // So 'to' = 'd4' should be correct.
    const fromInput = screen.getByTestId('from-input');
    const toInput = screen.getByTestId('to-input');
    const submitBtn = screen.getByTestId('submit-move');

    fireEvent.change(fromInput, { target: { value: 'e4' } });
    fireEvent.change(toInput, { target: { value: 'd4' } });
    fireEvent.click(submitBtn);
    
    expect(screen.getByText(/Correct move!/)).toBeInTheDocument();
    expect(mockAddXP).toHaveBeenCalledWith(5);
  });

  it('handles an incorrect move', () => {
    render(<EndgameTrainer />);
    
    const fromInput = screen.getByTestId('from-input');
    const toInput = screen.getByTestId('to-input');
    const submitBtn = screen.getByTestId('submit-move');

    fireEvent.change(fromInput, { target: { value: 'e4' } });
    fireEvent.change(toInput, { target: { value: 'a5' } });
    fireEvent.click(submitBtn);
    
    expect(screen.getByText(/Incorrect. Review the key concepts/)).toBeInTheDocument();
    expect(mockAddXP).not.toHaveBeenCalled();
  });

  it('can switch drills and validate triangulation', () => {
    render(<EndgameTrainer />);
    
    // Switch to Triangulation Drill
    const drillBtn = screen.getByRole('button', { name: /Triangulation Drill/ });
    fireEvent.click(drillBtn);
    
    // Verify that the title in theory guide is updated
    expect(screen.getAllByText('Triangulation Drill')[0]).toBeInTheDocument();
    
    // Triangulation Drill expects: ['Kd3', 'Ke2', 'Kd2']
    // Step 0 expected: Kd3 (cleanMoveSquare('Kd3') = 'd3')
    const fromInput = screen.getByTestId('from-input');
    const toInput = screen.getByTestId('to-input');
    const submitBtn = screen.getByTestId('submit-move');

    fireEvent.change(fromInput, { target: { value: 'e3' } });
    fireEvent.change(toInput, { target: { value: 'd3' } });
    fireEvent.click(submitBtn);
    
    expect(screen.getByText(/Correct move! Step 1\/3 completed/)).toBeInTheDocument();
    expect(mockAddXP).toHaveBeenCalledWith(5);
  });
});
