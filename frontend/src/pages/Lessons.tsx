import React, { useState } from 'react';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';

interface LessonModule {
  id: string;
  title: string;
  difficulty: string;
  theory: string;
  examples: Array<{ fen: string; title: string; description: string }>;
  exercises: Array<{ type: string; question: string; options: string[]; answer: number; explanation: string }>;
}

export const Lessons: React.FC = () => {
  const [selectedModuleIdx, setSelectedModuleIdx] = useState<number>(0);
  const [selectedExampleIdx, setSelectedExampleIdx] = useState<number>(0);
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [mode, setMode] = useState<'theory' | 'example' | 'quiz'>('theory');

  const addXP = useAppStore(state => state.addXP);
  const completeLesson = useAppStore(state => state.completeLesson);
  const completedLessons = useAppStore(state => state.completedLessons);

  const modules: LessonModule[] = [
    {
      id: 'chessboard',
      title: 'The Chessboard & Notations',
      difficulty: 'beginner',
      theory: `
        <h3 class="text-white font-bold text-base mb-2">The 8x8 Grid</h3>
        <p class="text-sm text-slate-300 leading-relaxed mb-3">
          The chessboard consists of 64 alternating light and dark squares arranged in 8 vertical rows (files, labeled a-h) and 8 horizontal rows (ranks, numbered 1-8).
        </p>
        <h3 class="text-white font-bold text-base mb-2">Coordinates (Algebraic Notation)</h3>
        <p class="text-sm text-slate-300 leading-relaxed mb-3">
          Every square has a unique coordinate (e.g. e4, f3, h1). White always begins on ranks 1 and 2, while Black starts on ranks 7 and 8. The bottom-right square must always be light ("white on right").
        </p>
      `,
      examples: [
        {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          title: 'Initial Position Setup',
          description: 'This is the starting setup. Note the white queen is on the light d1 square and the black queen is on the dark d8 square.'
        },
        {
          fen: '8/8/8/3PP3/3PP3/8/8/8 w - - 0 1',
          title: 'The Center Squares',
          description: 'The central squares (d4, d5, e4, e5) are critical targets. Controlling these squares gives pieces maximum scope.'
        }
      ],
      exercises: [
        {
          type: 'quiz',
          question: 'Which square is always a light square in the bottom-right corner?',
          options: ['a1', 'h1', 'a8', 'h8'],
          answer: 1, // h1
          explanation: 'h1 is the bottom-right square for White, which must always be light.'
        },
        {
          type: 'quiz',
          question: 'What color is the square e4?',
          options: ['Light', 'Dark'],
          answer: 0,
          explanation: 'e=5 (odd), 4 (even). Odd + Even = Light square.'
        }
      ]
    },
    {
      id: 'castling',
      title: 'Special Rules: Castling & Promotion',
      difficulty: 'beginner',
      theory: `
        <h3 class="text-white font-bold text-base mb-2">Castling Rules</h3>
        <p class="text-sm text-slate-300 leading-relaxed mb-3">
          Castling secures the king and activates the rook. The king moves two squares toward the rook, and the rook hops over the king. You cannot castle if:
        </p>
        <ul class="list-disc pl-5 text-sm text-slate-300 flex flex-col gap-1.5 mb-3">
          <li>King or rook has previously moved.</li>
          <li>Pieces block the squares between them.</li>
          <li>King is currently in check, or passes through a square controlled by an opponent piece.</li>
        </ul>
      `,
      examples: [
        {
          fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1',
          title: 'Castling Potential Position',
          description: 'Both White and Black can castle either kingside (O-O) or queenside (O-O-O) in this open position.'
        }
      ],
      exercises: [
        {
          type: 'quiz',
          question: 'Can you castle to escape a direct check?',
          options: ['Yes', 'No'],
          answer: 1, // No
          explanation: 'You are not allowed to castle if your king is currently in check.'
        }
      ]
    }
  ];

  const currentModule = modules[selectedModuleIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === currentModule.exercises[quizIdx].answer) {
      addXP(10);
      if (quizIdx === currentModule.exercises.length - 1) {
        completeLesson(currentModule.id);
      }
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (quizIdx < currentModule.exercises.length - 1) {
      setQuizIdx(quizIdx + 1);
    } else {
      setQuizIdx(0);
      setMode('theory');
    }
  };

  const changeModule = (idx: number) => {
    setSelectedModuleIdx(idx);
    setSelectedExampleIdx(0);
    setQuizIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setMode('theory');
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto py-4 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Curriculum Course</span>
        <h2 className="text-2xl font-black text-white font-serif">Interactive Lesson Labs</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module Selector Sidebar */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Lessons Outline</span>
          {modules.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => changeModule(idx)}
              className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                idx === selectedModuleIdx 
                  ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <h4 className="font-bold text-sm text-white">{m.title}</h4>
                {completedLessons.includes(m.id) && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/20">
                    Mastered
                  </span>
                )}
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mt-1">{m.difficulty}</span>
            </button>
          ))}
        </div>

        {/* Board View or Theory Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Mode Switcher */}
          <div className="flex bg-[#0c0c14] border border-white/5 p-1 rounded-xl">
            {['theory', 'example', 'quiz'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m as any)}
                className={`flex-1 py-2 text-xs font-bold capitalize rounded-lg transition-all ${
                  mode === m 
                    ? 'bg-emerald-500 text-bg-primary font-bold shadow-glow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="glass-panel p-8 rounded-3xl min-h-[400px] flex flex-col justify-between">
            {mode === 'theory' && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <h3 className="text-xl font-bold text-white mb-2">{currentModule.title} — Theory</h3>
                <div dangerouslySetInnerHTML={{ __html: currentModule.theory }} />
              </div>
            )}

            {mode === 'example' && (
              <div className="flex flex-col md:flex-row gap-6 items-center animate-fadeIn">
                <Board 
                  fen={currentModule.examples[selectedExampleIdx].fen} 
                  interactive={false}
                />
                <div className="flex flex-col gap-4 flex-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Board Demonstration</span>
                    <h4 className="font-bold text-base text-white mt-0.5">{currentModule.examples[selectedExampleIdx].title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-[#0c0c14] border border-white/5 p-3 rounded-lg">
                    {currentModule.examples[selectedExampleIdx].description}
                  </p>
                  {currentModule.examples.length > 1 && (
                    <div className="flex gap-2">
                      {currentModule.examples.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedExampleIdx(i)}
                          className={`w-8 h-8 rounded-lg font-mono text-xs font-bold ${
                            selectedExampleIdx === i ? 'bg-emerald-500 text-bg-primary font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {mode === 'quiz' && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">Assessment</span>
                  <h4 className="font-bold text-sm text-white mt-1">
                    Question {quizIdx + 1}: {currentModule.exercises[quizIdx].question}
                  </h4>
                </div>

                <div className="flex flex-col gap-2">
                  {currentModule.exercises[quizIdx].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionClick(oIdx)}
                      className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                        isAnswered
                          ? oIdx === currentModule.exercises[quizIdx].answer
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold'
                            : oIdx === selectedOption
                            ? 'bg-red-500/10 border-red-500 text-red-400'
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

                <div className="flex flex-col gap-4">
                  {isAnswered && (
                    <div className="text-xs text-slate-400 bg-[#0c0c14] border border-white/5 p-4 rounded-xl leading-relaxed">
                      <strong className="block text-white mb-1">
                        {selectedOption === currentModule.exercises[quizIdx].answer ? '🎉 Correct! (+10 XP)' : '❌ Incorrect'}
                      </strong>
                      {currentModule.exercises[quizIdx].explanation}
                    </div>
                  )}

                  {!isAnswered ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={selectedOption === null}
                      className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-bg-primary font-bold py-3 rounded-xl transition-all shadow-glow text-center text-xs"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuiz}
                      className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-3 rounded-xl transition-all text-center text-xs"
                    >
                      Next Quiz / Complete Lesson
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Lessons;
