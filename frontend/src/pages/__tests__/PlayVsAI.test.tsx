import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayVsAI } from '../PlayVsAI';
import { useAppStore } from '../../store/useAppStore';

// Mock Board to prevent full SVG coordinates layout loading in JSDOM
vi.mock('../../components/Board', () => ({
  Board: ({ fen, interactive, onMove }: any) => (
    <div data-testid="chess-board" data-fen={fen} data-interactive={interactive ? 'true' : 'false'}>
      <button onClick={() => onMove && onMove('e2', 'e4', 'e4')}>Move</button>
    </div>
  )
}));

vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

describe('PlayVsAI Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockImplementation((selector: any) => {
      // Mock theme value
      return 'dark';
    });
  });

  it('renders PlayVsAI arena successfully', () => {
    render(<PlayVsAI />);
    expect(screen.getByText(/Play vs/i)).toBeInTheDocument();
    expect(screen.getByText(/Chess AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Game Setup/i)).toBeInTheDocument();
    expect(screen.getByText(/Game Moves/i)).toBeInTheDocument();
  });

  it('allows changing AI difficulty and player color selection', () => {
    render(<PlayVsAI />);
    
    // Choose Black
    const playBlackBtn = screen.getByRole('button', { name: /Black/ });
    expect(playBlackBtn).toBeInTheDocument();
    fireEvent.click(playBlackBtn);

    // Difficulty settings
    const difficultySelect = screen.getByRole('combobox');
    expect(difficultySelect).toBeInTheDocument();
    fireEvent.change(difficultySelect, { target: { value: 'expert' } });
    expect(difficultySelect).toHaveValue('expert');
  });
});
