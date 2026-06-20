import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Achievements } from '../Achievements';
import { useAppStore } from '../../store/useAppStore';

vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

describe('Achievements Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockImplementation((selector: any) => {
      const state = {
        user: { email: 'test@chess.com', xp: 120, level: 2, puzzleRating: 1500, streak: 5 },
      };
      return selector(state);
    });
  });

  it('renders achievements layout and header successfully', () => {
    render(<Achievements />);
    expect(screen.getByText('Achievements & Rewards')).toBeInTheDocument();
    expect(screen.getByText('Trophy Room')).toBeInTheDocument();
  });

  it('displays filter tabs correctly', () => {
    render(<Achievements />);
    expect(screen.getByRole('button', { name: /Learning/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Streak/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rewards/ })).toBeInTheDocument();
  });
});
