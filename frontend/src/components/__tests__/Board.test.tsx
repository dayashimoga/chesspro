// ChessOS — Board Component Unit Tests
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import { Board } from '../Board';

describe('Board', () => {
  const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const dispatchPointerEvent = (element: Element, type: 'pointerdown' | 'pointerup', clientX: number, clientY: number) => {
    const event = type === 'pointerdown' ? createEvent.pointerDown(element) : createEvent.pointerUp(element);
    Object.defineProperty(event, 'clientX', { value: clientX, enumerable: true });
    Object.defineProperty(event, 'clientY', { value: clientY, enumerable: true });
    fireEvent(element, event);
  };

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
      <Board fen={startingFen} onSquareClick={onSquareClickMock} interactive={true} size={400} />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    vi.spyOn(svg!, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 400,
      bottom: 400,
      width: 400,
      height: 400,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);

    // e2 square: file 'e' (index 4) -> x = 4*50 + 25 = 225. rank '2' (index 6) -> y = 6*50 + 25 = 325.
    dispatchPointerEvent(svg!, 'pointerdown', 225, 325);
    dispatchPointerEvent(svg!, 'pointerup', 225, 325);

    expect(onSquareClickMock).toHaveBeenCalledWith('e2');
  });

  it('handles piece movement and triggers onMove callback', () => {
    const onMoveMock = vi.fn();
    const { container } = render(
      <Board fen={startingFen} onMove={onMoveMock} interactive={true} size={400} />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    vi.spyOn(svg!, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 400,
      bottom: 400,
      width: 400,
      height: 400,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);

    // Press down and release on e2 (index 4, 6) -> x=225, y=325
    dispatchPointerEvent(svg!, 'pointerdown', 225, 325);
    dispatchPointerEvent(svg!, 'pointerup', 225, 325);

    // Press down and release on e4 (index 4, 4) -> x=225, y=225
    dispatchPointerEvent(svg!, 'pointerdown', 225, 225);
    dispatchPointerEvent(svg!, 'pointerup', 225, 225);

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
        size={400}
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    vi.spyOn(svg!, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 400,
      bottom: 400,
      width: 400,
      height: 400,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);

    dispatchPointerEvent(svg!, 'pointerdown', 225, 325);
    dispatchPointerEvent(svg!, 'pointerup', 225, 325);

    expect(onSquareClickMock).not.toHaveBeenCalled();
    expect(onMoveMock).not.toHaveBeenCalled();
  });

  it('supports right-click highlights and clears on left click', () => {
    const { container } = render(<Board fen={startingFen} interactive={true} size={400} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    vi.spyOn(svg!, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 400,
      bottom: 400,
      width: 400,
      height: 400,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);

    // Simulate right-click (button: 2) on e2 (x: 225, y: 325)
    const rightClickDown = createEvent.pointerDown(svg!);
    Object.defineProperty(rightClickDown, 'button', { value: 2, enumerable: true });
    Object.defineProperty(rightClickDown, 'clientX', { value: 225, enumerable: true });
    Object.defineProperty(rightClickDown, 'clientY', { value: 325, enumerable: true });
    fireEvent(svg!, rightClickDown);

    const rightClickUp = createEvent.pointerUp(svg!);
    Object.defineProperty(rightClickUp, 'button', { value: 2, enumerable: true });
    Object.defineProperty(rightClickUp, 'clientX', { value: 225, enumerable: true });
    Object.defineProperty(rightClickUp, 'clientY', { value: 325, enumerable: true });
    fireEvent(svg!, rightClickUp);

    // Expecting 1 user-drawn highlight rectangle
    const highlightsAfterRightClick = container.querySelectorAll('rect[fill="rgba(245, 158, 11, 0.35)"]');
    expect(highlightsAfterRightClick.length).toBe(1);

    // Simulate left-click down to clear highlights
    const leftClickDown = createEvent.pointerDown(svg!);
    Object.defineProperty(leftClickDown, 'button', { value: 0, enumerable: true });
    Object.defineProperty(leftClickDown, 'clientX', { value: 225, enumerable: true });
    Object.defineProperty(leftClickDown, 'clientY', { value: 325, enumerable: true });
    fireEvent(svg!, leftClickDown);

    const highlightsCleared = container.querySelectorAll('rect[fill="rgba(245, 158, 11, 0.35)"]');
    expect(highlightsCleared.length).toBe(0);
  });
});

