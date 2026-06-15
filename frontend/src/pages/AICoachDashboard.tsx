import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Storage } from '../core/storage';

export const AICoachDashboard: React.FC = () => {
  const user = useAppStore(state => state.user);
  const completedLessons = useAppStore(state => state.completedLessons);
  const setActivePage = useAppStore(state => state.setActivePage);

  // Analyze actual user weaknesses & strengths
  const analysis = Storage.analyzeWeaknesses();
  const progress = Storage.getProgress();

  // Create a dynamic skill score based on user rating, XP, and actual database history
  const getSkillScore = (category: string, defaultVal: number): number => {
    // If analyzed as weakness, score is low
    if (analysis.weaknesses.includes(category)) return Math.max(25, defaultVal - 25);
    // If analyzed as strength, score is high
    if (analysis.strengths.includes(category)) return Math.min(98, defaultVal + 15);
    // If lesson complete, boost score
    const hasLesson = completedLessons.some(l => l.includes(category));
    if (hasLesson) return Math.min(90, defaultVal + 10);
    return defaultVal;
  };

  const weaknesses = [
    { id: 'calculation', name: 'Tactical Calculation', score: getSkillScore('calculation', 65), desc: 'Deep visualization & variations' },
    { id: 'endgames', name: 'Endgame Opposition', score: getSkillScore('endgames', 45), desc: 'Zugzwang, Lucena, Philidor' },
    { id: 'foundations', name: 'King Safety Assessment', score: getSkillScore('foundations', 70), desc: 'Evaluating check threats & defense' },
    { id: 'openings', name: 'Opening Principles', score: getSkillScore('openings', 55), desc: 'Central control & developmental tempo' },
    { id: 'deflection', name: 'Deflection Recognition', score: getSkillScore('deflection', 40), desc: 'Luring defenders away from key tasks' }
  ];

  // Map weaknesses to tailored suggestions
  const getRecommendations = () => {
    const recs = [];
    if (analysis.weaknesses.includes('deflection') || analysis.weaknesses.includes('fundamentals')) {
      recs.push({ type: 'Puzzle Set', title: 'Deflection & Back Rank Combos', difficulty: 'Intermediate', reward: '+15 XP', page: 'puzzles' as const });
    }
    if (analysis.weaknesses.includes('endgames') || progress.completedLessons.length < 5) {
      recs.push({ type: 'Drill Lab', title: 'Lucena Bridge Building Practice', difficulty: 'Advanced', reward: '+20 XP', page: 'endgames' as const });
    }
    if (analysis.weaknesses.includes('openings') || progress.completedLessons.length < 2) {
      recs.push({ type: 'Repertoire', title: 'Sicilian Defense - Common Mistakes & Traps', difficulty: 'Beginner', reward: '+10 XP', page: 'openings' as const });
    }
    
    // Default fallback recommendations if profile is clean
    if (recs.length === 0) {
      recs.push({ type: 'Puzzle Set', title: 'General Tactics & Mate in 2', difficulty: 'Intermediate', reward: '+15 XP', page: 'puzzles' as const });
      recs.push({ type: 'Calculation', title: 'Deep Knight Visualization', difficulty: 'Advanced', reward: '+20 XP', page: 'calculation' as const });
      recs.push({ type: 'Repertoire', title: 'Mastering the Italian Game', difficulty: 'Beginner', reward: '+10 XP', page: 'openings' as const });
    }
    return recs;
  };

  const recommendations = getRecommendations();

  // Create a structured daily routine schedule mapping to their weaknesses
  const getDailySchedule = () => {
    const list = [
      { time: '09:00 AM', task: 'Warm-up: 5 Coordinate Color Matching drills', duration: '5 min' },
    ];
    if (analysis.weaknesses.includes('deflection') || analysis.weaknesses.includes('tactics')) {
      list.push({ time: '10:30 AM', task: 'Tactics: Solve 3 forks and deflection puzzles in Guided Solve Mode', duration: '15 min' });
    } else {
      list.push({ time: '10:30 AM', task: 'Tactics: Review 5 tactical cards in Spaced Repetition queue', duration: '10 min' });
    }

    if (analysis.weaknesses.includes('calculation')) {
      list.push({ time: '04:00 PM', task: 'Calculation: Deep visualization training (MC-02 Knight Fork)', duration: '15 min' });
    } else {
      list.push({ time: '04:00 PM', task: 'Blindfold Lab: Track coordinates of 3-move bishop routes', duration: '10 min' });
    }

    if (analysis.weaknesses.includes('endgames')) {
      list.push({ time: '08:30 PM', task: 'Endgame: Practice Lucena Position drilling against standard engine', duration: '15 min' });
    } else {
      list.push({ time: '08:30 PM', task: 'Free play: Play 1 chess game against AI (Intermediate Level)', duration: '20 min' });
    }
    return list;
  };

  const dailySchedule = getDailySchedule();

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-indigo-500/10 to-transparent border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl shadow-glow">
            🤖
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-serif">Personal AI Chess Coach</h2>
            <p className="text-xs text-slate-400 mt-1">Analyzing playing habits, tactical errors, and calculation depth for {user.email}.</p>
          </div>
        </div>
        <div className="bg-[#0c0c14] border border-white/5 py-2 px-4 rounded-xl text-center text-xs font-mono text-emerald-400 font-semibold">
          AI Status: Ready & Syncing
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weakness Profiler */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-white/5">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Skill Profiler</span>
            <h3 className="text-sm font-bold text-white mt-0.5">Weakness & Strengths Tracker</h3>
          </div>
          <div className="flex flex-col gap-3.5">
            {weaknesses.map((w, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-300 font-semibold block">{w.name}</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">{w.desc}</span>
                  </div>
                  <span className={`font-mono font-bold ${
                    w.score < 50 ? 'text-red-400' : w.score < 75 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {w.score}%
                  </span>
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
        </div>

        {/* Personalized Recommendations */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-white/5">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Coach Suggestions</span>
            <h3 className="text-sm font-bold text-white mt-0.5">Tailored Action Pathways</h3>
          </div>
          <div className="flex flex-col gap-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white/5 hover:bg-white/10 transition-all border border-white/5 p-3 rounded-xl flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {rec.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-500">{rec.reward}</span>
                </div>
                <h4 className="font-bold text-xs text-white leading-snug">{rec.title}</h4>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                  <span>Difficulty: {rec.difficulty}</span>
                  <button 
                    onClick={() => setActivePage(rec.page as any)} 
                    className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
                  >
                    Start Study ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Schedule Plan */}
        {(() => {
          const [planTab, setPlanTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

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
            <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-white/5">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Practice Plan</span>
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
                      className={`px-2 py-1 text-[10px] font-bold rounded capitalize transition-all ${
                        planTab === tab 
                          ? 'bg-emerald-500 text-bg-primary shadow-glow' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-3 border-l border-emerald-500/20 pl-4 py-1 relative">
                {currentSchedule.map((sch, idx) => (
                  <div key={idx} className="relative flex flex-col gap-1 pb-3 last:pb-0">
                    {/* Timeline node dot */}
                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-bg-primary shadow-glow" />
                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                      <span>{sch.time}</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded text-slate-300">{sch.duration}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-semibold leading-relaxed mt-0.5">{sch.task}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default AICoachDashboard;
