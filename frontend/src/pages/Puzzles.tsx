import React, { useState } from 'react';
import { Board } from '../components/Board';
import { GuidedSolverPanel } from '../components/GuidedSolverPanel';

interface PuzzleItem {
  id: string;
  FEN: string;
  solution: string;
  category: string;
  difficulty: string;
  motif: string;
  theme?: string;
}

export const Puzzles: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('mate_in_1');
  const [activeMode, setActiveMode] = useState<'guided' | 'practice'>('guided');
  const [activePuzzleIdx, setActivePuzzleIdx] = useState<number>(0);
  const [customHighlight, setCustomHighlight] = useState<string | null>(null);
  const [solvedCount, setSolvedCount] = useState<number>(0);

  const puzzles: PuzzleItem[] = [
    {
      id: 'm1_01',
      FEN: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 0 1',
      solution: 'Qxf7#',
      category: 'mate_in_1',
      difficulty: 'beginner',
      motif: 'Weak f7'
    },
    {
      id: 'm1_02',
      FEN: '6k1/5ppp/8/8/8/8/r4PPP/1R4K1 w - - 0 1',
      solution: 'Rb8#',
      category: 'mate_in_1',
      difficulty: 'beginner',
      motif: 'Back Rank Mate'
    },
    {
      id: 'm2_02',
      FEN: 'r1b1k2r/ppppqppp/2n5/4P3/2B1n3/B4N2/P4PPP/R2Q1RK1 w kq - 1 10',
      solution: 'Bxf7+ Kxf7 Qd5+',
      category: 'mate_in_2',
      difficulty: 'intermediate',
      motif: 'Attraction'
    },
    {
      id: 'fork_01',
      FEN: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      solution: 'Ng5',
      category: 'forks',
      difficulty: 'beginner',
      motif: 'Knight Fork'
    }
  ];

  const filteredPuzzles = puzzles.filter(p => p.category === selectedCategory);
  const currentPuzzle = filteredPuzzles[activePuzzleIdx] || puzzles[0];

  const handleSolved = () => {
    setSolvedCount(solvedCount + 1);
    alert('Congratulations! Puzzle solved successfully. You have earned +15 XP.');
    // Move to next puzzle
    if (activePuzzleIdx < filteredPuzzles.length - 1) {
      setActivePuzzleIdx(activePuzzleIdx + 1);
    } else {
      setActivePuzzleIdx(0);
    }
  };

  const selectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setActivePuzzleIdx(0);
    setCustomHighlight(null);
  };

  const activeHighlights = customHighlight 
    ? [{ square: customHighlight, color: 'rgba(239, 68, 68, 0.4)', class: 'border-2 border-red-500' }]
    : [];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto py-4 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Practice Arena</span>
          <h2 className="text-2xl font-black text-white font-serif">Interactive Chess Puzzles</h2>
        </div>
        <div className="flex bg-[#0c0c14] border border-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveMode('guided')}
            className={`py-1.5 px-4 text-xs font-bold rounded-lg transition-all ${
              activeMode === 'guided' 
                ? 'bg-emerald-500 text-bg-primary font-bold shadow-glow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Guided Solve Mode
          </button>
          <button
            onClick={() => setActiveMode('practice')}
            className={`py-1.5 px-4 text-xs font-bold rounded-lg transition-all ${
              activeMode === 'practice' 
                ? 'bg-emerald-500 text-bg-primary font-bold shadow-glow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Practice Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Menu Selector */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Categories</span>
          <div className="flex flex-col gap-2">
            {[
              { id: 'mate_in_1', label: 'Mate in 1' },
              { id: 'mate_in_2', label: 'Mate in 2' },
              { id: 'forks', label: 'Forks & Double Attacks' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-500 bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed mt-4">
            🔥 Puzzles Solved: <span className="text-white font-bold">{solvedCount}</span>
          </div>
        </div>

        {/* Board View */}
        <div className="flex flex-col gap-4 items-center justify-center bg-[#0c0c14]/50 rounded-3xl p-8 border border-white/5">
          <Board 
            fen={currentPuzzle.FEN} 
            interactive={activeMode === 'practice'} 
            highlights={activeHighlights}
          />
          <div className="text-xs text-slate-500 mt-2 font-mono">
            Difficulty: <span className="text-amber-400 uppercase font-semibold">{currentPuzzle.difficulty}</span> • Theme: {currentPuzzle.motif}
          </div>
        </div>

        {/* Solver Panel */}
        <div className="flex justify-center">
          <GuidedSolverPanel 
            puzzle={currentPuzzle} 
            onSolved={handleSolved}
            onSelectHighlight={setCustomHighlight}
          />
        </div>
      </div>
    </div>
  );
};
export default Puzzles;
