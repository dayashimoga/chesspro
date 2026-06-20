import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Storage, SpacedRepetition } from '../core/storage';
import { Board } from '../components/Board';
import { AdaptiveEngine } from '../core/adaptive-engine';
import { Gamification } from '../core/gamification';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

const DAILY_PUZZLE_FEN = 'r2q1rk1/pp2ppbp/2n3p1/2pp4/3P1B2/2PB1N2/PP3PPP/R2Q1RK1 w - - 0 10';

export const Dashboard: React.FC = () => {
  const user = useAppStore(s => s.user);
  const completedLessons = useAppStore(s => s.completedLessons);
  const navigate = useNavigate();

  const analysis = Storage.analyzeWeaknesses();
  const srsStats = SpacedRepetition.getStats();
  const profile = AdaptiveEngine.analyzeProfile();
  const gamStats = Gamification.getStats();
  const dailyChallenges = Gamification.getDailyChallenges();
  const completedChallenges = dailyChallenges.filter(c => c.completed).length;

  const xpProgress = user.xp % 250;
  const xpPercentage = (xpProgress / 250) * 100;

  const skillTree = [
    { id: 'foundations', title: 'Chess Foundations', icon: '♔', desc: 'Board, Movement & Rules', target: '/foundations', status: completedLessons.length >= 5 ? 'Complete' : completedLessons.length > 0 ? 'In Progress' : 'In Progress' },
    { id: 'tactics', title: 'Tactical Motifs', icon: '⚔️', desc: 'Forks, Pins, Skewers & Mates', target: '/puzzles', status: completedLessons.length >= 3 ? 'In Progress' : 'Locked' },
    { id: 'calculation', title: 'Calculation Lab', icon: '🧠', desc: 'Deep visualization & variations', target: '/calculation', status: completedLessons.length >= 6 ? 'In Progress' : 'Locked' },
    { id: 'strategy', title: 'Positional Strategy', icon: '📈', desc: 'Pawn structures & plans', target: '/middlegame', status: 'Locked' },
    { id: 'openings', title: 'Opening Repertoires', icon: '📚', desc: 'Build your repertoire', target: '/opening-university', status: 'Locked' },
    { id: 'endgames', title: 'Endgame Mastery', icon: '👑', desc: 'Zugzwang, Lucena, Philidor', target: '/endgame-university', status: 'Locked' },
  ];

  const achievements = Gamification.getAllAchievements().filter(a => a.unlocked).slice(0, 5);

  const quickActions = [
    { label: 'Daily Plan', path: '/daily', icon: '📅', gradient: 'from-violet-500/20 to-violet-600/10 hover:border-violet-500/30' },
    { label: 'Solve Puzzles', path: '/puzzles', icon: '🧩', gradient: 'from-emerald-500/20 to-emerald-600/10 hover:border-emerald-500/30' },
    { label: 'Play vs AI', path: '/play', icon: '♟️', gradient: 'from-amber-500/20 to-amber-600/10 hover:border-amber-500/30' },
    { label: 'Learn Theory', path: '/lessons', icon: '📖', gradient: 'from-purple-500/20 to-purple-600/10 hover:border-purple-500/30' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-fadeIn">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-amber-500/10 border border-white/8 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
        <div>
          <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest block mb-1">Welcome back, Grandmaster Candidate</span>
          <h2 className="text-2xl font-black text-white font-serif">{user.email}</h2>
          <p className="text-sm text-slate-400 mt-1">Strengthen your calculation and positional mastery with today's tailored coaching path.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-bg-secondary/80 backdrop-blur-md border border-white/5 py-2.5 px-5 rounded-2xl text-center shadow-lg">
            <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Overall</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{profile.overallRating}</span>
          </div>
          <div className="bg-bg-secondary/80 backdrop-blur-md border border-white/5 py-2.5 px-5 rounded-2xl text-center shadow-lg">
            <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Streak</span>
            <span className="text-xl font-bold font-mono text-amber-500">🔥 {user.streak}</span>
          </div>
        </div>
      </div>

      {/* XP Bar Card */}
      <Card className="flex flex-col md:flex-row justify-between items-center gap-4 !p-4" hoverEffect={false}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center font-extrabold text-lg text-bg-primary shadow-glow">
            Lv{user.level}
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Experience Level</h4>
            <p className="text-[10px] text-slate-400 font-semibold">{user.xp} XP total • {250 - xpProgress} XP to Level {user.level + 1}</p>
          </div>
        </div>
        <div className="flex-1 w-full max-w-md">
          <ProgressBar percent={xpPercentage} height={10} gradient="from-emerald-500 to-emerald-400" />
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map(action => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className={`bg-gradient-to-br ${action.gradient} p-4 rounded-xl border border-white/5 transition-all duration-300 text-left group hover:scale-[1.02] hover:-translate-y-0.5 shadow-lg`}
          >
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="text-sm font-bold text-white block">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Daily Challenges Summary */}
      <Card hoverEffect={false}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🎯</span> Daily Challenges
            <Badge variant="amber" className="ml-1">
              {completedChallenges}/{dailyChallenges.length}
            </Badge>
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/daily')} className="text-xs text-emerald-400 hover:text-emerald-300 p-0 font-bold">
            View Plan →
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {dailyChallenges.map(ch => (
            <div key={ch.id} className={`p-3 rounded-xl border transition-all duration-300 ${ch.completed ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-white/[0.02] border-white/5'}`}>
              <div className="flex items-center gap-2.5">
                <span className="text-base">{ch.completed ? '✅' : ch.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-bold truncate ${ch.completed ? 'text-emerald-400' : 'text-white'}`}>{ch.title}</div>
                  <ProgressBar
                    percent={(ch.current / ch.target) * 100}
                    height={4}
                    gradient={ch.completed ? 'from-emerald-500 to-emerald-400' : 'from-violet-500 to-violet-400'}
                    className="mt-1.5"
                  />
                </div>
                <span className="text-[10px] text-amber-400 font-bold shrink-0">+{ch.xpReward} XP</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Tree */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Mastery Skill Tree</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skillTree.map(skill => (
              <Card
                key={skill.id}
                onClick={() => skill.status !== 'Locked' && navigate(skill.target)}
                className={`flex flex-col justify-between min-h-[120px] text-left cursor-pointer ${
                  skill.status === 'Complete' ? 'border-emerald-500/20' :
                  skill.status === 'In Progress' ? 'border-amber-500/20 ring-1 ring-amber-500/10' : 'opacity-50 cursor-not-allowed hover:border-white/5 hover:translate-y-0'
                }`}
                hoverEffect={skill.status !== 'Locked'}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex gap-2.5">
                    <span className="text-xl bg-white/5 w-9 h-9 flex items-center justify-center rounded-lg">{skill.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-xs">{skill.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{skill.desc}</p>
                    </div>
                  </div>
                  <Badge variant={
                    skill.status === 'Complete' ? 'emerald' :
                    skill.status === 'In Progress' ? 'amber' : 'slate'
                  }>
                    {skill.status}
                  </Badge>
                </div>
                {skill.status === 'In Progress' && (
                  <ProgressBar percent={33.3} height={4} gradient="from-amber-500 to-amber-400" className="mt-2" />
                )}
              </Card>
            ))}
          </div>

          {/* Daily Puzzle */}
          <Card className="mt-2" hoverEffect={false}>
            <h3 className="text-sm font-bold text-white mb-3">🧩 Puzzle of the Day</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Board fen={DAILY_PUZZLE_FEN} interactive={false} size={200} />
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Find the best move for White. Think carefully about pawn breaks, candidate moves, and piece activity.
                </p>
                <Button onClick={() => navigate('/puzzles')} size="sm">
                  Solve Now →
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Coach Insights */}
          <Card hoverEffect={false}>
            <h3 className="text-sm font-bold text-white mb-3">🎙️ Coach Insights</h3>
            {profile.weakAreas.length > 0 ? (
              <div className="text-xs text-slate-400 space-y-2">
                <p className="font-semibold text-amber-400 mb-2">Areas to improve:</p>
                {profile.weakAreas.slice(0, 4).map(w => (
                  <div key={w} className="flex items-center gap-2.5 bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-xl">
                    <span>⚠️</span>
                    <span className="capitalize font-medium">{w.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete more puzzles and lessons to unlock personalized coaching insights.
              </p>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate('/aicoach')} className="mt-3 text-emerald-400 hover:text-emerald-300 p-0 hover:bg-transparent justify-start">
              View Full Report →
            </Button>
          </Card>

          {/* Review Queue */}
          <Card className="text-center" hoverEffect={false}>
            <h3 className="text-sm font-bold text-white mb-2 text-left">🔄 Spaced Review</h3>
            <div>
              <div className="text-4xl font-extrabold text-white my-2 font-mono">{srsStats.due}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-4">cards due today</div>
              {srsStats.due > 0 && (
                <Button onClick={() => navigate('/review')} fullWidth>
                  Start Review
                </Button>
              )}
            </div>
          </Card>

          {/* Achievements */}
          <Card hoverEffect={false}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-white">🏆 Achievements</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/achievements')} className="text-xs text-emerald-400 hover:text-emerald-300 p-0 hover:bg-transparent font-bold">
                View All →
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {(achievements.length > 0 ? achievements : Gamification.getAllAchievements().slice(0, 5)).map((ach, idx) => (
                <div key={idx} className={`flex gap-2.5 p-2.5 rounded-xl items-center border transition-all duration-300 ${
                  ach.unlocked ? 'bg-emerald-500/5 border-emerald-500/10 text-slate-200 shadow-sm' : 'bg-white/[0.02] border-white/5 text-slate-500 opacity-50'
                }`}>
                  <span className="text-xl">{ach.icon}</span>
                  <div className="min-w-0">
                    <h4 className={`font-bold text-[11px] truncate ${ach.unlocked ? 'text-white' : 'text-slate-500'}`}>{ach.title}</h4>
                    <p className="text-[9px] text-slate-400 truncate mt-0.5">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

