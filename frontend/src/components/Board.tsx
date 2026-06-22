import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { useAppStore } from '../store/useAppStore';

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

const BOARD_THEMES = {
  green: { light: '#e8dcc8', dark: '#7b945d' },
  brown: { light: '#f0d9b5', dark: '#b58863' },
  blue: { light: '#dee3e6', dark: '#8ca2ad' },
  tournament: { light: '#e1e1e1', dark: '#4b7399' },
  wood: { light: '#f0d9b5', dark: '#a05a2c' },
  dark: { light: '#334155', dark: '#0f172a' },
};
const LAST_MOVE_COLOR = 'rgba(255, 255, 80, 0.25)';
const SELECTED_COLOR = 'rgba(16, 185, 129, 0.5)';
const CHECK_COLOR = 'rgba(239, 68, 68, 0.6)';

// Sound effect synthesizer using Web Audio API
class SoundEngine {
  private static ctx: AudioContext | null = null;

  private static getContext(): AudioContext | null {
    if (!this.ctx) {
      try { this.ctx = new AudioContext(); } catch { return null; }
    }
    return this.ctx;
  }

  static playMove() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  }

  static playCapture() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }

  static playCheck() {
    const ctx = this.getContext();
    if (!ctx) return;
    [800, 1000].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.15);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.15);
    });
  }

  static playCastle() {
    const ctx = this.getContext();
    if (!ctx) return;
    [300, 400, 500].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.1);
      osc.start(ctx.currentTime + i * 0.06);
      osc.stop(ctx.currentTime + i * 0.06 + 0.1);
    });
  }

  static playGameEnd() {
    const ctx = this.getContext();
    if (!ctx) return;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  }
}

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
  allowedMoves?: string[];
  soundEnabled?: boolean;
  boardTheme?: 'green' | 'brown' | 'blue' | 'tournament' | 'wood' | 'dark';
  pieceSet?: 'standard' | 'neo' | 'alpha' | 'merida';
}

interface DragState {
  piece: string;
  from: string;
  svgKey: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  active: boolean;
  alreadySelectedOnDown: boolean;
}

// Helpers for parsing FEN and detecting movement between FENs to animate pieces
function parseFen(fen: string): Array<Array<{ type: string; color: string } | null>> {
  const board: Array<Array<{ type: string; color: string } | null>> = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  const parts = fen.split(' ');
  const rows = parts[0].split('/');
  for (let r = 0; r < 8; r++) {
    let f = 0;
    for (let c = 0; c < rows[r].length; c++) {
      const char = rows[r][c];
      if (isNaN(Number(char))) {
        const color = char === char.toUpperCase() ? 'w' : 'b';
        board[r][f] = { type: char.toLowerCase(), color };
        f++;
      } else {
        f += Number(char);
      }
    }
  }
  return board;
}

function detectMoveDiff(prevFen: string, currentFen: string) {
  try {
    const prev = parseFen(prevFen);
    const curr = parseFen(currentFen);
    
    let from: { r: number; f: number; piece: { type: string; color: string } } | null = null;
    let to: { r: number; f: number; piece: { type: string; color: string } } | null = null;
    
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const pPiece = prev[r][f];
        const cPiece = curr[r][f];
        
        if (pPiece && !cPiece) {
          from = { r, f, piece: pPiece };
        } else if (!pPiece && cPiece) {
          to = { r, f, piece: cPiece };
        } else if (pPiece && cPiece && (pPiece.type !== cPiece.type || pPiece.color !== cPiece.color)) {
          to = { r, f, piece: cPiece };
        }
      }
    }
    
    if (from && to) {
      return {
        fromFile: from.f,
        fromRank: from.r,
        toFile: to.f,
        toRank: to.r,
        piece: to.piece
      };
    }
  } catch (e) {
    // ignore parsing errors
  }
  return null;
}

export const Board: React.FC<BoardProps> = ({
  fen,
  interactive = true,
  flipped: propFlipped,
  size,
  onMove,
  onSquareClick,
  highlights = [],
  arrows = [],
  lastMoveSquares = null,
  allowedMoves = [],
  soundEnabled = true,
  boardTheme: propBoardTheme,
  pieceSet: propPieceSet,
}) => {
  const globalBoardTheme = useAppStore(s => s.boardTheme);
  const globalPieceSet = useAppStore(s => s.pieceSet);
  const globalBoardFlipped = useAppStore(s => s.boardFlipped);

  const boardTheme = propBoardTheme !== undefined ? propBoardTheme : globalBoardTheme;
  const pieceSet = propPieceSet !== undefined ? propPieceSet : globalPieceSet;
  const flipped = propFlipped !== undefined ? propFlipped : globalBoardFlipped;
  const [selectedSq, setSelectedSq] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<Array<{ to: string; captured?: string }>>([]);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [animatingPiece, setAnimatingPiece] = useState<{
    key: string; fromX: number; fromY: number; toX: number; toY: number; svgKey: string;
  } | null>(null);

  // Right-click interactive drawing states
  const [rightDrag, setRightDrag] = useState<{ from: string; to: string } | null>(null);
  const [drawnArrows, setDrawnArrows] = useState<Array<{ from: string; to: string; color?: string; dashed?: boolean; width?: number }>>([]);
  const [drawnHighlights, setDrawnHighlights] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [boardSize, setBoardSize] = useState(size || 400);
  const prevFenRef = useRef(fen);

  const themeColors = BOARD_THEMES[boardTheme] || BOARD_THEMES.green;
  const lightColor = themeColors.light;
  const darkColor = themeColors.dark;

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

  const borderWidth = boardSize > 300 ? 18 : 12;
  const gridSize = boardSize - 2 * borderWidth;
  const sqSize = gridSize / 8;

  let game: Chess;
  try {
    game = new Chess(fen);
  } catch {
    game = new Chess();
  }
  const board = game.board();

  // Detect piece animation on FEN change
  useEffect(() => {
    if (prevFenRef.current !== fen) {
      const diff = detectMoveDiff(prevFenRef.current, fen);
      if (diff) {
        const dx = diff.fromFile - diff.toFile;
        const dy = diff.fromRank - diff.toRank;
        const multiplier = flipped ? -1 : 1;

        setAnimatingPiece({
          key: `piece-${diff.toFile}-${diff.toRank}`,
          fromX: dx * sqSize * multiplier,
          fromY: dy * sqSize * multiplier,
          toX: 0,
          toY: 0,
          svgKey: diff.piece.color === 'w' ? diff.piece.type.toUpperCase() : diff.piece.type
        });

        const timer = setTimeout(() => {
          setAnimatingPiece(null);
        }, 200);
        prevFenRef.current = fen;
        return () => clearTimeout(timer);
      }
      prevFenRef.current = fen;
    }
  }, [fen, sqSize, flipped]);

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
    return { x: borderWidth + f * sqSize, y: borderWidth + r * sqSize };
  };

  const getSqFromPixel = (px: number, py: number): string | null => {
    const f = Math.floor((px - borderWidth) / sqSize);
    const r = Math.floor((py - borderWidth) / sqSize);
    if (f < 0 || f > 7 || r < 0 || r > 7) return null;
    const fileIdx = flipped ? 7 - f : f;
    const rankIdx = flipped ? 7 - r : r;
    return FILES[fileIdx] + RANKS[rankIdx];
  };

  // Execute move with sound
  const executeMove = useCallback((from: string, to: string) => {
    try {
      const piece = game.get(from as Square);
      let promotion: string | undefined;
      if (piece?.type === 'p') {
        const toRank = to[1];
        if ((piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1')) {
          promotion = 'q';
        }
      }
      const move = game.move({ from, to, promotion: promotion as any });
      if (move && onMove) {
        if (soundEnabled) {
          try {
            if (game.isCheckmate() || game.isStalemate()) SoundEngine.playGameEnd();
            else if (game.isCheck()) SoundEngine.playCheck();
            else if (move.san.includes('O-O')) SoundEngine.playCastle();
            else if (move.captured) SoundEngine.playCapture();
            else SoundEngine.playMove();
          } catch (soundError) {
            // Audio context failed under test environment or without user gesture - safe to ignore
          }
        }
        onMove(from, to, move.san);
      }
    } catch (err) {
      console.error("executeMove error:", err);
    }
  }, [fen, onMove, soundEnabled]);

  const handleSquareClick = useCallback((square: string, skipToggleOff = false) => {
    if (!interactive || dragState?.active) return;
    onSquareClick?.(square);

    if (selectedSq) {
      if (selectedSq === square) {
        if (!skipToggleOff) {
          setSelectedSq(null);
          setLegalMoves([]);
        }
        return;
      }
      const isLegal = legalMoves.some(m => m.to === square);
      if (isLegal) {
        executeMove(selectedSq, square);
        setSelectedSq(null);
        setLegalMoves([]);
        return;
      }
      const piece = game.get(square as Square);
      if (piece && piece.color === game.turn()) {
        setSelectedSq(square);
        const moves = game.moves({ square: square as Square, verbose: true });
        setLegalMoves(moves.map(m => ({ to: m.to, captured: m.captured })));
      }
    } else {
      const piece = game.get(square as Square);
      if (piece && piece.color === game.turn()) {
        setSelectedSq(square);
        const moves = game.moves({ square: square as Square, verbose: true });
        setLegalMoves(moves.map(m => ({ to: m.to, captured: m.captured })));
      }
    }
  }, [interactive, selectedSq, legalMoves, fen, onMove, onSquareClick, flipped, dragState, executeMove]);

  // Drag and drop handlers
  const getPointerPos = (e: React.PointerEvent): { x: number; y: number } | null => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: rect.width ? ((e.clientX - rect.left) / rect.width) * boardSize : 0,
      y: rect.height ? ((e.clientY - rect.top) / rect.height) * boardSize : 0,
    };
  };

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!interactive) return;

    // Handle right-click interaction for drawing arrows and highlighting squares
    if (e.button === 2) {
      const pos = getPointerPos(e);
      if (!pos) return;
      const sq = getSqFromPixel(pos.x, pos.y);
      if (!sq) return;

      setRightDrag({ from: sq, to: sq });
      (e.target as Element)?.setPointerCapture?.(e.pointerId);
      return;
    }

    // Left-click clears all right-click drawings
    setDrawnArrows([]);
    setDrawnHighlights([]);

    const pos = getPointerPos(e);
    if (!pos) return;
    const sq = getSqFromPixel(pos.x, pos.y);
    if (!sq) return;

    const piece = game.get(sq as Square);
    const isPlayerPiece = piece && piece.color === game.turn();

    // If there is no player piece and no selectedSq, we don't need to track drag/click
    if (!isPlayerPiece && !selectedSq) return;

    const svgKey = isPlayerPiece ? (piece.color === 'w' ? piece.type.toUpperCase() : piece.type) : '';

    // If clicking on player's own piece, update selectedSq and legalMoves
    if (isPlayerPiece) {
      const moves = game.moves({ square: sq as Square, verbose: true });
      setSelectedSq(sq);
      setLegalMoves(moves.map(m => ({ to: m.to, captured: m.captured })));
    }

    setDragState({
      piece: isPlayerPiece ? piece.type : '',
      from: sq,
      svgKey,
      startX: pos.x,
      startY: pos.y,
      currentX: pos.x,
      currentY: pos.y,
      active: false,
      alreadySelectedOnDown: selectedSq === sq,
    });

    (e.target as Element)?.setPointerCapture?.(e.pointerId);
  }, [interactive, fen, flipped, selectedSq]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (rightDrag) {
      const pos = getPointerPos(e);
      if (!pos) return;
      const targetSq = getSqFromPixel(pos.x, pos.y);
      if (targetSq && targetSq !== rightDrag.to) {
        setRightDrag({ ...rightDrag, to: targetSq });
      }
      return;
    }

    if (!dragState) return;
    const pos = getPointerPos(e);
    if (!pos) return;

    const dx = pos.x - dragState.startX;
    const dy = pos.y - dragState.startY;
    const threshold = sqSize * 0.2;

    setDragState(prev => prev ? {
      ...prev,
      currentX: pos.x,
      currentY: pos.y,
      active: prev.active || Math.sqrt(dx * dx + dy * dy) > threshold,
    } : null);
  }, [dragState, rightDrag, sqSize]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (rightDrag) {
      const { from, to } = rightDrag;
      if (from === to) {
        // Toggle square highlight
        setDrawnHighlights(prev =>
          prev.includes(from) ? prev.filter(sq => sq !== from) : [...prev, from]
        );
      } else {
        // Toggle arrow
        const arrowExists = drawnArrows.some(arr => arr.from === from && arr.to === to);
        if (arrowExists) {
          setDrawnArrows(prev => prev.filter(arr => !(arr.from === from && arr.to === to)));
        } else {
          setDrawnArrows(prev => [...prev, { from, to, color: 'rgba(245, 158, 11, 0.85)' }]);
        }
      }
      setRightDrag(null);
      return;
    }

    if (!dragState) return;

    if (dragState.active) {
      if (dragState.piece) {
        const pos = getPointerPos(e);
        if (pos) {
          const targetSq = getSqFromPixel(pos.x, pos.y);
          if (targetSq && targetSq !== dragState.from) {
            const isLegal = legalMoves.some(m => m.to === targetSq);
            if (isLegal) {
              executeMove(dragState.from, targetSq);
            }
          }
        }
      }
      setSelectedSq(null);
      setLegalMoves([]);
    } else {
      // It was a click, not a drag — handleSquareClick will handle it
      const pos = getPointerPos(e);
      if (pos) {
        const sq = getSqFromPixel(pos.x, pos.y);
        if (sq) {
          const piece = game.get(sq as Square);
          const isPlayerPiece = piece && piece.color === game.turn();
          if (isPlayerPiece && sq === dragState.from && !dragState.alreadySelectedOnDown) {
            handleSquareClick(sq, true);
          } else {
            handleSquareClick(sq);
          }
        }
      }
    }

    setDragState(null);
  }, [dragState, rightDrag, drawnArrows, legalMoves, executeMove, handleSquareClick]);

  // Reset selection when FEN changes
  useEffect(() => {
    setSelectedSq(null);
    setLegalMoves([]);
    setDragState(null);
    setDrawnArrows([]);
    setDrawnHighlights([]);
  }, [fen]);

  const files = flipped ? [...FILES].reverse() : FILES;
  const ranks = flipped ? [...RANKS].reverse() : RANKS;

  return (
    <div
      ref={containerRef}
      className="chessboard-container"
      style={{ width: boardSize, height: boardSize, touchAction: 'none' }}
    >
      <svg
        ref={svgRef}
        width={boardSize}
        height={boardSize}
        viewBox={`0 0 ${boardSize} ${boardSize}`}
        className="chess-board-svg"
        style={{ userSelect: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Background */}
        <rect x={0} y={0} width={boardSize} height={boardSize} fill="#0d0d15" rx={4} />

        {/* Squares */}
        {ranks.map((rank, rIdx) =>
          files.map((file, fIdx) => {
            const isLight = (rIdx + fIdx) % 2 === 0;
            return (
              <rect
                 key={`sq-${file}${rank}`}
                 x={borderWidth + fIdx * sqSize}
                 y={borderWidth + rIdx * sqSize}
                 width={sqSize}
                 height={sqSize}
                 fill={isLight ? lightColor : darkColor}
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
              style={{ animation: 'glowPulse 2s infinite ease-in-out' }}
              pointerEvents="none"
            />
          );
        })}

        {/* User-drawn highlights (right click) */}
        {drawnHighlights.map(sq => {
          const pos = toSVGCoords(getFileIdx(sq), getRankIdx(sq));
          return (
            <rect
              key={`user-hl-${sq}`}
              x={pos.x} y={pos.y}
              width={sqSize} height={sqSize}
              fill="rgba(245, 158, 11, 0.35)"
              pointerEvents="none"
            />
          );
        })}

        {/* Pieces */}
        {board.map((row, rIdx) =>
          row.map((piece, fIdx) => {
            if (!piece) return null;
            const svgKey = piece.color === 'w' ? piece.type.toUpperCase() : piece.type;
            let svg = PIECE_SVG[svgKey];
            if (!svg) return null;
            const sq = FILES[fIdx] + RANKS[rIdx];
            
            // Apply piece set transformations
            if (pieceSet === 'neo') {
              if (piece.color === 'w') {
                svg = svg
                  .replace(/fill="#fff"/g, 'fill="#093325"')
                  .replace(/stroke="#000"/g, 'stroke="#10b981" stroke-width="2"');
              } else {
                svg = svg
                  .replace(/fill="#000"/g, 'fill="#1e1333"')
                  .replace(/stroke="#fff"/g, 'stroke="#a78bfa" stroke-width="2"')
                  .replace(/stroke="#000"/g, 'stroke="#a78bfa" stroke-width="2"');
              }
            } else if (pieceSet === 'alpha') {
              if (piece.color === 'w') {
                svg = svg
                  .replace(/fill="#fff"/g, 'fill="#f8fafc"')
                  .replace(/stroke="#000"/g, 'stroke="#334155"');
              } else {
                svg = svg
                  .replace(/fill="#000"/g, 'fill="#0f172a"')
                  .replace(/stroke="#fff"/g, 'stroke="#64748b"')
                  .replace(/stroke="#000"/g, 'stroke="#0f172a"');
              }
            } else if (pieceSet === 'merida') {
              if (piece.color === 'w') {
                svg = svg
                  .replace(/fill="#fff"/g, 'fill="#faecd8"')
                  .replace(/stroke="#000"/g, 'stroke="#6b4c35"');
              } else {
                svg = svg
                  .replace(/fill="#000"/g, 'fill="#4a2c11"')
                  .replace(/stroke="#fff"/g, 'stroke="#faecd8"')
                  .replace(/stroke="#000"/g, 'stroke="#4a2c11"');
              }
            }

            // Don't render the piece being dragged at its original position
            if (dragState?.active && dragState.from === sq) return null;
            const pos = toSVGCoords(fIdx, rIdx);
            const scale = sqSize / 45;

            // Check if this piece is currently animating from a previous FEN position
            const isAnimating = animatingPiece && animatingPiece.key === `piece-${fIdx}-${rIdx}`;

            return (
              <g
                key={`piece-${fIdx}-${rIdx}`}
                transform={`translate(${pos.x}, ${pos.y})`}
                style={{ cursor: interactive ? 'grab' : 'default' }}
              >
                <g
                  style={isAnimating ? {
                    animation: 'pieceMove 0.20s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
                    ['--from-x' as any]: `${animatingPiece.fromX}px`,
                    ['--from-y' as any]: `${animatingPiece.fromY}px`,
                  } : undefined}
                >
                  <g
                    transform={`scale(${scale})`}
                    style={{ filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.45))' }}
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
                </g>
              </g>
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

        {/* Dragging piece ghost (at cursor position) */}
        {dragState?.active && (() => {
          let svg = PIECE_SVG[dragState.svgKey];
          if (!svg) return null;

          // Apply piece set transformations
          const isWhite = dragState.svgKey === dragState.svgKey.toUpperCase();
          if (pieceSet === 'neo') {
            if (isWhite) {
              svg = svg
                .replace(/fill="#fff"/g, 'fill="#093325"')
                .replace(/stroke="#000"/g, 'stroke="#10b981" stroke-width="2"');
            } else {
              svg = svg
                .replace(/fill="#000"/g, 'fill="#1e1333"')
                .replace(/stroke="#fff"/g, 'stroke="#a78bfa" stroke-width="2"')
                .replace(/stroke="#000"/g, 'stroke="#a78bfa" stroke-width="2"');
            }
          } else if (pieceSet === 'alpha') {
            if (isWhite) {
              svg = svg
                .replace(/fill="#fff"/g, 'fill="#f8fafc"')
                .replace(/stroke="#000"/g, 'stroke="#334155"');
            } else {
              svg = svg
                .replace(/fill="#000"/g, 'fill="#0f172a"')
                .replace(/stroke="#fff"/g, 'stroke="#64748b"')
                .replace(/stroke="#000"/g, 'stroke="#0f172a"');
            }
          } else if (pieceSet === 'merida') {
            if (isWhite) {
              svg = svg
                .replace(/fill="#fff"/g, 'fill="#faecd8"')
                .replace(/stroke="#000"/g, 'stroke="#6b4c35"');
            } else {
              svg = svg
                .replace(/fill="#000"/g, 'fill="#4a2c11"')
                .replace(/stroke="#fff"/g, 'stroke="#faecd8"')
                .replace(/stroke="#000"/g, 'stroke="#4a2c11"');
            }
          }

          const scale = (sqSize * 1.25) / 45; // Slightly larger while dragging
          const offsetX = dragState.currentX - (sqSize * 1.25) / 2;
          const offsetY = dragState.currentY - (sqSize * 1.25) / 2;
          return (
            <g
              transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}
              style={{ opacity: 0.9, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
              pointerEvents="none"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          );
        })()}

        {/* Drag target highlight */}
        {dragState?.active && (() => {
          const sq = getSqFromPixel(dragState.currentX, dragState.currentY);
          if (!sq || sq === dragState.from) return null;
          const isLegal = legalMoves.some(m => m.to === sq);
          if (!isLegal) return null;
          const pos = toSVGCoords(getFileIdx(sq), getRankIdx(sq));
          return (
            <rect
              x={pos.x} y={pos.y}
              width={sqSize} height={sqSize}
              fill="rgba(16, 185, 129, 0.35)"
              rx={4}
              pointerEvents="none"
            />
          );
        })()}

        {/* Arrows (combined static arrows and user drawn arrows) */}
        {[
          ...arrows,
          ...drawnArrows,
          ...(rightDrag && rightDrag.from !== rightDrag.to ? [{ from: rightDrag.from, to: rightDrag.to, color: 'rgba(245, 158, 11, 0.6)' }] : [])
        ].map((arrow, idx) => {
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
                style={{ animation: 'fadeIn 0.25s ease-out' }}
                strokeDasharray={arrow.dashed ? '8,4' : undefined}
                pointerEvents="none"
              />
            </g>
          );
        })}

        {/* Coordinate labels */}
        {files.map((file, fIdx) => {
          return (
            <text
              key={`coord-file-${file}`}
              x={borderWidth + fIdx * sqSize + sqSize / 2}
              y={boardSize - borderWidth / 2}
              fontSize={Math.max(9, borderWidth * 0.65)}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight={700}
              fill="#94a3b8"
              dominantBaseline="central"
              textAnchor="middle"
              pointerEvents="none"
            >
              {file}
            </text>
          );
        })}
        {ranks.map((rank, rIdx) => {
          return (
            <text
              key={`coord-rank-${rank}`}
              x={borderWidth / 2}
              y={borderWidth + rIdx * sqSize + sqSize / 2}
              fontSize={Math.max(9, borderWidth * 0.65)}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight={700}
              fill="#94a3b8"
              dominantBaseline="central"
              textAnchor="middle"
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
