import React, { useState, useEffect } from 'react';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';
import { ALL_COURSES, Course, LessonSubModule } from '../content/index';
import { Chess } from 'chess.js';
import { ReplayPanel } from '../components/ReplayPanel';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Lessons: React.FC = () => {
  const [selectedCourseIdx, setSelectedCourseIdx] = useState<number>(0);
  const [selectedModuleIdx, setSelectedModuleIdx] = useState<number>(0);
  const currentCourse: Course = ALL_COURSES[selectedCourseIdx] || ALL_COURSES[0];
  const currentModule: LessonSubModule = currentCourse.modules[selectedModuleIdx] || currentCourse.modules[0];
  const [selectedExampleIdx, setSelectedExampleIdx] = useState<number>(0);
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [mode, setMode] = useState<'theory' | 'example' | 'quiz'>('theory');

  const [exampleFen, setExampleFen] = useState<string>('8/8/8/8/8/8/8/8 w - - 0 1');
  const [playedMoves, setPlayedMoves] = useState<any[]>([]);
  const [exampleMoveIdx, setExampleMoveIdx] = useState<number>(-1);
  const [flipped, setFlipped] = useState<boolean>(false);


  // Sync example FEN and moves
  useEffect(() => {
    if (mode === 'example' && currentModule.examples && currentModule.examples[selectedExampleIdx]) {
      setExampleFen(currentModule.examples[selectedExampleIdx].fen);
      setPlayedMoves([]);
      setExampleMoveIdx(-1);
    }
  }, [selectedExampleIdx, selectedModuleIdx, mode, currentModule]);

  const handleExampleMove = (from: string, to: string, san: string) => {
    const game = new Chess(exampleFen);
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (move) {
        const newFen = game.fen();
        setExampleFen(newFen);
        
        const newMoveObj = {
          move: san,
          comment: 'User exploration move',
          eval: '',
          fen: newFen
        };
        
        const newMoves = [...playedMoves.slice(0, exampleMoveIdx + 1), newMoveObj];
        setPlayedMoves(newMoves);
        setExampleMoveIdx(newMoves.length - 1);
      }
    } catch {
      // Illegal move
    }
  };

  const handleExampleIndexChange = (index: number) => {
    setExampleMoveIdx(index);
    if (index === -1) {
      setExampleFen(currentModule.examples![selectedExampleIdx].fen);
    } else {
      setExampleFen(playedMoves[index].fen);
    }
  };

  const addXP = useAppStore(state => state.addXP);
  const completeLesson = useAppStore(state => state.completeLesson);
  const completedLessons = useAppStore(state => state.completedLessons);


  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null || !currentModule.exercises || !currentModule.exercises[quizIdx]) return;
    setIsAnswered(true);
    if (selectedOption === currentModule.exercises[quizIdx].answer) {
      addXP(10);
      // If we finished all exercises in this sub-module
      if (quizIdx === currentModule.exercises.length - 1) {
        completeLesson(`${currentCourse.id}-${currentModule.id}`);
      }
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentModule.exercises && quizIdx < currentModule.exercises.length - 1) {
      setQuizIdx(quizIdx + 1);
    } else {
      setQuizIdx(0);
      setMode('theory');
    }
  };

  const changeCourse = (cIdx: number) => {
    setSelectedCourseIdx(cIdx);
    setSelectedModuleIdx(0);
    setSelectedExampleIdx(0);
    setQuizIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setMode('theory');
  };

  const changeModule = (mIdx: number) => {
    setSelectedModuleIdx(mIdx);
    setSelectedExampleIdx(0);
    setQuizIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setMode('theory');
  };

  const isModuleCompleted = (courseId: string, moduleId: string) => {
    return completedLessons.includes(`${courseId}-${moduleId}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      {/* Course Header/Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 font-mono">Interactive Curriculum</span>
          <h2 className="text-2xl font-black text-white font-serif">Chess OS Curriculum</h2>
        </div>
        
        {/* Course Dropdown/Grid */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin max-w-full">
          {ALL_COURSES.map((course, idx) => (
            <Button
              key={course.id}
              onClick={() => changeCourse(idx)}
              variant={idx === selectedCourseIdx ? 'primary' : 'secondary'}
              size="sm"
              className="whitespace-nowrap flex items-center gap-1.5 shrink-0"
            >
              <span>{course.icon}</span>
              <span>{course.title}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Submodules for the selected course */}
        <div className="flex flex-col gap-3">
          <Card className="flex flex-col gap-1.5" hoverEffect={false}>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 mb-1">
              <span>{currentCourse.icon}</span>
              <span>{currentCourse.title}</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
              {currentCourse.description}
            </p>
          </Card>

          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-2 font-mono">Modules</span>
          <div className="flex flex-col gap-2 max-h-[450px] overflow-y-auto pr-1">
            {currentCourse.modules.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => changeModule(idx)}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  idx === selectedModuleIdx
                    ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <h4 className="font-bold text-xs text-white leading-tight">{m.title}</h4>
                  {isModuleCompleted(currentCourse.id, m.id) && (
                    <span className="text-[8px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider font-mono">
                      Done
                    </span>
                  )}
                </div>
                <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">{m.difficulty}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Selected submodule workspace */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Mode Tabs */}
          <div className="flex bg-[#0c0c14] border border-white/5 p-1 rounded-xl">
            {(['theory', 'example', 'quiz'] as const).map(m => {
              // Check if step/mode is available (e.g. some modules might not have examples or exercises)
              const disabled = (m === 'example' && (!currentModule.examples || currentModule.examples.length === 0)) ||
                               (m === 'quiz' && (!currentModule.exercises || currentModule.exercises.length === 0));
              return (
                <button
                  key={m}
                  disabled={disabled}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 text-xs font-bold capitalize rounded-lg transition-all ${
                    disabled ? 'opacity-30 cursor-not-allowed' : ''
                  } ${
                    mode === m
                      ? 'bg-emerald-500 text-bg-primary font-bold shadow-glow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m === 'example' ? '🎥 GM Demonstrations' : m === 'quiz' ? '✏️ Practice Assessment' : '📖 Theory Study'}
                </button>
              );
            })}
          </div>

          {/* Tab Workspaces */}
          <Card className="min-h-[400px] flex flex-col justify-between" hoverEffect={false}>
            {mode === 'theory' && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-lg font-bold text-white font-serif">{currentModule.title}</h3>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono uppercase font-bold mt-1 inline-block">
                    {currentModule.difficulty}
                  </span>
                </div>
                <div 
                  className="text-sm text-slate-300 leading-relaxed space-y-4 font-semibold"
                  dangerouslySetInnerHTML={{ __html: currentModule.theory }} 
                />
              </div>
            )}

            {mode === 'example' && currentModule.examples && currentModule.examples.length > 0 && (
              <div className="flex flex-col lg:flex-row gap-6 items-start animate-fadeIn py-2">
                <div className="flex flex-col gap-4 items-center">
                  <Board 
                    fen={exampleFen} 
                    interactive={true}
                    flipped={flipped}
                    onMove={handleExampleMove}
                    size={320}
                  />
                  {currentModule.examples.length > 1 && (
                    <div className="flex gap-2 mt-2">
                      {currentModule.examples.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedExampleIdx(i)}
                          className={`w-7 h-7 rounded-lg font-mono text-xs font-bold ${
                            selectedExampleIdx === i ? 'bg-emerald-500 text-bg-primary font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4 flex-1 w-full">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider font-mono">Example {selectedExampleIdx + 1} of {currentModule.examples.length}</span>
                    <h4 className="font-bold text-sm text-white mt-0.5">{currentModule.examples[selectedExampleIdx]?.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-[#0c0c14] border border-white/5 p-4 rounded-xl font-semibold">
                    {currentModule.examples[selectedExampleIdx]?.description}
                  </p>
                  <ReplayPanel 
                    moves={playedMoves}
                    currentIndex={exampleMoveIdx}
                    onChangeIndex={handleExampleIndexChange}
                    onFlipBoard={() => setFlipped(!flipped)}
                  />
                </div>
              </div>
            )}


            {mode === 'quiz' && currentModule.exercises && currentModule.exercises.length > 0 && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Assessment Quiz</span>
                    <h4 className="font-extrabold text-sm text-white mt-0.5">
                      Question {quizIdx + 1} of {currentModule.exercises!.length}
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">+10 XP</span>
                </div>

                <p className="text-sm text-slate-200 font-semibold leading-relaxed my-2">
                  {currentModule.exercises![quizIdx]?.question}
                </p>

                <div className="flex flex-col gap-2 font-semibold">
                  {currentModule.exercises![quizIdx]?.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionClick(oIdx)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        isAnswered
                          ? oIdx === currentModule.exercises![quizIdx].answer
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-bold'
                            : oIdx === selectedOption
                            ? 'bg-red-500/10 border-red-500/50 text-red-400 font-bold'
                            : 'bg-white/[0.02] border-white/5 opacity-55'
                          : selectedOption === oIdx
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-semibold'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-4 mt-2">
                  {isAnswered && (
                    <div className="text-xs text-slate-400 bg-black/40 border border-white/5 p-4 rounded-xl leading-relaxed font-semibold">
                      <strong className="block text-white mb-1">
                        {selectedOption === currentModule.exercises[quizIdx].answer ? '🎉 Brilliant! (+10 XP)' : '❌ Inaccurate'}
                      </strong>
                      {currentModule.exercises[quizIdx].explanation}
                    </div>
                  )}

                  {!isAnswered ? (
                    <Button
                      onClick={handleQuizSubmit}
                      disabled={selectedOption === null}
                      fullWidth
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuiz}
                      variant="secondary"
                      fullWidth
                    >
                      {quizIdx < currentModule.exercises.length - 1 ? 'Next Question' : 'Complete Module Study'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
