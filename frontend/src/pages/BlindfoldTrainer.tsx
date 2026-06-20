import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

type FilterTab = 'color' | 'knight';

export const BlindfoldTrainer: React.FC = () => {
  const [mode, setMode] = useState<FilterTab>('color');
  const [currentSq, setCurrentSq] = useState<string>('e4');
  const [score, setScore] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [knightStart, setKnightStart] = useState<string>('a1');
  const [knightTarget, setKnightTarget] = useState<string>('c3');
  const [knightAnswer, setKnightAnswer] = useState<string>('');
  const [knightFeedback, setKnightFeedback] = useState<string | null>(null);

  const addXP = useAppStore(state => state.addXP);

  // Generate random square
  const generateRandomSquare = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const rFile = files[Math.floor(Math.random() * files.length)];
    const rRank = ranks[Math.floor(Math.random() * ranks.length)];
    setCurrentSq(`${rFile}${rRank}`);
    setFeedback(null);
  };

  useEffect(() => {
    generateRandomSquare();
  }, [mode]);

  const handleColorGuess = (guess: 'light' | 'dark') => {
    const file = currentSq.charCodeAt(0) - 97;
    const rank = parseInt(currentSq[1]) - 1;
    const isDark = (file + rank) % 2 === 0;
    const correctColor = isDark ? 'dark' : 'light';
    
    const isCorrect = guess === correctColor;
    setTotal(total + 1);
    if (isCorrect) {
      setScore(score + 1);
      setFeedback('Correct! 🎉');
      addXP(2);
      setTimeout(() => generateRandomSquare(), 1000);
    } else {
      setFeedback(`Incorrect. ${currentSq.toUpperCase()} is a ${correctColor.toUpperCase()} square. ❌`);
    }
  };

  const handleKnightSubmit = () => {
    if (!knightAnswer) return;
    
    const pathArray = knightAnswer.toLowerCase().split(/[ ,->]+/).filter(Boolean);
    
    if (pathArray[0] !== knightStart) {
      pathArray.unshift(knightStart);
    }

    const files = 'abcdefgh';
    const isValidMove = (s1: string, s2: string) => {
      const f1 = files.indexOf(s1[0]), r1 = parseInt(s1[1]);
      const f2 = files.indexOf(s2[0]), r2 = parseInt(s2[1]);
      const df = Math.abs(f1 - f2);
      const dr = Math.abs(r1 - r2);
      return (df === 1 && dr === 2) || (df === 2 && dr === 1);
    };

    let valid = true;
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!isValidMove(pathArray[i], pathArray[i+1])) {
        valid = false;
        break;
      }
    }

    const lastSq = pathArray[pathArray.length - 1];
    if (valid && lastSq === knightTarget) {
      setKnightFeedback(`Excellent! That is a valid knight path of ${pathArray.length - 1} moves. (+10 XP)`);
      addXP(10);
    } else {
      setKnightFeedback('Invalid knight path! Ensure each step is an L-shaped move.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Visualization Arena</span>
        <h2 className="text-2xl font-black text-white font-serif mt-1">Blindfold Lab</h2>
        <p className="text-sm text-slate-400 mt-1">Strengthen your internal chess board visual model with coordinate and path trainers.</p>
      </div>

      {/* Mode selectors */}
      <div className="flex border-b border-white/5 gap-6">
        <button
          onClick={() => setMode('color')}
          className={`pb-3 text-sm font-bold transition-all relative ${mode === 'color' ? 'text-emerald-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Coordinate Color Matcher
          {mode === 'color' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />}
        </button>
        <button
          onClick={() => setMode('knight')}
          className={`pb-3 text-sm font-bold transition-all relative ${mode === 'knight' ? 'text-emerald-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Knight Path Visualization
          {mode === 'knight' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Main interactive panel */}
        {mode === 'color' ? (
          <Card className="flex flex-col gap-6 text-center" hoverEffect={false}>
            <span className="text-slate-500 font-bold uppercase tracking-wider text-xs block">Coordinate Color Matcher</span>
            <div className="text-7xl font-black text-white py-12 bg-bg-primary/50 border border-white/5 rounded-2xl font-mono shadow-inner">
              {currentSq.toUpperCase()}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleColorGuess('light')}
                variant="secondary"
                size="lg"
                className="py-4 text-base"
              >
                Light
              </Button>
              <Button
                onClick={() => handleColorGuess('dark')}
                size="lg"
                className="py-4 text-base bg-[#7b945d] hover:bg-[#6b8251] text-[#fcfaf2]"
              >
                Dark
              </Button>
            </div>

            {feedback && (
              <div className="p-3 bg-white/5 border border-white/5 text-sm font-bold text-emerald-400 rounded-xl shadow-inner">
                {feedback}
              </div>
            )}

            <div className="text-xs text-slate-500 font-bold font-mono">
              Score: {score} / {total} correct ({total > 0 ? Math.round((score/total)*100) : 0}%)
            </div>
          </Card>
        ) : (
          <Card className="flex flex-col gap-6" hoverEffect={false}>
            <span className="text-slate-500 font-bold uppercase tracking-wider text-xs block">Knight Path Visualization</span>
            <div className="bg-[#0c0c14] border border-white/5 p-6 rounded-2xl flex flex-col gap-3 text-center shadow-inner">
              <div className="flex justify-around items-center text-white font-bold">
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">START SQUARE</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">{knightStart.toUpperCase()}</span>
                </div>
                <div className="text-2xl opacity-40">➔</div>
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">TARGET SQUARE</span>
                  <span className="text-2xl font-black font-mono text-amber-500">{knightTarget.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400">Write down the coordinate path (comma separated):</label>
              <input
                type="text"
                placeholder="e.g. a1, b3, c5, d7"
                value={knightAnswer}
                onChange={e => setKnightAnswer(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 text-white uppercase font-mono font-bold"
              />
            </div>

            <Button
              onClick={handleKnightSubmit}
              fullWidth
            >
              Verify Knight Path
            </Button>

            {knightFeedback && (
              <div className="p-4 bg-white/5 border border-white/5 text-xs text-slate-300 rounded-xl leading-relaxed font-semibold">
                {knightFeedback}
              </div>
            )}
          </Card>
        )}

        {/* Coach Commentary / Method Explanation */}
        <Card className="flex flex-col gap-4 text-slate-300" hoverEffect={false}>
          <h3 className="font-bold text-white text-base">💡 Visualization Techniques</h3>
          <p className="text-xs leading-relaxed text-slate-400 font-semibold">
            Strong players do not calculate by guessing random coordinates. They visualize the grid, identifying diagonals and key colors.
          </p>
          <div className="flex flex-col gap-3 mt-2">
            <div className="bg-[#0c0c14] border border-white/5 p-4 rounded-xl text-xs shadow-inner">
              <strong className="text-amber-400 block mb-1 font-bold">Rule of Coordinate Parity:</strong>
              <span className="font-semibold text-slate-400 leading-relaxed">
                If a file (a=1, b=2, c=3, d=4, e=5, f=6, g=7, h=8) and the rank have the same parity (both even or both odd), the square is dark. If they differ, it is light.
              </span>
            </div>
            <div className="bg-[#0c0c14] border border-white/5 p-4 rounded-xl text-xs shadow-inner">
              <strong className="text-emerald-400 block mb-1 font-bold">Knight Movement Tip:</strong>
              <span className="font-semibold text-slate-400 leading-relaxed">
                A knight always changes the color of the square it lands on. Use this to trace shortest paths and avoid color mismatches.
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BlindfoldTrainer;
