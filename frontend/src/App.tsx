import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Puzzles from './pages/Puzzles';
import MasterGames from './pages/MasterGames';
import OpeningTrainer from './pages/OpeningTrainer';
import EndgameTrainer from './pages/EndgameTrainer';
import CalculationTrainer from './pages/CalculationTrainer';
import BlindfoldTrainer from './pages/BlindfoldTrainer';
import AICoachDashboard from './pages/AICoachDashboard';
import { useAppStore } from './store/useAppStore';

type PageId = 'dashboard' | 'lessons' | 'puzzles' | 'games' | 'openings' | 'endgames' | 'calculation' | 'blindfold' | 'aicoach';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const user = useAppStore(state => state.user) || {
    id: 'user_01',
    email: 'learner@chessos.com',
    xp: 620,
    level: 3,
    puzzleRating: 1450,
    streak: 5
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'lessons', label: 'Lessons Lab', icon: '📚' },
    { id: 'puzzles', label: 'Puzzle Arena', icon: '⚔️' },
    { id: 'games', label: 'Master Games', icon: '🏆' },
    { id: 'openings', label: 'Openings', icon: '📖' },
    { id: 'endgames', label: 'Endgame Lab', icon: '🏁' },
    { id: 'calculation', label: 'Calculation', icon: '🧠' },
    { id: 'blindfold', label: 'Blindfold Vision', icon: '👁️' },
    { id: 'aicoach', label: 'AI Mentor', icon: '🤖' }
  ];

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-bg-secondary border-r border-white/5 flex flex-col justify-between shrink-0">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl text-emerald-500 font-bold">♔</span>
            <h1 className="text-xl font-black text-white font-serif tracking-wide">ChessOS <span className="text-emerald-500 text-xs">PRO</span></h1>
          </div>
          
          <nav className="flex flex-col gap-1.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as PageId)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activePage === item.id 
                    ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/15' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-white/5 bg-bg-tertiary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-bg-primary text-sm">
              L{user.level}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.email}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{user.xp} XP • {user.puzzleRating} Elo</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-bg-secondary/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Workspace</span>
            <span className="text-slate-500">/</span>
            <span className="text-white text-xs font-bold font-mono capitalize">{activePage}</span>
          </div>
          <div className="flex items-center gap-4">
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

        {/* Page Container */}
        <main className="flex-1 overflow-y-auto p-8 bg-bg-primary">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'lessons' && <Lessons />}
          {activePage === 'puzzles' && <Puzzles />}
          {activePage === 'games' && <MasterGames />}
          {activePage === 'openings' && <OpeningTrainer />}
          {activePage === 'endgames' && <EndgameTrainer />}
          {activePage === 'calculation' && <CalculationTrainer />}
          {activePage === 'blindfold' && <BlindfoldTrainer />}
          {activePage === 'aicoach' && <AICoachDashboard />}
        </main>
      </div>
    </div>
  );
};

export default App;
