import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Storage } from '../core/storage';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Board } from '../components/Board';

interface MistakeCase {
  id: string;
  name: string;
  blunderMove: string;
  classification: string;
  fen: string;
  explanation: string;
  correctAlternative: string;
  highlightSquare: string;
}

const MISTAKE_CASES: MistakeCase[] = [
  {
    id: 'fried-liver',
    name: 'Fried Liver Blunder',
    blunderMove: '5...Nxd5?',
    classification: '🔴 Blunder (-2.4)',
    fen: 'r1bqkb1r/ppp2ppp/2n5/3np1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 0 6',
    explanation: 'Capturing the pawn on d5 with the knight is a database blunder. White has the devastating sacrifice 6.Nxf7! drawing the king into the open center, where it faces a mating attack after 6...Kxf7 7.Qf3+ Ke6 8.Nc3.',
    correctAlternative: '5...Na5! (attacking the c4 bishop, driving it away)',
    highlightSquare: 'd5'
  },
  {
    id: 'scholars-mate',
    name: 'Scholar\'s Mate Blunder',
    blunderMove: '3...Nf6?',
    classification: '⛔ Mate in 1 Blunder',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    explanation: 'Developing the knight to f6 completely ignores White\'s threat on f7. White delivers immediate checkmate on the next move with 4.Qxf7#.',
    correctAlternative: '3...g6! (blocking the queen\'s attack path) or 3...Qe7!',
    highlightSquare: 'f7'
  },
  {
    id: 'back-rank-trap',
    name: 'Greedy Back Rank Blunder',
    blunderMove: '12...Qxb2?',
    classification: '🔴 Blunder (-4.8)',
    fen: 'r5k1/pp3ppp/2n5/8/8/4q3/PPQ2PPP/2R3K1 b - - 0 13',
    explanation: 'Black captures a free-looking pawn but abandons the back rank defense. White recaptures or plays Rc8+ leading to forced back rank checkmate.',
    correctAlternative: '12...Re8 (maintaining back rank control and safety)',
    highlightSquare: 'c8'
  }
];

export const AICoachDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppStore(state => state.user);
  const completedLessons = useAppStore(state => state.completedLessons);

  // Analyze actual user weaknesses & strengths
  const analysis = Storage.analyzeWeaknesses();
  const progress = Storage.getProgress();

  // Edge Workers Statistics state
  const [stats, setStats] = useState({
    tacticalAccuracy: 0.65,
    openingKnowledge: 0.55,
    endgameKnowledge: 0.45,
    calculationDepth: 3,
    strategicUnderstanding: 0.40,
    puzzleAccuracy: 0.70,
    timeUsage: 15
  });

  const [planTab, setPlanTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [activeMistakeIdx, setActiveMistakeIdx] = useState<number>(0);
  const [mistakeBoardFen, setMistakeBoardFen] = useState<string>(MISTAKE_CASES[0].fen);

  const activeMistake = MISTAKE_CASES[activeMistakeIdx];

  useEffect(() => {
    setMistakeBoardFen(activeMistake.fen);
  }, [activeMistakeIdx]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('chessos_token') || `token_${user.id}`;
        const res = await fetch('http://localhost:8787/api/progress/statistics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // Fallback
      }
    };
    fetchStats();
  }, [user]);

  // Extract Elo sub-ratings from Zustand store user model
  const subRatings = {
    tactics: user.tacticalRating || 800,
    openings: user.openingRating || 800,
    strategy: user.strategicRating || 800,
    middlegame: user.middlegameRating || 800,
    endgame: user.endgameRating || 800,
  };

  const weaknesses = [
    { id: 'calculation', name: 'Tactical Calculation', score: Math.round(stats.tacticalAccuracy * 100), desc: 'Deep visualization & variations', rating: subRatings.tactics },
    { id: 'endgames', name: 'Endgame Opposition', score: Math.round(stats.endgameKnowledge * 100), desc: 'Zugzwang, Lucena, Philidor', rating: subRatings.endgame },
    { id: 'foundations', name: 'King Safety Assessment', score: Math.round(stats.puzzleAccuracy * 100), desc: 'Evaluating check threats & defense', rating: subRatings.strategy },
    { id: 'openings', name: 'Opening Principles', score: Math.round(stats.openingKnowledge * 100), desc: 'Central control & developmental tempo', rating: subRatings.openings },
    { id: 'deflection', name: 'Deflection Recognition', score: Math.round(stats.strategicUnderstanding * 100), desc: 'Luring defenders away from key tasks', rating: subRatings.middlegame }
  ];

  // Map weaknesses to tailored suggestions
  const getRecommendations = () => {
    const recs = [];
    if (analysis.weaknesses.includes('deflection') || analysis.weaknesses.includes('fundamentals') || stats.strategicUnderstanding < 0.5) {
      recs.push({ type: 'Puzzle Set', title: 'Deflection & Back Rank Combos', difficulty: 'Intermediate', reward: '+15 XP', page: 'puzzles' as const });
    }
    if (analysis.weaknesses.includes('endgames') || progress.completedLessons.length < 5 || stats.endgameKnowledge < 0.5) {
      recs.push({ type: 'Drill Lab', title: 'Lucena Bridge Building Practice', difficulty: 'Advanced', reward: '+20 XP', page: 'endgames' as const });
    }
    if (analysis.weaknesses.includes('openings') || progress.completedLessons.length < 2 || stats.openingKnowledge < 0.5) {
      recs.push({ type: 'Repertoire', title: 'Sicilian Defense - Common Mistakes & Traps', difficulty: 'Beginner', reward: '+10 XP', page: 'openings' as const });
    }
    
    if (recs.length === 0) {
      recs.push({ type: 'Puzzle Set', title: 'General Tactics & Mate in 2', difficulty: 'Intermediate', reward: '+15 XP', page: 'puzzles' as const });
      recs.push({ type: 'Calculation', title: 'Deep Knight Visualization', difficulty: 'Advanced', reward: '+20 XP', page: 'calculation' as const });
      recs.push({ type: 'Repertoire', title: 'Mastering the Italian Game', difficulty: 'Beginner', reward: '+10 XP', page: 'openings' as const });
    }
    return recs;
  };

  const recommendations = getRecommendations();

  const getDailySchedule = () => {
    const list = [
      { time: '09:00 AM', task: 'Warm-up: 5 Coordinate Color Matching drills', duration: '5 min' },
    ];
    if (analysis.weaknesses.includes('deflection') || analysis.weaknesses.includes('tactics') || stats.tacticalAccuracy < 0.6) {
      list.push({ time: '10:30 AM', task: 'Tactics: Solve 3 forks and deflection puzzles in Guided Solve Mode', duration: '15 min' });
    } else {
      list.push({ time: '10:30 AM', task: 'Tactics: Review 5 tactical cards in Spaced Repetition queue', duration: '10 min' });
    }

    if (analysis.weaknesses.includes('calculation') || stats.calculationDepth < 4) {
      list.push({ time: '04:00 PM', task: 'Calculation: Deep visualization training (MC-02 Knight Fork)', duration: '15 min' });
    } else {
      list.push({ time: '04:00 PM', task: 'Blindfold Lab: Track coordinates of 3-move bishop routes', duration: '10 min' });
    }

    if (analysis.weaknesses.includes('endgames') || stats.endgameKnowledge < 0.5) {
      list.push({ time: '08:30 PM', task: 'Endgame: Practice Lucena Position drilling against standard engine', duration: '15 min' });
    } else {
      list.push({ time: '08:30 PM', task: 'Free play: Play 1 chess game against AI (Intermediate Level)', duration: '20 min' });
    }
    return list;
  };

  const dailySchedule = getDailySchedule();

  // Radar Chart Trigonometry helper
  const getRadarPoints = () => {
    const cx_val = 150;
    const cy_val = 150;
    const r_val = 90;
    const values = [
      subRatings.tactics,
      subRatings.openings,
      subRatings.strategy,
      subRatings.middlegame,
      subRatings.endgame,
    ];
    return values.map((val, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const normalized = Math.max(0.15, Math.min(1.0, (val - 400) / 1600)); // Range: 400 to 2000 Elo
      const x = cx_val + r_val * normalized * Math.cos(angle);
      const y = cy_val + r_val * normalized * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  const cx = 150;
  const cy = 150;
  const r = 90;
  const labels = ['Tactics', 'Openings', 'Strategy', 'Middlegame', 'Endgame'];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-indigo-500/10 to-transparent border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl shadow-glow">
            🤖
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-serif">Personal AI Chess Coach</h2>
            <p className="text-xs text-slate-400 mt-1">Analyzing playing habits, tactical errors, and calculation depth for {user.email}.</p>
          </div>
        </div>
        <div className="bg-[#0c0c14] border border-white/5 py-2 px-4 rounded-xl text-center text-xs font-mono text-emerald-400 font-semibold shadow-inner">
          AI Status: Ready & Syncing
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar Skill Chart Visualizer */}
        <Card className="flex flex-col gap-4 items-center justify-center p-5" hoverEffect={false}>
          <div className="w-full text-left">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Visual Profiler</span>
            <h3 className="text-sm font-bold text-white mt-0.5">Sub-Rating Radar Chart</h3>
          </div>
          
          {/* SVG Radar Chart */}
          <div className="relative w-[300px] h-[300px] my-2 select-none">
            <svg width="300" height="300" className="overflow-visible">
              {/* Background circular grids */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, sIdx) => {
                const points = Array.from({ length: 5 }).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                  const x = cx + r * scale * Math.cos(angle);
                  const y = cy + r * scale * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <polygon
                    key={sIdx}
                    points={points}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Grid spokes */}
              {Array.from({ length: 5 }).map((_, i) => {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Data Polygon overlay */}
              <polygon
                points={getRadarPoints()}
                fill="rgba(16, 185, 129, 0.15)"
                stroke="#10b981"
                strokeWidth="2"
                className="transition-all duration-500"
              />

              {/* Radar labels */}
              {labels.map((label, i) => {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const labelDist = r + 20;
                const x = cx + labelDist * Math.cos(angle);
                const y = cy + labelDist * Math.sin(angle) + 4; // slight vertical correction
                let anchor: 'inherit' | 'end' | 'start' | 'middle' = 'middle';
                if (Math.cos(angle) > 0.1) anchor = 'start';
                if (Math.cos(angle) < -0.1) anchor = 'end';
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    fill="#94a3b8"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor={anchor}
                    className="font-mono font-bold"
                  >
                    {label}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="text-[10px] text-slate-500 text-center font-mono mt-1 font-semibold leading-relaxed">
            Ratings span from 400 to 2000 Elo. Solves calibrate skill vectors automatically.
          </div>
        </Card>

        {/* Skill Profiler Detail List */}
        <Card className="flex flex-col gap-4 p-5" hoverEffect={false}>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Skill Profiler</span>
            <h3 className="text-sm font-bold text-white mt-0.5">Weakness & Strengths Tracker</h3>
          </div>
          <div className="flex flex-col gap-3.5">
            {weaknesses.map((w, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 font-semibold">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-300 font-bold block">{w.name}</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5 font-normal">{w.desc}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold text-xs block ${
                      w.score < 50 ? 'text-red-400' : w.score < 75 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {w.score}%
                    </span>
                    <span className="text-[8.5px] font-mono text-slate-500 font-bold block">{w.rating} Elo</span>
                  </div>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      w.score < 50 ? 'bg-red-500' : w.score < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${w.score}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Personalized Recommendations */}
        <Card className="flex flex-col gap-4 p-5" hoverEffect={false}>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Coach Suggestions</span>
            <h3 className="text-sm font-bold text-white mt-0.5">Tailored Action Pathways</h3>
          </div>
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white/5 hover:bg-white/10 transition-all border border-white/5 p-3 rounded-xl flex flex-col gap-2 font-semibold">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-mono">
                    {rec.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-500">{rec.reward}</span>
                </div>
                <h4 className="font-bold text-xs text-white leading-snug">{rec.title}</h4>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>Difficulty: {rec.difficulty}</span>
                  <button 
                    onClick={() => navigate('/' + rec.page)} 
                    className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                  >
                    Start Study ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Left Column: Dynamic Schedule Plan */}
        {(() => {
          const weeklySchedule = [
            { time: 'Mon / Tue', task: 'Openings: Build & practice custom repertoire lines', duration: '30m / day' },
            { time: 'Wed / Thu', task: 'Tactics: Solve 10 intermediate puzzles in Guided Solve Mode', duration: '40m / day' },
            { time: 'Fri / Sat', task: 'Endgames: Complete lucena and opposition training drills', duration: '30m / day' },
            { time: 'Sunday', task: 'Master Analysis: Study 1 classical game with move annotations', duration: '60 min' }
          ];

          const monthlySchedule = [
            { time: 'Week 1', task: 'Core focus: Tactician tactics and pattern recognition', duration: 'Daily' },
            { time: 'Week 2', task: 'Core focus: Endgame studies and defensive fortresses', duration: '2h / week' },
            { time: 'Week 3', task: 'Core focus: Opening repertoires and space control theory', duration: '3h / week' },
            { time: 'Week 4', task: 'Core focus: Real Stockfish depth analysis and calculation', duration: '4h / week' }
          ];

          const currentSchedule = planTab === 'daily' ? dailySchedule : planTab === 'weekly' ? weeklySchedule : monthlySchedule;

          return (
            <Card className="flex flex-col gap-4 p-5" hoverEffect={false}>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Practice Plan</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    {planTab === 'daily' ? 'Daily Routine' : planTab === 'weekly' ? 'Weekly Outlook' : 'Monthly Roadmap'}
                  </h3>
                </div>
                
                {/* Switcher tabs */}
                <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
                  {(['daily', 'weekly', 'monthly'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setPlanTab(tab)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg capitalize transition-all ${
                        planTab === tab 
                          ? 'bg-emerald-500 text-bg-primary shadow-glow font-bold' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 border-l border-emerald-500/20 pl-4 py-1 relative">
                {currentSchedule.map((sch, idx) => (
                  <div key={idx} className="relative flex flex-col gap-1 pb-3 last:pb-0">
                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-bg-primary shadow-glow" />
                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono font-bold">
                      <span>{sch.time}</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded text-slate-300">{sch.duration}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-semibold leading-relaxed mt-0.5">{sch.task}</p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })()}

        {/* Right Column: AI Mistake Explainer */}
        <Card className="flex flex-col gap-4 p-5" hoverEffect={false}>
          <div className="flex justify-between items-start border-b border-white/5 pb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-500 font-mono">Tactical Review</span>
              <h3 className="text-sm font-bold text-white mt-0.5">AI Mistake Explainer</h3>
            </div>
            
            {/* Blunder list dropdown selector */}
            <select
              value={activeMistakeIdx}
              onChange={(e) => setActiveMistakeIdx(Number(e.target.value))}
              className="bg-bg-secondary border border-white/10 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-none focus:border-rose-500"
            >
              {MISTAKE_CASES.map((item, idx) => (
                <option key={item.id} value={idx}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Board representation at the blunder point */}
            <div className="flex flex-col items-center">
              <Board
                fen={mistakeBoardFen}
                interactive={false}
                size={180}
                highlights={[{ square: activeMistake.highlightSquare, color: 'rgba(239, 68, 68, 0.4)' }]}
              />
            </div>
            
            {/* Explanatory notes */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-white font-mono">{activeMistake.blunderMove}</span>
                <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 border border-rose-500/15 px-2 py-0.5 rounded font-mono">
                  {activeMistake.classification}
                </span>
              </div>
              
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                {activeMistake.explanation}
              </p>

              <div className="mt-1 border-t border-white/5 pt-2">
                <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">Correct Defense:</span>
                <span className="text-xs text-slate-400 block mt-0.5 font-bold font-mono">{activeMistake.correctAlternative}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AICoachDashboard;
