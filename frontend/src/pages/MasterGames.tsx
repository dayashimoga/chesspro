import React, { useState } from 'react';
import { Board } from '../components/Board';
import { ReplayPanel } from '../components/ReplayPanel';
import { Chess } from 'chess.js';

interface MoveDetails {
  move: string;
  eval: string;
  idea?: string;
  motif?: string;
  comment?: string;
  threat?: string;
  alternatives?: string[];
}

interface MasterGame {
  id: string;
  white: string;
  black: string;
  event: string;
  date: string;
  result: string;
  description: string;
  initialFen: string;
  moves: MoveDetails[];
}

export const MasterGames: React.FC = () => {
  const [selectedGameIdx, setSelectedGameIdx] = useState<number>(0);
  const [currentMoveIdx, setCurrentMoveIdx] = useState<number>(-1);
  const [flipped, setFlipped] = useState<boolean>(false);

  const games: MasterGame[] = [
    {
      id: 'morphy_opera',
      white: 'Paul Morphy',
      black: 'Duke Karl / Count Isouard',
      event: 'Paris Opera House',
      date: '1858',
      result: '1-0',
      description: 'The most famous game in chess history. Morphy demonstrates the power of rapid development, open lines, and a spectacular mating sacrifice.',
      initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      moves: [
        { move: 'e4', eval: '+0.3', idea: 'Control Center', motif: 'Open Lines', comment: 'Morphy opens the game by claiming space in the center.' },
        { move: 'e5', eval: '+0.3', idea: 'Defend Center', comment: 'Black responds symmetrically, staking their own claim to the center.' },
        { move: 'Nf3', eval: '+0.4', idea: 'Develop & Attack', motif: 'Tempo', comment: 'Developing the knight to its most active square, attacking the e5 pawn.' },
        { move: 'd6', eval: '+0.6', idea: 'Philidor Defense', comment: 'The Philidor Defense. It defends the e5 pawn but restricts the dark-squared bishop.' },
        { move: 'd4', eval: '+0.7', idea: 'Center Challenge', comment: 'Morphy immediately challenges Black\'s central pawn.' },
        { move: 'Bg4', eval: '+1.1', idea: 'Pin Knight', comment: 'Black pins the f3 knight, but this is considered slightly passive.' },
        { move: 'dxe5', eval: '+1.2', idea: 'Exchange Pawns', comment: 'Morphy exchanges pawns. Black cannot recapture immediately.' },
        { move: 'Bxf3', eval: '+1.3', idea: 'Eliminate Knight', comment: 'Forced to trade the bishop to avoid losing material.' },
        { move: 'Qxf3', eval: '+1.3', idea: 'Recapture Queen', comment: 'Recaptures with the queen, keeping active development lead.' },
        { move: 'dxe5', eval: '+1.4', idea: 'Recapture Pawn', comment: 'Black recaptures the pawn, keeping material balance but lagging behind.' },
        { move: 'Bc4', eval: '+1.8', idea: 'Mating Threat', motif: 'Weak f7', comment: 'Morphy develops the bishop with a direct threat of mate on f7.' },
        { move: 'Nf6', eval: '+1.8', idea: 'Block Mate', comment: 'Black blocks the mating line with the knight, developing a piece.' },
        { move: 'Qb3', eval: '+2.3', idea: 'Double Attack', motif: 'Weak b7 & f7', comment: 'Morphy creates a double attack on b7 and f7. A classic tactical concept.' },
        { move: 'Qe7', eval: '+2.3', idea: 'Defend f7', comment: 'Black defends the f7 pawn, but now the b7 pawn is undefended.' }
      ]
    }
  ];

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

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto py-4 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Masterpieces</span>
        <h2 className="text-2xl font-black text-white font-serif font-semibold">Master Game Study System</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game list sidebar */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Game Library</span>
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

        {/* Board View */}
        <div className="flex flex-col gap-4 items-center justify-center bg-[#0c0c14]/50 rounded-3xl p-8 border border-white/5">
          <Board 
            fen={currentFen} 
            interactive={false}
          />
          <div className="text-xs text-slate-400 font-mono mt-2 bg-[#06060b] px-3 py-1 rounded-full border border-white/5">
            FEN: {currentFen}
          </div>
        </div>

        {/* Replay Controls Panel */}
        <ReplayPanel 
          moves={currentGame.moves} 
          currentIndex={currentMoveIdx} 
          onChangeIndex={setCurrentMoveIdx} 
          onFlipBoard={() => setFlipped(!flipped)}
        />
      </div>
    </div>
  );
};
export default MasterGames;
