import React, { useState, useEffect } from 'react';
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

  // Lifted solver states
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [lastMove, setLastMove] = useState<{ from: string; to: string; san: string } | null>(null);

  const puzzles: PuzzleItem[] = [
    // Mate in 1
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
      id: 'm1_03',
      FEN: '6k1/R7/8/8/8/8/5PPP/1R4K1 w - - 0 1',
      solution: 'Rb8#',
      category: 'mate_in_1',
      difficulty: 'beginner',
      motif: 'Back Rank Mate'
    },
    {
      id: 'm1_04',
      FEN: 'r1b1kbnr/pppp1ppp/2n5/4p3/6pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 1',
      solution: 'e3#',
      category: 'mate_in_1',
      difficulty: 'beginner',
      motif: "Fool's Mate Variation"
    },
    // Mate in 2
    {
      id: 'm2_01',
      FEN: '6k1/5ppp/8/8/8/2r5/1R3PPP/6K1 w - - 0 1',
      solution: 'Rb8+ Rc8 Rxc8#',
      category: 'mate_in_2',
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
      id: 'm2_03',
      FEN: 'r2q1rk1/pb3ppp/1p1bp3/3n4/3P4/3B1N2/PP1BQPPP/R3R1K1 w - - 0 14',
      solution: 'Bxh7+ Kxh7 Ng5+',
      category: 'mate_in_2',
      difficulty: 'intermediate',
      motif: 'Greek Gift'
    },
    {
      id: 'm2_04',
      FEN: '3r2k1/5pp1/7p/R7/4n3/1Q6/5PPP/3r2K1 w - - 0 1',
      solution: 'Qxd1 Rxd1#',
      category: 'mate_in_2',
      difficulty: 'beginner',
      motif: 'Back Rank Deflection'
    },
    // Mate in 3
    {
      id: 'm3_01',
      FEN: 'r1b3kr/pppn1pNp/8/4q3/8/8/PPPPQPPP/R1B1K2R w KQ - 0 1',
      solution: 'Qe8+ Rxe8 Nf7#',
      category: 'mate_in_3',
      difficulty: 'advanced',
      motif: 'Smothered Mate'
    },
    {
      id: 'm3_02',
      FEN: '6rk/5Qpp/7N/8/8/8/8/6QK w - - 0 1',
      solution: 'Qg8+ Rxg8 Nf7#',
      category: 'mate_in_3',
      difficulty: 'intermediate',
      motif: 'Smothered Mate'
    },
    {
      id: 'm3_03',
      FEN: 'r3k2r/ppp2ppp/2n5/3qp1Nb/8/3P3P/PPP1BPP1/R2QK2R b KQkq - 0 10',
      solution: 'Bxe2 Qxe2 Qxg2 O-O-O',
      category: 'mate_in_3',
      difficulty: 'intermediate',
      motif: 'Zwischenzug'
    },
    // Forks
    {
      id: 'fork_01',
      FEN: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      solution: 'Ng5',
      category: 'forks',
      difficulty: 'beginner',
      motif: 'Knight Fork'
    },
    {
      id: 'fork_02',
      FEN: '8/3k4/8/3N4/8/8/1K6/4r3 w - - 0 1',
      solution: 'Nf6+',
      category: 'forks',
      difficulty: 'intermediate',
      motif: 'Knight Fork'
    },
    {
      id: 'fork_03',
      FEN: '2r3k1/pp3pp1/4p2p/8/1b2q3/1B2B1P1/PP3P1P/3QR1K1 w - - 0 1',
      solution: 'Qd7',
      category: 'forks',
      difficulty: 'intermediate',
      motif: 'Queen Fork'
    },
    {
      id: 'fork_04',
      FEN: 'r3k2r/ppp1nppp/3q1n2/3pN3/3P4/2N5/PPP2PPP/R2QR1K1 w kq - 0 10',
      solution: 'Nxf7',
      category: 'forks',
      difficulty: 'advanced',
      motif: 'Knight Fork'
    },
    // Pins
    {
      id: 'pin_01',
      FEN: 'rn1qkb1r/ppp2ppp/4pn2/3p4/3P2b1/2N2N2/PPP1PPPP/R1BQKB1R w KQkq - 2 4',
      solution: 'Bg5',
      category: 'pins',
      difficulty: 'beginner',
      motif: 'Absolute Pin'
    },
    {
      id: 'pin_02',
      FEN: 'r1bqk1nr/pppp1ppp/2n5/1Bb1p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      solution: 'Bb5',
      category: 'pins',
      difficulty: 'beginner',
      motif: 'Absolute Pin'
    },
    {
      id: 'pin_03',
      FEN: 'r2qk2r/ppp1bppp/2n1pn2/3p2B1/3P4/2N2N2/PPP1PPPP/R2QKB1R w KQkq - 0 6',
      solution: 'Bxf6',
      category: 'pins',
      difficulty: 'intermediate',
      motif: 'Exploiting Pin'
    },
    // Skewers
    {
      id: 'skewer_01',
      FEN: '8/8/2k5/8/8/r7/8/7R w - - 0 1',
      solution: 'Rh6+',
      category: 'skewers',
      difficulty: 'beginner',
      motif: 'Rook Skewer'
    },
    {
      id: 'skewer_02',
      FEN: 'q7/8/2k5/8/5B2/8/8/3K4 w - - 0 1',
      solution: 'Be4+',
      category: 'skewers',
      difficulty: 'intermediate',
      motif: 'Bishop Skewer'
    },
    // Deflection
    {
      id: 'deflection',
      FEN: 'r4rk1/ppp1qppp/2n2n2/2bpp3/2B5/2NP1N2/PPP1QPPP/R1B2RK1 w - - 0 8',
      solution: 'Bxe6',
      category: 'deflection',
      difficulty: 'advanced',
      motif: 'Deflection'
    },
    // Decoy
    {
      id: 'decoy',
      FEN: '6k1/pp3ppp/8/8/4r3/1Q6/PP3PPP/6K1 w - - 0 1',
      solution: 'Qb8+',
      category: 'decoy',
      difficulty: 'intermediate',
      motif: 'Attraction/Decoy'
    },
    // Sacrifices
    {
      id: 'sacrifices',
      FEN: 'r1b2rk1/pp1nbppp/1q2p3/3pP3/3P4/3B1N2/PP3PPP/R1BQ1RK1 w - - 0 11',
      solution: 'Bxh7+',
      category: 'sacrifices',
      difficulty: 'advanced',
      motif: 'Greek Gift Sacrifice'
    }
  ];

  const filteredPuzzles = puzzles.filter(p => p.category === selectedCategory);
  const currentPuzzle = filteredPuzzles[activePuzzleIdx] || puzzles[0];

  const [puzzleFen, setPuzzleFen] = useState<string>(currentPuzzle.FEN);

  // Sync FEN and clear step/moves when puzzle changes
  useEffect(() => {
    setPuzzleFen(currentPuzzle.FEN);
    setCurrentStep(1);
    setLastMove(null);
  }, [currentPuzzle]);

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

  const handleBoardMove = (from: string, to: string, san: string) => {
    setLastMove({ from, to, san });
  };

  const activeHighlights = customHighlight 
    ? [{ square: customHighlight, color: 'rgba(239, 68, 68, 0.4)', class: 'border-2 border-red-500' }]
    : [];

  const isBoardInteractive = activeMode === 'practice' || (activeMode === 'guided' && (currentStep === 4 || currentStep === 5));

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
              { id: 'mate_in_3', label: 'Mate in 3' },
              { id: 'forks', label: 'Forks & Double Attacks' },
              { id: 'pins', label: 'Pins' },
              { id: 'skewers', label: 'Skewers' },
              { id: 'deflection', label: 'Deflection' },
              { id: 'decoy', label: 'Decoy' },
              { id: 'sacrifices', label: 'Sacrifices' }
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
            fen={puzzleFen} 
            interactive={isBoardInteractive} 
            highlights={activeHighlights}
            onMove={handleBoardMove}
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
            step={currentStep}
            setStep={setCurrentStep}
            lastMove={lastMove}
            onChangeFen={setPuzzleFen}
          />
        </div>
      </div>
    </div>
  );
};
export default Puzzles;
