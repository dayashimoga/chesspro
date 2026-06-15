import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Board } from '../components/Board';
import { GuidedSolverPanel } from '../components/GuidedSolverPanel';
import { Puzzle, queryPuzzles, ALL_PUZZLES } from '../content/puzzle-db';
import { useAppStore } from '../store/useAppStore';

const TACTICAL_THEMES = [
  { id: 'forks', label: 'Forks', icon: '⚔️', desc: 'Attack two pieces simultaneously with a single move.' },
  { id: 'pins', label: 'Pins', desc: 'Restrain an enemy piece to protect a higher value piece.' },
  { id: 'skewers', label: 'Skewers', desc: 'Attack a valuable piece, forcing it to move and expose a piece behind it.' },
  { id: 'double_attacks', label: 'Double Attacks', desc: 'Create multiple threats at once, overloading defensive responses.' },
  { id: 'discovered_attacks', label: 'Discovered Attacks', desc: 'Move a piece to unleash an attack from another piece behind it.' },
  { id: 'discovered_checks', label: 'Discovered Checks', desc: 'Uncover a check by moving a blocking piece.' },
  { id: 'double_checks', label: 'Double Checks', desc: 'Check the king with two pieces simultaneously. King must move!' },
  { id: 'deflection', label: 'Deflection', desc: 'Distract a defending piece away from its critical protection square.' },
  { id: 'decoy', label: 'Decoy', desc: 'Lure an opponent piece to a square where it becomes vulnerable.' },
  { id: 'attraction', label: 'Attraction', desc: 'Attract a valuable target (often the king) into a tactical net.' },
  { id: 'clearance', label: 'Clearance', desc: 'Vacate a square or diagonal for your attacking pieces.' },
  { id: 'interference', label: 'Interference', desc: 'Block the line of sight between two defending pieces.' },
  { id: 'overloading', label: 'Overloading', desc: 'Give a defending piece too many tasks so it fails one.' },
  { id: 'x_ray', label: 'X-Ray Attacks', desc: 'Indirectly attack or defend a square through intervening pieces.' },
  { id: 'zwischenzug', label: 'Zwischenzug (In-Between)', desc: 'Play an unexpected intermediate move to seize the initiative.' },
  { id: 'mating_nets', label: 'Mating Nets', desc: 'Trap the opponent king in a cage of checkmate vectors.' },
  { id: 'back_rank', label: 'Back Rank Mates', desc: 'Deliver checkmate on the 8th or 1st rank behind blocking pawns.' },
  { id: 'smothered_mates', label: 'Smothered Mates', desc: 'Deliver mate using a knight against a king boxed in by its own pieces.' },
  { id: 'sacrifices', label: 'Sacrifices', desc: 'Give up material to force a winning combination or checkmate.' }
];

export const TacticalUniversity: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<string>('forks');
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [puzzleIdx, setPuzzleIdx] = useState<number>(0);
  const [boardFen, setBoardFen] = useState<string>('8/8/8/8/8/8/8/8 w - - 0 1');
  const [customHighlight, setCustomHighlight] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  const [lastMove, setLastMove] = useState<{ from: string; to: string; san: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const addXP = useAppStore(state => state.addXP);
  const updateRating = useAppStore(state => state.updateRating);

  const currentThemeInfo = TACTICAL_THEMES.find(t => t.id === activeTheme) || TACTICAL_THEMES[0];
  const currentPuzzle: Puzzle = puzzles[puzzleIdx] || ALL_PUZZLES[0];

  // Fetch puzzles for selected theme from Worker API with local fallback
  useEffect(() => {
    const fetchThemePuzzles = async () => {
      try {
        const res = await fetch(`http://localhost:8787/api/puzzles?category=${activeTheme}&limit=100`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setPuzzles(data);
            setPuzzleIdx(0);
            return;
          }
        }
      } catch {
        // Fallback
      }
      const local = queryPuzzles({ category: activeTheme });
      setPuzzles(local.length > 0 ? local : [ALL_PUZZLES[0]]);
      setPuzzleIdx(0);
    };
    fetchThemePuzzles();
  }, [activeTheme]);

  // Sync board FEN
  useEffect(() => {
    if (currentPuzzle) {
      setBoardFen(currentPuzzle.fen);
      setStep(1);
      setLastMove(null);
      setCustomHighlight(null);
    }
  }, [currentPuzzle]);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSolved = () => {
    addXP(15);
    updateRating(10);
    showToastMsg('🎉 Tactical Lab Exercise Solved! +15 XP');
    if (puzzleIdx < puzzles.length - 1) {
      setPuzzleIdx(puzzleIdx + 1);
    } else {
      setPuzzleIdx(0);
    }
  };

  const handleBoardMove = (from: string, to: string, san: string) => {
    setLastMove({ from, to, san });
  };

  const isInteractive = step === 4 || step === 5;

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Tactical Mastery University</span>
          <h2 className="text-2xl font-black text-white font-serif">Interactive Tactical Labs</h2>
        </div>

        {/* Dynamic theme selector dropdown */}
        <div className="flex gap-2">
          <select
            value={activeTheme}
            onChange={e => setActiveTheme(e.target.value)}
            className="bg-bg-secondary border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {TACTICAL_THEMES.map(theme => (
              <option key={theme.id} value={theme.id}>
                {theme.label} Lab
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Theme List Sidebar */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tactical Labs</span>
          <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
            {TACTICAL_THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => setActiveTheme(theme.id)}
                className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                  activeTheme === theme.id
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-0.5">
                  <span>🎯</span>
                  <span>{theme.label}</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">{theme.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Interactive Board */}
        <div className="flex flex-col gap-4 items-center justify-center bg-[#0c0c14]/50 rounded-3xl p-6 border border-white/5">
          <Board
            fen={boardFen}
            interactive={isInteractive}
            onMove={handleBoardMove}
            highlights={customHighlight ? [{ square: customHighlight, color: 'rgba(239, 68, 68, 0.4)' }] : []}
          />
          <div className="text-[11px] text-slate-500 mt-2 font-mono text-center">
            <div>
              Active Lab: <span className="text-emerald-400 uppercase font-bold">{currentThemeInfo.label}</span>
            </div>
            <div className="text-slate-400 mt-1">
              Exercise {puzzleIdx + 1} of {puzzles.length} • Difficulty: <span className="text-amber-500 uppercase font-semibold">{currentPuzzle?.difficulty || 'N/A'}</span>
            </div>
            {/* Nav controls */}
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={() => setPuzzleIdx(prev => Math.max(0, prev - 1))}
                disabled={puzzleIdx === 0}
                className="bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-bold px-3 py-1 rounded disabled:opacity-40"
              >
                ◀ Prev
              </button>
              <button
                onClick={() => setPuzzleIdx(prev => Math.min(puzzles.length - 1, prev + 1))}
                disabled={puzzleIdx === puzzles.length - 1}
                className="bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-bold px-3 py-1 rounded disabled:opacity-40"
              >
                Next ▶
              </button>
            </div>
          </div>
        </div>

        {/* Right: 8-Step Guided Solver */}
        <div className="flex justify-center">
          {currentPuzzle && (
            <GuidedSolverPanel
              puzzle={currentPuzzle}
              onSolved={handleSolved}
              onSelectHighlight={setCustomHighlight}
              step={step}
              setStep={setStep}
              lastMove={lastMove}
              onChangeFen={setBoardFen}
            />
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500/90 border border-emerald-400/30 px-5 py-3 rounded-xl shadow-2xl text-xs font-bold animate-fadeIn text-white">
          {toast}
        </div>
      )}
    </div>
  );
};

export default TacticalUniversity;
