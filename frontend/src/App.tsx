import React from 'react';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Puzzles from './pages/Puzzles';
import MasterGames from './pages/MasterGames';
import OpeningTrainer from './pages/OpeningTrainer';
import EndgameTrainer from './pages/EndgameTrainer';
import CalculationTrainer from './pages/CalculationTrainer';
import BlindfoldTrainer from './pages/BlindfoldTrainer';
import AICoachDashboard from './pages/AICoachDashboard';
import PlayVsAI from './pages/PlayVsAI';
import SpacedReview from './pages/SpacedReview';
import FoundationsUniversity from './pages/FoundationsUniversity';
import TacticalUniversity from './pages/TacticalUniversity';
import MiddlegameUniversity from './pages/MiddlegameUniversity';
import { useAppStore } from './store/useAppStore';
import { Storage } from './core/storage';

type PageId = 'dashboard' | 'lessons' | 'puzzles' | 'games' | 'openings' | 'endgames' 
  | 'calculation' | 'blindfold' | 'aicoach' | 'play' | 'review' | 'lesson-detail'
  | 'foundations' | 'tactics' | 'middlegame';

const NAV_SECTIONS = [
  {
    title: 'Main',
    items: [
      { id: 'dashboard' as PageId, label: 'Dashboard', icon: '📊' },
      { id: 'foundations' as PageId, label: 'Foundations Uni', icon: '🏫' },
      { id: 'play' as PageId, label: 'Play vs AI', icon: '♟️' },
      { id: 'review' as PageId, label: 'Spaced Review', icon: '🔄' },
    ],
  },
  {
    title: 'GM Training Labs',
    items: [
      { id: 'tactics' as PageId, label: 'Tactics Labs', icon: '🧩' },
      { id: 'calculation' as PageId, label: 'Calculation Lab', icon: '👁️' },
      { id: 'blindfold' as PageId, label: 'Blindfold Lab', icon: '🙈' },
      { id: 'endgames' as PageId, label: 'Endgame Lab', icon: '👑' },
      { id: 'openings' as PageId, label: 'Opening Builder', icon: '🌳' },
    ],
  },
  {
    title: 'Analysis & Study',
    items: [
      { id: 'middlegame' as PageId, label: 'Middlegame Lab', icon: '⚔️' },
      { id: 'lessons' as PageId, label: 'Curriculum', icon: '📚' },
      { id: 'games' as PageId, label: 'Master Games', icon: '🏆' },
      { id: 'aicoach' as PageId, label: 'AI Chess Coach', icon: '🎙️' },
    ],
  },
];

export const App: React.FC = () => {
  const activePage = useAppStore(s => s.activePage);
  const setActivePage = useAppStore(s => s.setActivePage);
  const user = useAppStore(s => s.user);

  // Update streak on mount
  React.useEffect(() => {
    Storage.updateStreak();
    useAppStore.getState().syncFromStorage();
  }, []);

  const xpProgress = user.xp % 250;
  const xpPercentage = (xpProgress / 250) * 100;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'lessons': return <Lessons />;
      case 'lesson-detail': return <Lessons />;
      case 'puzzles': return <Puzzles />;
      case 'games': return <MasterGames />;
      case 'openings': return <OpeningTrainer />;
      case 'endgames': return <EndgameTrainer />;
      case 'calculation': return <CalculationTrainer />;
      case 'blindfold': return <BlindfoldTrainer />;
      case 'aicoach': return <AICoachDashboard />;
      case 'play': return <PlayVsAI />;
      case 'review': return <SpacedReview />;
      case 'foundations': return <FoundationsUniversity />;
      case 'tactics': return <TacticalUniversity />;
      case 'middlegame': return <MiddlegameUniversity />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-bg-secondary border-r border-white/5 flex flex-col justify-between shrink-0 overflow-y-auto">
        <div className="flex flex-col gap-1 p-4">
          {/* Brand */}
          <div className="flex items-center gap-3 px-3 py-4 mb-2">
            <span className="text-3xl font-bold" style={{ color: '#10b981' }}>♚</span>
            <div>
              <h1 className="text-lg font-black text-white tracking-wide leading-tight">ChessOS</h1>
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#10b981' }}>GM MASTERY</span>
            </div>
          </div>

          {/* Nav Sections */}
          {NAV_SECTIONS.map(section => (
            <div key={section.title} className="mb-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-1.5">
                {section.title}
              </div>
              {section.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activePage === item.id
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-white/5">
          <div className="mb-2">
            <div className="flex justify-between text-[10px] font-bold mb-1">
              <span style={{ color: '#fbbf24' }}>LEVEL {user.level}</span>
              <span className="text-slate-400">{user.xp} XP</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%`, background: 'linear-gradient(90deg, #10b981, #fbbf24)' }}
              />
            </div>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{user.puzzleRating}</div>
              <div className="text-[10px] text-slate-500">Elo</div>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: '#f59e0b' }}>🔥 {user.streak}</div>
              <div className="text-[10px] text-slate-500">Streak</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-bg-secondary/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">ChessOS</span>
            <span className="text-slate-600">›</span>
            <span className="text-white text-xs font-bold capitalize">{activePage.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/15 px-3 py-1 rounded-full">
              <span>🔥</span>
              <span>{user.streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-3 py-1 rounded-full">
              <span>💎</span>
              <span>{user.xp} XP</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-bg-primary">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
