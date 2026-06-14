import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const Dashboard: React.FC = () => {
  const user = useAppStore(state => state.user) || {
    id: 'user_01',
    email: 'learner@chessos.com',
    xp: 620,
    level: 3,
    puzzleRating: 1450,
    streak: 5
  };

  const completedLessons = useAppStore(state => state.completedLessons);

  const skillTree = [
    { id: 'foundations', title: 'Foundations', icon: '♔', status: 'Complete', desc: 'Board, Movement & Rules' },
    { id: 'tactics', title: 'Tactical Motifs', icon: '⚔️', status: 'In Progress', desc: 'Forks, Pins, Skewers & Deflections' },
    { id: 'calculation', title: 'Mental Calculation', icon: '🧠', status: 'Locked', desc: 'Deep variations & visualization' },
    { id: 'strategy', title: 'Positional Strategy', icon: '📈', status: 'Locked', desc: 'Pawn structures & plans' },
    { id: 'openings', title: 'Opening Repertoires', icon: '📚', status: 'Locked', desc: 'White & Black openings' },
    { id: 'endgames', title: 'Endgame Mastery', icon: '🏁', status: 'Locked', desc: 'Zugzwang, Lucena, Philidor' }
  ];

  const achievements = [
    { title: 'First Steps', desc: 'Complete Chess Foundations', unlocked: true, icon: '🌟' },
    { title: 'Tactician I', desc: 'Solve 10 Tactics puzzles', unlocked: true, icon: '🎯' },
    { title: 'Calculated Risk', desc: 'Finish Calculation Lab exercise', unlocked: false, icon: '🧠' },
    { title: 'Opposition Master', desc: 'Drill King and Pawn oppositions', unlocked: false, icon: '🛡️' },
    { title: 'Grandmaster Sight', desc: 'Complete a Blindfold exercise', unlocked: false, icon: '👁️' },
  ];

  const xpProgress = user.xp % 250;
  const xpPercentage = (xpProgress / 250) * 100;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto py-4 animate-fadeIn">
      {/* Top Banner / Hero Summary */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-amber-500/10 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-1">Welcome back, Grandmaster Candidate</span>
          <h2 className="text-3xl font-black text-white font-serif">{user.email}</h2>
          <p className="text-sm text-slate-400 mt-1">Strengthen your calculation and positional understanding with today's tailored coaching path.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-bg-secondary border border-white/5 py-3 px-6 rounded-2xl text-center">
            <span className="text-xs text-slate-500 block">Puzzle Rating</span>
            <span className="text-2xl font-bold font-mono text-white">{user.puzzleRating}</span>
          </div>
          <div className="bg-bg-secondary border border-white/5 py-3 px-6 rounded-2xl text-center">
            <span className="text-xs text-slate-500 block">Daily Streak</span>
            <span className="text-2xl font-bold font-mono text-amber-500">🔥 {user.streak} Days</span>
          </div>
        </div>
      </div>

      {/* Level & XP Progression */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center font-extrabold text-2xl text-bg-primary shadow-glow">
            Lvl {user.level}
          </div>
          <div>
            <h4 className="font-bold text-white">Experience Level</h4>
            <p className="text-xs text-slate-400 mt-0.5">{user.xp} XP total • {250 - xpProgress} XP to Level {user.level + 1}</p>
          </div>
        </div>
        <div className="flex-1 w-full max-w-lg">
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Skill Tree System */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Mastery Skill Tree</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillTree.map(skill => (
              <div 
                key={skill.id} 
                className={`glass-card p-5 rounded-2xl flex flex-col justify-between h-40 ${
                  skill.status === 'Complete' 
                    ? 'border-emerald-500/20' 
                    : skill.status === 'In Progress' 
                    ? 'border-amber-500/20 ring-1 ring-amber-500/10' 
                    : 'opacity-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <span className="text-2xl bg-white/5 w-10 h-10 flex items-center justify-center rounded-xl">{skill.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-sm">{skill.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{skill.desc}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    skill.status === 'Complete' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : skill.status === 'In Progress' 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                      : 'bg-white/5 text-slate-500'
                  }`}>
                    {skill.status}
                  </span>
                </div>
                {skill.status === 'In Progress' && (
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                    <div className="bg-amber-500 h-full w-1/3 rounded-full" />
                  </div>
                )}
                {skill.status === 'Complete' && (
                  <span className="text-xs text-emerald-400 font-semibold mt-3">✓ All modules mastered</span>
                )}
                {skill.status === 'Locked' && (
                  <span className="text-xs text-slate-500 mt-3">🔒 Unlock by finishing previous nodes</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Badge Achievements</h3>
          <div className="flex flex-col gap-3">
            {achievements.map((ach, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 p-4 rounded-xl items-center border transition-all ${
                  ach.unlocked 
                    ? 'bg-emerald-500/5 border-emerald-500/10 text-slate-200' 
                    : 'bg-white/[0.02] border-white/5 text-slate-500 opacity-60'
                }`}
              >
                <span className="text-2xl">{ach.icon}</span>
                <div>
                  <h4 className={`font-semibold text-xs ${ach.unlocked ? 'text-white' : 'text-slate-500'}`}>
                    {ach.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
