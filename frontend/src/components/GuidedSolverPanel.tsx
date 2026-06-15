import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { useAppStore } from '../store/useAppStore';
import { Puzzle } from '../content/puzzle-db';
import { stockfishService, PVLine } from '../core/stockfishService';

interface GuidedSolverPanelProps {
  puzzle: Puzzle;
  onSolved: () => void;
  onSelectHighlight: (square: string | null) => void;
  step: number;
  setStep: (step: number) => void;
  lastMove: { from: string; to: string; san: string } | null;
  onChangeFen: (fen: string) => void;
}

export const GuidedSolverPanel: React.FC<GuidedSolverPanelProps> = ({
  puzzle,
  onSolved,
  onSelectHighlight,
  step,
  setStep,
  lastMove,
  onChangeFen
}) => {
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [selectedSafety, setSelectedSafety] = useState<string | null>(null);
  const [selectedMotif, setSelectedMotif] = useState<string | null>(null);
  const [inputOverloaded, setInputOverloaded] = useState<string>('');
  const [evalBefore, setEvalBefore] = useState<string>('Analyzing...');
  const [evalAfter, setEvalAfter] = useState<string>('Analyzing...');
  const [moveClassification, setMoveClassification] = useState<string>('');
  
  const addXP = useAppStore(state => state.addXP);

  // Clear states when puzzle changes
  useEffect(() => {
    setFeedback(null);
    setSelectedSafety(null);
    setSelectedMotif(null);
    setInputOverloaded('');
    setEvalBefore('Analyzing...');
    setEvalAfter('Analyzing...');
    setMoveClassification('');
  }, [puzzle]);

  // Run Stockfish analysis when reaching Step 6
  useEffect(() => {
    if (step === 6) {
      // Analyze initial position
      stockfishService.analyze(puzzle.fen, 12).then(result => {
        if (result.lines.length > 0) {
          setEvalBefore(result.lines[0].displayScore);
        }
      }).catch(() => setEvalBefore('N/A'));

      // Analyze position after solution
      const game = new Chess(puzzle.fen);
      try {
        for (const move of puzzle.solution) {
          game.move(move);
        }
        stockfishService.analyze(game.fen(), 12).then(result => {
          if (result.lines.length > 0) {
            // Negate because it's now opponent's turn
            const rawScore = -result.lines[0].score;
            const displayScore = rawScore > 0 ? `+${(rawScore/100).toFixed(2)}` : (rawScore/100).toFixed(2);
            setEvalAfter(result.lines[0].scoreType === 'mate' ? `M${Math.abs(result.lines[0].score)}` : displayScore);
          }
        }).catch(() => setEvalAfter('Winning'));
      } catch {
        setEvalAfter('Winning');
      }
    }
  }, [step, puzzle]);

  // Classify a move based on eval delta (centipawns)
  const classifyMove = (evalDelta: number): string => {
    if (evalDelta >= 50) return '🟢 Excellent';
    if (evalDelta >= 0) return '🔵 Good';
    if (evalDelta >= -30) return '🟡 Interesting';
    if (evalDelta >= -80) return '🟠 Inaccuracy';
    if (evalDelta >= -200) return '🔴 Mistake';
    return '⛔ Blunder';
  };

  // Pre-calculate expected values for steps 1 and 3 based on position or defaults
  const getCorrectSafety = (): string => {
    const fen = puzzle.fen.toLowerCase();
    // Heuristics for the puzzle set
    if (puzzle.id.includes('mi1') || puzzle.id.includes('mi2') || puzzle.category.includes('mate')) {
      return 'Black'; // Black king is vulnerable (getting mated)
    }
    if (fen.includes('q') && fen.includes('r') && puzzle.category === 'forks') {
      return 'Black';
    }
    return 'Equal';
  };

  const getCorrectOverloaded = (): string => {
    // Simple mapped coordinates of critical/overloaded pieces for the genuine puzzle DB
    const coordinates: Record<string, string> = {
      'mi1-001': 'f7',
      'mi1-002': 'f7',
      'mi1-003': 'g8',
      'mi1-009': 'f7',
      'mi1-011': 'f7',
      'mi1-012': 'f7',
      'mi2-001': 'c3',
      'mi2-002': 'f7',
      'mi2-003': 'e8',
      'mi2-004': 'g8',
      'mi2-006': 'f7',
      'fork-001': 'd7',
      'fork-002': 'f7',
      'fork-003': 'c8',
      'fork-004': 'd6',
      'pin-001': 'f6',
      'pin-002': 'c6',
      'pin-003': 'f6',
      'skw-001': 'c6',
      'skw-002': 'c6',
      'skw-003': 'b1',
      'defl-002': 'f7',
      'sac-001': 'h7',
    };
    return coordinates[puzzle.id] || 'none';
  };

  // Handle board moves in Step 4 and Step 5
  useEffect(() => {
    if (!lastMove) return;

    const cleanSan = (s: string) => s.replace(/[+#x=]/g, '').toLowerCase();
    const solutionMoves = puzzle.solution;

    if (step === 4) {
      const expectedFirst = solutionMoves[0];
      const isCorrect = cleanSan(lastMove.san) === cleanSan(expectedFirst);

      if (isCorrect) {
        setMoveClassification(classifyMove(100)); // Correct move gets positive delta
        setFeedback({ isCorrect: true, text: `${classifyMove(100)} — ${lastMove.san}! The strongest continuation. (+5 XP)` });
        addXP(5);
        
        setTimeout(() => {
          setFeedback(null);
          if (solutionMoves.length <= 1) {
            // No opponent replies (e.g. Mate in 1), skip variation calculation
            setStep(6);
          } else {
            // Play opponent response automatically and move to Step 5
            const game = new Chess(puzzle.fen);
            try {
              game.move(solutionMoves[0]);
              const opponentMove = solutionMoves[1];
              game.move(opponentMove);
              onChangeFen(game.fen());
              setFeedback({ isCorrect: true, text: `Opponent replies with: ${opponentMove}. Now calculate the final move.` });
            } catch (e) {
              console.error("Opponent move execution failed", e);
            }
            setStep(5);
          }
        }, 1500);
      } else {
        setMoveClassification(classifyMove(-150)); // Wrong move classified as mistake/blunder
        setFeedback({ isCorrect: false, text: `${classifyMove(-150)} — ${lastMove.san} is not the best move. Try again.` });
        // Snap back to initial FEN
        setTimeout(() => {
          onChangeFen(puzzle.fen);
        }, 1000);
      }
    } else if (step === 5) {
      // Step 5 expects the final winning move (usually index 2 in the solution array)
      const expectedFinal = solutionMoves[2] || solutionMoves[0];
      const isCorrect = cleanSan(lastMove.san) === cleanSan(expectedFinal);

      if (isCorrect) {
        setFeedback({ isCorrect: true, text: `Brilliant! ${lastMove.san} completes the tactical combination. (+10 XP)` });
        addXP(10);
        setTimeout(() => {
          setFeedback(null);
          setStep(6);
        }, 1500);
      } else {
        setFeedback({ isCorrect: false, text: `Incorrect continuation: ${lastMove.san}. Look for the final blow.` });
        // Snap back to opponent's move state
        setTimeout(() => {
          const game = new Chess(puzzle.fen);
          try {
            game.move(solutionMoves[0]);
            game.move(solutionMoves[1]);
            onChangeFen(game.fen());
          } catch {}
        }, 1000);
      }
    }
  }, [lastMove]);

  const handleKingSafetySubmit = (choice: string) => {
    setSelectedSafety(choice);
    const correctSafety = getCorrectSafety();
    const isCorrect = choice.toLowerCase() === correctSafety.toLowerCase();
    
    if (isCorrect) {
      setFeedback({ isCorrect: true, text: `Correct! The ${choice} king is under severe strategic or tactical pressure.` });
      setTimeout(() => {
        setStep(2);
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ isCorrect: false, text: `Incorrect. Observe the degree of protection and attacker presence.` });
    }
  };

  const handleMotifSubmit = (motif: string) => {
    setSelectedMotif(motif);
    const expectedCategory = puzzle.category.toLowerCase().replace('_', ' ');
    const isCorrect = motif.toLowerCase().includes(expectedCategory) || 
                      expectedCategory.includes(motif.toLowerCase()) || 
                      puzzle.theme.toLowerCase().includes(motif.toLowerCase());
                      
    if (isCorrect) {
      setFeedback({ isCorrect: true, text: `Correct! The primary tactical motif involves ${motif}.` });
      setTimeout(() => {
        setStep(3);
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ isCorrect: false, text: 'Not quite. Check the alignment, double threat vectors, or geometric weaknesses.' });
    }
  };

  const handleOverloadedSubmit = () => {
    if (!inputOverloaded) return;
    const correctOverloaded = getCorrectOverloaded();
    
    // Accept exact match, or if 'none' matches, or user types a square of a piece in the tactical line
    const isCorrect = inputOverloaded.trim().toLowerCase() === correctOverloaded.toLowerCase() ||
                      (correctOverloaded === 'none' && inputOverloaded.toLowerCase() === 'none') ||
                      puzzle.solution.some(m => m.toLowerCase().includes(inputOverloaded.trim().toLowerCase()));

    if (isCorrect) {
      setFeedback({ isCorrect: true, text: `Excellent! ${inputOverloaded.toUpperCase()} is a critical weak target in this position.` });
      onSelectHighlight(inputOverloaded);
      setTimeout(() => {
        setStep(4);
        setFeedback(null);
        onSelectHighlight(null);
      }, 1500);
    } else {
      setFeedback({ isCorrect: false, text: `Incorrect target. Which square is key to defending the threats or is directly attackable?` });
    }
  };

  const handleNextStep = () => {
    if (step < 8) {
      setStep(step + 1);
      setFeedback(null);
    } else {
      // Reward user and trigger complete
      addXP(15);
      onSolved();
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5 w-full max-w-md text-slate-200 border border-white/5">
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Guided Coach</span>
          <h3 className="text-base font-bold text-white">8-Step Deliberate Method</h3>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 font-mono text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          Step {step}/8
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
          <div 
            key={s} 
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-emerald-500' : 'bg-white/10'}`}
          />
        ))}
      </div>

      {/* Main interactive panel based on step */}
      <div className="flex-1 min-h-[200px]">
        {step === 1 && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>1️⃣</span> Evaluate King Safety
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Examine the board. Compare the safety of both kings. Look at attacker coordination, pawn barriers, and open lines.
            </p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['White', 'Black', 'Equal'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleKingSafetySubmit(opt)}
                  className={`py-2 rounded-lg border text-xs font-semibold transition-all ${
                    selectedSafety === opt 
                      ? 'bg-emerald-500/20 border-emerald-500 text-white' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>2️⃣</span> Identify Tactical Motifs
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identify the active tactical motif. What positional configurations exist that support a tactical strike?
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Pins & Absolute Pins', 'Forks & Double Attacks', 'Back Rank Weakness', 'Sacrifices & Attraction', 'Deflection & Decoys', 'Zwischenzug'].map(motif => (
                <button
                  key={motif}
                  onClick={() => handleMotifSubmit(motif)}
                  className={`py-2 px-3 rounded-lg border text-left text-[11px] font-semibold transition-all ${
                    selectedMotif === motif 
                      ? 'bg-emerald-500/20 border-emerald-500 text-white' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {motif}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>3️⃣</span> Spot Weaknesses & Overloads
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find the specific weak square or overloaded piece. Type its board coordinate (e.g., <strong>f7</strong>, <strong>c6</strong>, <strong>e8</strong>) or type <strong>none</strong>:
            </p>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="e.g. f7, c6, none"
                value={inputOverloaded}
                onChange={e => setInputOverloaded(e.target.value.toLowerCase())}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 flex-1 text-white uppercase font-mono"
              />
              <button
                onClick={handleOverloadedSubmit}
                className="bg-emerald-500 hover:bg-emerald-600 text-bg-primary font-bold px-3 py-1.5 rounded-lg text-xs transition-all"
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>4️⃣</span> Formulate Candidate Moves
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Make your first candidate move directly on the board. The coach will evaluate it.
            </p>
            <div className="mt-2 text-[11px] text-slate-400 border border-white/5 rounded-lg p-3 bg-white/5 leading-relaxed">
              💡 <span className="font-bold text-emerald-400">Coach Guidance:</span> Grab a piece on the board and drag it to execute the starting move of the tactical combination.
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>5️⃣</span> Calculate Variations
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The opponent has responded. Input the follow-up move on the board to complete the variation chain and prove your line.
            </p>
            <div className="mt-2 text-[11px] text-slate-400 border border-white/5 rounded-lg p-3 bg-white/5 leading-relaxed">
              💡 <span className="font-bold text-emerald-400">Coach Guidance:</span> Complete the final blow of the tactical sequence on the board.
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>6️⃣</span> Evaluation Changes
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understand the impact of the tactical sequence on the position evaluation:
            </p>
            <div className="bg-[#0c0c14] border border-white/5 p-3 rounded-xl flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span>Before move:</span>
                <span className="text-slate-400">{evalBefore}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span>After solution:</span>
                <span className="text-emerald-400 font-bold">{evalAfter}</span>
              </div>
              {moveClassification && (
                <div className="flex justify-between items-center border-b border-white/5 pb-1">
                  <span>Move Quality:</span>
                  <span className="font-bold">{moveClassification}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>Theme:</span>
                <span className="text-amber-400 capitalize">{puzzle.theme}</span>
              </div>
            </div>
            <button
              onClick={handleNextStep}
              className="bg-emerald-500 hover:bg-emerald-600 text-bg-primary font-bold py-2 rounded-lg text-xs mt-2 transition-all w-full"
            >
              Explain Alternative Candidates →
            </button>
          </div>
        )}

        {step === 7 && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>7️⃣</span> Explain Alternatives
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Why were other candidate moves inferior? Let's check alternative paths:
            </p>
            
            <div className="flex flex-col gap-2 bg-[#0c0c14] border border-white/5 p-3 rounded-xl">
              {puzzle.alternatives && puzzle.alternatives.length > 0 ? (
                puzzle.alternatives.map((alt, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between font-mono font-semibold text-amber-400 border-b border-white/5 pb-1 mb-1">
                      <span>Alternative: {alt.move}</span>
                      <span>Eval: {alt.eval}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{alt.reason}</p>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-400 italic">No alternative lines offer any active counterplay or dynamic compensation in this position.</p>
              )}
            </div>

            <button
              onClick={handleNextStep}
              className="bg-[#10b981]/20 hover:bg-[#10b981]/30 border border-[#10b981]/30 text-emerald-400 font-bold py-2 rounded-lg text-xs mt-2 transition-all w-full"
            >
              Analyze Failure Modes →
            </button>
          </div>
        )}

        {step === 8 && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>8️⃣</span> Why Other Moves Fail
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Examine the common errors and why they fail to accomplish the tactical goals:
            </p>
            
            <div className="flex flex-col gap-2 bg-[#0c0c14] border border-white/5 p-3 rounded-xl leading-relaxed">
              {puzzle.commonErrors && puzzle.commonErrors.length > 0 ? (
                <ul className="list-disc pl-4 flex flex-col gap-1.5">
                  {puzzle.commonErrors.map((err, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300">
                      {err}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-slate-400 italic">Moving pieces to squares with lack of protection immediately leads to direct loss of material or checkmate.</p>
              )}
              <div className="text-[11px] text-slate-400 mt-2 border-t border-white/5 pt-2">
                <span className="font-bold text-white">Coach Verdict:</span> {puzzle.coachNotes}
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-bg-primary font-extrabold py-2.5 rounded-xl mt-2 shadow-glow text-center text-xs transition-all w-full"
            >
              Complete Study & Claim +15 XP 🏆
            </button>
          </div>
        )}
      </div>

      {/* Feedback Alert Overlay */}
      {feedback && (
        <div className={`p-2.5 rounded-lg text-[11px] font-semibold border ${
          feedback.isCorrect 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {feedback.text}
        </div>
      )}
    </div>
  );
};

export default GuidedSolverPanel;
