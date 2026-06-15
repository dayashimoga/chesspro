import React, { useState, useCallback } from 'react';
import { Board } from '../components/Board';
import { SpacedRepetition } from '../core/storage';
import { Chess } from 'chess.js';

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
  const [exploringFen, setExploringFen] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [practiceToast, setPracticeToast] = useState<string | null>(null);

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
      id: 'italian',
      name: 'Italian Game',
      side: 'White',
      moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4',
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      trap: 'Blackburne Shilling Gambit: Black traps the white king with an early knight sortie (Nd4) and queen checkmate threat.',
      middlegameTheme: 'Classic bishop target on f7, center control with c3-d4 expansions, quiet maneuvering in Giuoco Piano.',
      endgameTransition: 'Highly structured minor piece battles, often transitioning to rook endgames with balanced majorities.'
    },
    {
      id: 'queens_gambit',
      name: "Queen's Gambit",
      side: 'White',
      moves: '1. d4 d5 2. c4',
      fen: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2',
      trap: 'Albin Countergambit Trap: Black sacrifices a pawn and promotes a pawn to a knight on f1 with check on move 7.',
      middlegameTheme: 'Queen-side minority attacks, isolated queen pawn (IQP) structures, outpost knight on c5.',
      endgameTransition: 'Favorable rook endgames for White due to active rook files and pressure against backward pawns.'
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
      id: 'caro_kann',
      name: 'Caro-Kann Defense',
      side: 'Black',
      moves: '1. e4 c6',
      fen: 'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
      trap: 'Keres Mate: White sacrifices a knight on e6 and delivers a quick smothered mate with the queen on d6 or e6.',
      middlegameTheme: 'Solid pawn chain for Black, queenside expansion, and target focus against White\'s isolated d4 pawn.',
      endgameTransition: 'Black enjoys a highly resilient pawn structure, making it one of the safest openings for endgame survival.'
    },
    {
      id: 'french',
      name: 'French Defense',
      side: 'Black',
      moves: '1. e4 e6',
      fen: 'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
      trap: 'Reti Gambit Trap: White offers the e4 pawn to secure rapid development and deliver mate on the back rank.',
      middlegameTheme: 'Closed pawn chains (e5 vs d5), bad light-squared bishop for Black, active counterplay on the c5 break.',
      endgameTransition: 'Focus on blockading the passed e5 pawn; knight outposts vs restricted bishop pairs.'
    },
    {
      id: 'kings_indian',
      name: "King's Indian Defense",
      side: 'Black',
      moves: '1. d4 Nf6 2. c4 g6',
      fen: 'rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',
      trap: 'Bayonet Attack Trap: White forces a queenside breakthrough, trapping Black\'s bishop if they play passively.',
      middlegameTheme: 'Dynamic kingside pawn storm for Black (f5-f4-g5), queenside space invasion for White (b4-c5).',
      endgameTransition: 'Highly imbalanced; the passer on c7 vs Black\'s passed kingside pawns decide the minor piece endgame.'
    },
    {
      id: 'nimzo_indian',
      name: 'Nimzo-Indian Defense',
      side: 'Black',
      moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4',
      fen: 'rnbqk2r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',
      trap: 'Spielmann Trap: White overextends their center pawns, allowing Black to isolate and win the d4 pawn.',
      middlegameTheme: 'Pinning the c3 knight, doubling White\'s c-pawns, blockade on dark squares (e4/d5).',
      endgameTransition: 'Doubled c-pawns favor Black in closed pawn endgames due to White\'s impaired pawn mobility.'
    }
  ];

  const currentOpening = openings[selectedOpeningIdx];
  const displayFen = exploringFen || currentOpening.fen;

  const handleMove = useCallback((from: string, to: string) => {
    const game = new Chess(displayFen);
    try {
      const move = game.move({ from, to });
      if (move) {
        setExploringFen(game.fen());
        setMoveHistory(prev => [...prev, move.san]);
      }
    } catch {
      // Illegal move — ignore
    }
  }, [displayFen]);

  const resetExploration = () => {
    setExploringFen(null);
    setMoveHistory([]);
  };

  const selectOpening = (idx: number) => {
    setSelectedOpeningIdx(idx);
    setExploringFen(null);
    setMoveHistory([]);
  };

  const addToSRS = () => {
    SpacedRepetition.addCard({
      id: `opening-${currentOpening.id}`,
      front: `${currentOpening.name}\n\nMoves: ${currentOpening.moves}\n\nWhat are the key middlegame themes?`,
      back: `${currentOpening.middlegameTheme}\n\nTrap to know: ${currentOpening.trap}\n\nEndgame transition: ${currentOpening.endgameTransition}`,
      category: 'openings',
    });
    setPracticeToast('✅ Added to Spaced Repetition review queue!');
    setTimeout(() => setPracticeToast(null), 3000);
  };

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
              onClick={() => selectOpening(idx)}
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
            fen={displayFen} 
            interactive={true}
            onMove={handleMove}
          />
          <div className="text-xs text-slate-500 mt-2 flex flex-col items-center gap-2">
            {exploringFen ? (
              <>
                <span className="text-emerald-400">🔍 Exploring: {moveHistory.join(' ')}</span>
                <button 
                  onClick={resetExploration}
                  className="text-xs bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1 rounded-lg border border-white/5 transition-all"
                >
                  ↩ Reset to opening position
                </button>
              </>
            ) : (
              <span>Make moves on the board to explore the <strong className="text-slate-300 font-semibold">{currentOpening.name}</strong></span>
            )}
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

            {/* Practice Button + Toast */}
            <button 
              onClick={addToSRS}
              className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold text-xs py-2.5 rounded-xl transition-all mt-2"
            >
              📚 Add to Spaced Repetition Queue
            </button>
            {practiceToast && (
              <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg text-center animate-fadeIn">
                {practiceToast}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default OpeningTrainer;
