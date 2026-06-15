import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, Square } from 'chess.js';

// SVG piece paths (CBurnett-style)
const PIECE_SVG: Record<string, string> = {
  K: `<g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0"/></g>`,
  Q: `<g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15L14 11v14L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g>`,
  R: `<g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M15 17v7h15v-7" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt" stroke-linejoin="miter"/></g>`,
  B: `<g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter"/></g>`,
  N: `<g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#000"/></g>`,
  P: `<path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>`,
  k: `<g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#000"/><path d="M20 8h5" stroke-linejoin="miter"/><path d="M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5l.01 2.1-.01-2.1C20 18 9.906 14 6.997 19.85c-2.497 5.65 4.853 9 4.853 9" stroke="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/></g>`,
  q: `<g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000" stroke="none"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/></g><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z" fill="#000" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#000" stroke-linecap="butt"/><path d="M11 38.5a35 35 1 0 0 23 0" fill="none" stroke-linecap="butt"/><path d="M11 29a35 35 1 0 1 23 0M12.5 31.5h20M11.5 34.5a35 35 1 0 0 22 0M10.5 37.5a35 35 1 0 0 24 0" fill="none" stroke="#fff"/></g>`,
  r: `<g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z" stroke-linecap="butt" fill="#000"/><path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter" fill="#000"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt" fill="#000"/><path d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23" fill="none" stroke="#fff" stroke-width="1" stroke-linejoin="miter"/></g>`,
  b: `<g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z" fill="#000"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill="#000"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill="#000"/><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" fill="none" stroke="#fff" stroke-linejoin="miter"/></g>`,
  n: `<g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#fff" stroke="#fff"/></g>`,
  p: `<path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>`,
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const LIGHT_COLOR = '#e8dcc8';
const DARK_COLOR = '#7b945d';
const LAST_MOVE_COLOR = 'rgba(255, 255, 80, 0.25)';
const SELECTED_COLOR = 'rgba(16, 185, 129, 0.5)';
const CHECK_COLOR = 'rgba(239, 68, 68, 0.6)';

export interface BoardProps {
  fen: string;
  interactive?: boolean;
  flipped?: boolean;
  size?: number;
  onMove?: (from: string, to: string, san: string) => void;
  onSquareClick?: (square: string) => void;
  highlights?: Array<{ square: string; color?: string }>;
  arrows?: Array<{ from: string; to: string; color?: string; dashed?: boolean; width?: number }>;
  lastMoveSquares?: { from: string; to: string } | null;
  allowedMoves?: string[]; // squares that are legal targets for the selected piece
}

export const Board: React.FC<BoardProps> = ({
  fen,
  interactive = true,
  flipped = false,
  size,
  onMove,
  onSquareClick,
  highlights = [],
  arrows = [],
  lastMoveSquares = null,
  allowedMoves = [],
}) => {
  const [selectedSq, setSelectedSq] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<Array<{ to: string; captured?: string }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(size || 400);

  // Responsive sizing
  useEffect(() => {
    if (size) { setBoardSize(size); return; }
    const updateSize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement?.offsetWidth || 400;
        setBoardSize(Math.min(parentWidth - 16, 480));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [size]);

  const sqSize = boardSize / 8;

  // Create a new Chess instance each render (cheap for board display)
  let game: Chess;
  try {
    game = new Chess(fen);
  } catch {
    game = new Chess();
  }
  const board = game.board();

  // Find check square
  let checkSquare: string | null = null;
  if (game.isCheck()) {
    const turn = game.turn();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = board[r][f];
        if (p && p.type === 'k' && p.color === turn) {
          checkSquare = FILES[f] + RANKS[r];
        }
      }
    }
  }

  const getFileIdx = (sq: string) => FILES.indexOf(sq[0]);
  const getRankIdx = (sq: string) => RANKS.indexOf(sq[1]);

  const toSVGCoords = (fileIdx: number, rankIdx: number) => {
    const f = flipped ? 7 - fileIdx : fileIdx;
    const r = flipped ? 7 - rankIdx : rankIdx;
    return { x: f * sqSize, y: r * sqSize };
  };

  const handleSquareClick = useCallback((square: string) => {
    if (!interactive) return;
    onSquareClick?.(square);

    if (selectedSq) {
      if (selectedSq === square) {
        setSelectedSq(null);
        setLegalMoves([]);
        return;
      }
      // Check if this is a legal target
      const isLegal = legalMoves.some(m => m.to === square);
      if (isLegal) {
        try {
          const piece = game.get(selectedSq as Square);
          let promotion: string | undefined;
          if (piece?.type === 'p') {
            const toRank = square[1];
            if ((piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1')) {
              promotion = 'q';
            }
          }
          const move = game.move({ from: selectedSq, to: square, promotion: promotion as any });
          if (move && onMove) {
            onMove(selectedSq, square, move.san);
          }
        } catch { /* noop */ }
        setSelectedSq(null);
        setLegalMoves([]);
        return;
      }
      // Clicking a different own piece
      const piece = game.get(square as Square);
      if (piece && piece.color === game.turn()) {
        setSelectedSq(square);
        const moves = game.moves({ square: square as Square, verbose: true });
        setLegalMoves(moves.map(m => ({ to: m.to, captured: m.captured })));
        return;
      }
      setSelectedSq(null);
      setLegalMoves([]);
    } else {
      const piece = game.get(square as Square);
      if (piece && piece.color === game.turn()) {
        setSelectedSq(square);
        const moves = game.moves({ square: square as Square, verbose: true });
        setLegalMoves(moves.map(m => ({ to: m.to, captured: m.captured })));
      }
    }
  }, [interactive, selectedSq, legalMoves, fen, onMove, onSquareClick, flipped]);

  // Reset selection when FEN changes
  useEffect(() => {
    setSelectedSq(null);
    setLegalMoves([]);
  }, [fen]);

  const files = flipped ? [...FILES].reverse() : FILES;
  const ranks = flipped ? [...RANKS].reverse() : RANKS;

  return (
    <div
      ref={containerRef}
      className="chessboard-container"
      style={{ width: boardSize, height: boardSize }}
    >
      <svg
        width={boardSize}
        height={boardSize}
        viewBox={`0 0 ${boardSize} ${boardSize}`}
        className="chess-board-svg"
        style={{ userSelect: 'none' }}
      >
        {/* Background */}
        <rect x={0} y={0} width={boardSize} height={boardSize} fill="#2a2a3a" rx={4} />

        {/* Squares */}
        {ranks.map((rank, rIdx) =>
          files.map((file, fIdx) => {
            const isLight = (rIdx + fIdx) % 2 === 0;
            return (
              <rect
                key={`sq-${file}${rank}`}
                x={fIdx * sqSize}
                y={rIdx * sqSize}
                width={sqSize}
                height={sqSize}
                fill={isLight ? LIGHT_COLOR : DARK_COLOR}
                onClick={() => handleSquareClick(`${file}${rank}`)}
                style={{ cursor: interactive ? 'pointer' : 'default' }}
              />
            );
          })
        )}

        {/* Last move highlights */}
        {lastMoveSquares && [lastMoveSquares.from, lastMoveSquares.to].map(sq => {
          const pos = toSVGCoords(getFileIdx(sq), getRankIdx(sq));
          return (
            <rect
              key={`lm-${sq}`}
              x={pos.x} y={pos.y}
              width={sqSize} height={sqSize}
              fill={LAST_MOVE_COLOR}
              pointerEvents="none"
            />
          );
        })}

        {/* Selected square highlight */}
        {selectedSq && (() => {
          const pos = toSVGCoords(getFileIdx(selectedSq), getRankIdx(selectedSq));
          return (
            <rect
              x={pos.x} y={pos.y}
              width={sqSize} height={sqSize}
              fill={SELECTED_COLOR}
              pointerEvents="none"
            />
          );
        })()}

        {/* Check highlight */}
        {checkSquare && (() => {
          const pos = toSVGCoords(getFileIdx(checkSquare), getRankIdx(checkSquare));
          return (
            <rect
              x={pos.x} y={pos.y}
              width={sqSize} height={sqSize}
              fill={CHECK_COLOR}
              pointerEvents="none"
            />
          );
        })()}

        {/* Custom highlights */}
        {highlights.map((hl, idx) => {
          const pos = toSVGCoords(getFileIdx(hl.square), getRankIdx(hl.square));
          return (
            <rect
              key={`hl-${idx}`}
              x={pos.x} y={pos.y}
              width={sqSize} height={sqSize}
              fill={hl.color || 'rgba(16, 185, 129, 0.3)'}
              pointerEvents="none"
            />
          );
        })}

        {/* Pieces */}
        {board.map((row, rIdx) =>
          row.map((piece, fIdx) => {
            if (!piece) return null;
            const svgKey = piece.color === 'w' ? piece.type.toUpperCase() : piece.type;
            const svg = PIECE_SVG[svgKey];
            if (!svg) return null;
            const pos = toSVGCoords(fIdx, rIdx);
            const scale = sqSize / 45;
            return (
              <g
                key={`piece-${fIdx}-${rIdx}`}
                transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`}
                style={{ 
                  cursor: interactive ? 'pointer' : 'default',
                  transition: 'transform 0.2s ease-in-out'
                }}
                onClick={() => handleSquareClick(FILES[fIdx] + RANKS[rIdx])}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            );
          })
        )}

        {/* Legal move indicators */}
        {legalMoves.map(move => {
          const pos = toSVGCoords(getFileIdx(move.to), getRankIdx(move.to));
          if (move.captured) {
            return (
              <circle
                key={`legal-${move.to}`}
                cx={pos.x + sqSize / 2}
                cy={pos.y + sqSize / 2}
                r={sqSize / 2 - 2}
                fill="none"
                stroke="rgba(16, 185, 129, 0.6)"
                strokeWidth={3}
                pointerEvents="none"
              />
            );
          }
          return (
            <circle
              key={`legal-${move.to}`}
              cx={pos.x + sqSize / 2}
              cy={pos.y + sqSize / 2}
              r={sqSize / 6}
              fill="rgba(16, 185, 129, 0.4)"
              pointerEvents="none"
            />
          );
        })}

        {/* Arrows */}
        {arrows.map((arrow, idx) => {
          const fromPos = toSVGCoords(getFileIdx(arrow.from), getRankIdx(arrow.from));
          const toPos = toSVGCoords(getFileIdx(arrow.to), getRankIdx(arrow.to));
          const x1 = fromPos.x + sqSize / 2;
          const y1 = fromPos.y + sqSize / 2;
          const x2 = toPos.x + sqSize / 2;
          const y2 = toPos.y + sqSize / 2;
          const color = arrow.color || 'rgba(245, 158, 11, 0.8)';
          const markerId = `arrow-marker-${idx}`;
          return (
            <g key={`arrow-${idx}`}>
              <defs>
                <marker
                  id={markerId}
                  viewBox="0 0 10 10"
                  refX={8} refY={5}
                  markerWidth={4} markerHeight={4}
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
                </marker>
              </defs>
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color}
                strokeWidth={arrow.width || 8}
                strokeLinecap="round"
                markerEnd={`url(#${markerId})`}
                opacity={0.8}
                strokeDasharray={arrow.dashed ? '8,4' : undefined}
                pointerEvents="none"
              />
            </g>
          );
        })}

        {/* Coordinate labels */}
        {files.map((file, fIdx) => {
          const isLight = (7 + fIdx) % 2 === 0;
          return (
            <text
              key={`coord-file-${file}`}
              x={fIdx * sqSize + sqSize - 4}
              y={7 * sqSize + sqSize - 3}
              fontSize={Math.max(9, sqSize * 0.18)}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight={700}
              fill={isLight ? DARK_COLOR : LIGHT_COLOR}
              opacity={0.85}
              pointerEvents="none"
              textAnchor="end"
            >
              {file}
            </text>
          );
        })}
        {ranks.map((rank, rIdx) => {
          const isLight = (rIdx) % 2 === 0;
          return (
            <text
              key={`coord-rank-${rank}`}
              x={3}
              y={rIdx * sqSize + Math.max(10, sqSize * 0.22)}
              fontSize={Math.max(9, sqSize * 0.18)}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight={700}
              fill={isLight ? DARK_COLOR : LIGHT_COLOR}
              opacity={0.85}
              pointerEvents="none"
            >
              {rank}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default Board;
