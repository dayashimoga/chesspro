import React, { useState } from 'react';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';

interface EndgameDrill {
  id: string;
  title: string;
  category: string;
  fen: string;
  desc: string;
  keyConcepts: string[];
  solutionText: string;
  expectedMoves: string[];
}

export const EndgameTrainer: React.FC = () => {
  const [selectedDrillIdx, setSelectedDrillIdx] = useState<number>(0);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const addXP = useAppStore(state => state.addXP);

  const drills: EndgameDrill[] = [
    {
      id: 'endgame_opp',
      title: 'King Opposition Drill',
      category: 'King & Pawn',
      fen: '8/8/4k3/8/4K3/8/8/8 w - - 0 1',
      desc: 'Maintain opposition. The kings are facing each other. To seize the opposition, step directly in front of the enemy king when they move.',
      keyConcepts: ['Kings facing each other', 'ODD number of squares between', 'First player to move loses opposition'],
      solutionText: 'Play Kd4 when Black is on d6 to hold control of the critical squares.',
      expectedMoves: ['Kd4', 'Ke4', 'Kf4']
    },
    {
      id: 'endgame_lucena',
      title: 'Lucena Bridge Building',
      category: 'Rook Endgames',
      fen: '1K6/3P4/k7/8/8/8/r7/1R6 w - - 0 1',
      desc: 'Deliver checkmate or promote the pawn using the Lucena Position. Create the "bridge" with your rook on the 4th rank to shield your king from checks.',
      keyConcepts: ['Pawn on 7th rank', 'Rook on 4th rank (bridge)', 'Build shield against checkstorms'],
      solutionText: '1. Rf4! followed by Rd4 to block rook checks and promote the pawn.',
      expectedMoves: ['Rf4', 'Rd4']
    }
  ];

  const currentDrill = drills[selectedDrillIdx];

  const handleMoveAttempt = (from: string, to: string) => {
    // Simple validation of moves matching the solution steps
    const attempt = `${from}${to}`;
    const expected = currentDrill.expectedMoves[stepIndex];
    
    // Check if it matches expected or is a valid king opposition move
    if (currentDrill.id === 'endgame_opp') {
      if (to === 'd4' || to === 'e4' || to === 'f4') {
        setFeedback('Correct opposition! You maintain the key square barrier. (+5 XP)');
        addXP(5);
        if (stepIndex < currentDrill.expectedMoves.length - 1) {
          setStepIndex(stepIndex + 1);
        }
      } else {
        setFeedback('Incorrect. You gave up the opposition. Keep your king facing theirs.');
      }
    } else if (currentDrill.id === 'endgame_lucena') {
      // e.g. f1 to f4 -> f4
      if (to === 'f4' && stepIndex === 0) {
        setFeedback('Excellent! Rook to f4 prepares the bridge. Now advance the king.');
        setStepIndex(1);
        addXP(5);
      } else if (to === 'd4' && stepIndex === 1) {
        setFeedback('Bridge constructed! The rook will shield the king from checks, enabling pawn promotion. (+15 XP)');
        addXP(15);
      } else {
        setFeedback('Incorrect rook maneuver. Place the rook on the 4th rank first.');
      }
    }
  };

  const selectDrill = (idx: number) => {
    setSelectedDrillIdx(idx);
    setStepIndex(0);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto py-4 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Endgame Lab</span>
        <h2 className="text-2xl font-black text-white font-serif">Theoretical Endgame Drills</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Drill Menu Sidebar */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Select Drill</span>
          {drills.map((drill, idx) => (
            <button
              key={drill.id}
              onClick={() => selectDrill(idx)}
              className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                idx === selectedDrillIdx 
                  ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <h4 className="font-bold text-sm text-white">{drill.title}</h4>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-semibold text-slate-300">
                  {drill.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">{drill.desc}</p>
            </button>
          ))}
        </div>

        {/* Board View */}
        <div className="flex flex-col gap-4 items-center justify-center bg-[#0c0c14]/50 rounded-3xl p-8 border border-white/5">
          <Board 
            fen={currentDrill.fen} 
            interactive={true} 
            onMove={handleMoveAttempt}
          />
          <div className="text-xs text-slate-500 mt-2">
            💡 Make moves on the board to practice the endgame technique.
          </div>
        </div>

        {/* Coach Explanations Panel */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5 justify-between">
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-500">Theory Guide</span>
              <h3 className="text-base font-bold text-white mt-0.5">{currentDrill.title}</h3>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400">Key Concepts:</span>
              <ul className="list-disc pl-4 flex flex-col gap-1.5 text-xs text-slate-300">
                {currentDrill.keyConcepts.map((concept, i) => (
                  <li key={i}>{concept}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-[#0c0c14] border border-white/5 p-4 rounded-xl text-xs text-slate-300 leading-relaxed">
              <strong className="block text-white mb-1">Coach Notes:</strong>
              {currentDrill.desc}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {feedback && (
              <div className="p-3 bg-white/5 border border-white/10 text-xs font-semibold text-emerald-400 rounded-xl">
                {feedback}
              </div>
            )}
            
            <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-xs text-amber-400 leading-relaxed">
              <strong className="block text-white mb-1">Theoretical Solution:</strong>
              {currentDrill.solutionText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EndgameTrainer;
