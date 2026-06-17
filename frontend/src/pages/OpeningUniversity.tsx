import React, { useState, useMemo } from 'react';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';
import openingsContent from '../content/05-openings';
import extendedOpenings from '../content/openings-extended';

// Merge original + extended openings into a single module list
const allModules = [...openingsContent.modules, ...extendedOpenings];
const mergedContent = { ...openingsContent, modules: allModules };
type OpeningPhase = 'theory' | 'explorer' | 'quiz' | 'practice';

export const OpeningUniversity: React.FC = () => {
  const [activeOpening, setActiveOpening] = useState(mergedContent.modules[0]?.id || 'italian-game');
  const [phase, setPhase] = useState<OpeningPhase>('theory');
  const [moveIdx, setMoveIdx] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [completedOpenings, setCompletedOpenings] = useState<Set<string>>(new Set());

  const addXP = useAppStore(s => s.addXP);
  const currentModule = mergedContent.modules.find(m => m.id === activeOpening) || mergedContent.modules[0];
  const openingTree = currentModule?.openingTree || [];
  const exercises = currentModule?.exercises || [];

  const currentFen = useMemo(() => {
    if (moveIdx === 0 || !openingTree[moveIdx - 1]) {
      return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }
    return openingTree[moveIdx - 1].fen;
  }, [openingTree, moveIdx]);

  const resetToOpening = (openingId: string) => {
    setActiveOpening(openingId);
    setPhase('theory');
    setMoveIdx(0);
    setQuizIdx(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answerIdx: number) => {
    setSelectedAnswer(answerIdx);
    setShowResult(true);
    setTotalAttempts(totalAttempts + 1);
    if (answerIdx === exercises[quizIdx]?.answer) {
      setScore(score + 1);
      addXP(10);
    }
  };

  const handleNextQuiz = () => {
    if (quizIdx < exercises.length - 1) {
      setQuizIdx(quizIdx + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompletedOpenings(new Set([...completedOpenings, activeOpening]));
      setPhase('practice');
    }
  };

  const difficultyBadge = (d: string) => {
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
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Opening University</span>
          <h2 className="text-2xl font-black text-white font-serif">Opening Mastery</h2>
          <p className="text-xs text-slate-400 mt-1">Build a world-class opening repertoire with theory, interactive trees, and quizzes</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-400 text-xs font-bold">
            {completedOpenings.size} / {mergedContent.modules.length} Mastered
          </div>
        </div>
      </div>

      {/* Opening Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {mergedContent.modules.map(mod => (
          <button
            key={mod.id}
            onClick={() => resetToOpening(mod.id)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeOpening === mod.id
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : completedOpenings.has(mod.id)
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400'
            }`}
          >
            {completedOpenings.has(mod.id) && <span>✅</span>}
            <span>{mod.title}</span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] ${difficultyBadge(mod.difficulty)}`}>
              {mod.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Phase Navigation */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {(['theory', 'explorer', 'quiz', 'practice'] as OpeningPhase[]).map(p => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
              phase === p ? 'bg-blue-500 text-white' : 'hover:bg-white/5 text-slate-400'
            }`}
          >
            {p === 'explorer' ? 'Move Explorer' : p}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theory Phase */}
        {phase === 'theory' && (
          <>
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#0c0c14] overflow-y-auto max-h-[600px]">
              <div
                dangerouslySetInnerHTML={{ __html: currentModule?.theory || '' }}
                className="text-xs leading-relaxed [&_h2]:text-lg [&_h2]:font-black [&_h2]:text-white [&_h2]:mb-3 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-blue-400 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-slate-300 [&_p]:mb-3 [&_li]:text-slate-300 [&_li]:mb-1 [&_strong]:text-white"
              />
              <button
                onClick={() => setPhase('explorer')}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all"
              >
                Explore the Opening Tree →
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-[#0c0c14]/50 rounded-3xl p-6 border border-white/5 w-full flex flex-col items-center">
                <Board
                  fen={openingTree.length > 0 ? openingTree[openingTree.length - 1].fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}
                  interactive={false}
                  onMove={() => {}}
                />
                <div className="mt-3 text-center">
                  <span className="text-xs font-bold text-white">{currentModule?.title}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Explorer Phase — Interactive Opening Tree */}
        {phase === 'explorer' && (
          <>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-[#0c0c14]/50 rounded-3xl p-6 border border-white/5 w-full flex flex-col items-center">
                <Board fen={currentFen} interactive={false} onMove={() => {}} />
                <div className="mt-3 text-xs text-slate-400 text-center font-mono">
                  {moveIdx > 0 && openingTree[moveIdx - 1]
                    ? `${openingTree[moveIdx - 1].move}`
                    : 'Starting position'}
                </div>
              </div>

              {/* Move Navigation */}
              <div className="flex gap-2 w-full">
                <button onClick={() => setMoveIdx(0)} className="bg-white/5 border border-white/5 hover:bg-white/10 px-3 py-2 rounded-lg text-xs font-bold text-white">⏮</button>
                <button onClick={() => setMoveIdx(Math.max(0, moveIdx - 1))} className="bg-white/5 border border-white/5 hover:bg-white/10 px-3 py-2 rounded-lg text-xs font-bold text-white flex-1">◀ Back</button>
                <button onClick={() => setMoveIdx(Math.min(openingTree.length, moveIdx + 1))} className="bg-white/5 border border-white/5 hover:bg-white/10 px-3 py-2 rounded-lg text-xs font-bold text-white flex-1">Forward ▶</button>
                <button onClick={() => setMoveIdx(openingTree.length)} className="bg-white/5 border border-white/5 hover:bg-white/10 px-3 py-2 rounded-lg text-xs font-bold text-white">⏭</button>
              </div>
            </div>

            {/* Move Tree */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#0c0c14]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Opening Tree</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setMoveIdx(0)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    moveIdx === 0 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="font-mono font-bold">Start</span>
                  <span className="text-slate-500 ml-2">— Initial position</span>
                </button>
                {openingTree.map((node, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMoveIdx(idx + 1)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      moveIdx === idx + 1 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-mono font-bold text-white">{node.move}</span>
                    {node.comment && <span className="text-slate-500 ml-2">— {node.comment}</span>}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPhase('quiz')}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all"
              >
                Test Your Knowledge →
              </button>
            </div>
          </>
        )}

        {/* Quiz Phase */}
        {phase === 'quiz' && exercises.length > 0 && (
          <>
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#0c0c14]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block mb-2">
                Quiz {quizIdx + 1} of {exercises.length}
              </span>
              <h3 className="text-sm font-bold text-white mb-4">
                {exercises[quizIdx]?.question}
              </h3>

              <div className="flex flex-col gap-2 mb-4">
                {(exercises[quizIdx]?.options || []).map((opt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => !showResult && handleAnswer(idx)}
                    disabled={showResult}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      showResult && idx === exercises[quizIdx]?.answer
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : showResult && idx === selectedAnswer && idx !== exercises[quizIdx]?.answer
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : selectedAnswer === idx
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <span className="text-slate-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>

              {showResult && (
                <div className="animate-fadeIn">
                  <div className={`p-3 rounded-xl border text-xs mb-3 ${
                    selectedAnswer === exercises[quizIdx]?.answer
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    <strong className="block mb-1">
                      {selectedAnswer === exercises[quizIdx]?.answer ? '🟢 Correct!' : '🔴 Incorrect'}
                    </strong>
                    {exercises[quizIdx]?.explanation}
                  </div>
                  <button
                    onClick={handleNextQuiz}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all"
                  >
                    {quizIdx < exercises.length - 1 ? 'Next Question →' : 'Complete Opening ✓'}
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="bg-[#0c0c14]/50 rounded-3xl p-6 border border-white/5 w-full flex flex-col items-center">
                <Board
                  fen={openingTree.length > 0 ? openingTree[openingTree.length - 1].fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}
                  interactive={false}
                  onMove={() => {}}
                />
              </div>
            </div>
          </>
        )}

        {/* Practice Complete */}
        {phase === 'practice' && (
          <div className="col-span-1 lg:col-span-2 glass-panel p-8 rounded-2xl border border-white/5 bg-[#0c0c14] text-center">
            <span className="text-5xl mb-4 block">🎓</span>
            <h3 className="text-xl font-black text-white mb-2">Opening Mastered!</h3>
            <p className="text-xs text-slate-400 mb-6">
              You completed the <strong className="text-blue-400">{currentModule?.title}</strong> opening.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-xl font-black text-emerald-400">{score}</div>
                <div className="text-[10px] text-slate-500">Correct</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-xl font-black text-sky-400">{totalAttempts > 0 ? Math.round(score / totalAttempts * 100) : 0}%</div>
                <div className="text-[10px] text-slate-500">Accuracy</div>
              </div>
            </div>
            <button
              onClick={() => {
                const modIds = mergedContent.modules.map(m => m.id);
                const curIdx = modIds.indexOf(activeOpening);
                if (curIdx < modIds.length - 1) {
                  resetToOpening(modIds[curIdx + 1]);
                }
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold py-3 px-8 rounded-xl text-xs transition-all"
            >
              Next Opening →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpeningUniversity;
