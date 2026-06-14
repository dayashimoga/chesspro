import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const AICoachDashboard: React.FC = () => {
  const user = useAppStore(state => state.user) || {
    id: 'user_01',
    email: 'learner@chessos.com',
    xp: 620,
    level: 3,
    puzzleRating: 1450,
    streak: 5
  };

  const weaknesses = [
    { name: 'Tactical Calculation', score: 78, status: 'Strong', color: 'bg-emerald-500' },
    { name: 'Endgame Opposition', score: 45, status: 'Needs Focus', color: 'bg-amber-500' },
    { name: 'King Safety Assessment', score: 82, status: 'Excellent', color: 'bg-emerald-500' },
    { name: 'Opening Principles', score: 60, status: 'Stable', color: 'bg-indigo-500' },
    { name: 'Deflection Recognition', score: 38, status: 'Critical Weakness', color: 'bg-red-500' }
  ];

  const recommendations = [
    { type: 'Puzzle Set', title: 'Deflection & Back Rank Combos', difficulty: 'Intermediate', reward: '+15 XP' },
    { type: 'Drill Lab', title: 'Lucena Bridge Building Practice', difficulty: 'Advanced', reward: '+20 XP' },
    { type: 'Repertoire', title: 'Sicilian Defense - Common Mistakes & Traps', difficulty: 'Beginner', reward: '+10 XP' }
  ];

  const dailySchedule = [
    { time: '09:00 AM', task: 'Warm-up: 5 Coordinate Color Matching games', duration: '5 min' },
    { time: '10:30 AM', task: 'Tactics: Solve 3 forks and deflection puzzles in Guided Solve Mode', duration: '15 min' },
    { time: '04:00 PM', task: 'Calculation: Mental Tracing Lab (MC-02 Knight Fork)', duration: '10 min' },
    { time: '08:30 PM', task: 'Endgame: Build Lucena Bridge twice without assistance', duration: '10 min' }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto py-4 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500/20 via-indigo-500/10 to-transparent border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-glow">
            🤖
          </div>
          <div>
            <h2 className="text-2xl font-black text-white font-serif">Personal AI Chess Coach</h2>
            <p className="text-xs text-slate-400 mt-1">Analyzing playing habits, tactical errors, and calculation depth to optimize your practice.</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/5 py-2.5 px-5 rounded-2xl text-center text-xs font-mono text-emerald-400 font-semibold">
          AI Status: Ready & Monitoring
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weakness Profiler (Radar representation using CSS progress bars) */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Skill Profiler</span>
            <h3 className="text-base font-bold text-white mt-0.5">Weakness & Strengths Tracker</h3>
          </div>
          <div className="flex flex-col gap-4">
            {weaknesses.map((w, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">{w.name}</span>
                  <span className={`font-mono font-bold ${
                    w.status === 'Critical Weakness' ? 'text-red-400' : w.status === 'Needs Focus' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {w.score}% ({w.status})
                  </span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                  <div className={`h-full rounded-full ${w.color}`} style={{ width: `${w.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Coach Suggestions</span>
            <h3 className="text-base font-bold text-white mt-0.5">Daily Action Pathways</h3>
          </div>
          <div className="flex flex-col gap-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white/5 hover:bg-white/10 transition-all border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {rec.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-500">{rec.reward}</span>
                </div>
                <h4 className="font-bold text-xs text-white leading-snug">{rec.title}</h4>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                  <span>Difficulty: {rec.difficulty}</span>
                  <span className="text-emerald-400 cursor-pointer hover:underline font-semibold">Start Study ➔</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Schedule Plan */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Practice Plan</span>
            <h3 className="text-base font-bold text-white mt-0.5">Weekly Routine Schedule</h3>
          </div>
          <div className="flex flex-col gap-3 border-l border-emerald-500/20 pl-4 py-2 relative">
            {dailySchedule.map((sch, idx) => (
              <div key={idx} className="relative flex flex-col gap-1 pb-3 last:pb-0">
                {/* Timeline node dot */}
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-bg-primary shadow-glow" />
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>{sch.time}</span>
                  <span className="bg-white/5 px-2 py-0.5 rounded text-slate-300">{sch.duration}</span>
                </div>
                <p className="text-xs text-slate-200 font-semibold leading-relaxed mt-0.5">{sch.task}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AICoachDashboard;
