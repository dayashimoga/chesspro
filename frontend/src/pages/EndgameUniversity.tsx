import React, { useState, useEffect } from 'react';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';
import endgameContent from '../content/03-endgames';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Chess } from 'chess.js';

type LabPhase = 'theory' | 'examples' | 'exercises' | 'assessment';

export const EndgameUniversity: React.FC = () => {
  const [activeModule, setActiveModule] = useState(endgameContent.modules[0]?.id || 'opposition');
  const [phase, setPhase] = useState<LabPhase>('theory');
  const [exampleIdx, setExampleIdx] = useState(0);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  // Find-move state variables
  const [exerciseFen, setExerciseFen] = useState('8/8/8/8/8/8/8/8 w - - 0 1');
  const [exerciseFeedback, setExerciseFeedback] = useState<{ correct: boolean; text: string } | null>(null);

  const addXP = useAppStore(s => s.addXP);
  const currentModule = endgameContent.modules.find(m => m.id === activeModule) || endgameContent.modules[0];
  const currentExamples = currentModule?.examples || [];
  const currentExercises = currentModule?.exercises || [];

  useEffect(() => {
    setPhase('theory');
    setExampleIdx(0);
    setExerciseIdx(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setExerciseFeedback(null);
  }, [activeModule]);

  // Update exercise FEN when active exercise changes
  useEffect(() => {
    if (currentExercises[exerciseIdx]) {
      setExerciseFen(currentExercises[exerciseIdx].fen || '8/8/8/8/8/8/8/8 w - - 0 1');
      setExerciseFeedback(null);
    }
  }, [exerciseIdx, activeModule, phase]);

  const handleAnswer = (answerIdx: number) => {
    setSelectedAnswer(answerIdx);
    setShowResult(true);
    setTotalAttempts(totalAttempts + 1);
    const ex = currentExercises[exerciseIdx];
    if (ex && ex.type === 'quiz' && answerIdx === ex.answer) {
      setScore(score + 1);
      addXP(10);
    }
  };

  const handleNextExercise = () => {
    if (exerciseIdx < currentExercises.length - 1) {
      setExerciseIdx(exerciseIdx + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setExerciseFeedback(null);
    } else {
      setCompletedModules(new Set([...completedModules, activeModule]));
      setPhase('assessment');
    }
  };

  const handleExerciseMove = (from: string, to: string) => {
    const ex = currentExercises[exerciseIdx];
    if (!ex || ex.type !== 'find-move') return;
    if (showResult) return; // already solved

    const game = new Chess(exerciseFen);
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (move) {
        const expectedSolution = ex.solution?.[0];
        if (expectedSolution && move.san === expectedSolution) {
          setExerciseFen(game.fen());
          setScore(prev => prev + 1);
          setTotalAttempts(prev => prev + 1);
          addXP(15);
          setShowResult(true);
          setExerciseFeedback({ correct: true, text: `Correct! ${ex.explanation || ''}` });
        } else {
          setTotalAttempts(prev => prev + 1);
          setExerciseFeedback({ correct: false, text: 'Not the best move. Try another idea!' });
        }
      }
    } catch {
      setExerciseFeedback({ correct: false, text: 'Illegal move in this position.' });
    }
  };

  const handleMoveInExample = () => {};

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'beginner': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'intermediate': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'advanced': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-slate-400 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500 font-mono">Endgame University</span>
          <h2 className="text-2xl font-black text-white font-serif">Endgame Mastery</h2>
          <p className="text-xs text-slate-400 mt-1">Master the art of converting advantages and defending inferior positions</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-400 text-xs font-bold font-mono">
            {completedModules.size} / {endgameContent.modules.length} Modules
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg text-amber-400 text-xs font-bold font-mono">
            Score: {score}/{totalAttempts}
          </div>
        </div>
      </div>

      {/* Module Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {endgameContent.modules.map(mod => (
          <Button
            key={mod.id}
            onClick={() => setActiveModule(mod.id)}
            variant={activeModule === mod.id ? 'primary' : 'secondary'}
            size="sm"
            className="whitespace-nowrap flex items-center gap-1.5 shrink-0"
          >
            {completedModules.has(mod.id) && <span>✅</span>}
            <span>{mod.title}</span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] ${difficultyColor(mod.difficulty)}`}>
              {mod.difficulty}
            </span>
          </Button>
        ))}
      </div>

      {/* Phase Navigation */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {(['theory', 'examples', 'exercises', 'assessment'] as LabPhase[]).map(p => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
              phase === p ? 'bg-amber-500 text-black shadow-glow' : 'hover:bg-white/5 text-slate-400'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theory Phase */}
        {phase === 'theory' && (
          <>
            <Card className="overflow-y-auto max-h-[600px]" hoverEffect={false}>
              <div
                dangerouslySetInnerHTML={{ __html: currentModule?.theory || '' }}
                className="text-xs leading-relaxed [&_h2]:text-lg [&_h2]:font-black [&_h2]:text-white [&_h2]:mb-3 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-amber-400 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-slate-300 [&_p]:mb-3 [&_li]:text-slate-300 [&_li]:mb-1 [&_strong]:text-white [&_.key-concept]:bg-amber-500/5 [&_.key-concept]:border [&_.key-concept]:border-amber-500/20 [&_.key-concept]:rounded-xl [&_.key-concept]:p-4 [&_.key-concept]:mt-4 [&_.key-concept-title]:text-amber-400 [&_.key-concept-title]:font-bold [&_.key-concept-title]:text-xs [&_.key-concept-title]:mb-2 font-semibold"
              />
            </Card>
            <div className="flex flex-col gap-4 items-center">
              {currentExamples.length > 0 && (
                <Card className="w-full flex flex-col items-center" hoverEffect={false}>
                  <Board fen={currentExamples[0]?.fen || '8/8/8/8/8/8/8/8 w - - 0 1'} interactive={false} onMove={() => {}} />
                  <div className="mt-3 text-center">
                    <span className="text-xs font-bold text-white">{currentExamples[0]?.title}</span>
                    <p className="text-[11px] text-slate-400 mt-1">{currentExamples[0]?.description}</p>
                  </div>
                </Card>
              )}
              <Button
                onClick={() => setPhase('examples')}
                fullWidth
              >
                View Examples →
              </Button>
            </div>
          </>
        )}

        {/* Examples Phase */}
        {phase === 'examples' && (
          <>
            <div className="flex flex-col gap-4 items-center">
              <Card className="w-full flex flex-col items-center" hoverEffect={false}>
                <Board
                  fen={currentExamples[exampleIdx]?.fen || '8/8/8/8/8/8/8/8 w - - 0 1'}
                  interactive={false}
                  onMove={handleMoveInExample}
                />
              </Card>
              <div className="flex gap-2 w-full">
                <Button
                  onClick={() => setExampleIdx(Math.max(0, exampleIdx - 1))}
                  disabled={exampleIdx === 0}
                  variant="secondary"
                  className="flex-1"
                >
                  ◀ Previous
                </Button>
                <Button
                  onClick={() => setExampleIdx(Math.min(currentExamples.length - 1, exampleIdx + 1))}
                  disabled={exampleIdx >= currentExamples.length - 1}
                  variant="secondary"
                  className="flex-1"
                >
                  Next ▶
                </Button>
              </div>
            </div>
            <Card hoverEffect={false}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 font-mono">
                Example {exampleIdx + 1} of {currentExamples.length}
              </span>
              <h3 className="text-lg font-bold text-white mt-2 mb-3">
                {currentExamples[exampleIdx]?.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                {currentExamples[exampleIdx]?.description}
              </p>
              <Button
                onClick={() => setPhase('exercises')}
                className="mt-6"
                fullWidth
              >
                Practice Exercises →
              </Button>
            </Card>
          </>
        )}

        {/* Exercises Phase */}
        {phase === 'exercises' && currentExercises.length > 0 && (
          <>
            <Card hoverEffect={false}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block mb-2 font-mono">
                Exercise {exerciseIdx + 1} of {currentExercises.length}
              </span>
              <h3 className="text-sm font-bold text-white mb-4">
                {currentExercises[exerciseIdx]?.question || 'No question'}
              </h3>

              {currentExercises[exerciseIdx]?.type === 'quiz' && (
                <div className="flex flex-col gap-2 mb-4">
                  {(currentExercises[exerciseIdx]?.options || []).map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => !showResult && handleAnswer(idx)}
                      disabled={showResult}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        showResult && idx === currentExercises[exerciseIdx]?.answer
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : showResult && idx === selectedAnswer && idx !== currentExercises[exerciseIdx]?.answer
                          ? 'bg-red-500/10 border-red-500/30 text-red-400'
                          : selectedAnswer === idx
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <span className="text-slate-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {currentExercises[exerciseIdx]?.type === 'find-move' && (
                <div className="flex flex-col gap-3 mb-4">
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                    Play White's best move on the board to solve this endgame challenge.
                  </p>
                  {!showResult && exerciseFeedback && (
                    <div className={`p-3 rounded-xl border text-xs font-bold ${
                      exerciseFeedback.correct ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                      {exerciseFeedback.text}
                    </div>
                  )}
                </div>
              )}

              {showResult && (
                <div className="animate-fadeIn">
                  <div className={`p-3 rounded-xl border text-xs mb-3 ${
                    currentExercises[exerciseIdx]?.type === 'find-move' || selectedAnswer === currentExercises[exerciseIdx]?.answer
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    <strong className="block mb-1">
                      {(currentExercises[exerciseIdx]?.type === 'find-move' || selectedAnswer === currentExercises[exerciseIdx]?.answer) ? '🟢 Correct!' : '🔴 Incorrect'}
                    </strong>
                    {currentExercises[exerciseIdx]?.explanation}
                  </div>
                  <Button
                    onClick={handleNextExercise}
                    fullWidth
                  >
                    {exerciseIdx < currentExercises.length - 1 ? 'Next Exercise →' : 'Complete Module ✓'}
                  </Button>
                </div>
              )}
            </Card>

            {/* Board for find-move exercises */}
            <div className="flex flex-col gap-4 items-center">
              <Card className="w-full flex flex-col items-center" hoverEffect={false}>
                <Board
                  fen={exerciseFen}
                  interactive={currentExercises[exerciseIdx]?.type === 'find-move'}
                  onMove={handleExerciseMove}
                />
              </Card>
            </div>
          </>
        )}

        {/* Assessment Phase */}
        {phase === 'assessment' && (
          <Card className="col-span-1 lg:col-span-2 text-center py-8" hoverEffect={false}>
            <span className="text-5xl mb-4 block">🏆</span>
            <h3 className="text-xl font-black text-white mb-2">Module Complete!</h3>
            <p className="text-xs text-slate-400 mb-6">
              You completed the <strong className="text-amber-400">{currentModule?.title}</strong> module.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-xl font-black text-emerald-400">{score}</div>
                <div className="text-[10px] text-slate-500">Correct</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-xl font-black text-amber-400">{totalAttempts}</div>
                <div className="text-[10px] text-slate-500">Attempts</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-xl font-black text-sky-400">{totalAttempts > 0 ? Math.round(score / totalAttempts * 100) : 0}%</div>
                <div className="text-[10px] text-slate-500">Accuracy</div>
              </div>
            </div>
            <Button
              onClick={() => {
                const modIds = endgameContent.modules.map(m => m.id);
                const curIdx = modIds.indexOf(activeModule);
                if (curIdx < modIds.length - 1) {
                  setActiveModule(modIds[curIdx + 1]);
                }
              }}
            >
              Next Module →
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EndgameUniversity;
