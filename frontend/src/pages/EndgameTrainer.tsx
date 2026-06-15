import React, { useState, useEffect } from 'react';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';
import { Chess } from 'chess.js';

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
      id: 'endgame_triangulation',
      title: 'Triangulation Drill',
      category: 'King & Pawn',
      fen: '8/8/6p1/5kP1/5P2/4K3/8/8 w - - 0 1',
      desc: 'Use king triangulation to lose a tempo on purpose, forcing the opponent into zugzwang.',
      keyConcepts: ['Lose a move (tempo)', 'Move in a triangle (e.g. d3-e2-d2)', 'Force enemy king to abandon defense'],
      solutionText: 'Maneuver the king in a triangle (Kd3-Ke2-Kd2) to return to d3 with Black to move.',
      expectedMoves: ['Kd3', 'Ke2', 'Kd2']
    },
    {
      id: 'endgame_zugzwang',
      title: 'Zugzwang Practice',
      category: 'King & Pawn',
      fen: '8/8/4k3/p7/P7/3K4/8/8 w - - 0 1',
      desc: 'Force the opponent king into a position where any move they make weakens their position.',
      keyConcepts: ['Forced moves weaken position', 'Maintain pawn barriers', 'Infiltrate with king when they yield space'],
      solutionText: 'Play Kc4 to attack the a5 pawn, forcing the black king to move away.',
      expectedMoves: ['Kc4']
    },
    {
      id: 'endgame_passed',
      title: 'Passed Pawns (Square Rule)',
      category: 'King & Pawn',
      fen: '8/8/8/4k3/1P6/8/8/4K3 w - - 0 1',
      desc: 'Calculate if the enemy king can catch your passed pawn using the "Square of the Pawn" rule.',
      keyConcepts: ['Square of the pawn', 'Promote without king help', 'Stop counter-infiltrations'],
      solutionText: 'Advance the pawn (b5) to shrink the square and promote before the black king catches up.',
      expectedMoves: ['b5', 'b6', 'b7']
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
    },
    {
      id: 'endgame_philidor',
      title: 'Philidor Defense',
      category: 'Rook Endgames',
      fen: '8/8/1r6/3k4/3P4/8/3K4/3R4 b - - 0 1',
      desc: 'Learn the defensive drawing method in rook endgames by cutting off the active king and giving back-rank checks.',
      keyConcepts: ['Cut off king on 3rd rank', 'Wait until pawn advances', 'Deliver checkstorms from behind'],
      solutionText: 'Keep the rook on the 6th rank (Rb6) until the pawn advances to the 6th, then drop to the 1st rank (Rb1) to check.',
      expectedMoves: ['Rb1']
    },
    {
      id: 'endgame_queen',
      title: 'Queen vs Pawn Endgame',
      category: 'Queen Endgames',
      fen: '8/8/8/8/3k4/4p3/3K4/7Q w - - 0 1',
      desc: 'Maneuver the queen to force the enemy king in front of its passed pawn, earning tempos to bring your own king closer.',
      keyConcepts: ['Pin the passed pawn', 'Force king to block own pawn', 'March white king closer'],
      solutionText: 'Play Qe4+ followed by Qd3 to pin and force Kd2, bringing the white king in to win.',
      expectedMoves: ['Qe4']
    },
    {
      id: 'endgame_fortress',
      title: 'Fortress Hold Drill',
      category: 'Fortresses',
      fen: '8/8/p7/kp6/1p6/1P6/8/K7 w - - 0 1',
      desc: 'Hold a draw in an otherwise lost material position by constructing an unbreakable defensive fortress.',
      keyConcepts: ['Closed pawn barriers', 'Restricted enemy ingress paths', 'Shuffing king between safe squares'],
      solutionText: 'Play Ka2 and shuffle between a1 and a2. Black has no way to infiltrate the closed pawn wall.',
      expectedMoves: ['Ka2']
    }
  ];

  const addXP = useAppStore(state => state.addXP);
  const currentDrill = drills[selectedDrillIdx];
  const [drillFen, setDrillFen] = useState<string>(currentDrill.fen);

  // Sync FEN when drill changes
  useEffect(() => {
    setDrillFen(currentDrill.fen);
  }, [selectedDrillIdx]);

  const handleMoveAttempt = (from: string, to: string) => {
    const cleanMoveSquare = (san: string) => {
      return san.replace(/[KQRBN+#x=]/g, '').toLowerCase();
    };

    const expected = currentDrill.expectedMoves[stepIndex];
    if (!expected) return;

    const expectedSq = cleanMoveSquare(expected);
    
    // For King Opposition Drill, Kd4, Ke4, and Kf4 are all acceptable in step 0
    const isCorrect = currentDrill.id === 'endgame_opp' 
      ? (to === 'd4' || to === 'e4' || to === 'f4')
      : (to.toLowerCase() === expectedSq);

    if (isCorrect) {
      // Apply the move to the FEN
      const game = new Chess(drillFen);
      try {
        const move = game.move({ from, to, promotion: 'q' });
        if (move) {
          setDrillFen(game.fen());
        }
      } catch (e) {
        // Fallback FEN update if move notation is complex
      }

      if (stepIndex === currentDrill.expectedMoves.length - 1) {
        setFeedback(`🎉 Perfect! You successfully completed the ${currentDrill.title}! (+15 XP)`);
        addXP(15);
        setStepIndex(stepIndex + 1);
      } else {
        setFeedback(`Correct move! Step ${stepIndex + 1}/${currentDrill.expectedMoves.length} completed. Keep going! (+5 XP)`);
        addXP(5);
        setStepIndex(stepIndex + 1);
      }
    } else {
      setFeedback(`Incorrect. Review the key concepts or solution and try again.`);
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
            fen={drillFen} 
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
