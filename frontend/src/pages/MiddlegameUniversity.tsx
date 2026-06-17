import React, { useState, useEffect } from 'react';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';
import { Chess } from 'chess.js';

interface MiddlegameLab {
  id: string;
  title: string;
  icon: string;
  theory: string;
  fen: string;
  bestPlan: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

const MIDDLEGAME_LABS: MiddlegameLab[] = [
  {
    id: 'pawn_structures',
    title: 'Pawn Structures',
    icon: '🧱',
    theory: `
      <h3>Understanding Pawn Chains</h3>
      <p>Pawn structures dictate the planning vector for both sides. The base of the pawn chain is the weakest link, and you should attack it directly.</p>
      <p>In this lab, analyze the central pawn pyramid e4-d5 vs e5-d4. A key break is crucial to opening files for the rooks.</p>
    `,
    fen: 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/2PP4/2N1PN2/PP3PPP/R1BQ1RK1 w - - 0 8',
    bestPlan: 'Trade pawns on d5 (cxd5) to isolate Black\'s d-pawn, creating a target on the open d-file.',
    question: 'What is the best pawn structure break for White in this position?',
    options: ['cxd5 (creates isolated d5 pawn)', 'd5 (closes the center)', 'b3 (reinforces c4)', 'a3 (prophylactic side move)'],
    answerIndex: 0,
    explanation: 'cxd5 forces exd5, leaving Black with an Isolated Queen\'s Pawn (IQP) on d5, which White can block and pressure.'
  },
  {
    id: 'outposts',
    title: 'Outpost Squares',
    icon: '🚩',
    theory: `
      <h3>Establishing Outposts</h3>
      <p>An outpost is a square (usually on the 4th, 5th, or 6th rank) that cannot be attacked by enemy pawns. Knights are extremely powerful on outpost squares.</p>
    `,
    fen: 'r2q1rk1/pp2bppp/2n1bn2/3pp3/8/2N1BNP1/PPPQPPBP/R4RK1 w - - 0 9',
    bestPlan: 'Position White\'s knight on the d5 outpost square.',
    question: 'Which square represents a secure outpost for White\'s knight in this opening setup?',
    options: ['d5 square', 'e4 square', 'c4 square', 'f5 square'],
    answerIndex: 0,
    explanation: 'The d5 square is an outpost because Black has no pawns on c6 or e6 that can evict a knight landing on d5.'
  },
  {
    id: 'prophylaxis',
    title: 'Prophylaxis',
    icon: '🛡️',
    theory: `
      <h3>Preventive Thinking</h3>
      <p>Prophylaxis is the act of stopping your opponent's plans before they can execute them. It's the hallmark of positional mastery.</p>
    `,
    fen: 'r1bq1rk1/pp2bppp/2n1pn2/2pp4/2PP4/2N1PN2/PP1BBPPP/R2Q1RK1 w - - 4 8',
    bestPlan: 'Play h3 to prevent Bg4 pins or knight sorties.',
    question: 'What is the standard prophylactic move for White to limit Black\'s light-squared bishop activity?',
    options: ['h3 (stops Bg4 pins)', 'a4 (gains space)', 'f4 (aggressive push)', 'Re1 (aligns rook)'],
    answerIndex: 0,
    explanation: 'h3 is a common prophylactic move that stops Black from playing Bg4, pinning the f3 knight to the queen.'
  }
];

export const MiddlegameUniversity: React.FC = () => {
  const [labIdx, setLabIdx] = useState<number>(0);
  const currentLab = MIDDLEGAME_LABS[labIdx] || MIDDLEGAME_LABS[0];
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isExploring, setIsExploring] = useState<boolean>(false);
  const [exploreFen, setExploreFen] = useState<string>(currentLab.fen);

  const addXP = useAppStore(state => state.addXP);

  // Sync exploration state
  useEffect(() => {
    setSelectedOpt(null);
    setIsSubmitted(false);
    setIsExploring(false);
    setExploreFen(currentLab.fen);
  }, [labIdx]);

  const handleOptionClick = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOpt(idx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null) return;
    setIsSubmitted(true);
    if (selectedOpt === currentLab.answerIndex) {
      addXP(15);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsSubmitted(false);
    setLabIdx((labIdx + 1) % MIDDLEGAME_LABS.length);
  };

  const handleExploreMove = (from: string, to: string) => {
    const chess = new Chess(exploreFen);
    try {
      const move = chess.move({ from, to, promotion: 'q' });
      if (move) {
        setExploreFen(chess.fen());
        setIsExploring(true);
      }
    } catch {
      // Illegal move
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Middlegame University</span>
          <h2 className="text-2xl font-black text-white font-serif">Positional Learning Labs</h2>
        </div>

        {/* Labs Quick Menu */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin max-w-full">
          {MIDDLEGAME_LABS.map((lab, idx) => (
            <button
              key={lab.id}
              onClick={() => setLabIdx(idx)}
              className={`px-4 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                idx === labIdx
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400'
              }`}
            >
              <span>{lab.icon}</span>
              <span>{lab.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Theory & Analysis Plan */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#0c0c14] flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <span className="text-2xl">{currentLab.icon}</span>
              <h3 className="font-bold text-white text-sm">{currentLab.title}</h3>
            </div>
            <div 
              className="text-xs text-slate-300 leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{ __html: currentLab.theory }}
            />
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#0c0c14] flex flex-col gap-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">🎯 Positional Plan:</span>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">{currentLab.bestPlan}</p>
          </div>
        </div>

        {/* Center: Interactive Analysis Board */}
        <div className="flex flex-col gap-4 items-center justify-center bg-[#0c0c14]/50 rounded-3xl p-6 border border-white/5">
          <Board
            fen={exploreFen}
            interactive={true}
            onMove={handleExploreMove}
          />
          {isExploring ? (
            <button
              onClick={() => { setExploreFen(currentLab.fen); setIsExploring(false); }}
              className="bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-bold px-3 py-1 rounded transition-all text-slate-300"
            >
              ↩ Reset Position
            </button>
          ) : (
            <span className="text-[10px] text-slate-500 font-mono">Free play enabled: Make moves to explore variations</span>
          )}
        </div>

        {/* Right: Assessment quiz */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-500">Middlegame Quiz</span>
              <h3 className="text-base font-bold text-white mt-0.5">{currentLab.title} Check</h3>
            </div>

            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              {currentLab.question}
            </p>

            <div className="flex flex-col gap-2 mt-2">
              {currentLab.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleOptionClick(oIdx)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    isSubmitted
                      ? oIdx === currentLab.answerIndex
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                        : oIdx === selectedOpt
                        ? 'bg-red-500/10 border-red-500/40 text-red-400'
                        : 'bg-white/[0.02] border-white/5 opacity-50'
                      : selectedOpt === oIdx
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {isSubmitted && (
              <div className="text-xs text-slate-400 bg-[#0c0c14] border border-white/5 p-4 rounded-xl leading-relaxed animate-fadeIn">
                <strong className="block text-white mb-1">
                  {selectedOpt === currentLab.answerIndex ? '🎉 Positional Master! (+15 XP)' : '❌ Try again'}
                </strong>
                {currentLab.explanation}
              </div>
            )}

            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOpt === null}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-bg-primary font-bold py-2.5 rounded-xl text-xs transition-all w-full text-center"
              >
                Submit Plan Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl text-xs transition-all w-full text-center"
              >
                Next Lab Exercise
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiddlegameUniversity;
