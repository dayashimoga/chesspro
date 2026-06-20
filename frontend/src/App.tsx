import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
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
import DailyLearning from './pages/DailyLearning';
import Achievements from './pages/Achievements';
import { AuthModal } from './components/AuthModal';
import { ThemeToggle } from './components/ThemeToggle';
import { BoardSettingsToggle } from './components/BoardSettingsToggle';
// Lazy-loaded university pages for performance
const CalculationUniversity = React.lazy(() => import('./pages/CalculationUniversity'));
const EndgameUniversity = React.lazy(() => import('./pages/EndgameUniversity'));
const MasterGameUniversity = React.lazy(() => import('./pages/MasterGameUniversity'));
const OpeningUniversity = React.lazy(() => import('./pages/OpeningUniversity'));
const TournamentPrep = React.lazy(() => import('./pages/TournamentPrep'));
const PositionAnalysis = React.lazy(() => import('./pages/PositionAnalysis'));
const GameImport = React.lazy(() => import('./pages/GameImport'));
import { useAppStore } from './store/useAppStore';
import { Storage } from './core/storage';
import { Gamification } from './core/gamification';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Main',
    items: [
      { path: '/', label: 'Dashboard', icon: '📊' },
      { path: '/daily', label: 'Daily Plan', icon: '📅' },
      { path: '/play', label: 'Play vs AI', icon: '♟️' },
      { path: '/review', label: 'Spaced Review', icon: '🔄' },
    ],
  },
  {
    title: 'Chess University',
    items: [
      { path: '/foundations', label: 'Foundations', icon: '🏫' },
      { path: '/tactics', label: 'Tactics Lab', icon: '🧩' },
      { path: '/calc-university', label: 'Calculation', icon: '🧠' },
      { path: '/opening-university', label: 'Openings', icon: '🌳' },
      { path: '/middlegame', label: 'Middlegame', icon: '⚔️' },
      { path: '/endgame-university', label: 'Endgames', icon: '👑' },
      { path: '/master-games', label: 'Master Games', icon: '🏆' },
    ],
  },
  {
    title: 'Training Tools',
    items: [
      { path: '/puzzles', label: 'Puzzle Trainer', icon: '🎯' },
      { path: '/calculation', label: 'Visualization', icon: '👁️' },
      { path: '/blindfold', label: 'Blindfold Lab', icon: '🙈' },
      { path: '/endgames', label: 'Endgame Drills', icon: '♔' },
      { path: '/tournament-prep', label: 'Tournament Prep', icon: '🏅' },
      { path: '/analysis', label: 'Position Analysis', icon: '🔬' },
      { path: '/import', label: 'Game Import', icon: '📋' },
    ],
  },
  {
    title: 'Coach & Study',
    items: [
      { path: '/aicoach', label: 'AI Chess Coach', icon: '🎙️' },
      { path: '/lessons', label: 'Curriculum', icon: '📚' },
      { path: '/games', label: 'Game Database', icon: '📂' },
      { path: '/achievements', label: 'Achievements', icon: '🏆' },
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

// Inner app that uses router hooks
const AppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppStore(s => s.user);
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const toggleSidebar = useAppStore(s => s.toggleSidebar);
  const closeSidebar = useAppStore(s => s.closeSidebar);
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const logout = useAppStore(s => s.logout);

  const [showAuth, setShowAuth] = useState(false);
  const [achievementToast, setAchievementToast] = useState<string | null>(null);

  // Update streak and sync on mount
  useEffect(() => {
    Storage.updateStreak();
    useAppStore.getState().syncFromStorage();
    // Sync gamification stats
    const p = Storage.getProgress();
    Gamification.syncStats(p.xp, p.level, p.streak, p.completedLessons.length);
    // Auto-sync from cloud on mount if authenticated
    if (useAppStore.getState().isAuthenticated) {
      useAppStore.getState().syncFromCloud().catch(() => {});
    }
  }, []);

  // Set document title based on route
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const pageName = pathSegments.length > 0
      ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      : 'Dashboard';
    document.title = `${pageName} — ChessOS Pro`;
  }, [location]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  const xpProgress = user.xp % 250;
  const xpPercentage = (xpProgress / 250) * 100;

  // Get current page name from path
  const getCurrentPageName = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return 'Dashboard';
    return pathSegments[pathSegments.length - 1].replace(/-/g, ' ');
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
          <NavLink to="/" className="flex items-center gap-3 px-3 py-4 mb-2 group">
            <span className="text-3xl font-bold group-hover:scale-110 transition-transform" style={{ color: '#10b981' }}>♚</span>
            <div>
              <h1 className="text-lg font-black text-white tracking-wide leading-tight">ChessOS</h1>
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#10b981' }}>GM MASTERY</span>
            </div>
          </NavLink>

          {/* Nav Sections */}
          {NAV_SECTIONS.map(section => (
            <div key={section.title} className="mb-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-1.5">
                {section.title}
              </div>
              {section.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  id={`nav-${item.path.replace(/\//g, '-').slice(1) || 'dashboard'}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                    }`
                  }
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
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
              <span className="text-white text-xs font-bold capitalize">{getCurrentPageName()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <BoardSettingsToggle />
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
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/daily" element={<DailyLearning />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/puzzles" element={<Puzzles />} />
              <Route path="/games" element={<MasterGames />} />
              <Route path="/openings" element={<OpeningTrainer />} />
              <Route path="/endgames" element={<EndgameTrainer />} />
              <Route path="/calculation" element={<CalculationTrainer />} />
              <Route path="/blindfold" element={<BlindfoldTrainer />} />
              <Route path="/aicoach" element={<AICoachDashboard />} />
              <Route path="/play" element={<PlayVsAI />} />
              <Route path="/review" element={<SpacedReview />} />
              <Route path="/foundations" element={<FoundationsUniversity />} />
              <Route path="/tactics" element={<TacticalUniversity />} />
              <Route path="/middlegame" element={<MiddlegameUniversity />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/calc-university" element={<Suspense fallback={<PageSkeleton />}><CalculationUniversity /></Suspense>} />
              <Route path="/endgame-university" element={<Suspense fallback={<PageSkeleton />}><EndgameUniversity /></Suspense>} />
              <Route path="/master-games" element={<Suspense fallback={<PageSkeleton />}><MasterGameUniversity /></Suspense>} />
              <Route path="/opening-university" element={<Suspense fallback={<PageSkeleton />}><OpeningUniversity /></Suspense>} />
              <Route path="/tournament-prep" element={<Suspense fallback={<PageSkeleton />}><TournamentPrep /></Suspense>} />
              <Route path="/analysis" element={<Suspense fallback={<PageSkeleton />}><PositionAnalysis /></Suspense>} />
              <Route path="/import" element={<Suspense fallback={<PageSkeleton />}><GameImport /></Suspense>} />
              {/* Catch-all */}
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Achievement Toast */}
      {achievementToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500/90 to-amber-600/90 border border-amber-400/30 px-5 py-3 rounded-xl shadow-2xl text-sm font-bold text-white animate-fadeIn max-w-md">
          🏆 {achievementToast}
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
};

export default App;
