import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Board } from '../components/Board';
import { GuidedSolverPanel } from '../components/GuidedSolverPanel';
import { ThinkingModePanel } from '../components/ThinkingModePanel';
import { VariationExplorer } from '../components/VariationExplorer';
import { ALL_PUZZLES, PUZZLE_CATEGORIES, Puzzle, getRandomPuzzle, queryPuzzles } from '../content/puzzle-db';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Toast } from '../components/ui/Toast';

type SolveMode = 'guided' | 'practice' | 'coach' | 'examination' | 'analysis' | 'thinking';

export const Puzzles: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('mate_in_1');
  const [activeMode, setActiveMode] = useState<SolveMode>('guided');
  const [activePuzzleIdx, setActivePuzzleIdx] = useState<number>(0);
  const [customHighlight, setCustomHighlight] = useState<string | null>(null);
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [thinkingCompleted, setThinkingCompleted] = useState<boolean>(false);

  // Examination Mode state
  const [examTimer, setExamTimer] = useState<number>(60);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examResult, setExamResult] = useState<'success' | 'failed' | null>(null);

  // Analysis Mode free play state
  const [analysisMoves, setAnalysisMoves] = useState<string[]>([]);

  // Lifted solver states
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [lastMove, setLastMove] = useState<{ from: string; to: string; san: string } | null>(null);

  const addXP = useAppStore(state => state.addXP);
  const updateRating = useAppStore(state => state.updateRating);

  const filteredPuzzles = queryPuzzles({ category: selectedCategory });
  const currentPuzzle: Puzzle = filteredPuzzles[activePuzzleIdx] || ALL_PUZZLES[0];

  const [puzzleFen, setPuzzleFen] = useState<string>(currentPuzzle.fen);

  // Sync FEN and clear step/moves when puzzle changes or mode changes
  useEffect(() => {
    setPuzzleFen(currentPuzzle.fen);
    setCurrentStep(1);
    setLastMove(null);
    setExamTimer(60);
    setExamSubmitted(false);
    setExamResult(null);
    setAnalysisMoves([]);
    setThinkingCompleted(false);
  }, [currentPuzzle, activeMode]);

  // Exam timer interval
  useEffect(() => {
    if (activeMode !== 'examination' || examSubmitted) return;
    const timer = setInterval(() => {
      setExamTimer(prev => {
        if (prev <= 1) {
          setExamSubmitted(true);
          setExamResult('failed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeMode, examSubmitted]);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToast({ type, text });
  };

  const handleSolved = () => {
    setSolvedCount(prev => prev + 1);
    addXP(15);
    updateRating(12);
    showToast('success', '🎉 Puzzle solved! +15 XP, +12 rating.');
    // Move to next puzzle
    if (activePuzzleIdx < filteredPuzzles.length - 1) {
      setActivePuzzleIdx(activePuzzleIdx + 1);
    } else {
      setActivePuzzleIdx(0);
    }
  };

  const navigatePuzzle = (direction: 'prev' | 'next') => {
    if (direction === 'next' && activePuzzleIdx < filteredPuzzles.length - 1) {
      setActivePuzzleIdx(activePuzzleIdx + 1);
    } else if (direction === 'next') {
      setActivePuzzleIdx(0);
    } else if (direction === 'prev' && activePuzzleIdx > 0) {
      setActivePuzzleIdx(activePuzzleIdx - 1);
    } else {
      setActivePuzzleIdx(filteredPuzzles.length - 1);
    }
  };

  const selectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setActivePuzzleIdx(0);
    setCustomHighlight(null);
  };

  const handleBoardMove = (from: string, to: string, san: string) => {
    setLastMove({ from, to, san });

    if (activeMode === 'practice') {
      const cleanSan = (s: string) => s.replace(/[+#x=]/g, '').toLowerCase();
      const firstMoveExpected = currentPuzzle.solution[0];
      
      if (cleanSan(san) === cleanSan(firstMoveExpected)) {
        if (currentPuzzle.solution.length <= 1) {
          handleSolved();
        } else {
          // Play opponent response and let player make final move
          const tempGame = new Chess(currentPuzzle.fen);
          try {
            tempGame.move(currentPuzzle.solution[0]);
            const reply = currentPuzzle.solution[1];
            tempGame.move(reply);
            setPuzzleFen(tempGame.fen());
            setLastMove(null);
          } catch {
            // ignore invalid move attempts during transition
          }
        }
      } else {
        // Check if final move matches
        const finalExpected = currentPuzzle.solution[2] || currentPuzzle.solution[0];
        if (cleanSan(san) === cleanSan(finalExpected)) {
          handleSolved();
        } else {
          showToast('error', `Incorrect: ${san}. Try again!`);
          setPuzzleFen(currentPuzzle.fen);
        }
      }
    } else if (activeMode === 'examination') {
      const cleanSan = (s: string) => s.replace(/[+#x=]/g, '').toLowerCase();
      const firstMoveExpected = currentPuzzle.solution[0];
      if (cleanSan(san) === cleanSan(firstMoveExpected)) {
        setExamResult('success');
        addXP(20);
        updateRating(15);
      } else {
        setExamResult('failed');
        updateRating(-8);
      }
      setExamSubmitted(true);
    } else if (activeMode === 'analysis') {
      setAnalysisMoves(prev => [...prev, san]);
    }
  };

  const activeHighlights = customHighlight 
    ? [{ square: customHighlight, color: 'rgba(239, 68, 68, 0.4)', class: 'border-2 border-red-500' }]
    : [];

  const isBoardInteractive = activeMode === 'analysis' ||
                             activeMode === 'practice' ||
                             (activeMode === 'examination' && !examSubmitted) ||
                             (activeMode === 'coach') ||
                             (activeMode === 'guided' && (currentStep === 4 || currentStep === 5)) ||
                             (activeMode === 'thinking' && thinkingCompleted);

  const changeMode = (mode: SolveMode) => {
    setActiveMode(mode);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Mastery Arena</span>
          <h2 className="text-2xl font-black text-white font-serif">Tactical Solver Labs</h2>
        </div>

        {/* solve Modes Switcher */}
        <div className="flex bg-[#0c0c14] border border-white/5 p-1 rounded-xl flex-wrap gap-1 shadow-inner">
          {([
            { id: 'guided', label: 'Guided Coach' },
            { id: 'thinking', label: '🧠 GM Thinking' },
            { id: 'practice', label: 'Standard Practice' },
            { id: 'coach', label: 'AI Hint Helper' },
            { id: 'examination', label: 'Exam Stress' },
            { id: 'analysis', label: 'Free Analysis' }
          ] as const).map(m => (
            <button
              key={m.id}
              onClick={() => changeMode(m.id)}
              className={`py-1.5 px-3.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                activeMode === m.id 
                  ? 'bg-emerald-500 text-bg-primary font-bold shadow-glow' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Menu Selector */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Categories</span>
          <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
            {PUZZLE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`p-3 rounded-xl border text-left text-xs font-semibold flex justify-between items-center transition-all duration-300 ${
                  selectedCategory === cat.id 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white shadow-sm' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.label}</span>
                </span>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-mono font-bold">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <Card className="!p-4 flex justify-between items-center text-xs text-slate-400 font-semibold" hoverEffect={false}>
            <span>🔥 Puzzles Solved:</span>
            <span className="text-emerald-400 font-extrabold text-sm">{solvedCount}</span>
          </Card>
        </div>

        {/* Board View */}
        <Card className="flex flex-col gap-4 items-center justify-center" hoverEffect={false}>
          <Board 
            fen={puzzleFen} 
            interactive={isBoardInteractive} 
            highlights={activeHighlights}
            onMove={handleBoardMove}
          />
          <div className="text-[11px] text-slate-500 mt-2 font-mono text-center flex flex-col gap-2 w-full">
            <div>
              Difficulty: <Badge variant="amber" className="ml-1">{currentPuzzle.difficulty}</Badge> • Theme: <Badge variant="slate" className="ml-1">{currentPuzzle.theme}</Badge>
              <div className="text-slate-400 font-bold mt-1">Position {activePuzzleIdx + 1} of {filteredPuzzles.length}</div>
            </div>
            {/* Puzzle Navigation */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <Button variant="secondary" size="sm" onClick={() => navigatePuzzle('prev')}>◀ Prev</Button>
              <Button variant="secondary" size="sm" onClick={() => navigatePuzzle('next')}>Next ▶</Button>
            </div>
            {activeMode === 'analysis' && (
              <div className="text-emerald-400 text-xs mt-2 bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/10 font-bold">
                📊 FREE PLAY: Make moves for either color to explore variants
              </div>
            )}
          </div>
        </Card>

        {/* Solver Panel or Mode Panel */}
        <div className="flex justify-center">
          {activeMode === 'guided' && (
            <GuidedSolverPanel 
              puzzle={currentPuzzle} 
              onSolved={handleSolved}
              onSelectHighlight={setCustomHighlight}
              step={currentStep}
              setStep={setCurrentStep}
              lastMove={lastMove}
              onChangeFen={setPuzzleFen}
            />
          )}

          {activeMode === 'practice' && (
            <Card className="w-full max-w-md flex flex-col gap-4" hoverEffect={false}>
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                <span>🎯</span> Standard Practice Mode
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Solve the tactical combination directly on the board. No guidance, just pure chess execution.
              </p>
              <div className="bg-[#0c0c14] border border-white/5 p-4 rounded-xl text-center my-2 shadow-inner">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Expected moves</span>
                <span className="text-sm font-mono text-white font-bold">{currentPuzzle.solution.length} move sequence</span>
              </div>
              <Button 
                variant="secondary"
                onClick={() => setPuzzleFen(currentPuzzle.fen)}
                fullWidth
              >
                Reset Position
              </Button>
            </Card>
          )}

          {activeMode === 'coach' && (
            <Card className="w-full max-w-md flex flex-col gap-4" hoverEffect={false}>
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                <span>💡</span> AI Hint Helper
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Need a hand? The AI Coach has analyzed the position and provides the following coaching pointers:
              </p>
              <div className="flex flex-col gap-3 bg-[#0c0c14] border border-white/5 p-4 rounded-xl shadow-inner">
                <div className="text-xs">
                  <span className="font-bold text-emerald-400 block mb-1">🔑 Core Motif:</span>
                  <span className="text-slate-300 font-semibold">{currentPuzzle.theme}</span>
                </div>
                <div className="text-xs">
                  <span className="font-bold text-amber-400 block mb-1">📢 Coach Tip:</span>
                  <span className="text-slate-300 font-semibold">{currentPuzzle.coachNotes}</span>
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-400 block mb-1">🔍 Target coordinates:</span>
                  <span className="text-slate-300 font-semibold">Look closely at pieces defending the 8th rank or overloaded files.</span>
                </div>
              </div>
              <Button 
                onClick={() => showToast('info', `First move hint: ${currentPuzzle.solution[0]}`)}
                fullWidth
              >
                Reveal First Move SAN
              </Button>
            </Card>
          )}

          {activeMode === 'examination' && (
            <Card className="w-full max-w-md flex flex-col gap-4" hoverEffect={false}>
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                <span>⏰</span> Tournament Stress Test
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Simulate real chess tournament stress. Solve the puzzle within the time limit. Incorrect moves decrease rating instantly.
              </p>
              
              <div className="flex justify-between gap-3 my-2">
                <div className="flex-1 bg-[#0c0c14] border border-white/5 p-3 rounded-xl text-center shadow-inner">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold mb-1">Time Remaining</span>
                  <span className={`text-lg font-mono font-black ${examTimer <= 15 ? 'text-red-500 animate-pulse' : 'text-amber-500'}`}>
                    {examTimer}s
                  </span>
                </div>
                <div className="flex-1 bg-[#0c0c14] border border-white/5 p-3 rounded-xl text-center shadow-inner">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold mb-1">Reward</span>
                  <span className="text-lg font-mono font-black text-emerald-400">+20 XP</span>
                </div>
              </div>

              {examSubmitted && (
                <div className={`p-4 rounded-xl border text-center font-bold ${
                  examResult === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {examResult === 'success' 
                    ? '🎉 EXAM PASSED! (+20 XP, +15 Rating)' 
                    : '❌ EXAM FAILED! (-8 Rating)'}
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setExamSubmitted(false);
                      setExamResult(null);
                      setExamTimer(60);
                      if (activePuzzleIdx < filteredPuzzles.length - 1) {
                        setActivePuzzleIdx(activePuzzleIdx + 1);
                      } else {
                        setActivePuzzleIdx(0);
                      }
                    }}
                    className="mt-3"
                    fullWidth
                  >
                    Load Next Position
                  </Button>
                </div>
              )}
            </Card>
          )}

          {activeMode === 'thinking' && (
            <div className="w-full max-w-md">
              {!thinkingCompleted ? (
                <ThinkingModePanel
                  fen={puzzleFen}
                  puzzleTheme={currentPuzzle.theme}
                  difficulty={currentPuzzle.difficulty}
                  onComplete={(answers) => {
                    setThinkingCompleted(true);
                    addXP(10);
                    showToast('success', '🧠 Analysis complete! +10 XP. Now play your best move on the board.');
                  }}
                  onSkip={() => {
                    setThinkingCompleted(true);
                    showToast('info', 'Skipped analysis. Play your move on the board.');
                  }}
                />
              ) : (
                <Card className="w-full flex flex-col gap-4" hoverEffect={false}>
                  <h3 className="text-base font-bold text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                    <span>🧠</span> Play Your Calculated Move
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    You've completed your analysis. Now play the move you calculated on the board. The board is interactive.
                  </p>
                  <div className="bg-violet-500/10 border border-violet-500/20 p-3 rounded-xl text-xs text-violet-400 font-bold">
                    ✅ GM Thinking process complete. Board is now interactive.
                  </div>
                  <Button 
                    variant="secondary"
                    onClick={() => setPuzzleFen(currentPuzzle.fen)}
                    fullWidth
                  >
                    Reset Position
                  </Button>
                </Card>
              )}
            </div>
          )}

          {activeMode === 'analysis' && (
            <Card className="w-full max-w-md flex flex-col gap-4" hoverEffect={false}>
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                <span>📊</span> Free Analysis Mode
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Free analysis mode allows exploring multiple candidate options and analyzing branching variations on the board.
              </p>

              <div className="bg-[#0c0c14] border border-white/5 p-3 rounded-xl min-h-[100px] flex flex-col justify-between shadow-inner">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Played Moves</span>
                <div className="flex flex-wrap gap-1.5 text-xs font-mono max-h-[80px] overflow-y-auto">
                  {analysisMoves.length > 0 ? (
                    analysisMoves.map((m, idx) => (
                      <span key={idx} className="bg-white/5 px-2 py-0.5 rounded border border-white/5 text-slate-300 font-bold">
                        {idx + 1}. {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic font-semibold">No moves entered yet...</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="secondary"
                  onClick={() => {
                    setPuzzleFen(currentPuzzle.fen);
                    setAnalysisMoves([]);
                  }}
                  className="flex-1"
                >
                  Reset Board
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => {
                    showToast('info', 'Use board reset to return to the starting position.');
                  }}
                  className="flex-1"
                >
                  Undo Move
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.text}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Puzzles;
