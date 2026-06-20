import React, { useState } from 'react';
import { Gamification, Achievement } from '../core/gamification';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

type FilterTab = 'all' | 'learning' | 'tactical' | 'streak' | 'mastery' | 'special';

export const Achievements: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [showRewardHistory, setShowRewardHistory] = useState(false);
  const user = useAppStore(s => s.user);

  const allAchievements = Gamification.getAllAchievements();
  const stats = Gamification.getStats();
  const rewardHistory = Gamification.getRewardHistory();
  const cosmetics = Gamification.getUnlockedCosmetics();

  const filtered = activeFilter === 'all'
    ? allAchievements
    : allAchievements.filter(a => a.category === activeFilter);

  const unlockedCount = allAchievements.filter(a => a.unlocked).length;
  const totalCount = allAchievements.length;
  const progressPercent = (unlockedCount / totalCount) * 100;

  const filters: { id: FilterTab; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '🏆' },
    { id: 'learning', label: 'Learning', icon: '📚' },
    { id: 'tactical', label: 'Tactical', icon: '⚔️' },
    { id: 'streak', label: 'Streak', icon: '🔥' },
    { id: 'mastery', label: 'Mastery', icon: '⭐' },
    { id: 'special', label: 'Special', icon: '💫' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-violet-500/10 to-emerald-500/8 border border-white/8 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Trophy Room</span>
            <h2 className="text-2xl font-black text-white font-serif mt-1">Achievements & Rewards</h2>
            <p className="text-sm text-slate-400 mt-1">Track your chess mastery journey and collect trophies.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-bg-secondary border border-white/5 py-2.5 px-5 rounded-2xl text-center shadow-md">
              <span className="text-[10px] text-slate-500 block font-bold uppercase">Unlocked</span>
              <span className="text-lg font-bold font-mono text-amber-400">{unlockedCount}/{totalCount}</span>
            </div>
            <div className="bg-bg-secondary border border-white/5 py-2.5 px-5 rounded-2xl text-center shadow-md">
              <span className="text-[10px] text-slate-500 block font-bold uppercase">Collection</span>
              <span className="text-lg font-bold font-mono text-violet-400">{cosmetics.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] mb-1.5 font-bold">
            <span className="text-slate-400">Achievement Progress</span>
            <span className="text-amber-400">{Math.round(progressPercent)}%</span>
          </div>
          <ProgressBar percent={progressPercent} height={10} gradient="from-amber-500 to-amber-400" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => {
              setActiveFilter(f.id);
              setShowRewardHistory(false);
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all duration-300 ${
              activeFilter === f.id && !showRewardHistory
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-sm'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400'
            }`}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
            <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded ml-1 font-bold">
              {f.id === 'all' ? allAchievements.filter(a => a.unlocked).length : allAchievements.filter(a => a.category === f.id && a.unlocked).length}
            </span>
          </button>
        ))}
        <button
          onClick={() => setShowRewardHistory(true)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all duration-300 ${
            showRewardHistory
              ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 shadow-sm'
              : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400'
          }`}
        >
          <span>🎁</span>
          <span>Rewards</span>
        </button>
      </div>

      {!showRewardHistory ? (
        /* Achievements Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered
            .sort((a, b) => (a.unlocked === b.unlocked ? 0 : a.unlocked ? -1 : 1))
            .map(ach => (
            <Card
              key={ach.id}
              className={`transition-all duration-300 ${
                ach.unlocked
                  ? 'border-white/10'
                  : 'opacity-50 hover:opacity-75'
              }`}
              style={ach.unlocked ? { boxShadow: Gamification.getRarityGlow(ach.rarity) } : undefined}
              hoverEffect={ach.unlocked}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  ach.unlocked ? 'bg-white/5 shadow-inner' : 'bg-white/[0.02]'
                }`}>
                  {ach.unlocked ? ach.icon : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs font-bold truncate ${ach.unlocked ? 'text-white' : 'text-slate-500'}`}>
                      {ach.title}
                    </h4>
                    <span
                      className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full shrink-0"
                      style={{
                        color: Gamification.getRarityColor(ach.rarity),
                        background: `${Gamification.getRarityColor(ach.rarity)}15`,
                        border: `1px solid ${Gamification.getRarityColor(ach.rarity)}30`,
                      }}
                    >
                      {ach.rarity}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{ach.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="amber">
                      +{ach.xpReward} XP
                    </Badge>
                    {ach.unlocked && (
                      <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                        <span>✓</span> Unlocked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Reward History & Collection */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collection */}
          <Card hoverEffect={false}>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
              <span>🗃️</span> Your Collection
            </h3>
            {cosmetics.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">Complete daily plans to earn rewards!</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {cosmetics.map((c, i) => {
                  const [type, name] = c.split(':');
                  return (
                    <div key={i} className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center shadow-inner">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">{type}</div>
                      <div className="text-xs text-white font-bold mt-1 truncate">{name}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recent Rewards */}
          <Card hoverEffect={false}>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
              <span>📜</span> Reward History
            </h3>
            {rewardHistory.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No rewards earned yet. Complete your daily plan!</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                {rewardHistory.slice().reverse().map((entry, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl shadow-inner">
                    <span className="text-xl">{entry.reward.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{entry.reward.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-[8px] font-bold uppercase"
                          style={{ color: Gamification.getRarityColor(entry.reward.rarity) }}
                        >
                          {entry.reward.rarity}
                        </span>
                        <span className="text-[9px] text-slate-500 font-semibold">{entry.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Stats Footer */}
      <Card className="flex flex-wrap justify-center gap-6" hoverEffect={false}>
        {[
          { icon: '🧩', label: 'Puzzles', value: stats.puzzlesSolved },
          { icon: '📖', label: 'Lessons', value: stats.lessonsCompleted },
          { icon: '🔥', label: 'Max Streak', value: stats.maxStreak },
          { icon: '🎯', label: 'Challenges', value: stats.dailyChallengesCompleted },
          { icon: '✨', label: 'Perfect Sets', value: stats.perfectPuzzleSets },
          { icon: '💎', label: 'Total XP', value: user.xp },
        ].map((s, i) => (
          <div key={i} className="text-center min-w-[70px]">
            <span className="text-xl block mb-1">{s.icon}</span>
            <span className="text-sm font-extrabold text-white block">{s.value}</span>
            <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">{s.label}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Achievements;
