import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { AdaptiveEngine, DailyPlan, DailyPlanItem, MissionPosition } from '../core/adaptive-engine';
import { Gamification } from '../core/gamification';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { Board } from '../components/Board';
import { Chess } from 'chess.js';

const TIME_OPTIONS = [
  { value: 5, label: '5 min', desc: 'Quick warm-up', icon: '⚡' },
  { value: 10, label: '10 min', desc: 'Morning routine', icon: '☀️' },
  { value: 15, label: '15 min', desc: 'Focused session', icon: '🎯' },
  { value: 30, label: '30 min', desc: 'Deep practice', icon: '📚' },
  { value: 60, label: '60 min', desc: 'Full workout', icon: '🏋️' },
];

export const DailyLearning: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppStore(s => s.user);
  const addXP = useAppStore(s => s.addXP);

  const [selectedMinutes, setSelectedMinutes] = useState<number>(AdaptiveEngine.getDailyGoalMinutes());
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set(AdaptiveEngine.getCompletedToday()));
  const [showReward, setShowReward] = useState(false);
  const [reward, setReward] = useState<any>(null);
  const [customMinutes, setCustomMinutes] = useState<number>(20);
  const [showCustom, setShowCustom] = useState(false);

  const ratings = AdaptiveEngine.getRatings();
  const profile = AdaptiveEngine.analyzeProfile();
  const dailyChallenges = Gamification.getDailyChallenges();

  const generatePlan = useCallback((mins: number) => {
    const newPlan = AdaptiveEngine.generateDailyPlan(mins);
    setPlan(newPlan);
    setSelectedMinutes(mins);
  }, []);

  useEffect(() => {
    generatePlan(selectedMinutes);
  }, []);

  const handleCompleteItem = (item: DailyPlanItem) => {
    if (completedItems.has(item.title)) return;
    const newCompleted = new Set(completedItems);
    newCompleted.add(item.title);
    setCompletedItems(newCompleted);
    AdaptiveEngine.markPlanItemComplete(item.title);
    addXP(item.xpReward);
    Gamification.incrementStat('lessonsCompleted');
    Gamification.updateChallengeProgress('lessons', 1);

    // Check if all items completed → show reward
    if (plan && newCompleted.size >= plan.items.length && Gamification.canClaimDailyReward()) {
      const drop = Gamification.claimDailyReward();
      setReward(drop);
      setShowReward(true);
      if (drop.value) addXP(drop.value);
    }
  };

  const allComplete = plan ? completedItems.size >= plan.items.length : false;
  const progressPercent = plan ? Math.min(100, (completedItems.size / Math.max(1, plan.items.length)) * 100) : 0;

  const getSkillLabel = (key: string): string => {
    const labels: Record<string, string> = {
      tactical: 'Tactics', strategic: 'Strategy', opening: 'Openings',
      middlegame: 'Middlegame', endgame: 'Endgames', calculation: 'Calculation',
      visualization: 'Visualization', patternRecognition: 'Patterns',
    };
    return labels[key] || key;
  };

  const [activeMission, setActiveMission] = useState<string | null>(null);
  const [missionPosIdx, setMissionPosIdx] = useState(0);
  const [missionFeedback, setMissionFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const [missionSolved, setMissionSolved] = useState<Set<number>>(new Set());

  const handleMissionMove = useCallback((item: DailyPlanItem, _from: string, _to: string, san: string) => {
    if (!item.missionData || missionPosIdx >= item.missionData.length) return;
    const pos = item.missionData[missionPosIdx];
    const normalizedSan = san.replace(/[+#!?]/g, '').replace(/x/g, '').toLowerCase().trim();
    const normalizedSolution = pos.solution[0]?.replace(/[+#!?]/g, '').replace(/x/g, '').toLowerCase().trim();

    if (normalizedSan === normalizedSolution) {
      setMissionFeedback({ correct: true, text: `✅ Correct! ${pos.theme}` });
      const newSolved = new Set(missionSolved);
      newSolved.add(missionPosIdx);
      setMissionSolved(newSolved);
      addXP(5);
      Gamification.updateChallengeProgress('puzzles', 1);
      Gamification.incrementStat('puzzlesSolved');

      // Auto-advance after delay
      setTimeout(() => {
        setMissionFeedback(null);
        if (missionPosIdx < item.missionData!.length - 1) {
          setMissionPosIdx(prev => prev + 1);
        } else {
          // Mission complete
          handleCompleteItem(item);
          setActiveMission(null);
          setMissionPosIdx(0);
          setMissionSolved(new Set());
        }
      }, 1500);
    } else {
      setMissionFeedback({ correct: false, text: `❌ Try again. ${pos.instruction}` });
    }
  }, [missionPosIdx, missionSolved, addXP]);

  const startMission = (item: DailyPlanItem) => {
    setActiveMission(item.title);
    setMissionPosIdx(0);
    setMissionFeedback(null);
    setMissionSolved(new Set());
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500/15 via-emerald-500/10 to-amber-500/8 border border-white/8 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Daily Learning Plan</span>
            <h2 className="text-2xl font-black text-white font-serif mt-1">Your Personalized Training</h2>
            <p className="text-sm text-slate-400 mt-1">Adaptive plan designed around your skill profile and goals.</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="bg-bg-secondary/80 backdrop-blur-md border border-white/5 py-2 px-4 rounded-xl text-center shadow-md">
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Overall</span>
              <span className="text-lg font-bold font-mono text-emerald-400">{profile.overallRating}</span>
            </div>
            <div className="bg-bg-secondary/80 backdrop-blur-md border border-white/5 py-2 px-4 rounded-xl text-center shadow-md">
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Confidence</span>
              <span className="text-lg font-bold font-mono text-amber-400">{Math.round(profile.confidence * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Time Selector + Skill Radar */}
        <div className="flex flex-col gap-4">
          {/* Time Selector */}
          <Card hoverEffect={false}>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
              <span>⏱️</span> Choose Session Length
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {TIME_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => generatePlan(opt.value)}
                  className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                    selectedMinutes === opt.value
                      ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{opt.icon}</span>
                    <div>
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10px] text-slate-500">{opt.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => setShowCustom(!showCustom)}
                className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                  showCustom ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚙️</span>
                  <div>
                    <div className="text-xs font-bold">Custom</div>
                    <div className="text-[10px] text-slate-500">Set your time</div>
                  </div>
                </div>
              </button>
            </div>
            {showCustom && (
              <div className="mt-3 flex gap-2">
                <input
                  type="number"
                  value={customMinutes}
                  min={1}
                  max={180}
                  onChange={e => setCustomMinutes(Math.min(180, Math.max(1, Number(e.target.value))))}
                  className="flex-1 bg-bg-primary border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                />
                <Button
                  onClick={() => generatePlan(customMinutes)}
                  size="sm"
                >
                  Generate
                </Button>
              </div>
            )}
          </Card>

          {/* Skill Ratings */}
          <Card hoverEffect={false}>
            <h3 className="text-sm font-bold text-white mb-3">📊 Skill Profile</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(ratings).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">{getSkillLabel(key)}</span>
                    <span className={`font-mono font-bold ${
                      value < 900 ? 'text-red-400' : value < 1200 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>{value}</span>
                  </div>
                  <ProgressBar
                    percent={(value / 2400) * 100}
                    height={6}
                    gradient={value < 900 ? 'from-red-500 to-red-400' : value < 1200 ? 'from-amber-500 to-amber-400' : 'from-emerald-500 to-emerald-400'}
                  />
                </div>
              ))}
            </div>
            {profile.weakAreas.length > 0 && (
              <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl shadow-inner">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5">Focus Areas</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.weakAreas.map(w => (
                    <Badge variant="amber" key={w} className="capitalize">
                      {getSkillLabel(w)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Center: Daily Plan */}
        <div className="flex flex-col gap-4">
          <Card hoverEffect={false}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">📋 Today's Plan</h3>
                <span className="text-[10px] text-slate-500 font-semibold">{selectedMinutes} min • {plan?.items.length || 0} activities • ~{plan?.estimatedXP || 0} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">{Math.round(progressPercent)}%</span>
                <ProgressBar percent={progressPercent} height={8} className="w-16" />
              </div>
            </div>

            {plan && (
              <div className="flex flex-col gap-3">
                {plan.items.map((item, idx) => {
                  const isCompleted = completedItems.has(item.title);
                  const isActiveMission = activeMission === item.title;
                  const hasMission = item.missionData && item.missionData.length > 0;
                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500/5 border-emerald-500/20 opacity-75'
                          : isActiveMission
                          ? 'bg-amber-500/5 border-amber-500/20'
                          : 'bg-white/5 border-white/5 hover:border-white/15 shadow-sm'
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                            isCompleted ? 'bg-emerald-500/10' : 'bg-white/5'
                          }`}>
                            {isCompleted ? '✅' : item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className={`text-xs font-bold ${isCompleted ? 'text-emerald-400 line-through' : 'text-white'}`}>
                                  {item.title}
                                </h4>
                                <p className="text-[10px] text-slate-500 mt-0.5 font-semibold leading-snug">{item.description}</p>
                                {hasMission && !isCompleted && (
                                  <span className="text-[8px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">
                                    🎯 Interactive Mission
                                  </span>
                                )}
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <span className="text-[10px] text-amber-400 font-bold block">+{item.xpReward} XP</span>
                                <span className="text-[9px] text-slate-600 font-bold block">{item.duration} min</span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              {!isCompleted && !isActiveMission && (
                                <>
                                  {hasMission ? (
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() => startMission(item)}
                                      className="!py-1 !px-3 text-[10px]"
                                    >
                                      🎯 Start Mission
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => navigate(item.route)}
                                      className="!py-1 !px-2.5 text-[10px]"
                                    >
                                      Start →
                                    </Button>
                                  )}
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleCompleteItem(item)}
                                    className="!py-1 !px-2.5 text-[10px]"
                                  >
                                    Mark Done ✓
                                  </Button>
                                </>
                              )}
                              {isActiveMission && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => { setActiveMission(null); setMissionPosIdx(0); setMissionSolved(new Set()); }}
                                  className="!py-1 !px-2.5 text-[10px]"
                                >
                                  Close Mission
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Inline Mission Board */}
                      {isActiveMission && item.missionData && (
                        <div className="border-t border-amber-500/10 p-4 animate-slideUp">
                          <div className="flex flex-col items-center gap-3">
                            {/* Progress */}
                            <div className="flex items-center gap-2 w-full">
                              <span className="text-[10px] font-bold text-amber-400 uppercase">
                                Puzzle {missionPosIdx + 1} of {item.missionData.length}
                              </span>
                              <div className="flex-1 flex gap-1">
                                {item.missionData.map((_, i) => (
                                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                                    missionSolved.has(i) ? 'bg-emerald-500' : i === missionPosIdx ? 'bg-amber-500 animate-pulse' : 'bg-white/10'
                                  }`} />
                                ))}
                              </div>
                            </div>

                            {/* Instruction */}
                            <p className="text-xs text-white font-bold w-full">
                              {item.missionData[missionPosIdx]?.instruction}
                            </p>

                            {/* Board */}
                            <Board
                              fen={item.missionData[missionPosIdx]?.fen || '8/8/8/8/8/8/8/8 w - - 0 1'}
                              interactive={true}
                              onMove={(_from, _to, san) => handleMissionMove(item, _from, _to, san)}
                              size={280}
                            />

                            {/* Feedback */}
                            {missionFeedback && (
                              <div className={`w-full p-3 rounded-xl text-xs font-bold text-center transition-all animate-slideUp ${
                                missionFeedback.correct
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {missionFeedback.text}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {allComplete && (
              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/10 to-violet-500/10 border border-emerald-500/20 rounded-xl text-center shadow-lg">
                <span className="text-2xl block mb-2">🎉</span>
                <h4 className="text-sm font-bold text-white">Daily Plan Completed!</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">Great work! Your dedication is building mastery.</p>
                {!showReward && Gamification.canClaimDailyReward() && (
                  <Button
                    onClick={() => {
                      const drop = Gamification.claimDailyReward();
                      setReward(drop);
                      setShowReward(true);
                      if (drop.value) addXP(drop.value);
                    }}
                    className="mt-4"
                  >
                    🎁 Open Reward Chest
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Daily Challenges + Streak */}
        <div className="flex flex-col gap-4">
          {/* Daily Challenges */}
          <Card hoverEffect={false}>
            <h3 className="text-sm font-bold text-white mb-3">🎯 Daily Challenges</h3>
            <div className="flex flex-col gap-3">
              {dailyChallenges.map((ch) => (
                <div key={ch.id} className={`p-3 rounded-xl border transition-all duration-300 ${
                  ch.completed
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-white/5 border-white/5'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{ch.completed ? '✅' : ch.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-bold ${ch.completed ? 'text-emerald-400' : 'text-white'}`}>{ch.title}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold truncate">{ch.description}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <ProgressBar
                          percent={(ch.current / ch.target) * 100}
                          height={4}
                          gradient={ch.completed ? 'from-emerald-500 to-emerald-400' : 'from-violet-500 to-violet-400'}
                          className="flex-1"
                        />
                        <span className="text-[9px] font-mono text-slate-500 font-bold shrink-0">{ch.current}/{ch.target}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold shrink-0">+{ch.xpReward} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Streak Calendar */}
          <Card hoverEffect={false}>
            <h3 className="text-sm font-bold text-white mb-3">🔥 Streak Calendar</h3>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 28 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - 27 + i);
                const dateStr = d.toISOString().split('T')[0];
                const isActive = Gamification.getStreakCalendar().includes(dateStr);
                const isToday = i === 27;
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-md flex items-center justify-center text-[8px] font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isToday
                        ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                        : 'bg-white/[0.02] text-slate-600 border border-white/5'
                    }`}
                    title={dateStr}
                  >
                    {d.getDate()}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-bold">
              <span className="text-slate-500">4 weeks</span>
              <span className="text-amber-400">🔥 {user.streak} day streak</span>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card hoverEffect={false}>
            <h3 className="text-sm font-bold text-white mb-3">📈 Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Puzzles Solved', value: Gamification.getStats().puzzlesSolved, icon: '🧩' },
                { label: 'Lessons Done', value: Gamification.getStats().lessonsCompleted, icon: '📖' },
                { label: 'Achievements', value: `${Gamification.getUnlockedCount()}/${Gamification.getTotalAchievementCount()}`, icon: '🏆' },
                { label: 'Challenges', value: Gamification.getStats().dailyChallengesCompleted, icon: '🎯' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 p-2.5 rounded-xl text-center shadow-sm">
                  <span className="text-lg block mb-1">{stat.icon}</span>
                  <span className="text-sm font-extrabold text-white block">{stat.value}</span>
                  <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Reward Modal */}
      {showReward && reward && (
        <Modal
          isOpen={showReward}
          onClose={() => setShowReward(false)}
          title={`${reward.rarity.toUpperCase()} REWARD UNLOCKED`}
        >
          <div className="text-center p-4">
            <div className="text-6xl mb-4 animate-bounce">{reward.icon}</div>
            <h3 className="text-xl font-black text-white mb-2">{reward.name}</h3>
            <p className="text-xs text-slate-400 mb-6">
              {reward.type === 'xp' ? `You earned ${reward.value} bonus XP!` : `New ${reward.type} added to your collection!`}
            </p>
            <Button
              onClick={() => setShowReward(false)}
              fullWidth
            >
              Awesome! ✨
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DailyLearning;
