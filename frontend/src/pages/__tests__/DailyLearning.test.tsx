import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DailyLearning } from '../DailyLearning';
import { useAppStore } from '../../store/useAppStore';

vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('DailyLearning Page', () => {
  const mockAddXP = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockImplementation((selector: any) => {
      const state = {
        user: { email: 'test@chess.com', xp: 120, level: 2, puzzleRating: 1500, streak: 5 },
        addXP: mockAddXP,
      };
      return selector(state);
    });
  });

  it('renders daily learning dashboard successfully', () => {
    render(<DailyLearning />);
    expect(screen.getByText('Your Personalized Training')).toBeInTheDocument();
    expect(screen.getByText(/Choose Session Length/)).toBeInTheDocument();
    expect(screen.getByText(/Skill Profile/)).toBeInTheDocument();
  });

  it('allows choosing a session length', () => {
    render(<DailyLearning />);
    const tenMinBtn = screen.getByRole('button', { name: /10 min/ });
    expect(tenMinBtn).toBeInTheDocument();
    fireEvent.click(tenMinBtn);
  });
});
