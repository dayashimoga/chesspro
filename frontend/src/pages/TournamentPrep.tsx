import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// ============================================================================
// Tournament Preparation Center
// Covers: Clock Training, Opening Prep, Nerves Management, Pre-game Routine
// ============================================================================

type PrepPhase = 'overview' | 'clock' | 'openings' | 'nerves' | 'routine';

interface ClockSettings {
  timeControl: string;
  whiteTime: number;
  blackTime: number;
  increment: number;
}

const TIME_CONTROLS: ClockSettings[] = [
  { timeControl: 'Bullet 1+0', whiteTime: 60, blackTime: 60, increment: 0 },
  { timeControl: 'Bullet 2+1', whiteTime: 120, blackTime: 120, increment: 1 },
  { timeControl: 'Blitz 3+0', whiteTime: 180, blackTime: 180, increment: 0 },
  { timeControl: 'Blitz 3+2', whiteTime: 180, blackTime: 180, increment: 2 },
  { timeControl: 'Blitz 5+0', whiteTime: 300, blackTime: 300, increment: 0 },
  { timeControl: 'Blitz 5+3', whiteTime: 300, blackTime: 300, increment: 3 },
  { timeControl: 'Rapid 10+0', whiteTime: 600, blackTime: 600, increment: 0 },
  { timeControl: 'Rapid 15+10', whiteTime: 900, blackTime: 900, increment: 10 },
  { timeControl: 'Classical 30+0', whiteTime: 1800, blackTime: 1800, increment: 0 },
  { timeControl: 'Classical 90+30', whiteTime: 5400, blackTime: 5400, increment: 30 },
];

const NERVES_TIPS = [
  { icon: '🧘', title: 'Box Breathing', desc: 'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Repeat 4 times before each move.' },
  { icon: '🎯', title: 'Process Focus', desc: 'Don\'t think about the result. Focus ONLY on finding the best move in the current position.' },
  { icon: '💪', title: 'Power Posture', desc: 'Sit up straight, shoulders back. Body language affects your confidence and thinking.' },
  { icon: '⏰', title: 'Time Management', desc: 'Use 1/3 of your time for the first 20 moves. Save time for the critical middle game.' },
  { icon: '🧠', title: 'Blunder Check', desc: 'Before every move, ask: "Can my opponent take anything for free?" This prevents 90% of blunder.' },
  { icon: '📝', title: 'Write It Down', desc: 'Write your move on the scoresheet BEFORE playing it. This extra second catches mistakes.' },
  { icon: '🚶', title: 'Walk Away', desc: 'When stuck, stand up and walk around. Fresh perspective often reveals the best move.' },
  { icon: '💧', title: 'Stay Hydrated', desc: 'Dehydration reduces calculation ability by 20%. Drink water every 15 minutes.' },
];

const PRE_GAME_ROUTINE = [
  { time: '-2 hours', task: 'Light meal — complex carbs + protein (oatmeal, eggs, fruit)', icon: '🍳' },
  { time: '-1 hour', task: 'Review your opening repertoire lines (don\'t study new material)', icon: '📖' },
  { time: '-30 min', task: 'Solve 5-10 easy tactical puzzles to warm up pattern recognition', icon: '🧩' },
  { time: '-15 min', task: 'Box breathing exercises (4×4×4×4) to calm nerves', icon: '🧘' },
  { time: '-5 min', task: 'Positive self-talk: "I am prepared. I will play my best chess."', icon: '💪' },
  { time: 'Game start', task: 'Focus on the first move. Don\'t rush. Check your preparation.', icon: '♟️' },
  { time: 'During game', task: 'Blunder check every move. Manage time. Stay hydrated.', icon: '🎯' },
  { time: 'After game', task: 'Win or lose: analyze what went well and what to improve. No excuses.', icon: '📝' },
];

export const TournamentPrep: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<PrepPhase>('overview');
  const [clockSettings, setClockSettings] = useState<ClockSettings>(TIME_CONTROLS[4]); // 5+0
  const [whiteTime, setWhiteTime] = useState(300);
  const [blackTime, setBlackTime] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [activeClock, setActiveClock] = useState<'white' | 'black'>('white');
  const [moveCount, setMoveCount] = useState(0);

  const addXP = useAppStore(s => s.addXP);

  // Clock timer
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      if (activeClock === 'white') {
        setWhiteTime(prev => {
          if (prev <= 0) { setIsRunning(false); return 0; }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 0) { setIsRunning(false); return 0; }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, activeClock]);

  const resetClock = useCallback((settings: ClockSettings) => {
    setClockSettings(settings);
    setWhiteTime(settings.whiteTime);
    setBlackTime(settings.blackTime);
    setIsRunning(false);
    setActiveClock('white');
    setMoveCount(0);
  }, []);

  const switchClock = () => {
    if (activeClock === 'white') {
      setWhiteTime(prev => prev + clockSettings.increment);
    } else {
      setBlackTime(prev => prev + clockSettings.increment);
    }
    setActiveClock(activeClock === 'white' ? 'black' : 'white');
    setMoveCount(prev => prev + 1);
    if (!isRunning) setIsRunning(true);
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200 font-semibold">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-500">Tournament Center</span>
        <h2 className="text-2xl font-black text-white font-serif">Tournament Preparation</h2>
        <p className="text-xs text-slate-400 mt-1">Train under real tournament conditions — clock pressure, nerves management, and pre-game routines</p>
      </div>

      {/* Phase Navigation */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {([
          { id: 'overview' as PrepPhase, label: '📋 Overview' },
          { id: 'clock' as PrepPhase, label: '⏱️ Clock Training' },
          { id: 'openings' as PrepPhase, label: '📖 Opening Prep' },
          { id: 'nerves' as PrepPhase, label: '🧘 Nerves Management' },
          { id: 'routine' as PrepPhase, label: '📝 Pre-Game Routine' },
        ]).map(p => (
          <button
            key={p.id}
            onClick={() => setPhase(p.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              phase === p.id ? 'bg-orange-500 text-white' : 'hover:bg-white/5 text-slate-400'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {phase === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '⏱️', title: 'Clock Training', desc: 'Practice with real chess clocks. Learn time management at different time controls.', color: 'from-orange-500/10 to-amber-500/10', action: () => setPhase('clock') },
            { icon: '📖', title: 'Opening Prep', desc: 'Review your repertoire. Practice critical lines under time pressure.', color: 'from-blue-500/10 to-cyan-500/10', action: () => setPhase('openings') },
            { icon: '🧘', title: 'Nerves Management', desc: 'Techniques to stay calm under pressure. Breathing, focus, and confidence.', color: 'from-violet-500/10 to-purple-500/10', action: () => setPhase('nerves') },
            { icon: '📝', title: 'Pre-Game Routine', desc: 'Your complete tournament day plan from breakfast to post-game analysis.', color: 'from-emerald-500/10 to-green-500/10', action: () => setPhase('routine') },
          ].map((card, idx) => (
            <button
              key={idx}
              onClick={card.action}
              className={`bg-gradient-to-br ${card.color} border border-white/5 p-6 rounded-2xl text-left hover:border-orange-500/20 transition-all group`}
            >
              <span className="text-3xl block mb-3">{card.icon}</span>
              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{card.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{card.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* Clock Training */}
      {phase === 'clock' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col items-center gap-6">
            {/* Clock Display */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              <button
                onClick={switchClock}
                disabled={activeClock !== 'black' && isRunning}
                className={`p-8 rounded-2xl border-2 text-center transition-all ${
                  activeClock === 'white'
                    ? 'bg-white/10 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-2">White</span>
                <span className={`text-4xl font-mono font-black ${whiteTime <= 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {formatTime(whiteTime)}
                </span>
              </button>

              <button
                onClick={switchClock}
                disabled={activeClock !== 'white' && isRunning}
                className={`p-8 rounded-2xl border-2 text-center transition-all ${
                  activeClock === 'black'
                    ? 'bg-white/10 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-2">Black</span>
                <span className={`text-4xl font-mono font-black ${blackTime <= 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {formatTime(blackTime)}
                </span>
              </button>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant={isRunning ? 'danger' : 'primary'}
                size="md"
              >
                {isRunning ? '⏸ Pause' : '▶ Start'}
              </Button>
              <Button
                onClick={() => resetClock(clockSettings)}
                variant="secondary"
                size="md"
              >
                🔄 Reset
              </Button>
            </div>

            <div className="text-xs text-slate-500">
              Moves played: <span className="text-orange-400 font-bold">{moveCount}</span> • 
              Time control: <span className="text-white font-bold">{clockSettings.timeControl}</span>
              {clockSettings.increment > 0 && ` (+${clockSettings.increment}s increment)`}
            </div>
          </div>

          {/* Time Control Selector */}
          <Card className="p-5" hoverEffect={false}>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Time Controls</h4>
            <div className="flex flex-col gap-2">
              {TIME_CONTROLS.map(tc => (
                <button
                  key={tc.timeControl}
                  onClick={() => resetClock(tc)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    clockSettings.timeControl === tc.timeControl
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {tc.timeControl}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Nerves Management */}
      {phase === 'nerves' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NERVES_TIPS.map((tip, idx) => (
            <Card key={idx} className="flex gap-4 items-start" hoverEffect={false}>
              <span className="text-2xl">{tip.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{tip.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{tip.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pre-Game Routine */}
      {phase === 'routine' && (
        <Card hoverEffect={false}>
          <h4 className="text-sm font-bold text-white mb-4">Your Tournament Day Timeline</h4>
          <div className="border-l-2 border-orange-500/30 pl-6 flex flex-col gap-4 relative">
            {PRE_GAME_ROUTINE.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-orange-500 border-2 border-bg-secondary" />
                <div className="flex items-start gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-orange-400 block">{item.time}</span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">{item.task}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Opening Prep */}
      {phase === 'openings' && (
        <Card className="text-center" hoverEffect={false}>
          <span className="text-5xl block mb-4">📖</span>
          <h3 className="text-lg font-bold text-white mb-2">Opening Repertoire Review</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
            Review your prepared lines under simulated time pressure. Focus on the critical branching points
            where your opponent might deviate.
          </p>
          <Button
            onClick={() => navigate('/opening-university')}
            variant="primary"
          >
            Go to Opening University →
          </Button>
        </Card>
      )}
    </div>
  );
};

export default TournamentPrep;
