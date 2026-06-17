import React, { Suspense, useState } from 'react';
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
import { AuthModal } from './components/AuthModal';
// Lazy-loaded university pages for performance
const CalculationUniversity = React.lazy(() => import('./pages/CalculationUniversity'));
const EndgameUniversity = React.lazy(() => import('./pages/EndgameUniversity'));
const MasterGameUniversity = React.lazy(() => import('./pages/MasterGameUniversity'));
const OpeningUniversity = React.lazy(() => import('./pages/OpeningUniversity'));
const TournamentPrep = React.lazy(() => import('./pages/TournamentPrep'));
import { useAppStore } from './store/useAppStore';
import { Storage } from './core/storage';

type PageId = 'dashboard' | 'lessons' | 'puzzles' | 'games' | 'openings' | 'endgames' 
  | 'calculation' | 'blindfold' | 'aicoach' | 'play' | 'review' | 'lesson-detail'
  | 'foundations' | 'tactics' | 'middlegame'
  | 'calc-university' | 'endgame-university' | 'master-games' | 'opening-university'
  | 'tournament-prep';

const NAV_SECTIONS = [
  {
    title: 'Main',
    items: [
      { id: 'dashboard' as PageId, label: 'Dashboard', icon: '📊' },
      { id: 'play' as PageId, label: 'Play vs AI', icon: '♟️' },
      { id: 'review' as PageId, label: 'Spaced Review', icon: '🔄' },
    ],
  },
  {
    title: 'Chess University',
    items: [
      { id: 'foundations' as PageId, label: 'Foundations', icon: '🏫' },
      { id: 'tactics' as PageId, label: 'Tactics Lab', icon: '🧩' },
      { id: 'calc-university' as PageId, label: 'Calculation', icon: '🧠' },
      { id: 'opening-university' as PageId, label: 'Openings', icon: '🌳' },
      { id: 'middlegame' as PageId, label: 'Middlegame', icon: '⚔️' },
      { id: 'endgame-university' as PageId, label: 'Endgames', icon: '👑' },
      { id: 'master-games' as PageId, label: 'Master Games', icon: '🏆' },
    ],
  },
  {
    title: 'Training Tools',
    items: [
      { id: 'puzzles' as PageId, label: 'Puzzle Trainer', icon: '🎯' },
      { id: 'calculation' as PageId, label: 'Visualization', icon: '👁️' },
      { id: 'blindfold' as PageId, label: 'Blindfold Lab', icon: '🙈' },
      { id: 'endgames' as PageId, label: 'Endgame Drills', icon: '♔' },
      { id: 'tournament-prep' as PageId, label: 'Tournament Prep', icon: '🏅' },
    ],
  },
  {
    title: 'Coach & Study',
    items: [
      { id: 'aicoach' as PageId, label: 'AI Chess Coach', icon: '🎙️' },
      { id: 'lessons' as PageId, label: 'Curriculum', icon: '📚' },
      { id: 'games' as PageId, label: 'Game Database', icon: '📂' },
    ],
  },
];

// Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
          <span className="text-5xl">⚠️</span>
          <h2 className="text-xl font-bold text-white">Something went wrong</h2>
          <p className="text-sm text-slate-400 max-w-md">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-bg-primary font-bold rounded-xl text-sm transition-all"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading skeleton
const PageSkeleton = () => (
  <div className="flex flex-col gap-4 p-6 animate-pulse">
    <div className="h-8 bg-white/5 rounded-xl w-1/3" />
    <div className="h-4 bg-white/5 rounded-lg w-2/3" />
    <div className="grid grid-cols-2 gap-4 mt-4">
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl" />)}
    </div>
  </div>
);

export const App: React.FC = () => {
  const activePage = useAppStore(s => s.activePage);
  const setActivePage = useAppStore(s => s.setActivePage);
  const user = useAppStore(s => s.user);
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const toggleSidebar = useAppStore(s => s.toggleSidebar);
  const closeSidebar = useAppStore(s => s.closeSidebar);
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const logout = useAppStore(s => s.logout);

  const [showAuth, setShowAuth] = useState(false);

  // Update streak on mount
  React.useEffect(() => {
    Storage.updateStreak();
    useAppStore.getState().syncFromStorage();
    // Auto-sync from cloud on mount if authenticated
    if (useAppStore.getState().isAuthenticated) {
      useAppStore.getState().syncFromCloud().catch(() => {});
    }
  }, []);

  // Set document title based on page
  React.useEffect(() => {
    const pageName = activePage.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    document.title = `${pageName} — ChessOS Pro`;
  }, [activePage]);

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
      case 'calc-university': return <Suspense fallback={<PageSkeleton />}><CalculationUniversity /></Suspense>;
      case 'endgame-university': return <Suspense fallback={<PageSkeleton />}><EndgameUniversity /></Suspense>;
      case 'master-games': return <Suspense fallback={<PageSkeleton />}><MasterGameUniversity /></Suspense>;
      case 'opening-university': return <Suspense fallback={<PageSkeleton />}><OpeningUniversity /></Suspense>;
      case 'tournament-prep': return <Suspense fallback={<PageSkeleton />}><TournamentPrep /></Suspense>;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-bg-secondary border-r border-white/5 flex flex-col justify-between shrink-0 overflow-y-auto
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
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
                  id={`nav-${item.id}`}
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
          {/* Auth actions */}
          <div className="mb-3">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-semibold truncate max-w-[140px]">{user.email}</span>
                <button onClick={logout} className="text-[10px] text-slate-500 hover:text-red-400 font-bold transition-colors">
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="w-full text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/5 border border-emerald-500/10 py-2 rounded-lg transition-all hover:bg-emerald-500/10"
              >
                🔗 Sign In to Sync
              </button>
            )}
          </div>

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
        <header className="h-14 bg-bg-secondary/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger - mobile only */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Toggle navigation"
              id="hamburger-menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider hidden sm:inline">ChessOS</span>
              <span className="text-slate-600 hidden sm:inline">›</span>
              <span className="text-white text-xs font-bold capitalize">{activePage.replace(/-/g, ' ')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/15 px-2 sm:px-3 py-1 rounded-full">
              <span>🔥</span>
              <span className="hidden sm:inline">{user.streak} Day </span>
              <span className="sm:hidden">{user.streak}</span>
              <span className="hidden sm:inline">Streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-2 sm:px-3 py-1 rounded-full">
              <span>💎</span>
              <span>{user.xp} XP</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-bg-primary">
          <ErrorBoundary>
            {renderPage()}
          </ErrorBoundary>
        </main>
      </div>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default App;
