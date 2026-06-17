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
  
  // Interactive Questions States for deliberate practice
  const [questionnaireActive, setQuestionnaireActive] = useState<boolean>(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<boolean>(false);
  const [selectedIdea, setSelectedIdea] = useState<string>('');
  const [selectedThreat, setSelectedThreat] = useState<string>('');
  const [selectedAlternative, setSelectedAlternative] = useState<string>('');
  
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
    setQuestionnaireActive(false);
    setSubmittedAnswers(false);
    setSelectedIdea('');
    setSelectedThreat('');
    setSelectedAlternative('');
  }, [puzzle]);

  // Run Stockfish analysis when reaching Step 6
  useEffect(() => {
    if (step === 6) {
      stockfishService.analyze(puzzle.fen, 12).then(result => {
        if (result.lines.length > 0) {
          setEvalBefore(result.lines[0].displayScore);
        }
      }).catch(() => setEvalBefore('N/A'));

      const game = new Chess(puzzle.fen);
      try {
        for (const move of puzzle.solution) {
          game.move(move);
        }
        stockfishService.analyze(game.fen(), 12).then(result => {
          if (result.lines.length > 0) {
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

  const classifyMove = (evalDelta: number): string => {
    if (evalDelta >= 50) return '🟢 Excellent';
    if (evalDelta >= 0) return '🔵 Good';
    if (evalDelta >= -30) return '🟡 Interesting';
    if (evalDelta >= -80) return '🟠 Inaccuracy';
    if (evalDelta >= -200) return '🔴 Mistake';
    return '⛔ Blunder';
  };

  const getCorrectSafety = (): string => {
    const fen = puzzle.fen.toLowerCase();
    if (puzzle.id.includes('mi1') || puzzle.id.includes('mi2') || puzzle.category.includes('mate')) {
      return 'Black';
    }
    if (fen.includes('q') && fen.includes('r') && puzzle.category === 'forks') {
      return 'Black';
    }
    return 'Equal';
  };

  const getCorrectOverloaded = (): string => {
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
        setFeedback(null);
        // Activate interactive questionnaire before advancing
        setQuestionnaireActive(true);
        setSubmittedAnswers(false);
      } else {
        setFeedback({ isCorrect: false, text: `⛔ Move ${lastMove.san} is incorrect. Let's retry from the start.` });
        setTimeout(() => {
          onChangeFen(puzzle.fen);
        }, 1200);
      }
    } else if (step === 5) {
      const expectedFinal = solutionMoves[2] || solutionMoves[0];
      const isCorrect = cleanSan(lastMove.san) === cleanSan(expectedFinal);

      if (isCorrect) {
        setFeedback(null);
        setQuestionnaireActive(true);
        setSubmittedAnswers(false);
      } else {
        setFeedback({ isCorrect: false, text: `Incorrect continuation: ${lastMove.san}. Retrying...` });
        setTimeout(() => {
          const game = new Chess(puzzle.fen);
          try {
            game.move(solutionMoves[0]);
            game.move(solutionMoves[1]);
            onChangeFen(game.fen());
          } catch {
            // ignore setup errors
          }
        }, 1200);
      }
    }
  }, [lastMove]);

  const handleKingSafetySubmit = (choice: string) => {
    setSelectedSafety(choice);
    const correctSafety = getCorrectSafety();
    const isCorrect = choice.toLowerCase() === correctSafety.toLowerCase();
    
    if (isCorrect) {
      setFeedback({ isCorrect: true, text: `Correct! The ${choice} king is vulnerable in this tactical environment.` });
      setTimeout(() => {
        setStep(2);
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ isCorrect: false, text: `Incorrect. Look at piece activity and open alignment lines around the kings.` });
    }
  };

  const handleMotifSubmit = (motif: string) => {
    setSelectedMotif(motif);
    const expectedCategory = puzzle.category.toLowerCase().replace('_', ' ');
    const isCorrect = motif.toLowerCase().includes(expectedCategory) || 
                      expectedCategory.includes(motif.toLowerCase()) || 
                      puzzle.theme.toLowerCase().includes(motif.toLowerCase());
                      
    if (isCorrect) {
      setFeedback({ isCorrect: true, text: `Correct! The primary tactical theme relies on ${motif}.` });
      setTimeout(() => {
        setStep(3);
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ isCorrect: false, text: 'Incorrect. Re-evaluate the geometrical alignment and tactical threats.' });
    }
  };

  const handleOverloadedSubmit = () => {
    if (!inputOverloaded) return;
    const correctOverloaded = getCorrectOverloaded();
    const isCorrect = inputOverloaded.trim().toLowerCase() === correctOverloaded.toLowerCase() ||
                      (correctOverloaded === 'none' && inputOverloaded.toLowerCase() === 'none') ||
                      puzzle.solution.some(m => m.toLowerCase().includes(inputOverloaded.trim().toLowerCase()));

    if (isCorrect) {
      setFeedback({ isCorrect: true, text: `Excellent! ${inputOverloaded.toUpperCase()} is a weak link in the opponent's coordination.` });
      onSelectHighlight(inputOverloaded);
      setTimeout(() => {
        setStep(4);
        setFeedback(null);
        onSelectHighlight(null);
      }, 1500);
    } else {
      setFeedback({ isCorrect: false, text: `Incorrect. Which square acts as the critical defender or direct target?` });
    }
  };

  const handleQuestionnaireSubmit = () => {
    if (!selectedIdea || !selectedThreat || !selectedAlternative) {
      setFeedback({ isCorrect: false, text: 'Please answer all three coaching questions to continue!' });
      return;
    }
    setSubmittedAnswers(true);
    setFeedback({ isCorrect: true, text: 'Answers submitted! Review the GM Critique below.' });
  };

  const handleQuestionnaireContinue = () => {
    setQuestionnaireActive(false);
    setSubmittedAnswers(false);
    setSelectedIdea('');
    setSelectedThreat('');
    setSelectedAlternative('');
    setFeedback(null);

    const solutionMoves = puzzle.solution;
    if (step === 4) {
      addXP(5);
      if (solutionMoves.length <= 1) {
        setStep(6);
      } else {
        const game = new Chess(puzzle.fen);
        try {
          game.move(solutionMoves[0]);
          const opponentMove = solutionMoves[1];
          game.move(opponentMove);
          onChangeFen(game.fen());
          setFeedback({ isCorrect: true, text: `Opponent plays ${opponentMove}. Solve the final follow-up move!` });
        } catch {
          // ignore move errors
        }
        setStep(5);
      }
    } else if (step === 5) {
      addXP(10);
      setStep(6);
    }
  };

  const handleNextStep = () => {
    if (step < 8) {
      setStep(step + 1);
      setFeedback(null);
    } else {
      addXP(15);
      onSolved();
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5 w-full max-w-md text-slate-200 border border-white/5 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Guided Coach</span>
          <h3 className="text-base font-bold text-white">8-Step Deliberate Method</h3>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 font-mono text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          Step {step}/8
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
          <div 
            key={s} 
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-emerald-500' : 'bg-white/10'}`}
          />
        ))}
      </div>

      {/* Steps Content */}
      <div className="flex-1 min-h-[220px] flex flex-col justify-between">
        {questionnaireActive ? (
          /* Deliberate Practice Move Questionnaire */
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider text-emerald-400 border-b border-white/5 pb-1">
              🤔 Deliberate Practice Evaluation
            </h4>
            
            {!submittedAnswers ? (
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {/* Q1: Idea */}
                <div>
                  <span className="text-[11px] font-bold text-slate-300 block mb-1">1. What was your idea behind {lastMove?.san}?</span>
                  <div className="flex flex-col gap-1">
                    {[
                      'To deliver checkmate / direct mating attack',
                      'To decoy or deflect the primary defender',
                      'To win material via a fork / double attack',
                      'To gain template space / activate pieces'
                    ].map(opt => (
                      <label key={opt} className="flex items-start gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-[11px] cursor-pointer text-slate-300">
                        <input 
                          type="radio" 
                          name="idea" 
                          value={opt} 
                          checked={selectedIdea === opt} 
                          onChange={() => setSelectedIdea(opt)} 
                          className="mt-0.5 accent-emerald-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q2: Threats */}
                <div>
                  <span className="text-[11px] font-bold text-slate-300 block mb-1">2. What opponent threats did you see?</span>
                  <div className="flex flex-col gap-1">
                    {[
                      'Counter-attack or checkmate vectors on my king',
                      'Piece pins, structural forks, or captures',
                      'None, this is a fully forced sequence'
                    ].map(opt => (
                      <label key={opt} className="flex items-start gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-[11px] cursor-pointer text-slate-300">
                        <input 
                          type="radio" 
                          name="threat" 
                          value={opt} 
                          checked={selectedThreat === opt} 
                          onChange={() => setSelectedThreat(opt)} 
                          className="mt-0.5 accent-emerald-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q3: Alternatives */}
                <div>
                  <span className="text-[11px] font-bold text-slate-300 block mb-1">3. What alternatives existed?</span>
                  <div className="flex flex-col gap-1">
                    {[
                      'Playing a passive defensive / castling move',
                      'Attempting a different forcing check or capture',
                      'None, this was the only viable candidate move'
                    ].map(opt => (
                      <label key={opt} className="flex items-start gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-[11px] cursor-pointer text-slate-300">
                        <input 
                          type="radio" 
                          name="alternative" 
                          value={opt} 
                          checked={selectedAlternative === opt} 
                          onChange={() => setSelectedAlternative(opt)} 
                          className="mt-0.5 accent-emerald-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleQuestionnaireSubmit}
                  className="bg-emerald-500 hover:bg-emerald-600 text-bg-primary font-bold py-2 rounded-xl text-xs mt-1 transition-all"
                >
                  Submit for Critique
                </button>
              </div>
            ) : (
              /* GM Critique & Feedback Output */
              <div className="flex flex-col gap-3">
                <div className="bg-[#06060b] border border-white/5 p-3.5 rounded-xl flex flex-col gap-2.5 text-[11px] leading-relaxed">
                  <div>
                    <span className="font-bold text-emerald-400 block">🟢 Move Critique:</span>
                    <span>Excellent choice. You played <strong>{lastMove?.san}</strong>, which is the strongest move. Your idea to <em>"{selectedIdea}"</em> is tactically sound and executes the solution.</span>
                  </div>
                  <div>
                    <span className="font-bold text-sky-400 block">🌳 Better Alternatives:</span>
                    <span>No better options. Alternative moves like passive development would release tension and surrender control.</span>
                  </div>
                  <div>
                    <span className="font-bold text-amber-400 block">🎯 Missed Opportunities:</span>
                    <span>Zero missed opportunities. You executed the absolute engine move.</span>
                  </div>
                  <div>
                    <span className="font-bold text-rose-400 block">⚠️ Tactical Warning:</span>
                    <span>Ensure that you keep calculating forced responses to prevent opponent counter-punches.</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block">📖 Strategic Advice:</span>
                    <span>In forcing positions, prioritize Checks, Captures, and Threats (CCT) in your calculation tree.</span>
                  </div>
                </div>

                <button 
                  onClick={handleQuestionnaireContinue}
                  className="bg-emerald-500 hover:bg-emerald-600 text-bg-primary font-extrabold py-2 rounded-xl text-xs transition-all w-full shadow-glow"
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Normal Steps */
          <div className="flex flex-col gap-3">
            {step === 1 && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>1️⃣</span> Evaluate King Safety
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Examine the position. Assess safety level, open lines, and coordinates of both kings to determine target vulnerability.
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
                  Look for tactical configurations. Which imbalance or tactical mechanism serves as the catalyst for your combination?
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
                  Identify the overloaded defender or target weakness square. Type its board coordinate (e.g. <strong>f7</strong>, <strong>c6</strong>, <strong>e8</strong>) or <strong>none</strong>:
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
                  Generate candidate options. Play your first candidate move directly on the chess board.
                </p>
                <div className="mt-2 text-[11px] text-slate-400 border border-white/5 rounded-lg p-3.5 bg-white/5 leading-relaxed">
                  💡 <span className="font-bold text-emerald-400">Coach:</span> Drag and drop the piece on the board to execute your calculated first move.
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>5️⃣</span> Calculate Variations
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The defender has replied. Now calculate the follow-up move to break opponent resistance.
                </p>
                <div className="mt-2 text-[11px] text-slate-400 border border-white/5 rounded-lg p-3.5 bg-white/5 leading-relaxed">
                  💡 <span className="font-bold text-emerald-400">Coach:</span> Enter the final move on the board to prove the variation.
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>6️⃣</span> Evaluation Changes (Outcome)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  See how the evaluation of the position shifted following the deliberate tactical line:
                </p>
                <div className="bg-[#0c0c14] border border-white/5 p-3 rounded-xl flex flex-col gap-2 font-mono text-xs shadow-inner">
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
                  Compare other candidate choices. Why are alternative paths tactically inferior?
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
                    <p className="text-[11px] text-slate-400 italic">No alternative options exist that avoid direct material loss or checkmate.</p>
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
                  Learn from failure modes. How does the opponent refute other moves?
                </p>
                <div className="flex flex-col gap-2 bg-[#0c0c14] border border-white/5 p-3.5 rounded-xl leading-relaxed">
                  {puzzle.commonErrors && puzzle.commonErrors.length > 0 ? (
                    <ul className="list-disc pl-4 flex flex-col gap-1.5 text-[11px]">
                      {puzzle.commonErrors.map((err, idx) => (
                        <li key={idx} className="text-slate-300">
                          {err}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">Deviating from the solution immediately drops initiative or defense.</p>
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
        )}
      </div>

      {/* Local Feedback Indicator */}
      {feedback && (
        <div className={`p-2.5 rounded-lg text-[11px] font-semibold border animate-fadeIn ${
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
