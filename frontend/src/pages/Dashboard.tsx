import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Storage, SpacedRepetition } from '../core/storage';
import { Board } from '../components/Board';

const DAILY_PUZZLE_FEN = 'r2q1rk1/pp2ppbp/2n3p1/2pp4/3P1B2/2PB1N2/PP3PPP/R2Q1RK1 w - - 0 10';

export const Dashboard: React.FC = () => {
  const user = useAppStore(s => s.user);
  const completedLessons = useAppStore(s => s.completedLessons);
  const setActivePage = useAppStore(s => s.setActivePage);

  const analysis = Storage.analyzeWeaknesses();
  const srsStats = SpacedRepetition.getStats();

  const xpProgress = user.xp % 250;
  const xpPercentage = (xpProgress / 250) * 100;

  const skillTree = [
    { id: 'foundations', title: 'Chess Foundations', icon: '♔', desc: 'Board, Movement & Rules', target: 'lessons' as const, status: completedLessons.length >= 5 ? 'Complete' : completedLessons.length > 0 ? 'In Progress' : 'In Progress' },
    { id: 'tactics', title: 'Tactical Motifs', icon: '⚔️', desc: 'Forks, Pins, Skewers & Mates', target: 'puzzles' as const, status: completedLessons.length >= 3 ? 'In Progress' : 'Locked' },
    { id: 'calculation', title: 'Calculation Lab', icon: '🧠', desc: 'Deep visualization & variations', target: 'calculation' as const, status: completedLessons.length >= 6 ? 'In Progress' : 'Locked' },
    { id: 'strategy', title: 'Positional Strategy', icon: '📈', desc: 'Pawn structures & plans', target: 'lessons' as const, status: 'Locked' },
    { id: 'openings', title: 'Opening Repertoires', icon: '📚', desc: 'Build your repertoire', target: 'openings' as const, status: 'Locked' },
    { id: 'endgames', title: 'Endgame Mastery', icon: '👑', desc: 'Zugzwang, Lucena, Philidor', target: 'endgames' as const, status: 'Locked' },
  ];

  const achievements = [
    { title: 'First Steps', desc: 'Started learning chess', unlocked: true, icon: '🌟' },
    { title: 'Tactician I', desc: 'Complete 10 puzzles', unlocked: user.xp >= 150, icon: '🎯' },
    { title: 'Calculated Risk', desc: 'Reach 1000 puzzle Elo', unlocked: user.puzzleRating >= 1000, icon: '🧠' },
    { title: 'Memory Master', desc: 'Review 20 flashcards', unlocked: srsStats.mastered >= 5, icon: '🃏' },
    { title: 'Grandmaster Sight', desc: 'Complete a blindfold exercise', unlocked: false, icon: '👁️' },
  ];

  const quickActions = [
    { label: 'Solve Puzzles', page: 'puzzles' as const, icon: '🧩', gradient: 'from-emerald-500/20 to-emerald-600/10' },
    { label: 'Play vs AI', page: 'play' as const, icon: '♟️', gradient: 'from-amber-500/20 to-amber-600/10' },
    { label: 'Daily Review', page: 'review' as const, icon: '🔄', gradient: 'from-blue-500/20 to-blue-600/10' },
    { label: 'Learn Theory', page: 'lessons' as const, icon: '📖', gradient: 'from-purple-500/20 to-purple-600/10' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-fadeIn">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-amber-500/10 border border-white/8 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest block mb-1">Welcome back, Grandmaster Candidate</span>
          <h2 className="text-2xl font-black text-white font-serif">{user.email}</h2>
          <p className="text-sm text-slate-400 mt-1">Strengthen your calculation and positional mastery with today's tailored coaching path.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-bg-secondary border border-white/5 py-2.5 px-5 rounded-2xl text-center">
            <span className="text-[10px] text-slate-500 block">Puzzle Elo</span>
            <span className="text-xl font-bold font-mono text-white">{user.puzzleRating}</span>
          </div>
          <div className="bg-bg-secondary border border-white/5 py-2.5 px-5 rounded-2xl text-center">
            <span className="text-[10px] text-slate-500 block">Streak</span>
            <span className="text-xl font-bold font-mono text-amber-500">🔥 {user.streak}</span>
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center font-extrabold text-lg text-bg-primary shadow-glow">
            Lv{user.level}
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Experience Level</h4>
            <p className="text-[10px] text-slate-400">{user.xp} XP total • {250 - xpProgress} XP to Level {user.level + 1}</p>
          </div>
        </div>
        <div className="flex-1 w-full max-w-md">
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden border border-white/5">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${xpPercentage}%` }} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map(action => (
          <button
            key={action.label}
            onClick={() => setActivePage(action.page)}
            className={`bg-gradient-to-br ${action.gradient} p-4 rounded-xl border border-white/5 hover:border-emerald-500/20 transition-all text-left group`}
          >
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="text-sm font-bold text-white">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Tree */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Mastery Skill Tree</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skillTree.map(skill => (
              <button
                key={skill.id}
                onClick={() => skill.status !== 'Locked' && setActivePage(skill.target)}
                className={`glass-card p-4 rounded-xl flex flex-col justify-between min-h-[120px] text-left cursor-pointer ${
                  skill.status === 'Complete' ? 'border-emerald-500/20' :
                  skill.status === 'In Progress' ? 'border-amber-500/20 ring-1 ring-amber-500/10' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex gap-2.5">
                    <span className="text-xl bg-white/5 w-9 h-9 flex items-center justify-center rounded-lg">{skill.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-xs">{skill.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{skill.desc}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    skill.status === 'Complete' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    skill.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-white/5 text-slate-500'
                  }`}>
                    {skill.status}
                  </span>
                </div>
                {skill.status === 'In Progress' && (
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-amber-500 h-full w-1/3 rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Daily Puzzle */}
          <div className="glass-panel p-5 rounded-xl mt-2">
            <h3 className="text-sm font-bold text-white mb-3">🧩 Puzzle of the Day</h3>
            <div className="flex gap-4 items-center">
              <Board fen={DAILY_PUZZLE_FEN} interactive={false} size={200} />
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-2">Find the best move for White. Think carefully about pawn breaks and piece activity.</p>
                <button onClick={() => setActivePage('puzzles')} className="bg-emerald-500 hover:bg-emerald-600 text-bg-primary font-bold px-4 py-2 rounded-lg text-xs transition-all">
                  Solve Now →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Coach Insights */}
          <div className="glass-panel p-5 rounded-xl">
            <h3 className="text-sm font-bold text-white mb-3">🎙️ Coach Insights</h3>
            {analysis.weaknesses.length > 0 ? (
              <div className="text-xs text-slate-400 space-y-2">
                <p className="font-semibold text-amber-400">Areas to improve:</p>
                {analysis.weaknesses.map(w => (
                  <div key={w} className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/10 p-2 rounded-lg">
                    <span>⚠️</span>
                    <span className="capitalize">{w.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Complete more puzzles to unlock personalized coaching insights.</p>
            )}
            <button onClick={() => setActivePage('aicoach')} className="mt-3 text-xs text-emerald-400 font-bold hover:text-emerald-300">View Full Report →</button>
          </div>

          {/* Review Queue */}
          <div className="glass-panel p-5 rounded-xl">
            <h3 className="text-sm font-bold text-white mb-3">🔄 Spaced Review</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{srsStats.due}</div>
              <div className="text-[10px] text-slate-500 mb-3">cards due today</div>
              {srsStats.due > 0 && (
                <button onClick={() => setActivePage('review')} className="bg-emerald-500 hover:bg-emerald-600 text-bg-primary font-bold px-4 py-2 rounded-lg text-xs transition-all w-full">
                  Start Review
                </button>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="glass-panel p-5 rounded-xl">
            <h3 className="text-sm font-bold text-white mb-3">🏆 Achievements</h3>
            <div className="flex flex-col gap-2">
              {achievements.map((ach, idx) => (
                <div key={idx} className={`flex gap-2.5 p-2.5 rounded-lg items-center border transition-all ${
                  ach.unlocked ? 'bg-emerald-500/5 border-emerald-500/10 text-slate-200' : 'bg-white/[0.02] border-white/5 text-slate-500 opacity-50'
                }`}>
                  <span className="text-lg">{ach.icon}</span>
                  <div>
                    <h4 className={`font-semibold text-[11px] ${ach.unlocked ? 'text-white' : 'text-slate-500'}`}>{ach.title}</h4>
                    <p className="text-[9px] text-slate-400">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
