import React, { useState, useEffect } from 'react';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';
import endgameContent from '../content/03-endgames';

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
  }, [activeModule]);

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
    } else {
      setCompletedModules(new Set([...completedModules, activeModule]));
      setPhase('assessment');
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
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Endgame University</span>
          <h2 className="text-2xl font-black text-white font-serif">Endgame Mastery</h2>
          <p className="text-xs text-slate-400 mt-1">Master the art of converting advantages and defending inferior positions</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-400 text-xs font-bold">
            {completedModules.size} / {endgameContent.modules.length} Modules
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg text-amber-400 text-xs font-bold">
            Score: {score}/{totalAttempts}
          </div>
        </div>
      </div>

      {/* Module Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {endgameContent.modules.map(mod => (
          <button
            key={mod.id}
            onClick={() => setActiveModule(mod.id)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeModule === mod.id
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : completedModules.has(mod.id)
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400'
            }`}
          >
            {completedModules.has(mod.id) && <span>✅</span>}
            <span>{mod.title}</span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] ${difficultyColor(mod.difficulty)}`}>
              {mod.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Phase Navigation */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {(['theory', 'examples', 'exercises', 'assessment'] as LabPhase[]).map(p => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
              phase === p ? 'bg-amber-500 text-black' : 'hover:bg-white/5 text-slate-400'
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
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#0c0c14] overflow-y-auto max-h-[600px] prose prose-invert prose-sm">
              <div
                dangerouslySetInnerHTML={{ __html: currentModule?.theory || '' }}
                className="text-xs leading-relaxed [&_h2]:text-lg [&_h2]:font-black [&_h2]:text-white [&_h2]:mb-3 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-amber-400 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-slate-300 [&_p]:mb-3 [&_li]:text-slate-300 [&_li]:mb-1 [&_strong]:text-white [&_.key-concept]:bg-amber-500/5 [&_.key-concept]:border [&_.key-concept]:border-amber-500/20 [&_.key-concept]:rounded-xl [&_.key-concept]:p-4 [&_.key-concept]:mt-4 [&_.key-concept-title]:text-amber-400 [&_.key-concept-title]:font-bold [&_.key-concept-title]:text-xs [&_.key-concept-title]:mb-2"
              />
            </div>
            <div className="flex flex-col items-center gap-4">
              {currentExamples.length > 0 && (
                <div className="bg-[#0c0c14]/50 rounded-3xl p-6 border border-white/5 w-full flex flex-col items-center">
                  <Board fen={currentExamples[0]?.fen || '8/8/8/8/8/8/8/8 w - - 0 1'} interactive={false} onMove={() => {}} />
                  <div className="mt-3 text-center">
                    <span className="text-xs font-bold text-white">{currentExamples[0]?.title}</span>
                    <p className="text-[11px] text-slate-400 mt-1">{currentExamples[0]?.description}</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setPhase('examples')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold py-2.5 rounded-xl text-xs transition-all"
              >
                View Examples →
              </button>
            </div>
          </>
        )}

        {/* Examples Phase */}
        {phase === 'examples' && (
          <>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-[#0c0c14]/50 rounded-3xl p-6 border border-white/5 w-full flex flex-col items-center">
                <Board
                  fen={currentExamples[exampleIdx]?.fen || '8/8/8/8/8/8/8/8 w - - 0 1'}
                  interactive={false}
                  onMove={handleMoveInExample}
                />
              </div>
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => setExampleIdx(Math.max(0, exampleIdx - 1))}
                  disabled={exampleIdx === 0}
                  className="flex-1 bg-white/5 border border-white/5 hover:bg-white/10 py-2 rounded-lg disabled:opacity-40 text-xs font-bold text-white"
                >
                  ◀ Previous
                </button>
                <button
                  onClick={() => setExampleIdx(Math.min(currentExamples.length - 1, exampleIdx + 1))}
                  disabled={exampleIdx >= currentExamples.length - 1}
                  className="flex-1 bg-white/5 border border-white/5 hover:bg-white/10 py-2 rounded-lg disabled:opacity-40 text-xs font-bold text-white"
                >
                  Next ▶
                </button>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#0c0c14]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                Example {exampleIdx + 1} of {currentExamples.length}
              </span>
              <h3 className="text-lg font-bold text-white mt-2 mb-3">
                {currentExamples[exampleIdx]?.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentExamples[exampleIdx]?.description}
              </p>
              <button
                onClick={() => setPhase('exercises')}
                className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold py-2.5 rounded-xl text-xs transition-all"
              >
                Practice Exercises →
              </button>
            </div>
          </>
        )}

        {/* Exercises Phase */}
        {phase === 'exercises' && currentExercises.length > 0 && (
          <>
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#0c0c14]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block mb-2">
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

              {showResult && (
                <div className="animate-fadeIn">
                  <div className={`p-3 rounded-xl border text-xs mb-3 ${
                    selectedAnswer === currentExercises[exerciseIdx]?.answer
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    <strong className="block mb-1">
                      {selectedAnswer === currentExercises[exerciseIdx]?.answer ? '🟢 Correct!' : '🔴 Incorrect'}
                    </strong>
                    {currentExercises[exerciseIdx]?.explanation}
                  </div>
                  <button
                    onClick={handleNextExercise}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold py-2.5 rounded-xl text-xs transition-all"
                  >
                    {exerciseIdx < currentExercises.length - 1 ? 'Next Exercise →' : 'Complete Module ✓'}
                  </button>
                </div>
              )}
            </div>

            {/* Board for find-move exercises */}
            <div className="flex flex-col items-center gap-4">
              <div className="bg-[#0c0c14]/50 rounded-3xl p-6 border border-white/5 w-full flex flex-col items-center">
                <Board
                  fen={currentExercises[exerciseIdx]?.fen || currentExamples[0]?.fen || '8/8/8/8/8/8/8/8 w - - 0 1'}
                  interactive={currentExercises[exerciseIdx]?.type === 'find-move'}
                  onMove={() => {}}
                />
              </div>
            </div>
          </>
        )}

        {/* Assessment Phase */}
        {phase === 'assessment' && (
          <div className="col-span-1 lg:col-span-2 glass-panel p-8 rounded-2xl border border-white/5 bg-[#0c0c14] text-center">
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
            <button
              onClick={() => {
                const modIds = endgameContent.modules.map(m => m.id);
                const curIdx = modIds.indexOf(activeModule);
                if (curIdx < modIds.length - 1) {
                  setActiveModule(modIds[curIdx + 1]);
                }
              }}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold py-3 px-8 rounded-xl text-xs transition-all"
            >
              Next Module →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EndgameUniversity;
