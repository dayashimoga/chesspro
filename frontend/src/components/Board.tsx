import React, { useState } from 'react';
import { Chess } from 'chess.js';

interface BoardProps {
  fen: string;
  interactive?: boolean;
  onMove?: (from: string, to: string) => void;
  highlights?: Array<{ square: string; color?: string; class?: string }>;
  arrows?: Array<{ from: string; to: string; color?: string; class?: string; dashed?: boolean }>;
}

export const Board: React.FC<BoardProps> = ({
  fen,
  interactive = true,
  onMove,
  highlights = [],
  arrows = []
}) => {
  const [selectedSq, setSelectedSq] = useState<string | null>(null);
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  const game = new Chess(fen);
  const board = game.board();

  const handleSquareClick = (square: string) => {
    if (!interactive) return;

    if (selectedSq) {
      if (selectedSq === square) {
        setSelectedSq(null);
      } else {
        // Attempt move
        try {
          const move = game.move({ from: selectedSq, to: square, promotion: 'q' });
          if (move && onMove) {
            onMove(selectedSq, square);
          }
        } catch {
          // Check if selecting another of own piece
          const piece = game.get(square as any);
          if (piece && piece.color === game.turn()) {
            setSelectedSq(square);
          } else {
            setSelectedSq(null);
          }
        }
      }
    } else {
      const piece = game.get(square as any);
      if (piece && piece.color === game.turn()) {
        setSelectedSq(square);
      }
    }
  };

  const getSquareColorClass = (r: number, f: number) => {
    return (r + f) % 2 === 0 ? 'bg-[#e8dcc8]' : 'bg-[#7b945d]';
  };

  return (
    <div className="relative w-[400px] h-[400px] select-none rounded overflow-hidden shadow-lg border border-white/5 bg-bg-tertiary">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {ranks.map((rank, rIdx) => (
          files.map((file, fIdx) => {
            const sqName = `${file}${rank}`;
            const piece = board[rIdx][fIdx];
            const isSelected = selectedSq === sqName;
            const highlight = highlights.find(h => h.square === sqName);
            
            return (
              <div
                key={sqName}
                className={`relative flex items-center justify-center cursor-pointer ${getSquareColorClass(rIdx, fIdx)}`}
                onClick={() => handleSquareClick(sqName)}
              >
                {/* Piece representation */}
                {piece && (
                  <span className={`text-4xl select-none leading-none transition-transform duration-200 hover:scale-110 ${
                    piece.color === 'w' 
                      ? 'text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]' 
                      : 'text-[#1a1a24] drop-shadow-[0_1px_2px_rgba(255,255,255,0.35)]'
                  }`}>
                    {{
                      p: '♟',
                      r: '♜',
                      n: '♞',
                      b: '♝',
                      q: '♛',
                      k: '♚'
                    }[piece.type]}
                  </span>
                )}

                {/* Selected highlight overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-emerald-500/40 pointer-events-none" />
                )}

                {/* Custom Overlay Highlights (Fork, Sacrifice, Pinned) */}
                {highlight && (
                  <div className={`absolute inset-0 pointer-events-none ${highlight.class || 'bg-emerald-500/20'}`} style={{ backgroundColor: highlight.color }} />
                )}

                {/* Internal Coordinates */}
                {rIdx === 7 && (
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold opacity-60 pointer-events-none text-bg-primary">
                    {file}
                  </span>
                )}
                {fIdx === 7 && (
                  <span className="absolute top-1 right-1 text-[9px] font-bold opacity-60 pointer-events-none text-bg-primary">
                    {rank}
                  </span>
                )}
              </div>
            );
          })
        ))}
      </div>

      {/* Render SVG Vector overlays for lasers/arrows */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full">
        {arrows.map((arrow, idx) => {
          const fromF = files.indexOf(arrow.from[0]);
          const fromR = ranks.indexOf(arrow.from[1]);
          const toF = files.indexOf(arrow.to[0]);
          const toR = ranks.indexOf(arrow.to[1]);
          
          const x1 = fromF * 50 + 25;
          const y1 = fromR * 50 + 25;
          const x2 = toF * 50 + 25;
          const y2 = toR * 50 + 25;

          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={arrow.color || '#f59e0b'}
              strokeWidth={4}
              strokeDasharray={arrow.dashed ? '6,3' : undefined}
              className={arrow.class}
              opacity={0.8}
            />
          );
        })}
      </svg>
    </div>
  );
};
export default Board;
