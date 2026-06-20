import React, { useState, useEffect } from 'react';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';
import { Chess } from 'chess.js';
import { stockfishService } from '../core/stockfishService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

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

  // Play vs Engine States
  const [trainerMode, setTrainerMode] = useState<'theory' | 'conversion' | 'defense'>('theory');
  const [engineIsThinking, setEngineIsThinking] = useState<boolean>(false);
  const [evalBarText, setEvalBarText] = useState<string>('0.00');
  const [evalBarPercent, setEvalBarPercent] = useState<number>(50); // 50% is equal

  const drills: EndgameDrill[] = [
    {
      id: 'endgame_opp',
      title: 'King Opposition Drill',
      category: 'King & Pawn',
      fen: '8/8/4k3/8/4K3/8/8/8 w - - 0 1',
      desc: 'Maintain opposition. Seize the opposition by stepping directly in front of the enemy king when they move.',
      keyConcepts: ['Kings facing each other', 'Odd number of squares between', 'First player to move loses opposition'],
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
      desc: 'Promote the pawn using the Lucena Position. Create the "bridge" with your rook on the 4th rank to shield your king from checks.',
      keyConcepts: ['Pawn on 7th rank', 'Rook on 4th rank (bridge)', 'Build shield against checkstorms'],
      solutionText: '1. Rf4! followed by Rd4 to block rook checks and promote the pawn.',
      expectedMoves: ['Rf4', 'Rd4']
    },
    {
      id: 'endgame_philidor',
      title: 'Philidor Defense',
      category: 'Rook Endgames',
      fen: '8/8/1r6/3k4/3P4/8/3K4/3R4 b - - 0 1',
      desc: 'Defend and draw in a rook endgame by cutting off the active king on the 3rd rank, and dropping to the 1st rank once the pawn advances.',
      keyConcepts: ['Cut off king on 3rd rank', 'Wait until pawn advances', 'Deliver checkstorms from behind'],
      solutionText: 'Keep the rook on the 6th rank (Rb6) until the pawn advances to the 6th, then drop to the 1st rank (Rb1) to check.',
      expectedMoves: ['Rb1']
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
  const currentDrill = drills[selectedDrillIdx] || drills[0];
  const [drillFen, setDrillFen] = useState<string>(currentDrill.fen);

  // Sync FEN when drill or mode changes
  useEffect(() => {
    setDrillFen(currentDrill.fen);
    setStepIndex(0);
    setFeedback(null);
    setEngineIsThinking(false);
    updateEvalBar(currentDrill.fen);
  }, [selectedDrillIdx, trainerMode]);

  const updateEvalBar = async (fen: string) => {
    try {
      const analysis = await stockfishService.analyze(fen, 10);
      if (analysis.lines && analysis.lines.length > 0) {
        const score = analysis.lines[0].score;
        const scoreType = analysis.lines[0].scoreType;
        if (scoreType === 'mate') {
          setEvalBarText(`M${Math.abs(score)}`);
          setEvalBarPercent(score > 0 ? 100 : 0);
        } else {
          const evalVal = score / 100;
          setEvalBarText(evalVal > 0 ? `+${evalVal.toFixed(2)}` : evalVal.toFixed(2));
          // Map -5.0 to +5.0 range to 0% to 100%
          const percent = Math.min(100, Math.max(0, ((evalVal + 5) / 10) * 100));
          setEvalBarPercent(percent);
        }
      }
    } catch {
      // Offline fallback
    }
  };

  const handleMoveAttempt = async (from: string, to: string) => {
    const game = new Chess(drillFen);
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (!move) return;

      const newFen = game.fen();
      setDrillFen(newFen);
      updateEvalBar(newFen);

      if (trainerMode === 'theory') {
        // Mode 1: Step by Step theory verification
        const cleanMoveSquare = (san: string) => san.replace(/[KQRBN+#x=]/g, '').toLowerCase();
        const expected = currentDrill.expectedMoves[stepIndex];
        if (!expected) return;

        const expectedSq = cleanMoveSquare(expected);
        const isCorrect = currentDrill.id === 'endgame_opp'
          ? (to === 'd4' || to === 'e4' || to === 'f4')
          : (to.toLowerCase() === expectedSq);

        if (isCorrect) {
          if (stepIndex === currentDrill.expectedMoves.length - 1) {
            setFeedback(`🎉 Perfect! You successfully completed the ${currentDrill.title}! (+15 XP)`);
            addXP(15);
            setStepIndex(stepIndex + 1);
          } else {
            setFeedback(`Correct move! Step ${stepIndex + 1}/${currentDrill.expectedMoves.length} completed. Keep going!`);
            addXP(5);
            setStepIndex(stepIndex + 1);
          }
        } else {
          setFeedback(`Incorrect. Review the key concepts or solution and try again.`);
          // Snap back
          setTimeout(() => setDrillFen(currentDrill.fen), 1000);
        }
      } else {
        // Mode 2: Play Vs Engine (Conversion or Defense)
        if (game.isGameOver()) {
          if (game.isDraw()) {
            setFeedback(trainerMode === 'defense' ? '🎉 Excellent defense! Draw secured. (+20 XP)' : 'Game drawn.');
            if (trainerMode === 'defense') addXP(20);
          } else {
            setFeedback(trainerMode === 'conversion' ? '🎉 Outstanding! Mate delivered. (+20 XP)' : 'Game over.');
            if (trainerMode === 'conversion') addXP(20);
          }
          return;
        }

        // Trigger Stockfish opponent move
        setEngineIsThinking(true);
        setFeedback('AI Coach is thinking...');
        
        setTimeout(async () => {
          try {
            const analysis = await stockfishService.analyze(newFen, 12);
            if (analysis.bestMove) {
              const moveFrom = analysis.bestMove.substring(0, 2);
              const moveTo = analysis.bestMove.substring(2, 4);
              game.move({ from: moveFrom, to: moveTo, promotion: 'q' });
              const postEngineFen = game.fen();
              setDrillFen(postEngineFen);
              updateEvalBar(postEngineFen);
              setFeedback('Your turn! Play the continuation.');
            }
          } catch {
            setFeedback('AI opponent failed to move.');
          } finally {
            setEngineIsThinking(false);
          }
        }, 800);
      }
    } catch {
      if (trainerMode === 'theory') {
        setFeedback(`Incorrect. Review the key concepts or solution and try again.`);
      } else {
        setFeedback('Illegal move. Play a valid chess move.');
      }
    }
  };

  const selectDrill = (idx: number) => {
    setSelectedDrillIdx(idx);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Endgame Lab</span>
          <h2 className="text-2xl font-black text-white font-serif">Theoretical Endgame Drills</h2>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-bg-secondary border border-white/5 p-1 rounded-xl gap-1 shrink-0">
          <Button
            onClick={() => setTrainerMode('theory')}
            variant={trainerMode === 'theory' ? 'primary' : 'ghost'}
            size="sm"
          >
            📖 Step Theory
          </Button>
          <Button
            onClick={() => setTrainerMode('conversion')}
            variant={trainerMode === 'conversion' ? 'primary' : 'ghost'}
            size="sm"
          >
            🔥 Conversion Practice
          </Button>
          <Button
            onClick={() => setTrainerMode('defense')}
            variant={trainerMode === 'defense' ? 'primary' : 'ghost'}
            size="sm"
          >
            🛡️ Active Defense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Drill Menu Sidebar */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Select Drill</span>
          <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
            {drills.map((drill, idx) => (
              <button
                key={drill.id}
                onClick={() => selectDrill(idx)}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  idx === selectedDrillIdx ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <h4 className="font-bold text-xs text-white leading-tight">{drill.title}</h4>
                  <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded font-bold text-slate-400">
                    {drill.category}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{drill.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Board & Eval Bar */}
        <Card className="flex flex-col gap-4 items-center justify-center p-6 relative" hoverEffect={false}>
          {/* Eval Bar */}
          <div className="w-full max-w-[340px] bg-slate-800 h-2.5 rounded-full overflow-hidden flex relative mb-2">
            <div 
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${evalBarPercent}%` }}
            />
            <span className="absolute right-2 top-0 text-[8px] font-mono font-bold text-slate-400">{evalBarText}</span>
          </div>

          <Board
            fen={drillFen}
            interactive={!engineIsThinking}
            onMove={handleMoveAttempt}
          />
          <div className="text-[11px] text-slate-500 mt-2 font-mono">
            {engineIsThinking ? '🤖 Engine thinking...' : 'Make moves on the board to practice.'}
          </div>
        </Card>

        {/* Right Panel: Guided Strategy details */}
        <Card className="flex flex-col justify-between" hoverEffect={false}>
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-500">Endgame Guide</span>
              <h3 className="text-base font-extrabold text-white mt-0.5">{currentDrill.title}</h3>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400">Key Concepts:</span>
              <ul className="list-disc pl-4 flex flex-col gap-1 text-[11px] text-slate-300">
                {currentDrill.keyConcepts.map((concept, i) => (
                  <li key={i} className="font-semibold">{concept}</li>
                ))}
              </ul>
            </div>

            <div className="bg-bg-primary border border-white/5 p-4 rounded-xl text-xs text-slate-300 leading-normal font-semibold">
              <strong className="block text-white mb-0.5">Objective:</strong>
              {currentDrill.desc}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {feedback && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 rounded-xl animate-fadeIn">
                {feedback}
              </div>
            )}

            <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-xs text-amber-400 leading-normal font-semibold">
              <strong className="block text-white mb-0.5">Theoretical Solution:</strong>
              {currentDrill.solutionText}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EndgameTrainer;
