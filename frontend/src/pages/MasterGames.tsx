import React, { useState } from 'react';
import { Board } from '../components/Board';
import { ReplayPanel } from '../components/ReplayPanel';
import { VariationExplorer } from '../components/VariationExplorer';
import { Chess } from 'chess.js';
import { MASTER_GAMES, MasterGame, MoveDetails } from '../content/master-games-db';

export const MasterGames: React.FC = () => {
  const [selectedGameIdx, setSelectedGameIdx] = useState<number>(0);
  const [currentMoveIdx, setCurrentMoveIdx] = useState<number>(-1);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [showVariations, setShowVariations] = useState<boolean>(false);

  const games: MasterGame[] = MASTER_GAMES;

  const currentGame = games[selectedGameIdx];

  // Derive board FEN based on move index
  const getFenForMoveIndex = (moves: MoveDetails[], index: number) => {
    if (index === -1) return currentGame.initialFen;
    
    const game = new Chess();
    for (let i = 0; i <= index; i++) {
      try {
        game.move(moves[i].move);
      } catch {
        break;
      }
    }
    return game.fen();
  };

  const currentFen = getFenForMoveIndex(currentGame.moves, currentMoveIdx);

  // Build a simple variation tree from the game moves
  const buildVariationTree = () => {
    const moves = currentGame.moves;
    if (moves.length === 0) return { move: 'Start', children: [] };
    
    const root: any = {
      move: moves[0]?.move || 'Start',
      eval: moves[0]?.eval,
      comment: moves[0]?.comment,
      children: [],
    };

    let current = root;
    for (let i = 1; i < Math.min(moves.length, 20); i++) {
      const child: any = {
        move: moves[i].move,
        eval: moves[i].eval,
        comment: moves[i].comment,
        children: [],
      };
      // Add alternatives as sibling branches
      if (moves[i].alternatives && moves[i].alternatives!.length > 0) {
        for (const alt of moves[i].alternatives!) {
          current.children.push({
            move: alt,
            eval: '?',
            comment: 'Alternative continuation',
            children: [],
          });
        }
      }
      current.children.unshift(child);
      current = child;
    }

    return root;
  };

  const handleVariationSelect = (moveSequence: string[]) => {
    // Navigate to the selected move in the game
    const targetMove = moveSequence[moveSequence.length - 1];
    const idx = currentGame.moves.findIndex((m: any) => m.move === targetMove);
    if (idx >= 0) {
      setCurrentMoveIdx(idx);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto py-4 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Masterpieces</span>
          <h2 className="text-2xl font-black text-white font-serif">Master Game Study System</h2>
        </div>
        <button
          onClick={() => setShowVariations(!showVariations)}
          className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
            showVariations 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
          }`}
        >
          {showVariations ? '🌳 Hide Variations' : '🌳 Show Variations'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game list sidebar */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Game Library</span>
          <div className="max-h-[500px] overflow-y-auto flex flex-col gap-2 pr-1">
            {games.map((g, idx) => (
              <button
                key={g.id}
                onClick={() => { setSelectedGameIdx(idx); setCurrentMoveIdx(-1); }}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  idx === selectedGameIdx 
                    ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <h4 className="font-bold text-sm text-white">{g.white} vs {g.black}</h4>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-semibold text-slate-300">
                    {g.result}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{g.event} • {g.date}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Board View */}
        <div className="flex flex-col gap-4 items-center justify-center bg-[#0c0c14]/50 rounded-3xl p-8 border border-white/5">
          <Board 
            fen={currentFen} 
            interactive={false}
            flipped={flipped}
          />
          <div className="text-xs text-slate-400 font-mono mt-2 bg-[#06060b] px-3 py-1 rounded-full border border-white/5 max-w-full truncate">
            {currentGame.white} vs {currentGame.black} • Move {currentMoveIdx + 1}/{currentGame.moves.length}
          </div>
        </div>

        {/* Replay Controls Panel or Variation Explorer */}
        <div className="flex flex-col gap-4">
          <ReplayPanel 
            moves={currentGame.moves} 
            currentIndex={currentMoveIdx} 
            onChangeIndex={setCurrentMoveIdx} 
            onFlipBoard={() => setFlipped(!flipped)}
          />
          
          {showVariations && (
            <VariationExplorer 
              tree={buildVariationTree()} 
              onSelectMove={handleVariationSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default MasterGames;

