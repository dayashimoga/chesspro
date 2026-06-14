import React, { useState } from 'react';
import { Board } from '../components/Board';

interface OpeningItem {
  id: string;
  name: string;
  side: 'White' | 'Black';
  moves: string;
  fen: string;
  trap: string;
  middlegameTheme: string;
  endgameTransition: string;
}

export const OpeningTrainer: React.FC = () => {
  const [selectedOpeningIdx, setSelectedOpeningIdx] = useState<number>(0);

  const openings: OpeningItem[] = [
    {
      id: 'ruy_lopez',
      name: 'Ruy Lopez (Spanish Opening)',
      side: 'White',
      moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5',
      fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      trap: 'Noah\'s Ark Trap: Black traps White\'s light-squared bishop on b3 using a pawn storm (a6, b5, c5, c4).',
      middlegameTheme: 'Fight for the d4 square, queenside expansion for Black, kingside attack build-ups for White.',
      endgameTransition: 'White has a pawn majority on the kingside; Black has the bishop pair to compensate for damaged pawn structure.'
    },
    {
      id: 'sicilian',
      name: 'Sicilian Defense',
      side: 'Black',
      moves: '1. e4 c5',
      fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c5 0 2',
      trap: 'Siberian Trap: Black sacrifices a pawn in the Smith-Morra Gambit to deliver a surprise checkmate on h2 with Queen and Knight.',
      middlegameTheme: 'Asymmetrical battles, d5 break for Black, f4 expansion for White, queenside counterplay on open c-file.',
      endgameTransition: 'Black usually enjoys a central pawn majority (2 vs 1 pawns in center), favoring Black in standard endgames.'
    },
    {
      id: 'london',
      name: 'London System',
      side: 'White',
      moves: '1. d4 d5 2. Bf4',
      fen: 'rnbqkbnr/ppp1pppp/8/3p4/5B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 1 2',
      trap: 'Early Queen sorties by Black on b6 targeting b2 can be punished by developing pieces and trapping the black queen.',
      middlegameTheme: 'Solid pawn pyramid on c3-d4-e3, outpost knight on e5, attacking target on the h7 pawn.',
      endgameTransition: 'Symmetric structures lead to highly technical minor-piece endgames where pawn majorities are scarce.'
    }
  ];

  const currentOpening = openings[selectedOpeningIdx];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto py-4 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Opening Repertoire</span>
        <h2 className="text-2xl font-black text-white font-serif">Interactive Opening Trainer</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Openings List */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Openings Library</span>
          {openings.map((op, idx) => (
            <button
              key={op.id}
              onClick={() => setSelectedOpeningIdx(idx)}
              className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                idx === selectedOpeningIdx 
                  ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <h4 className="font-bold text-sm text-white">{op.name}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                  op.side === 'White' ? 'bg-white/10 text-slate-200' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {op.side}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">{op.moves}</p>
            </button>
          ))}
        </div>

        {/* Board View */}
        <div className="flex flex-col gap-4 items-center justify-center bg-[#0c0c14]/50 rounded-3xl p-8 border border-white/5">
          <Board 
            fen={currentOpening.fen} 
            interactive={false}
          />
          <div className="text-xs text-slate-500 mt-2">
            Showcasing the tab position for <strong className="text-slate-300 font-semibold">{currentOpening.name}</strong>
          </div>
        </div>

        {/* Strategic Analysis Details */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5 justify-between">
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-500">Opening Strategy</span>
              <h3 className="text-base font-bold text-white mt-0.5">{currentOpening.name}</h3>
            </div>

            <div className="bg-[#0c0c14] border border-white/5 p-4 rounded-xl flex flex-col gap-2">
              <strong className="text-xs text-emerald-400">⚡ Common Opening Trap:</strong>
              <p className="text-xs text-slate-300 leading-relaxed">{currentOpening.trap}</p>
            </div>

            <div className="bg-[#0c0c14] border border-white/5 p-4 rounded-xl flex flex-col gap-2">
              <strong className="text-xs text-amber-400">🛡️ Typical Middlegame Themes:</strong>
              <p className="text-xs text-slate-300 leading-relaxed">{currentOpening.middlegameTheme}</p>
            </div>

            <div className="bg-[#0c0c14] border border-white/5 p-4 rounded-xl flex flex-col gap-2">
              <strong className="text-xs text-slate-400">🏁 Endgame Transition:</strong>
              <p className="text-xs text-slate-300 leading-relaxed">{currentOpening.endgameTransition}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OpeningTrainer;
