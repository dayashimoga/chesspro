import React, { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';
import { stockfishService } from '../core/stockfishService';

interface CalculationExercise {
  id: string;
  title: string;
  fen: string;
  bestMove: string;
  bestLine: string[];
  theme: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  coachNotes: string;
  candidateMoves: Array<{ move: string; eval: string; quality: string }>;
}

const CALC_TOPICS = [
  { id: 'candidate-moves', title: 'Candidate Moves', icon: '🎯', desc: 'Learn to systematically generate candidate moves before calculating.' },
  { id: 'cct', title: 'Checks, Captures, Threats', icon: '⚡', desc: 'The CCT framework — always check forcing moves first.' },
  { id: 'visualization', title: 'Visualization', icon: '👁️', desc: 'See positions in your mind without moving pieces.' },
  { id: 'forcing-variations', title: 'Forcing Variations', icon: '🔗', desc: 'Calculate sequences where the opponent has limited responses.' },
  { id: 'tactical-trees', title: 'Tactical Trees', icon: '🌳', desc: 'Build decision trees branching at each opponent response.' },
  { id: 'strategic-calc', title: 'Strategic Calculation', icon: '📊', desc: 'Evaluate quiet positions and find the best plan.' },
];

const EXERCISES: CalculationExercise[] = [
  {
    id: 'calc-ex-001', title: 'Find the Forcing Sequence', theme: 'forcing-variations',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    bestMove: 'Qxf7#', bestLine: ['Qxf7#'],
    difficulty: 'beginner',
    coachNotes: 'Start with Checks! Qxf7# is checkmate. The queen is protected by the bishop on c4.',
    candidateMoves: [
      { move: 'Qxf7#', eval: '#1', quality: '🟢 Checkmate' },
      { move: 'Qf3', eval: '+0.5', quality: '🟡 Retreats — misses the win' },
      { move: 'Qe2', eval: '+0.3', quality: '🔴 Passive — terrible' }
    ]
  },
  {
    id: 'calc-ex-002', title: 'Calculate the Knight Fork', theme: 'candidate-moves',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    bestMove: 'Ng5', bestLine: ['Ng5', 'O-O', 'Nxf7'],
    difficulty: 'intermediate',
    coachNotes: 'Ng5 targets the weak f7 square. Combined with the bishop on c4, this creates a double attack. Calculate: after Ng5, what can Black do? If O-O, then Nxf7 forks queen and rook.',
    candidateMoves: [
      { move: 'Ng5', eval: '+0.8', quality: '🟢 Best — attacks f7 with dual threats' },
      { move: 'd3', eval: '+0.3', quality: '🟡 Solid but passive' },
      { move: 'O-O', eval: '+0.2', quality: '🟡 Safe development' }
    ]
  },
  {
    id: 'calc-ex-003', title: 'CCT Framework Practice', theme: 'cct',
    fen: 'r2q1rk1/pb3ppp/1p2pn2/8/3P4/3B1N2/PP3PPP/R1BQ1RK1 w - - 0 11',
    bestMove: 'Bxh7+', bestLine: ['Bxh7+', 'Kxh7', 'Ng5+', 'Kg8', 'Qh5'],
    difficulty: 'advanced',
    coachNotes: 'Apply CCT: Checks first! Bxh7+ is a check that sacrifices the bishop. After Kxh7, Ng5+ is another check. After Kg8, Qh5 threatens Qh7# and Qxf7+. This is the classic Greek Gift sacrifice.',
    candidateMoves: [
      { move: 'Bxh7+', eval: '+5.0', quality: '🟢 Brilliant — Greek Gift sacrifice' },
      { move: 'Ng5', eval: '+0.4', quality: '🟡 Good but premature without Bxh7+ first' },
      { move: 'Qe2', eval: '+0.2', quality: '🔴 Misses the tactical opportunity' }
    ]
  },
  {
    id: 'calc-ex-004', title: 'Visualization Challenge', theme: 'visualization',
    fen: '6rk/5Npp/8/8/8/8/6PP/6K1 w - - 0 1',
    bestMove: 'Nh6', bestLine: ['Nh6', 'Kh8', 'Qg8+', 'Rxg8', 'Nf7#'],
    difficulty: 'advanced',
    coachNotes: 'Visualize 5 moves ahead: Nh6 (threatening Qg8# which the rook blocks), Kh8 (only move), Qg8+! (queen sacrifice!), Rxg8, Nf7# (smothered mate). Can you see the final position in your mind?',
    candidateMoves: [
      { move: 'Nh6', eval: '#5', quality: '🟢 Forces smothered mate (Philidor Legacy)' },
      { move: 'Nd6', eval: '+2.0', quality: '🟡 Decent but misses forced mate' }
    ]
  },
  {
    id: 'calc-ex-005', title: 'Strategic Calculation', theme: 'strategic-calc',
    fen: 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/2PP4/2N1PN2/PP3PPP/R1BQ1RK1 w - - 0 8',
    bestMove: 'cxd5', bestLine: ['cxd5', 'exd5', 'Bd3'],
    difficulty: 'intermediate',
    coachNotes: 'Strategic calculation: cxd5 creates an isolated d-pawn for Black. Calculate: after exd5, White plays Bd3 targeting h7. The IQP on d5 becomes a permanent weakness. Plan: blockade d4, target d5, attack on the kingside.',
    candidateMoves: [
      { move: 'cxd5', eval: '+0.4', quality: '🟢 Best — creates IQP weakness' },
      { move: 'Be2', eval: '+0.1', quality: '🟡 Solid but doesn\'t create weaknesses' },
      { move: 'dxc5', eval: '0.0', quality: '🟡 Gives up the center' }
    ]
  },
  {
    id: 'calc-ex-006', title: 'Tactical Tree', theme: 'tactical-trees',
    fen: 'r2qk2r/ppp1bppp/2n5/3Np3/2B5/8/PPP2PPP/R1BQK2R w KQkq - 0 1',
    bestMove: 'Nf6+', bestLine: ['Nf6+', 'gxf6', 'Qd5'],
    difficulty: 'advanced',
    coachNotes: 'Build the tactical tree: Nf6+ (check!) — Branch A: gxf6, Qd5 (double attack on a8 and f7). Branch B: Kf8, Nxh7+ winning material. The key is seeing BOTH branches before committing.',
    candidateMoves: [
      { move: 'Nf6+', eval: '+3.0', quality: '🟢 Discovered check wins material in all lines' },
      { move: 'Bxf7+', eval: '+1.0', quality: '🟡 Good but less forcing' },
      { move: 'Ne3', eval: '0.0', quality: '🔴 Retreating knight — loses the initiative' }
    ]
  },
];

export const CalculationUniversity: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState('candidate-moves');
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [phase, setPhase] = useState<'study' | 'analyze' | 'calculate' | 'compare' | 'review'>('study');
  const [userMove, setUserMove] = useState<string>('');
  const [userReasoning, setUserReasoning] = useState<string>('');
  const [showSolution, setShowSolution] = useState(false);
  const [engineEval, setEngineEval] = useState<string>('...');
  const [boardFen, setBoardFen] = useState('8/8/8/8/8/8/8/8 w - - 0 1');
  const [feedback, setFeedback] = useState<string | null>(null);

  const addXP = useAppStore(s => s.addXP);
  const topicExercises = EXERCISES.filter(e => e.theme === activeTopic);
  const currentExercise = topicExercises[exerciseIdx] || EXERCISES[0];

  useEffect(() => {
    setBoardFen(currentExercise.fen);
    setPhase('study');
    setUserMove('');
    setUserReasoning('');
    setShowSolution(false);
    setFeedback(null);
    setEngineEval('...');
  }, [activeTopic, exerciseIdx]);

  useEffect(() => {
    if (phase === 'compare') {
      stockfishService.analyze(currentExercise.fen, 15).then(result => {
        if (result.lines.length > 0) {
          setEngineEval(result.lines[0].displayScore);
        }
      }).catch(() => setEngineEval('N/A'));
    }
  }, [phase]);

  const handleBoardMove = (from: string, to: string, san: string) => {
    setUserMove(san);
    const isCorrect = san.replace(/[+#]/g, '').toLowerCase() === currentExercise.bestMove.replace(/[+#]/g, '').toLowerCase();
    if (isCorrect) {
      setFeedback('🟢 Correct! That\'s the best move.');
      addXP(15);
    } else {
      setFeedback(`🟡 You played ${san}. The best move was ${currentExercise.bestMove}. Let's review why.`);
    }
    setPhase('compare');
    setShowSolution(true);
  };

  const handleNextExercise = () => {
    if (exerciseIdx < topicExercises.length - 1) {
      setExerciseIdx(exerciseIdx + 1);
    } else {
      setExerciseIdx(0);
      const topicIds = CALC_TOPICS.map(t => t.id);
      const currentIdx = topicIds.indexOf(activeTopic);
      if (currentIdx < topicIds.length - 1) {
        setActiveTopic(topicIds[currentIdx + 1]);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Calculation University</span>
          <h2 className="text-2xl font-black text-white font-serif">Train Your Calculation</h2>
          <p className="text-xs text-slate-400 mt-1">Learn HOW to calculate — not just WHAT to play</p>
        </div>
      </div>

      {/* Topic Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {CALC_TOPICS.map(topic => (
          <button
            key={topic.id}
            onClick={() => { setActiveTopic(topic.id); setExerciseIdx(0); }}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTopic === topic.id
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400'
            }`}
          >
            <span>{topic.icon}</span>
            <span>{topic.title}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Theory + Candidate Moves */}
        <div className="flex flex-col gap-4">
          {/* Topic Theory */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#0c0c14]">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5 mb-3">
              <span className="text-2xl">{CALC_TOPICS.find(t => t.id === activeTopic)?.icon}</span>
              <h3 className="font-bold text-white text-sm">{CALC_TOPICS.find(t => t.id === activeTopic)?.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {CALC_TOPICS.find(t => t.id === activeTopic)?.desc}
            </p>
          </div>

          {/* Candidate Moves Panel */}
          {showSolution && (
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#0c0c14] animate-fadeIn">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-3">Candidate Moves Analysis</h4>
              <div className="flex flex-col gap-2">
                {currentExercise.candidateMoves.map((cm, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border text-xs ${
                    cm.move === currentExercise.bestMove
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-white/5 border-white/5'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold font-mono text-white">{cm.move}</span>
                      <span className="font-mono text-slate-400">{cm.eval}</span>
                    </div>
                    <span className="text-slate-400">{cm.quality}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engine Comparison */}
          {phase === 'compare' && (
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#0c0c14] animate-fadeIn">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-3">🔬 Engine Comparison</h4>
              <div className="text-xs text-slate-300 space-y-2">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>Your move:</span>
                  <span className="font-mono font-bold text-amber-400">{userMove || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>Best move:</span>
                  <span className="font-mono font-bold text-emerald-400">{currentExercise.bestMove}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>Engine eval:</span>
                  <span className="font-mono text-sky-400">{engineEval}</span>
                </div>
                <div className="flex justify-between">
                  <span>Best line:</span>
                  <span className="font-mono text-slate-400">{currentExercise.bestLine.join(' ')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center: Interactive Board */}
        <div className="flex flex-col gap-4 items-center justify-start">
          <div className="bg-[#0c0c14]/50 rounded-3xl p-6 border border-white/5 w-full flex flex-col items-center">
            <Board
              fen={boardFen}
              interactive={phase === 'calculate'}
              onMove={handleBoardMove}
            />
            <div className="text-[11px] text-slate-500 mt-3 text-center font-mono">
              <span className="text-amber-400 font-bold">{currentExercise.difficulty.toUpperCase()}</span>
              <span className="mx-2">•</span>
              <span>{currentExercise.title}</span>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`w-full p-3 rounded-xl border text-xs font-bold text-center animate-fadeIn ${
              feedback.startsWith('🟢') 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              {feedback}
            </div>
          )}
        </div>

        {/* Right: Workflow Steps */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#0c0c14]">
            <h3 className="font-bold text-sm text-white mb-4">Calculation Workflow</h3>

            {/* Phase indicators */}
            <div className="flex gap-1 mb-4">
              {['study', 'analyze', 'calculate', 'compare', 'review'].map((p, i) => (
                <div key={p} className={`h-1 flex-1 rounded-full transition-all ${
                  ['study','analyze','calculate','compare','review'].indexOf(phase) >= i
                    ? 'bg-emerald-500' : 'bg-white/10'
                }`} />
              ))}
            </div>

            {phase === 'study' && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">1. Study the Position</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Examine the position carefully. Identify: material balance, king safety, piece activity, pawn structure, and threats.
                </p>
                <div className="bg-white/5 rounded-lg p-3 text-xs text-slate-400">
                  <strong className="text-white block mb-1">Coach Tip:</strong>
                  {currentExercise.coachNotes.split('.')[0]}.
                </div>
                <button
                  onClick={() => setPhase('analyze')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-bg-primary font-bold py-2 rounded-xl text-xs transition-all"
                >
                  I've studied the position →
                </button>
              </div>
            )}

            {phase === 'analyze' && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">2. Generate Candidate Moves</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Apply the CCT framework: list all <strong>Checks</strong>, then <strong>Captures</strong>, then <strong>Threats</strong>. Write your top 3 candidate moves mentally.
                </p>
                <textarea
                  placeholder="List your candidate moves and reasoning (e.g., '1. Bxh7+ — sacrifice to open the king. 2. Ng5 — attacks f7...')"
                  value={userReasoning}
                  onChange={e => setUserReasoning(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white resize-none h-24 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  onClick={() => setPhase('calculate')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-bg-primary font-bold py-2 rounded-xl text-xs transition-all"
                >
                  Ready to play my move →
                </button>
              </div>
            )}

            {phase === 'calculate' && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">3. Play Your Best Move</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Click on the board to play your calculated best move. The board is now interactive.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-400">
                  ⚠️ Think before you move! Once you play, the system will compare with the engine.
                </div>
              </div>
            )}

            {phase === 'compare' && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">4. Compare & Learn</h4>
                <div className="bg-[#06060b] border border-white/5 p-3 rounded-xl text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block mb-1">📖 Coach Analysis:</strong>
                  {currentExercise.coachNotes}
                </div>
                <button
                  onClick={() => setPhase('review')}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-2 rounded-xl text-xs transition-all"
                >
                  Review Complete →
                </button>
              </div>
            )}

            {phase === 'review' && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">5. Summary</h4>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-xs text-emerald-400">
                  🏆 Exercise complete! You practiced the {CALC_TOPICS.find(t => t.id === activeTopic)?.title} technique.
                </div>
                <button
                  onClick={handleNextExercise}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-bg-primary font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-glow"
                >
                  Next Exercise →
                </button>
              </div>
            )}
          </div>

          {/* Exercise navigation */}
          <div className="flex justify-between items-center text-xs text-slate-500">
            <button
              onClick={() => setExerciseIdx(Math.max(0, exerciseIdx - 1))}
              disabled={exerciseIdx === 0}
              className="bg-white/5 border border-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg disabled:opacity-40 font-bold"
            >
              ◀ Prev
            </button>
            <span className="font-mono">
              {exerciseIdx + 1} / {topicExercises.length || EXERCISES.length}
            </span>
            <button
              onClick={() => setExerciseIdx(Math.min((topicExercises.length || EXERCISES.length) - 1, exerciseIdx + 1))}
              disabled={exerciseIdx >= (topicExercises.length || EXERCISES.length) - 1}
              className="bg-white/5 border border-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg disabled:opacity-40 font-bold"
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationUniversity;
