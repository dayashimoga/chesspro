import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Board } from '../components/Board';
import { GuidedSolverPanel } from '../components/GuidedSolverPanel';
import { Puzzle, queryPuzzles, ALL_PUZZLES } from '../content/puzzle-db';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';

interface TacticalTheme {
  id: string;
  label: string;
  icon: string;
  desc: string;
  theory: string;
  exampleFen: string;
  exampleTitle: string;
  exampleDesc: string;
}

const TACTICAL_THEMES: TacticalTheme[] = [
  {
    id: 'forks',
    label: 'Forks',
    icon: '⚔️',
    desc: 'Attack two pieces simultaneously with a single move.',
    theory: 'A fork is a tactical weapon where a single piece attacks two or more opponent pieces simultaneously. Knights are famous for executing forks due to their unique L-shaped jump, but queens, rooks, bishops, and even pawns can deliver devastating forks.',
    exampleFen: '8/3k4/8/3N4/8/8/1K6/4r3 w - - 0 1',
    exampleTitle: 'King & Rook Knight Fork',
    exampleDesc: 'White plays Nf6+, attacking both the king on d7 and the rook on e1.'
  },
  {
    id: 'pins',
    label: 'Pins',
    icon: '📌',
    desc: 'Restrain an enemy piece to protect a higher value piece.',
    theory: 'A pin restricts the movement of an defending piece because moving it would expose a more valuable piece (such as the Queen or King) to capture. An absolute pin occurs when the piece behind is the King, making it illegal to move the pinned piece.',
    exampleFen: 'rn1qkb1r/ppp2ppp/4pn2/3p4/3P2b1/2N2N2/PPP1PPPP/R1BQKB1R w KQkq - 2 4',
    exampleTitle: 'Bishop Pin on Knight',
    exampleDesc: 'White\'s bishop pins Black\'s f6 knight to the d8 queen.'
  },
  {
    id: 'skewers',
    label: 'Skewers',
    icon: '🍢',
    desc: 'Attack a valuable piece, forcing it to move and expose a piece behind it.',
    theory: 'A skewer is often described as a reversed pin. You attack a highly valuable piece (e.g. King or Queen) along a line. When that piece moves to escape, it exposes a less valuable piece behind it to capture.',
    exampleFen: '8/8/2k5/8/8/r7/8/7R w - - 0 1',
    exampleTitle: 'Rook Skewer',
    exampleDesc: 'Rh6+ checks the king on c6, forcing it to move and expose the rook on a3.'
  },
  {
    id: 'double_attacks',
    label: 'Double Attacks',
    icon: '🎯',
    desc: 'Create multiple threats at once, overloading defensive responses.',
    theory: 'Double attacks occur when a move creates two separate tactical threats at the same time. This differs from a fork because the threats do not have to be direct piece attacks — they can include checkmate threats, promotion threats, or pawn storms.',
    exampleFen: 'rnbqkb1r/ppp1pppp/5n2/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 2',
    exampleTitle: 'Double Attack Center',
    exampleDesc: 'White\'s c4 pawn attacks d5 while opening lines for the Queen.'
  },
  {
    id: 'discovered_attacks',
    label: 'Discovered Attacks',
    icon: '👁️',
    desc: 'Move a piece to unleash an attack from another piece behind it.',
    theory: 'Discovered attacks occur when you move a piece out of the way, opening up a line of sight for a long-range piece (bishop, rook, or queen) to attack an opponent\'s target.',
    exampleFen: 'r2qkb1r/ppp2ppp/2n1pn2/3p4/3P2b1/4PN2/PPP1BPPP/RNBQK2R w KQkq - 0 5',
    exampleTitle: 'Discovered Attack on Bishop',
    exampleDesc: 'Moving the knight from f3 discovers the bishop\'s attack on g4.'
  },
  {
    id: 'deflection',
    label: 'Deflection',
    icon: '🪃',
    desc: 'Distract a defending piece away from its critical protection square.',
    theory: 'Deflection forces an opponent\'s defending piece to move away from a square or line it is protecting, allowing you to penetrate their defenses or win material.',
    exampleFen: '6k1/5ppp/8/8/8/8/r4PPP/1R3RK1 w - - 0 1',
    exampleTitle: 'Deflection Back Rank Mate',
    exampleDesc: 'White plays Rb8+, forcing the black rook to block, deflecting it from defense.'
  },
  {
    id: 'sacrifices',
    label: 'Sacrifices',
    icon: '💎',
    desc: 'Give up material to force a winning combination or checkmate.',
    theory: 'A sacrifice involves deliberately giving up material (pawns, minor pieces, or major pieces) to achieve a concrete tactical advantage, such as delivering checkmate, winning more material later, or achieving a winning positional setup.',
    exampleFen: 'r1b2rk1/pp1nbppp/1q2p3/3pP3/3P4/3B1N2/PP3PPP/R1BQ1RK1 w - - 0 11',
    exampleTitle: 'Greek Gift Sacrifice',
    exampleDesc: 'Bxh7+ sacrifices the bishop to expose the black king to a devastating attack.'
  }
];

export const TacticalUniversity: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<string>('forks');
  const [activeTab, setActiveTab] = useState<'theory' | 'examples' | 'practice' | 'mastery' | 'review'>('theory');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  
  // Puzzles state
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [puzzleIdx, setPuzzleIdx] = useState<number>(0);
  const [boardFen, setBoardFen] = useState<string>('8/8/8/8/8/8/8/8 w - - 0 1');
  const [customHighlight, setCustomHighlight] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  const [lastMove, setLastMove] = useState<{ from: string; to: string; san: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  
  // Progress & Stats tracking
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  
  // Mastery mode specific states
  const [masteryChess, setMasteryChess] = useState<Chess | null>(null);
  const [masteryMoveIdx, setMasteryMoveIdx] = useState<number>(0);
  const [masterySuccess, setMasterySuccess] = useState<boolean>(false);
  const [masteryErrors, setMasteryErrors] = useState<number>(0);

  const addXP = useAppStore(state => state.addXP);
  const updateRating = useAppStore(state => state.updateRating);

  const currentThemeInfo = TACTICAL_THEMES.find(t => t.id === activeTheme) || TACTICAL_THEMES[0];

  // Load progress from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('chessos_solved_puzzles');
      if (stored) {
        setSolvedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save puzzle as solved
  const markPuzzleSolved = (id: string) => {
    const updated = [...solvedIds];
    if (!updated.includes(id)) {
      updated.push(id);
      setSolvedIds(updated);
      try {
        localStorage.setItem('chessos_solved_puzzles', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Fetch puzzles for selected theme
  useEffect(() => {
    const fetchThemePuzzles = async () => {
      let local = queryPuzzles({ category: activeTheme });
      if (local.length === 0) {
        // Fallback to all puzzles if category has no direct puzzles
        local = ALL_PUZZLES.filter(p => p.category === activeTheme || p.theme.toLowerCase().includes(activeTheme));
      }
      if (local.length === 0) {
        local = [ALL_PUZZLES[0]];
      }
      
      // Apply difficulty filter
      if (difficultyFilter !== 'all') {
        const filtered = local.filter(p => p.difficulty === difficultyFilter);
        setPuzzles(filtered.length > 0 ? filtered : local);
      } else {
        setPuzzles(local);
      }
      setPuzzleIdx(0);
    };
    fetchThemePuzzles();
  }, [activeTheme, difficultyFilter]);

  const currentPuzzle: Puzzle = puzzles[puzzleIdx] || ALL_PUZZLES[0];

  // Sync board FEN & reset state on tab or puzzle change
  useEffect(() => {
    if (activeTab === 'theory') {
      setBoardFen(currentThemeInfo.exampleFen);
    } else if (activeTab === 'examples') {
      setBoardFen(currentThemeInfo.exampleFen);
    } else if (activeTab === 'practice') {
      if (currentPuzzle) {
        setBoardFen(currentPuzzle.fen);
        setStep(1);
        setLastMove(null);
        setCustomHighlight(null);
      }
    } else if (activeTab === 'mastery') {
      if (currentPuzzle) {
        setBoardFen(currentPuzzle.fen);
        setMasteryChess(new Chess(currentPuzzle.fen));
        setMasteryMoveIdx(0);
        setMasterySuccess(false);
        setMasteryErrors(0);
      }
    }
  }, [activeTab, currentPuzzle, activeTheme]);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSolved = () => {
    if (currentPuzzle) {
      markPuzzleSolved(currentPuzzle.id);
    }
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
    if (activeTab === 'practice') {
      setLastMove({ from, to, san });
    } else if (activeTab === 'mastery' && masteryChess && !masterySuccess) {
      const cleanSan = (s: string) => s.replace(/[+#x=]/g, '').toLowerCase();
      const expectedMove = currentPuzzle.solution[masteryMoveIdx];
      
      try {
        const gameCopy = new Chess(masteryChess.fen());
        const moveRes = gameCopy.move(san);
        
        // Verify move correctness
        if (cleanSan(moveRes.san) === cleanSan(expectedMove)) {
          masteryChess.move(san);
          
          const nextIdx = masteryMoveIdx + 1;
          if (nextIdx >= currentPuzzle.solution.length) {
            // Solved!
            setBoardFen(masteryChess.fen());
            setMasterySuccess(true);
            markPuzzleSolved(currentPuzzle.id);
            addXP(20);
            updateRating(12);
            showToastMsg('🏆 Mastery Check Complete! +20 XP');
          } else {
            // Play opponent response automatically
            const oppMove = currentPuzzle.solution[nextIdx];
            masteryChess.move(oppMove);
            setBoardFen(masteryChess.fen());
            setMasteryMoveIdx(nextIdx + 1);
            
            if (nextIdx + 1 >= currentPuzzle.solution.length) {
              setMasterySuccess(true);
              markPuzzleSolved(currentPuzzle.id);
              addXP(20);
              updateRating(12);
              showToastMsg('🏆 Mastery Check Complete! +20 XP');
            }
          }
        } else {
          setMasteryErrors(prev => prev + 1);
          showToastMsg('❌ Incorrect move. Re-calculate and try again!');
          // Reset to start
          setTimeout(() => {
            setBoardFen(currentPuzzle.fen);
            setMasteryChess(new Chess(currentPuzzle.fen));
            setMasteryMoveIdx(0);
          }, 1000);
        }
      } catch (e) {
        // Illegal move locally
        showToastMsg('Illegal move. Drag pieces to legal squares.');
      }
    }
  };

  // Progress metrics
  const themePuzzles = queryPuzzles({ category: activeTheme });
  const themeSolvedCount = themePuzzles.filter(p => solvedIds.includes(p.id)).length;
  const progressPercent = themePuzzles.length > 0 ? Math.round((themeSolvedCount / themePuzzles.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Tactical Mastery University</span>
          <h2 className="text-2xl font-black text-white font-serif">Interactive Tactical Labs</h2>
        </div>

        {/* Dynamic theme selector dropdown & Difficulty */}
        <div className="flex gap-2 items-center">
          <span className="text-xs font-semibold text-slate-400">Theme:</span>
          <select
            value={activeTheme}
            onChange={e => setActiveTheme(e.target.value)}
            className="bg-bg-secondary border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {TACTICAL_THEMES.map(theme => (
              <option key={theme.id} value={theme.id}>
                {theme.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Curriculum Tabs */}
      <div className="flex border-b border-white/5 gap-1">
        {(['theory', 'examples', 'practice', 'mastery', 'review'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === tab
                ? 'border-emerald-500 text-white bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Theme List & Progress Sidebar */}
        <div className="flex flex-col gap-5">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progress Details</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">{currentThemeInfo.label} Lab</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">{themeSolvedCount} / {themePuzzles.length} Solved</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Complete theory and examples, then solve both Guided Practice and Mastery Checks to master this tactical concept.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Other Tactical Labs</span>
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            {TACTICAL_THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => {
                  setActiveTheme(theme.id);
                  setActiveTab('theory');
                }}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  activeTheme === theme.id
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-0.5">
                  <span>{theme.icon}</span>
                  <span>{theme.label}</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">{theme.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Interactive Board */}
        <Card className="flex flex-col gap-4 items-center justify-center p-6" hoverEffect={false}>
          <Board
            fen={boardFen}
            interactive={activeTab === 'practice' || activeTab === 'mastery'}
            onMove={handleBoardMove}
            highlights={customHighlight ? [{ square: customHighlight, color: 'rgba(239, 68, 68, 0.4)' }] : []}
          />
          <div className="text-[11px] text-slate-500 mt-2 font-mono text-center">
            <div>
              Active Concept: <span className="text-emerald-400 uppercase font-bold">{currentThemeInfo.label}</span>
            </div>
            {activeTab === 'practice' || activeTab === 'mastery' ? (
              <div className="text-slate-400 mt-1">
                Exercise {puzzleIdx + 1} of {puzzles.length} • Difficulty: <span className="text-amber-500 uppercase font-semibold">{currentPuzzle?.difficulty || 'N/A'}</span>
              </div>
            ) : (
              <div className="text-slate-400 mt-1">Concept Demonstration</div>
            )}
            
            {(activeTab === 'practice' || activeTab === 'mastery') && (
              /* Nav controls */
              <div className="flex justify-center gap-2 mt-3">
                <Button
                  onClick={() => setPuzzleIdx(prev => Math.max(0, prev - 1))}
                  disabled={puzzleIdx === 0}
                  variant="secondary"
                  size="sm"
                >
                  ◀ Prev
                </Button>
                <Button
                  onClick={() => setPuzzleIdx(prev => Math.min(puzzles.length - 1, prev + 1))}
                  disabled={puzzleIdx === puzzles.length - 1}
                  variant="secondary"
                  size="sm"
                >
                  Next ▶
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Right: Dynamic curriculum step panels */}
        <div className="flex justify-center w-full">
          {activeTab === 'theory' && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 w-full text-slate-200 border border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📖</span> {currentThemeInfo.label} Theory
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentThemeInfo.theory}
              </p>
              
              <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{currentThemeInfo.exampleTitle}</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {currentThemeInfo.exampleDesc}
                </p>
              </div>

              <Button 
                onClick={() => setActiveTab('examples')} 
                variant="primary" 
                className="mt-4 font-bold"
              >
                Go to Demonstration →
              </Button>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 w-full text-slate-200 border border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>👁️</span> Motif Demonstration
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Observe the core tactic in action. Study the geometric alignment of the pieces and the forced moves that make it work.
              </p>

              <div className="bg-[#0c0c14] border border-white/5 p-4 rounded-xl flex flex-col gap-2 text-xs">
                <span className="font-bold text-amber-400">{currentThemeInfo.exampleTitle}</span>
                <p className="text-slate-400 leading-relaxed">{currentThemeInfo.exampleDesc}</p>
                <div className="text-[10px] text-slate-500 font-mono mt-1">FEN: {currentThemeInfo.exampleFen}</div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => {
                    // Flash correct highlight
                    setCustomHighlight(currentThemeInfo.id === 'forks' ? 'f6' : 'g5');
                    setTimeout(() => setCustomHighlight(null), 1500);
                  }}
                  variant="secondary"
                  className="flex-1 font-bold text-xs"
                >
                  Highlight Key Square
                </Button>
                <Button 
                  onClick={() => setActiveTab('practice')} 
                  variant="primary"
                  className="flex-1 font-bold text-xs"
                >
                  Start Practice →
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'practice' && currentPuzzle && (
            <div className="flex flex-col gap-4 w-full">
              {/* Difficulty filter in practice */}
              <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">Filter Difficulty:</span>
                <select
                  value={difficultyFilter}
                  onChange={e => setDifficultyFilter(e.target.value)}
                  className="bg-bg-secondary border border-white/10 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none"
                >
                  <option value="all">All levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <GuidedSolverPanel
                puzzle={currentPuzzle}
                onSolved={handleSolved}
                onSelectHighlight={setCustomHighlight}
                step={step}
                setStep={setStep}
                lastMove={lastMove}
                onChangeFen={setBoardFen}
              />
            </div>
          )}

          {activeTab === 'mastery' && currentPuzzle && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 w-full text-slate-200 border border-white/5">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Unassisted Mode</span>
                  <h3 className="text-base font-bold text-white">Mastery Check</h3>
                </div>
                <div className="bg-rose-500/10 text-rose-400 font-mono text-xs px-2.5 py-0.5 rounded-full border border-rose-500/20">
                  Solve Directly
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Solve the tactical position unassisted. Drag and play the correct solution sequence directly on the board. No hints, no intermediate coach questions.
              </p>

              {masterySuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex flex-col gap-2.5 text-center items-center">
                  <span className="text-xl">🏆</span>
                  <span className="text-xs font-bold text-emerald-400">Mastery Complete!</span>
                  <p className="text-[11px] text-slate-300">You successfully found the winning sequence on your own.</p>
                  <Button 
                    onClick={() => {
                      if (puzzleIdx < puzzles.length - 1) {
                        setPuzzleIdx(puzzleIdx + 1);
                      } else {
                        setPuzzleIdx(0);
                      }
                      setActiveTab('mastery');
                    }}
                    variant="primary"
                    size="sm"
                    className="font-bold text-xs mt-1"
                  >
                    Next Mastery Challenge
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="bg-[#0c0c14] border border-white/5 p-4 rounded-xl text-xs flex flex-col gap-1 text-slate-400">
                    <div>Moves Played: <span className="text-white font-mono">{Math.floor(masteryMoveIdx / 2)} / {Math.floor(currentPuzzle.solution.length / 2) + 1}</span></div>
                    <div>Errors Made: <span className="text-rose-500 font-bold font-mono">{masteryErrors}</span></div>
                  </div>
                  <Button 
                    onClick={() => {
                      setBoardFen(currentPuzzle.fen);
                      setMasteryChess(new Chess(currentPuzzle.fen));
                      setMasteryMoveIdx(0);
                      setMasteryErrors(0);
                      showToastMsg('Resetting mastery board.');
                    }}
                    variant="secondary"
                    className="font-bold text-xs"
                  >
                    Reset Position
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'review' && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 w-full text-slate-200 border border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📋</span> Lab Review & Coach Notes
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Review the tactical notes and key pointers for this lab. Retain these concepts in your memory database.
              </p>

              <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                {themePuzzles.map((p, idx) => (
                  <div key={p.id} className="bg-[#0c0c14] border border-white/5 p-3 rounded-xl flex flex-col gap-1 text-xs">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase border-b border-white/5 pb-1 mb-1">
                      <span>Exercise #{idx + 1}</span>
                      <span className={solvedIds.includes(p.id) ? "text-emerald-400" : "text-slate-500"}>
                        {solvedIds.includes(p.id) ? "✓ Mastered" : "○ Unsolved"}
                      </span>
                    </div>
                    <p className="text-slate-300 italic">"{p.coachNotes}"</p>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">Solution: {p.solution.join(' → ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default TacticalUniversity;
