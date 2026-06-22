import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';
import { useLocation } from 'react-router-dom';
import { ALL_COURSES, Course, LessonSubModule, GuidedStep, DemoStep, MasteryPosition } from '../content/index';
import { Chess } from 'chess.js';
import { ReplayPanel } from '../components/ReplayPanel';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { InteractiveLessonEngine } from '../core/InteractiveLessonEngine';
import { Storage } from '../core/storage';

type LessonPhase = 'theory' | 'demo' | 'practice' | 'quiz' | 'mastery';

const PHASE_META: Record<LessonPhase, { label: string; icon: string; color: string }> = {
  theory: { label: 'Theory', icon: '📖', color: 'emerald' },
  demo: { label: 'Demonstration', icon: '🎥', color: 'blue' },
  practice: { label: 'Guided Practice', icon: '🎯', color: 'amber' },
  quiz: { label: 'Assessment', icon: '✏️', color: 'violet' },
  mastery: { label: 'Mastery Check', icon: '🏆', color: 'rose' },
};

const PATHWAYS = [
  { id: 'openings', title: 'Openings', icon: '🌳', desc: 'Build your repertoire', courseIds: ['openings'] },
  { id: 'tactics', title: 'Tactics', icon: '⚔️', desc: 'Forks, pins, and checkmates', courseIds: ['foundations', 'tactics'] },
  { id: 'middlegame', title: 'Middlegame', icon: '📈', desc: 'Positional strategy and planning', courseIds: ['strategy', 'middlegame'] },
  { id: 'endgame', title: 'Endgame', icon: '👑', desc: 'Endgame drills and techniques', courseIds: ['endgame'] },
  { id: 'calculation', title: 'Calculation', icon: '🧠', desc: 'Visualization & GM studies', courseIds: ['calculation', 'advanced', 'master-games'] },
];

export const Lessons: React.FC = () => {
  const [activePathway, setActivePathway] = useState<string>('tactics');
  const [selectedCourseIdx, setSelectedCourseIdx] = useState<number>(0);
  const [selectedModuleIdx, setSelectedModuleIdx] = useState<number>(0);

  const filteredCourses = useMemo(() => {
    const pw = PATHWAYS.find(p => p.id === activePathway) || PATHWAYS[1];
    return ALL_COURSES.filter(c => pw.courseIds.includes(c.id));
  }, [activePathway]);

  const currentCourse: Course = filteredCourses[selectedCourseIdx] || filteredCourses[0] || ALL_COURSES[0];
  const currentModule: LessonSubModule = currentCourse.modules[selectedModuleIdx] || currentCourse.modules[0];

  const location = useLocation();

  // Listen to navigation state to open a specific course/module
  useEffect(() => {
    const navState = location.state as { courseId?: string; moduleId?: string } | null;
    if (navState?.courseId) {
      const courseIdx = ALL_COURSES.findIndex(c => c.id === navState.courseId);
      if (courseIdx !== -1) {
        // Find pathway containing this course
        const pathway = PATHWAYS.find(p => p.courseIds.includes(navState.courseId!));
        if (pathway) {
          setActivePathway(pathway.id);
          
          // Re-calculate the filtered index
          const filteredCoursesList = ALL_COURSES.filter(c => pathway.courseIds.includes(c.id));
          const filteredCourseIdx = filteredCoursesList.findIndex(c => c.id === navState.courseId);
          if (filteredCourseIdx !== -1) {
            setSelectedCourseIdx(filteredCourseIdx);
            
            if (navState.moduleId) {
              const modIdx = filteredCoursesList[filteredCourseIdx].modules.findIndex(m => m.id === navState.moduleId);
              if (modIdx !== -1) {
                setSelectedModuleIdx(modIdx);
              }
            }
          }
        }
      }
    }
  }, [location.state]);

  // Phase state
  const [phase, setPhase] = useState<LessonPhase>('theory');
  const [engine] = useState(() => new InteractiveLessonEngine());

  // Demo state
  const [demoIdx, setDemoIdx] = useState(0);

  // Practice state
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResult, setPracticeResult] = useState<{ correct: boolean; feedback: string; type: string } | null>(null);
  const [practiceComplete, setPracticeComplete] = useState(false);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Mastery state
  const [masteryResult, setMasteryResult] = useState<{ correct: boolean; feedback: string; type: string } | null>(null);
  const [masteryComplete, setMasteryComplete] = useState(false);
  const [masteryFen, setMasteryFen] = useState<string>('8/8/8/8/8/8/8/8 w - - 0 1');

  // Board state for examples
  const [exampleFen, setExampleFen] = useState('8/8/8/8/8/8/8/8 w - - 0 1');
  const [selectedExampleIdx, setSelectedExampleIdx] = useState(0);
  const [playedMoves, setPlayedMoves] = useState<any[]>([]);
  const [exampleMoveIdx, setExampleMoveIdx] = useState(-1);
  const [flipped, setFlipped] = useState(false);

  // Score state
  const [showScore, setShowScore] = useState(false);

  const addXP = useAppStore(s => s.addXP);
  const completeLesson = useAppStore(s => s.completeLesson);
  const completedLessons = useAppStore(s => s.completedLessons);
  const favorites = useAppStore(s => s.favorites || []);
  const toggleFavorite = useAppStore(s => s.toggleFavorite);

  // Content accessors
  const demoSteps: DemoStep[] = currentModule.demoSteps || [];
  const guidedSteps: GuidedStep[] = currentModule.guidedSteps || [];
  const exercises = currentModule.exercises || [];
  const masteryPositions: MasteryPosition[] = currentModule.masteryPositions || [];

  // Available phases
  const availablePhases = useMemo<LessonPhase[]>(() => {
    const phases: LessonPhase[] = ['theory'];
    if (demoSteps.length > 0) phases.push('demo');
    if (guidedSteps.length > 0) phases.push('practice');
    if (exercises.length > 0) phases.push('quiz');
    if (masteryPositions.length > 0) phases.push('mastery');
    return phases;
  }, [demoSteps.length, guidedSteps.length, exercises.length, masteryPositions.length]);

  // Reset on module change
  useEffect(() => {
    setPhase('theory');
    setDemoIdx(0);
    setPracticeIdx(0);
    setPracticeResult(null);
    setPracticeComplete(false);
    setQuizIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizScore(0);
    setMasteryResult(null);
    setMasteryComplete(false);
    setShowScore(false);
    setSelectedExampleIdx(0);
    setPlayedMoves([]);
    setExampleMoveIdx(-1);
    engine.reset();
    if (currentModule.examples?.[0]) {
      setExampleFen(currentModule.examples[0].fen);
    }
    if (masteryPositions[0]) {
      setMasteryFen(masteryPositions[0].fen);
    }
    // Save as last active lesson
    if (currentCourse?.id && currentModule?.id) {
      Storage.saveProgress({
        lastActiveLesson: `${currentCourse.id}/${currentModule.id}`
      });
    }
  }, [selectedCourseIdx, selectedModuleIdx, currentCourse, currentModule]);

  // ==== Demo Handlers ====
  const handleDemoNext = () => {
    if (demoIdx < demoSteps.length - 1) setDemoIdx(demoIdx + 1);
  };
  const handleDemoPrev = () => {
    if (demoIdx > 0) setDemoIdx(demoIdx - 1);
  };

  // ==== Practice Handlers ====
  const handlePracticeMove = useCallback((_from: string, _to: string, san: string) => {
    if (practiceComplete) return;
    const step = guidedSteps[practiceIdx];
    if (!step) return;

    const result = engine.validatePracticeMove(san, guidedSteps);
    setPracticeResult({ correct: result.correct, feedback: result.feedback, type: result.feedbackType });

    if (result.correct) {
      setTimeout(() => {
        if (result.completed) {
          setPracticeComplete(true);
        } else {
          setPracticeIdx(prev => prev + 1);
          setPracticeResult(null);
        }
      }, 1800);
    }
  }, [practiceIdx, practiceComplete, guidedSteps, engine]);

  // ==== Quiz Handlers ====
  const handleQuizSubmit = () => {
    if (selectedOption === null || !exercises[quizIdx]) return;
    setIsAnswered(true);
    if (selectedOption === exercises[quizIdx].answer) {
      addXP(10);
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (quizIdx < exercises.length - 1) {
      setQuizIdx(quizIdx + 1);
    } else {
      // Quiz complete — advance to mastery or show score
      if (masteryPositions.length > 0) {
        setPhase('mastery');
      } else {
        finishModule();
      }
    }
  };

  // ==== Mastery Handlers ====
  const handleMasteryMove = useCallback((_from: string, _to: string, san: string) => {
    if (masteryComplete) return;
    const result = engine.validateMasteryMove(san, masteryPositions);
    setMasteryResult({ correct: result.correct, feedback: result.feedback, type: result.feedbackType });

    if (result.correct && result.nextFen) {
      setMasteryFen(result.nextFen);
    }

    if (result.completed) {
      setMasteryComplete(true);
      setTimeout(() => finishModule(), 2000);
    }
  }, [masteryComplete, masteryPositions, engine]);

  // ==== Finish Module ====
  const finishModule = () => {
    const lessonKey = `${currentCourse.id}-${currentModule.id}`;
    if (!completedLessons.includes(lessonKey)) {
      completeLesson(lessonKey);
      addXP(25);
    }
    setShowScore(true);
  };

  // ==== Example Board ====
  useEffect(() => {
    if (currentModule.examples?.[selectedExampleIdx]) {
      setExampleFen(currentModule.examples[selectedExampleIdx].fen);
      setPlayedMoves([]);
      setExampleMoveIdx(-1);
    }
  }, [selectedExampleIdx, selectedModuleIdx]);

  const handleExampleMove = (from: string, to: string, san: string) => {
    const game = new Chess(exampleFen);
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (move) {
        const newFen = game.fen();
        setExampleFen(newFen);
        const newMoveObj = { move: san, comment: '', eval: '', fen: newFen };
        const newMoves = [...playedMoves.slice(0, exampleMoveIdx + 1), newMoveObj];
        setPlayedMoves(newMoves);
        setExampleMoveIdx(newMoves.length - 1);
      }
    } catch { /* illegal */ }
  };

  const handleExampleIndexChange = (index: number) => {
    setExampleMoveIdx(index);
    if (index === -1 && currentModule.examples?.[selectedExampleIdx]) {
      setExampleFen(currentModule.examples[selectedExampleIdx].fen);
    } else if (playedMoves[index]) {
      setExampleFen(playedMoves[index].fen);
    }
  };

  // ==== Navigation ====
  const changePathway = (pathwayId: string) => {
    setActivePathway(pathwayId);
    setSelectedCourseIdx(0);
    setSelectedModuleIdx(0);
  };
  const changeCourse = (idx: number) => {
    setSelectedCourseIdx(idx);
    setSelectedModuleIdx(0);
  };
  const changeModule = (idx: number) => {
    setSelectedModuleIdx(idx);
  };
  const isModuleCompleted = (courseId: string, moduleId: string) => completedLessons.includes(`${courseId}-${moduleId}`);

  const advanceToNextPhase = () => {
    const currentIdx = availablePhases.indexOf(phase);
    if (currentIdx < availablePhases.length - 1) {
      setPhase(availablePhases[currentIdx + 1]);
    } else {
      finishModule();
    }
  };

  // Get color class for phase
  const getPhaseColorClasses = (p: LessonPhase, isActive: boolean): string => {
    const meta = PHASE_META[p];
    if (isActive) {
      return `bg-${meta.color}-500 text-bg-primary font-bold shadow-glow`;
    }
    return 'text-slate-400 hover:text-slate-200';
  };

  // Current practice position
  const currentPracticeFen = guidedSteps[practiceIdx]?.fen || '8/8/8/8/8/8/8/8 w - - 0 1';
  const currentPracticeStep = guidedSteps[practiceIdx];

  // Current demo position
  const currentDemoStep = demoSteps[demoIdx];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      {/* Pathway Header */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 font-mono">Interactive Curriculum</span>
            <h2 className="text-2xl font-black text-white font-serif">Chess OS Curriculum</h2>
          </div>
        </div>
        
        {/* Pathway Tabs */}
        <div className="flex flex-wrap gap-2" id="curriculum-pathways">
          {PATHWAYS.map(p => (
            <button
              key={p.id}
              id={`pathway-${p.id}`}
              onClick={() => changePathway(p.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                activePathway === p.id
                  ? 'bg-emerald-500 text-bg-primary border-emerald-500 shadow-glow'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.title}</span>
            </button>
          ))}
        </div>

        {/* Sub-Course Selector */}
        {filteredCourses.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 mt-1 scrollbar-thin max-w-full" id="course-selector">
            {filteredCourses.map((course, idx) => (
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
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Modules */}
        <div className="flex flex-col gap-3">
          <Card className="flex flex-col gap-1.5" hoverEffect={false}>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 mb-1">
              <span>{currentCourse.icon}</span>
              <span>{currentCourse.title}</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{currentCourse.description}</p>
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
                <div className="flex gap-1.5 mt-0.5">
                  <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">{m.difficulty}</span>
                  {(m.guidedSteps?.length ?? 0) > 0 && (
                    <span className="text-[8px] bg-amber-500/10 text-amber-400 font-bold px-1 py-0.5 rounded">Interactive</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Workspace */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Phase Tabs */}
          <div className="flex bg-[#0c0c14] border border-white/5 p-1 rounded-xl gap-0.5">
            {availablePhases.map(p => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  phase === p
                    ? 'bg-emerald-500 text-[#06060b] shadow-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>{PHASE_META[p].icon}</span>
                <span className="hidden sm:inline">{PHASE_META[p].label}</span>
              </button>
            ))}
          </div>

          {/* Score overlay */}
          {showScore && (
            <Card className="!bg-gradient-to-br !from-emerald-500/10 !to-violet-500/10 !border-emerald-500/20" hoverEffect={false}>
              <div className="text-center py-6">
                <span className="text-5xl block mb-3 animate-bounceIn">🏆</span>
                <h3 className="text-xl font-black text-white mb-2">Module Complete!</h3>
                <p className="text-sm text-slate-400 mb-4">{currentModule.title}</p>
                <div className="flex justify-center gap-6 mb-6">
                  {exercises.length > 0 && (
                    <div className="text-center">
                      <span className="text-2xl font-black text-emerald-400 block">{quizScore}/{exercises.length}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Quiz Score</span>
                    </div>
                  )}
                  {guidedSteps.length > 0 && (
                    <div className="text-center">
                      <span className="text-2xl font-black text-amber-400 block">{guidedSteps.length}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Practice Steps</span>
                    </div>
                  )}
                  <div className="text-center">
                    <span className="text-2xl font-black text-violet-400 block">+25</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">XP Earned</span>
                  </div>
                </div>
                <Button onClick={() => {
                  setShowScore(false);
                  if (selectedModuleIdx < currentCourse.modules.length - 1) {
                    changeModule(selectedModuleIdx + 1);
                  }
                }}>
                  {selectedModuleIdx < currentCourse.modules.length - 1 ? 'Next Module →' : 'Review Module'}
                </Button>
              </div>
            </Card>
          )}

          {/* Phase Content */}
          {!showScore && (
            <Card className="min-h-[400px] flex flex-col justify-between" hoverEffect={false}>
              {/* ===== THEORY PHASE ===== */}
              {phase === 'theory' && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="border-b border-white/5 pb-2 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white font-serif">{currentModule.title}</h3>
                        <button
                          onClick={() => toggleFavorite(`${currentCourse.id}/${currentModule.id}`)}
                          className="text-amber-400 hover:scale-110 active:scale-95 transition-transform focus:outline-none text-xl"
                          title={favorites.includes(`${currentCourse.id}/${currentModule.id}`) ? "Remove from Favorites" : "Add to Favorites"}
                          id="toggle-favorite-btn"
                        >
                          {favorites.includes(`${currentCourse.id}/${currentModule.id}`) ? '★' : '☆'}
                        </button>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono uppercase font-bold mt-1 inline-block">
                        {currentModule.difficulty}
                      </span>
                    </div>
                    {availablePhases.length > 1 && (
                      <Button onClick={advanceToNextPhase} size="sm" className="!text-[10px]">
                        Continue → {PHASE_META[availablePhases[1]]?.icon}
                      </Button>
                    )}
                  </div>
                  <div
                    className="text-sm text-slate-300 leading-relaxed space-y-4 font-semibold prose-headings:text-white prose-strong:text-white"
                    dangerouslySetInnerHTML={{ __html: currentModule.theory }}
                  />

                  {/* Inline examples with board */}
                  {currentModule.examples && currentModule.examples.length > 0 && (
                    <div className="mt-4 border-t border-white/5 pt-4">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3 font-mono">
                        📊 Examples — Explore the position
                      </span>
                      <div className="flex flex-col lg:flex-row gap-6 items-start">
                        <div className="flex flex-col gap-3 items-center">
                          <Board
                            fen={exampleFen}
                            interactive={true}
                            flipped={flipped}
                            onMove={handleExampleMove}
                            size={300}
                          />
                          {currentModule.examples.length > 1 && (
                            <div className="flex gap-1.5">
                              {currentModule.examples.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setSelectedExampleIdx(i)}
                                  className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition-all ${
                                    selectedExampleIdx === i ? 'bg-emerald-500 text-[#06060b]' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                  }`}
                                >
                                  {i + 1}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-3 flex-1 w-full">
                          <h4 className="font-bold text-sm text-white">{currentModule.examples[selectedExampleIdx]?.title}</h4>
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
                    </div>
                  )}
                </div>
              )}

              {/* ===== DEMO PHASE ===== */}
              {phase === 'demo' && currentDemoStep && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="border-b border-white/5 pb-2 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase font-mono tracking-wider">Interactive Demonstration</span>
                      <h3 className="text-sm font-bold text-white mt-0.5">Step {demoIdx + 1} of {demoSteps.length}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleDemoPrev} disabled={demoIdx === 0} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 flex items-center justify-center text-sm hover:bg-white/10 transition-all">←</button>
                      <button onClick={handleDemoNext} disabled={demoIdx === demoSteps.length - 1} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 flex items-center justify-center text-sm hover:bg-white/10 transition-all">→</button>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center gap-3">
                      <Board
                        fen={currentDemoStep.fen}
                        interactive={false}
                        highlights={currentDemoStep.highlights}
                        arrows={currentDemoStep.arrows}
                        size={320}
                      />
                      {/* Step indicators */}
                      <div className="flex gap-1">
                        {demoSteps.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setDemoIdx(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              i === demoIdx ? 'bg-blue-500 scale-125' : i < demoIdx ? 'bg-blue-500/30' : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-5">
                        <p className="text-sm text-slate-200 leading-relaxed font-semibold">{currentDemoStep.commentary}</p>
                      </div>
                      {demoIdx === demoSteps.length - 1 && (
                        <Button onClick={advanceToNextPhase} className="mt-4 w-full">
                          Continue to {PHASE_META[availablePhases[availablePhases.indexOf('demo') + 1]]?.label || 'Next'} →
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== PRACTICE PHASE ===== */}
              {phase === 'practice' && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="border-b border-white/5 pb-2 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase font-mono tracking-wider">Guided Practice</span>
                      <h3 className="text-sm font-bold text-white mt-0.5">
                        {practiceComplete ? 'Practice Complete!' : `Step ${practiceIdx + 1} of ${guidedSteps.length}`}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-amber-400 font-bold">+5 XP per correct move</span>
                  </div>

                  {!practiceComplete && currentPracticeStep ? (
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                      <div className="flex flex-col items-center gap-3">
                        <Board
                          fen={currentPracticeFen}
                          interactive={true}
                          onMove={handlePracticeMove}
                          highlights={currentPracticeStep.highlights}
                          arrows={currentPracticeStep.arrows}
                          size={320}
                        />
                        {/* Progress dots */}
                        <div className="flex gap-1">
                          {guidedSteps.map((_, i) => (
                            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${
                              i < practiceIdx ? 'bg-emerald-500' : i === practiceIdx ? 'bg-amber-500 scale-125 animate-pulse' : 'bg-white/10'
                            }`} />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 w-full flex flex-col gap-3">
                        {/* Instruction */}
                        <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-5">
                          <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">Your Turn</span>
                          <p className="text-sm text-white font-bold leading-relaxed">{currentPracticeStep.instruction}</p>
                        </div>

                        {/* Feedback */}
                        {practiceResult && (
                          <div className={`p-4 rounded-xl border transition-all animate-slideUp ${
                            practiceResult.correct
                              ? 'bg-emerald-500/5 border-emerald-500/20'
                              : 'bg-red-500/5 border-red-500/20'
                          }`}>
                            <span className="text-sm block mb-1">{practiceResult.correct ? '✅' : '❌'}</span>
                            <p className="text-xs text-slate-300 font-semibold leading-relaxed">{practiceResult.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <span className="text-4xl block mb-3">🎯</span>
                      <h4 className="text-lg font-bold text-white mb-2">All Practice Steps Complete!</h4>
                      <p className="text-xs text-slate-400 mb-4">You nailed every guided exercise.</p>
                      <Button onClick={advanceToNextPhase}>
                        Continue to {PHASE_META[availablePhases[availablePhases.indexOf('practice') + 1]]?.label || 'Next'} →
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* ===== QUIZ PHASE ===== */}
              {phase === 'quiz' && exercises.length > 0 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div>
                      <span className="text-[10px] font-bold text-violet-400 uppercase font-mono tracking-wider">Assessment Quiz</span>
                      <h4 className="font-extrabold text-sm text-white mt-0.5">
                        Question {quizIdx + 1} of {exercises.length}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-emerald-400 font-bold">{quizScore}/{quizIdx + (isAnswered ? 1 : 0)} correct</span>
                      <span className="text-xs font-mono text-amber-400 font-bold">+10 XP</span>
                    </div>
                  </div>

                  {/* FEN-based question: show board */}
                  {exercises[quizIdx]?.fen && (
                    <div className="flex justify-center">
                      <Board fen={exercises[quizIdx].fen!} interactive={false} size={260} />
                    </div>
                  )}

                  <p className="text-sm text-slate-200 font-semibold leading-relaxed my-1">
                    {exercises[quizIdx]?.question}
                  </p>

                  <div className="flex flex-col gap-2 font-semibold">
                    {exercises[quizIdx]?.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => { if (!isAnswered) setSelectedOption(oIdx); }}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          isAnswered
                            ? oIdx === exercises[quizIdx].answer
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
                      <div className="text-xs text-slate-400 bg-black/40 border border-white/5 p-4 rounded-xl leading-relaxed font-semibold animate-slideUp">
                        <strong className="block text-white mb-1">
                          {selectedOption === exercises[quizIdx].answer ? '🎉 Brilliant! (+10 XP)' : '❌ Inaccurate'}
                        </strong>
                        {exercises[quizIdx].explanation}
                      </div>
                    )}

                    {!isAnswered ? (
                      <Button onClick={handleQuizSubmit} disabled={selectedOption === null} fullWidth>
                        Submit Answer
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuiz} variant="secondary" fullWidth>
                        {quizIdx < exercises.length - 1 ? 'Next Question' : masteryPositions.length > 0 ? 'Continue to Mastery Check →' : 'Complete Module'}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* ===== MASTERY PHASE ===== */}
              {phase === 'mastery' && masteryPositions.length > 0 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="border-b border-white/5 pb-2 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 uppercase font-mono tracking-wider">Mastery Check</span>
                      <h3 className="text-sm font-bold text-white mt-0.5">
                        {masteryComplete ? '🏆 Mastery Achieved!' : 'Demonstrate Your Understanding'}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-rose-400 font-bold">+20 XP</span>
                  </div>

                  {!masteryComplete ? (
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                      <div className="flex flex-col items-center gap-3">
                        <Board
                          fen={masteryFen}
                          interactive={true}
                          onMove={handleMasteryMove}
                          size={320}
                        />
                      </div>
                      <div className="flex-1 w-full flex flex-col gap-3">
                        <div className="bg-rose-500/5 border border-rose-500/15 rounded-xl p-5">
                          <span className="text-[10px] font-bold text-rose-400 uppercase block mb-1">Challenge</span>
                          <p className="text-sm text-white font-bold leading-relaxed">
                            {masteryPositions[0]?.description}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-2">
                            Concept: <strong className="text-slate-300">{masteryPositions[0]?.conceptTested}</strong>
                          </p>
                        </div>
                        {masteryResult && (
                          <div className={`p-4 rounded-xl border transition-all animate-slideUp ${
                            masteryResult.correct
                              ? 'bg-emerald-500/5 border-emerald-500/20'
                              : 'bg-red-500/5 border-red-500/20'
                          }`}>
                            <p className="text-xs text-slate-300 font-semibold leading-relaxed">{masteryResult.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 animate-scaleIn">
                      <span className="text-5xl block mb-3">🏆</span>
                      <h4 className="text-lg font-bold text-white mb-2">Mastery Demonstrated!</h4>
                      <p className="text-xs text-slate-400">You've proven your understanding. +20 XP earned.</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lessons;
