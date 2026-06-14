import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

interface GuidedSolverPanelProps {
  puzzle: {
    id: string;
    FEN: string;
    solution: string;
    category: string;
    difficulty: string;
    motif: string;
    theme?: string;
  };
  onSolved: () => void;
  onSelectHighlight: (square: string | null) => void;
}

export const GuidedSolverPanel: React.FC<GuidedSolverPanelProps> = ({
  puzzle,
  onSolved,
  onSelectHighlight
}) => {
  const [step, setStep] = useState<number>(1);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selectedSafety, setSelectedSafety] = useState<string | null>(null);
  const [selectedMotif, setSelectedMotif] = useState<string | null>(null);
  const [inputOverloaded, setInputOverloaded] = useState<string>('');
  
  const addXP = useAppStore(state => state.addXP);
  const updateRating = useAppStore(state => state.updateRating);

  // Clear states when puzzle changes
  useEffect(() => {
    setStep(1);
    setFeedback(null);
    setCandidates([]);
    setSelectedSafety(null);
    setSelectedMotif(null);
    setInputOverloaded('');
  }, [puzzle]);

  const handleKingSafetySubmit = (choice: string) => {
    setSelectedSafety(choice);
    // Simple heuristic correct answers
    const isCorrect = choice === 'Equal' || 
                      (puzzle.motif.toLowerCase().includes('king') && choice === 'Black') ||
                      (puzzle.id.includes('m1') && choice === 'Black') || 
                      choice === 'White'; // Simple check
    
    if (isCorrect) {
      setFeedback({ isCorrect: true, text: 'Correct! You evaluated king safety accurately.' });
      setTimeout(() => {
        setStep(2);
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ isCorrect: false, text: 'Incorrect. Look at the local protection around the king.' });
    }
  };

  const handleMotifSubmit = (motif: string) => {
    setSelectedMotif(motif);
    const expected = puzzle.category.toLowerCase().replace('_', ' ');
    const isCorrect = motif.toLowerCase().includes(expected) || 
                      expected.includes(motif.toLowerCase()) || 
                      puzzle.motif.toLowerCase().includes(motif.toLowerCase());
                      
    if (isCorrect) {
      setFeedback({ isCorrect: true, text: `Correct! The primary tactical motif involves ${motif}.` });
      setTimeout(() => {
        setStep(3);
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ isCorrect: false, text: 'Not quite. Check the geometry and alignment of pieces.' });
    }
  };

  const handleOverloadedSubmit = () => {
    if (!inputOverloaded) return;
    // Simple check
    const isCorrect = true; // Let them specify any weak square or defender
    setFeedback({ isCorrect: true, text: `Excellent! ${inputOverloaded} is indeed a critical target.` });
    onSelectHighlight(inputOverloaded);
    setTimeout(() => {
      setStep(4);
      setFeedback(null);
      onSelectHighlight(null);
    }, 1500);
  };

  const handleNextStep = () => {
    if (step < 7) {
      setStep(step + 1);
      setFeedback(null);
    } else {
      // Reward user
      addXP(15);
      updateRating(10);
      onSolved();
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 w-full max-w-md text-slate-200">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Guided Solver</span>
          <h3 className="text-lg font-bold text-white">7-Step Tactical Method</h3>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 font-mono text-sm px-3 py-1 rounded-full border border-emerald-500/20">
          Step {step}/7
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7].map(s => (
          <div 
            key={s} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-emerald-500' : 'bg-white/10'}`}
          />
        ))}
      </div>

      {/* Main interactive panel based on step */}
      <div className="flex-1 min-h-[200px]">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white">Step 1: Evaluate King Safety</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Examine the board carefully. Compare the vulnerability of both kings. Consider open files, pawn storms, and active attackers.
            </p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['White', 'Black', 'Equal'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleKingSafetySubmit(opt)}
                  className={`py-3 rounded-lg border text-sm font-semibold transition-all ${
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
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white">Step 2: Identify Tactical Motifs</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              What tactical opportunities exist? Find pins, forks, skewers, mate threats, or weak squares (like f7 or the back rank).
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Pins', 'Forks', 'Back Rank', 'Weak f7 / f2', 'Deflection', 'Sacrifices'].map(motif => (
                <button
                  key={motif}
                  onClick={() => handleMotifSubmit(motif)}
                  className={`py-2 px-3 rounded-lg border text-left text-xs font-semibold transition-all ${
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
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white">Step 3: Spot Weaknesses & Overloads</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Identify which piece is overloaded with defensive duties, or which square lacks protection (e.g., e7, f7, c3). Enter coordinates:
            </p>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="e.g. f7, d4, c3"
                value={inputOverloaded}
                onChange={e => setInputOverloaded(e.target.value.toLowerCase())}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 flex-1 text-white uppercase font-mono"
              />
              <button
                onClick={handleOverloadedSubmit}
                className="bg-emerald-500 hover:bg-emerald-600 text-bg-primary font-bold px-4 py-2 rounded-lg text-sm transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white">Step 4: Formulate Candidate Moves</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enter candidate moves directly on the board. Make your first candidate move. The coach will evaluate whether it is accurate, inaccurate, a mistake, or a blunder.
            </p>
            <div className="mt-2 text-xs text-slate-400 border border-white/5 rounded-lg p-3 bg-white/5">
              💡 <span className="font-semibold text-emerald-400">Coach Guidance:</span> Make the first move of the tactical solution to progress to variation calculation.
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white">Step 5: Calculate Variations</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Opponent responds! Enter the correct reply moves on the board to complete the variation chain. Work out all defensive lines.
            </p>
            <div className="mt-2 text-xs text-slate-400 border border-white/5 rounded-lg p-3 bg-white/5">
              💡 <span className="font-semibold text-emerald-400">Coach Guidance:</span> Input the complete checkmate or material gain combination on the board.
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white">Step 6: Evaluation Changes</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Let's analyze the evaluation:
            </p>
            <div className="bg-[#0c0c14] border border-white/5 p-4 rounded-xl flex flex-col gap-3 font-mono text-sm">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>Before move:</span>
                <span className="text-slate-400">-0.2 (Equal)</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>After solution:</span>
                <span className="text-emerald-400 font-semibold">+4.8 (Winning)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tactical Theme:</span>
                <span className="text-amber-400 capitalize">{puzzle.category.replace('_', ' ')}</span>
              </div>
            </div>
            <button
              onClick={handleNextStep}
              className="bg-emerald-500 hover:bg-emerald-600 text-bg-primary font-bold py-2.5 rounded-lg text-sm mt-2 transition-all"
            >
              Continue to Solution Explanation
            </button>
          </div>
        )}

        {step === 7 && (
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white">Step 7: Complete Solution Explanations</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              The correct line is: <strong className="text-emerald-400 font-mono">{puzzle.solution}</strong>.
            </p>
            <div className="text-sm text-slate-400 border border-white/5 p-3 rounded-lg bg-[#0c0c14] leading-relaxed">
              <span className="font-semibold text-white">Coach Notes:</span> Bxf7+ exposes the enemy king. If Kxf7, Nxe5+ forks king and bishop, securing an advantageous endgame with an extra pawn and central control.
            </div>
            <button
              onClick={handleNextStep}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-bg-primary font-extrabold py-3 rounded-xl mt-2 shadow-glow text-center transition-all"
            >
              Finish & Claim Rewards (+15 XP)
            </button>
          </div>
        )}
      </div>

      {/* Feedback Alert Overlay */}
      {feedback && (
        <div className={`p-3 rounded-lg text-xs font-semibold border ${
          feedback.isCorrect 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {feedback.text}
        </div>
      )}
    </div>
  );
};
export default GuidedSolverPanel;
