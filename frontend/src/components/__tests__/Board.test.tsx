// ChessOS — Board Component Unit Tests
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Board } from '../Board';

describe('Board', () => {
  const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders starting position board successfully', () => {
    const { container } = render(<Board fen={startingFen} />);
    // Check that we render the board SVG
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    
    // There should be 64 squares represented as rects (first 64 are board squares)
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThanOrEqual(64);
  });

  it('displays coordinate labels correctly', () => {
    render(<Board fen={startingFen} />);
    
    // Check that files and ranks coordinate text elements are rendered
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('h')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('highlights the last move squares if provided', () => {
    const { container } = render(
      <Board 
        fen={startingFen} 
        lastMoveSquares={{ from: 'e2', to: 'e4' }} 
      />
    );
    // lastMoveSquares are drawn using LAST_MOVE_COLOR
    // Check if we have additional highlights (2 rects for last move)
    const rects = container.querySelectorAll('rect');
    // 64 squares + 1 background + 2 last move = 67 rects
    expect(rects.length).toBe(67);
  });

  it('renders custom highlights and arrows correctly', () => {
    const { container } = render(
      <Board 
        fen={startingFen} 
        highlights={[{ square: 'e4', color: 'rgba(255, 0, 0, 0.5)' }]}
        arrows={[{ from: 'g1', to: 'f3', color: 'blue' }]}
      />
    );
    
    // Check highlight rect exists
    const rects = container.querySelectorAll('rect');
    // 64 squares + 1 background + 1 custom highlight = 66
    expect(rects.length).toBe(66);

    // Check SVG lines (for arrows)
    const line = container.querySelector('line');
    expect(line).toBeInTheDocument();
    expect(line).toHaveAttribute('stroke', 'blue');
  });

  it('handles square clicks and triggers onSquareClick callback', () => {
    const onSquareClickMock = vi.fn();
    const { container } = render(
      <Board fen={startingFen} onSquareClick={onSquareClickMock} interactive={true} />
    );

    // Click on e2 square (which is columns/files e = index 4, ranks 2 = index 6 from top (8-7-6-5-4-3-2-1))
    // A simple way is to find the rect index corresponding to e2
    // file 'e' is index 4, rank '2' is index 6. In a flat array of 64: rIdx * 8 + fIdx = 6 * 8 + 4 = 52
    const rects = container.querySelectorAll('rect');
    // First rect is background (index 0). Squares start from index 1.
    // So flat index is 1 + 52 = 53
    const e2Square = rects[53];
    fireEvent.click(e2Square);

    expect(onSquareClickMock).toHaveBeenCalledWith('e2');
  });

  it('handles piece movement and triggers onMove callback', () => {
    const onMoveMock = vi.fn();
    const { container } = render(
      <Board fen={startingFen} onMove={onMoveMock} interactive={true} />
    );

    const rects = container.querySelectorAll('rect');
    // Click on e2 (index 53)
    const e2Square = rects[53];
    fireEvent.click(e2Square);

    // Click on e4 (file 'e' index 4, rank '4' index 4: 4 * 8 + 4 = 36. flat index: 37)
    const e4Square = rects[37];
    fireEvent.click(e4Square);

    expect(onMoveMock).toHaveBeenCalledWith('e2', 'e4', 'e4');
  });

  it('does not trigger onSquareClick or onMove when interactive is false', () => {
    const onSquareClickMock = vi.fn();
    const onMoveMock = vi.fn();
    const { container } = render(
      <Board 
        fen={startingFen} 
        onSquareClick={onSquareClickMock} 
        onMove={onMoveMock} 
        interactive={false} 
      />
    );

    const rects = container.querySelectorAll('rect');
    const e2Square = rects[53];
    fireEvent.click(e2Square);

    expect(onSquareClickMock).not.toHaveBeenCalled();
    expect(onMoveMock).not.toHaveBeenCalled();
  });
});
