import React, { useState } from 'react';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';

interface CalcExercise {
  id: string;
  title: string;
  fen: string;
  movesSequence: string[];
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export const CalculationTrainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'mental'>('candidates');
  const [selectedExerciseIdx, setSelectedExerciseIdx] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const addXP = useAppStore(state => state.addXP);

  const candidatesDrills = [
    {
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      question: 'Identify the most forcing candidate move targeting the weak f7 square.',
      options: ['O-O', 'Ng5', 'd3', 'Nc3'],
      answerIndex: 1, // Ng5
      explanation: 'Ng5 creates an immediate threat on f7 (forking f7 with bishop support), which makes it the most forcing candidate.'
    },
    {
      fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
      question: 'After Black captures on e4 (Nxe4), what is the best central strike candidate for White?',
      options: ['O-O', 'd4', 'Nc3', 'Qe2'],
      answerIndex: 1, // d4
      explanation: 'd4 immediately hits back in the center and challenges the bishop. After d4, White fights for the initiative.'
    }
  ];

  const mentalExercises: CalcExercise[] = [
    {
      id: 'mc_01',
      title: 'Back Rank Deflection Trace',
      fen: '6k1/5ppp/8/8/8/2r5/1R3PPP/6K1 w - - 0 1',
      movesSequence: ['1. Rb8+', '1... Rc8', '2. Rxc8#'],
      question: 'After 1. Rb8+ Rc8 2. Rxc8#, what is the final checkmate square?',
      options: ['c8', 'b8', 'g8', 'c1'],
      answerIndex: 0,
      explanation: 'The rook on b8 captures the blocking black rook on c8, delivering checkmate on that square.'
    },
    {
      id: 'mc_02',
      title: 'Knight Fork Visualization',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      movesSequence: ['1. Ng5', '1... d5', '2. exd5', '2... Nxd5', '3. Nxf7', '3... Kxf7'],
      question: 'After 3. Nxf7 Kxf7, what pieces did White fork with the knight before the sacrifice?',
      options: ['Queen and Rook', 'King and Bishop', 'Rook and Bishop', 'Queen and Bishop'],
      answerIndex: 0,
      explanation: 'Ng5-f7 attacks the d8 queen and the h8 rook simultaneously, forcing Kxf7.'
    }
  ];

  const currentDrill = activeTab === 'candidates' ? candidatesDrills[selectedExerciseIdx] : mentalExercises[selectedExerciseIdx];

  const handleOptionClick = (idx: number) => {
    if (isSubmitted) return;
    setUserAnswer(idx);
  };

  const handleSubmit = () => {
    if (userAnswer === null) return;
    setIsSubmitted(true);
    if (userAnswer === currentDrill.answerIndex) {
      addXP(10);
    }
  };

  const handleNext = () => {
    setUserAnswer(null);
    setIsSubmitted(false);
    const length = activeTab === 'candidates' ? candidatesDrills.length : mentalExercises.length;
    setSelectedExerciseIdx((selectedExerciseIdx + 1) % length);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto py-4 animate-fadeIn">
      {/* Tab Switcher */}
      <div className="flex border-b border-white/10 gap-6">
        <button
          onClick={() => { setActiveTab('candidates'); setSelectedExerciseIdx(0); setUserAnswer(null); setIsSubmitted(false); }}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'candidates' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Candidate Moves Drill
          {activeTab === 'candidates' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />}
        </button>
        <button
          onClick={() => { setActiveTab('mental'); setSelectedExerciseIdx(0); setUserAnswer(null); setIsSubmitted(false); }}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'mental' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Mental Tracing Lab
          {activeTab === 'mental' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Board View */}
        <div className="lg:col-span-2 flex flex-col gap-4 items-center justify-center bg-[#0c0c14]/50 rounded-3xl p-8 border border-white/5">
          <Board 
            fen={currentDrill.fen} 
            interactive={false} 
          />
          {activeTab === 'mental' && (
            <div className="flex flex-col gap-2 w-full mt-4 max-w-[400px]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Calculation Line</span>
              <div className="flex gap-2 flex-wrap">
                {(currentDrill as CalcExercise).movesSequence.map((m, idx) => (
                  <span key={idx} className="font-mono bg-bg-card border border-white/5 py-1 px-3 rounded-lg text-sm text-emerald-400 font-semibold">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Panel Options */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 w-full text-slate-200 justify-between">
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                {activeTab === 'candidates' ? 'Candidate Search' : 'Visualization Practice'}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {activeTab === 'candidates' ? 'Find Candidate Moves' : 'Mental Variation Tracing'}
              </h3>
            </div>
            
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              {currentDrill.question}
            </p>

            <div className="flex flex-col gap-2 mt-2">
              {currentDrill.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  className={`py-3 px-4 rounded-xl border text-left text-sm transition-all ${
                    isSubmitted 
                      ? idx === currentDrill.answerIndex 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold' 
                        : idx === userAnswer 
                        ? 'bg-red-500/10 border-red-500 text-red-400' 
                        : 'bg-white/[0.02] border-white/5 opacity-50'
                      : userAnswer === idx 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-semibold' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {isSubmitted && (
              <div className="text-xs text-slate-400 bg-[#0c0c14] border border-white/5 p-4 rounded-xl leading-relaxed">
                <strong className="block text-white mb-1">
                  {userAnswer === currentDrill.answerIndex ? '🎉 Correct! (+10 XP)' : '❌ Incorrect'}
                </strong>
                {currentDrill.explanation}
              </div>
            )}

            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={userAnswer === null}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 text-bg-primary font-bold py-3 rounded-xl transition-all shadow-glow text-center"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-3 rounded-xl transition-all text-center"
              >
                Next Exercise
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CalculationTrainer;
