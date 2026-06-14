// ChessOS — Main Application Entry Point & Router Controller
import { ChessEngine } from './core/chess-engine.js';
import { AIEngine } from './core/ai-engine.js';
import { BoardRenderer } from './core/board-renderer.js';
import { Router } from './core/router.js';
import { Storage, SpacedRepetition } from './core/storage.js';
import { stockfishService } from './core/stockfish-service.js';
import { GuidedSolver } from './core/guided-solver.js';
import { ReplaySystem } from './core/replay-system.js';
import { AICoach } from './core/ai-coach.js';
import { Gamification } from './core/gamification.js';
import { queryPuzzles, getProceduralPuzzles } from './content/puzzle-db.js';
import { MASTER_GAMES, getMasterGame } from './content/master-games-db.js';

import { foundationsContent } from './content/00-foundations.js';
import { tacticsContent } from './content/01-tactics.js';
import { calculationContent } from './content/02-calculation.js';
import { endgameContent } from './content/03-endgames.js';
import { strategyContent } from './content/04-strategy.js';
import { openingsContent } from './content/05-openings.js';
import { masterGamesContent } from './content/06-master-games.js';
import { middlegameContent } from './content/07-middlegame.js';
import { advancedContent } from './content/08-advanced.js';

// ============================================
// Content Registry
// ============================================
const ALL_CONTENT = [
  foundationsContent,
  tacticsContent,
  calculationContent,
  endgameContent,
  strategyContent,
  openingsContent,
  masterGamesContent,
  middlegameContent,
  advancedContent
];

// ============================================
// App State
// ============================================
const state = {
  currentPage: 'home',
  currentModule: null,
  currentLesson: null,
  sidebarOpen: window.innerWidth > 768,
  engine: null,
  ai: new AIEngine(),
  board: null,
  router: new Router(),
  
  // Custom states for redesign modules
  guidedSolver: null,
  replaySystem: null,
  activePuzzle: null,
  
  // Calculation trainer state
  calcActive: false,
  calcTimer: null,
  
  // Blindfold trainer state
  blindfoldMoveList: [],
  blindfoldExpected: null,
  
  // Endgame trainer FEN
  endgameCategory: 'opposition',
  
  // Guess the move state
  guessMoveIdx: 0,
  guessScore: 0,
  guessActive: false
};

// ============================================
// Navigation Sidebar Component
// ============================================
function renderSidebar() {
  const progress = Storage.getProgress();
  const gamState = Gamification.getPlayerState();
  const totalLessons = ALL_CONTENT.reduce((sum, c) => sum + c.modules.length, 0);
  const completedCount = progress.completedLessons.length;

  return `
    <aside class="sidebar ${state.sidebarOpen ? 'open' : ''}" id="sidebar">
      <div class="sidebar-brand">
        <div class="sidebar-brand-icon">♚</div>
        <div class="sidebar-brand-text">
          <h2>ChessOS Pro</h2>
          <span>GM Mastery Platform</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">Main</div>
          <button class="nav-item ${state.currentPage === 'home' ? 'active' : ''}" onclick="App.navigate('/')">
            <span class="nav-item-icon">🏠</span>
            <span>Dashboard</span>
          </button>
          <button class="nav-item ${state.currentPage === 'play' ? 'active' : ''}" onclick="App.navigate('/play')">
            <span class="nav-item-icon">♟️</span>
            <span>Play vs AI</span>
          </button>
          <button class="nav-item ${state.currentPage === 'review' ? 'active' : ''}" onclick="App.navigate('/review')">
            <span class="nav-item-icon">🔄</span>
            <span>Spaced Review</span>
            ${SpacedRepetition.getDueCards().length > 0 ? `<span class="nav-item-badge">${SpacedRepetition.getDueCards().length}</span>` : ''}
          </button>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">GM Training Labs</div>
          <button class="nav-item ${state.currentPage === 'trainer-tactics' ? 'active' : ''}" onclick="App.navigate('/trainer/tactics')">
            <span class="nav-item-icon">🧩</span>
            <span>Tactical Solver</span>
          </button>
          <button class="nav-item ${state.currentPage === 'trainer-calculation' ? 'active' : ''}" onclick="App.navigate('/trainer/calculation')">
            <span class="nav-item-icon">👁️</span>
            <span>Calculation Lab</span>
          </button>
          <button class="nav-item ${state.currentPage === 'trainer-blindfold' ? 'active' : ''}" onclick="App.navigate('/trainer/blindfold')">
            <span class="nav-item-icon">🙈</span>
            <span>Blindfold Lab</span>
          </button>
          <button class="nav-item ${state.currentPage === 'trainer-endgame' ? 'active' : ''}" onclick="App.navigate('/trainer/endgame')">
            <span class="nav-item-icon">👑</span>
            <span>Endgame Lab</span>
          </button>
          <button class="nav-item ${state.currentPage === 'trainer-openings' ? 'active' : ''}" onclick="App.navigate('/trainer/openings')">
            <span class="nav-item-icon">🌳</span>
            <span>Opening Builder</span>
          </button>
          <button class="nav-item ${state.currentPage === 'trainer-strategy' ? 'active' : ''}" onclick="App.navigate('/trainer/strategy')">
            <span class="nav-item-icon">🎯</span>
            <span>Strategy Lab</span>
          </button>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">Analysis & Career</div>
          <button class="nav-item ${state.currentPage === 'coach' ? 'active' : ''}" onclick="App.navigate('/coach')">
            <span class="nav-item-icon">🎙️</span>
            <span>AI Chess Coach</span>
          </button>
          <button class="nav-item ${state.currentPage === 'gamification' ? 'active' : ''}" onclick="App.navigate('/gamification')">
            <span class="nav-item-icon">🏆</span>
            <span>Skill Tree & Bots</span>
          </button>
          <button class="nav-item ${state.currentPage === 'games-study' ? 'active' : ''}" onclick="App.navigate('/games-study')">
            <span class="nav-item-icon">📜</span>
            <span>Master Games</span>
          </button>
        </div>
      </nav>
      
      <div class="sidebar-footer">
        <div style="margin-bottom: var(--space-sm);">
          <div class="flex justify-between" style="font-size: var(--text-xs); font-weight: 700; margin-bottom: 2px;">
            <span style="color: var(--amber-400);">LEVEL ${gamState.level}</span>
            <span>${gamState.xp} XP</span>
          </div>
          <div class="progress-bar" style="height: 4px;">
            <div class="progress-bar-fill" style="width: ${gamState.percent}%; background: linear-gradient(90deg, var(--amber-500), var(--amber-400));"></div>
          </div>
        </div>
        <div class="sidebar-stats">
          <div class="sidebar-stat">
            <div class="sidebar-stat-value">${completedCount}</div>
            <div class="sidebar-stat-label">Lessons</div>
          </div>
          <div class="sidebar-stat">
            <div class="sidebar-stat-value">${progress.puzzleRating}</div>
            <div class="sidebar-stat-label">Elo</div>
          </div>
        </div>
      </div>
    </aside>
  `;
}

// ============================================
// Header Component
// ============================================
function renderHeader(breadcrumbs = []) {
  const progress = Storage.getProgress();
  return `
    <header class="main-header">
      <div class="header-left">
        <button class="menu-toggle" onclick="App.toggleSidebar()" id="menu-toggle">☰</button>
        <div class="breadcrumb">
          <span class="breadcrumb-item" onclick="App.navigate('/')">ChessOS</span>
          ${breadcrumbs.map((b, i) => `
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-item ${i === breadcrumbs.length - 1 ? 'active' : ''}" 
                  ${b.path ? `onclick="App.navigate('${b.path}')"` : ''}>${b.label}</span>
          `).join('')}
        </div>
      </div>
      <div class="header-right">
        <div class="streak-badge">🔥 ${progress.streak} day streak</div>
      </div>
    </header>
  `;
}

// ============================================
// Home Page
// ============================================
function renderHomePage() {
  const progress = Storage.getProgress();
  const gamState = Gamification.getPlayerState();
  const totalLessons = ALL_CONTENT.reduce((sum, c) => sum + c.modules.length, 0);
  const overallPercent = totalLessons > 0 ? Math.round((progress.completedLessons.length / totalLessons) * 100) : 0;
  
  return `
    ${renderHeader()}
    <div class="page-content">
      <div class="flex items-center justify-between" style="margin-bottom: var(--space-xl);">
        <div>
          <h1 class="page-title">Grandmaster <span class="page-title-gradient">ChessOS</span></h1>
          <p class="page-subtitle">Interactive reasoning, visualization, and deep calculation trainers.</p>
        </div>
      </div>
      
      <!-- User Profile Card -->
      <div class="card card-glow" style="margin-bottom: var(--space-xl); display: flex; gap: var(--space-xl); align-items: center;">
        <div style="font-size: 4rem;">👑</div>
        <div style="flex: 1;">
          <h2>Level ${gamState.level} Chess Champion</h2>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">You have earned a total of ${gamState.xp} XP on your journey.</p>
          <div class="progress-bar" style="height: 12px; border-radius: var(--radius-full);">
            <div class="progress-bar-fill" style="width: ${gamState.percent}%; background: linear-gradient(90deg, var(--emerald-500), var(--amber-400));"></div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid" style="margin-bottom: var(--space-2xl);">
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--emerald-400);">${overallPercent}%</div>
          <div class="stat-card-label">Curriculum Done</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--amber-400);">${progress.puzzleRating}</div>
          <div class="stat-card-label">Calculated Rating</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--blue-400);">${progress.puzzlesSolved}</div>
          <div class="stat-card-label">Puzzles Solved</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--purple-400);">${gamState.unlockedAchievements.length}/${ACHIEVEMENTS.length}</div>
          <div class="stat-card-label">Achievements Unlocked</div>
        </div>
      </div>
      
      <!-- Training Laboratories Section -->
      <h2 class="section-title">Lab Training Hub</h2>
      <div class="grid-3" style="margin-bottom: var(--space-2xl);">
        <button class="card card-glow flex flex-col items-center justify-center" onclick="App.navigate('/trainer/tactics')">
          <span style="font-size: 3rem; margin-bottom: var(--space-sm);">🧩</span>
          <h3>Tactical Solver</h3>
          <p style="font-size: var(--text-sm); color: var(--text-secondary); text-align: center;">7-step reasoning & motif parsing.</p>
        </button>
        <button class="card card-glow flex flex-col items-center justify-center" onclick="App.navigate('/trainer/calculation')">
          <span style="font-size: 3rem; margin-bottom: var(--space-sm);">👁️</span>
          <h3>Calculation Lab</h3>
          <p style="font-size: var(--text-sm); color: var(--text-secondary); text-align: center;">Mental calculations and coordinate checks.</p>
        </button>
        <button class="card card-glow flex flex-col items-center justify-center" onclick="App.navigate('/trainer/blindfold')">
          <span style="font-size: 3rem; margin-bottom: var(--space-sm);">🙈</span>
          <h3>Blindfold Lab</h3>
          <p style="font-size: var(--text-sm); color: var(--text-secondary); text-align: center;">Calculate board positions fully blindfolded.</p>
        </button>
      </div>

      <!-- Curriculum Overview -->
      <h2 class="section-title">Structured Curriculum</h2>
      <div class="grid-3">
        ${ALL_CONTENT.map((content, i) => {
          const percent = getModuleCompletionPercent(content.id);
          return `
            <div class="module-card animate-fade-in stagger-${(i % 6) + 1}" onclick="App.navigate('/learn/${content.id}')">
              <div class="module-card-icon">${content.icon}</div>
              <div class="module-card-title">${content.title}</div>
              <div class="module-card-desc">${content.description}</div>
              <div class="progress-bar" style="margin-bottom: var(--space-sm);">
                <div class="progress-bar-fill" style="width: ${percent}%"></div>
              </div>
              <div class="module-card-meta">
                <span>${content.modules.length} lessons</span>
                <span class="badge badge-${getDifficultyBadge(content.difficulty)}">${content.difficulty}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ============================================
// Play Page (Full Chess Player & Boss Challenges)
// ============================================
function renderPlayPage() {
  return `
    ${renderHeader([{ label: 'Play Chess' }])}
    <div class="page-content">
      <h1 class="page-title">Play vs <span class="page-title-gradient">Chess Bots</span></h1>
      <p class="page-subtitle">Challenge various levels of standard AI or historic Chess Masters.</p>
      
      <div class="lesson-layout">
        <div>
          <div class="board-container">
            <div class="board-wrapper" id="play-board"></div>
          </div>
          <div class="board-controls" style="margin-top: var(--space-md); justify-content: center;">
            <button class="btn btn-secondary btn-sm" onclick="App.playUndo()">↩ Undo</button>
            <button class="btn btn-secondary btn-sm" onclick="App.playFlip()">🔄 Flip</button>
            <button class="btn btn-primary btn-sm" onclick="App.playNewGame()">✨ New Game</button>
          </div>
          <div id="play-status" class="card" style="margin-top: var(--space-md); text-align: center; padding: var(--space-md);">
            <span style="font-weight: 600;">White to move</span>
          </div>
        </div>
        <div>
          <!-- Settings -->
          <div class="card" style="margin-bottom: var(--space-lg);">
            <h3 style="font-weight: 700; margin-bottom: var(--space-md);">⚙️ Sparring Partner</h3>
            <div style="margin-bottom: var(--space-md);">
              <label class="label">Difficulty / Personality</label>
              <select id="ai-level" style="width: 100%; margin-top: 4px;" onchange="App.setAILevel(this.value)">
                ${Object.entries(AIEngine.LEVELS).map(([key, val]) => 
                  `<option value="${key}" ${key === 'intermediate' ? 'selected' : ''}>${val.name}</option>`
                ).join('')}
                <option value="bot_morphy">Boss Bot Morphy (Aggressive Tactics)</option>
                <option value="bot_capa">Boss Bot Capablanca (Clean Endgames)</option>
                <option value="bot_tal">Boss Bot Tal (Sacrifices)</option>
              </select>
            </div>
            <div style="margin-bottom: var(--space-md);">
              <label class="label">Play as</label>
              <div class="flex gap-sm" style="margin-top: 4px;">
                <button class="btn btn-primary btn-sm" id="color-white" onclick="App.setPlayerColor('w')">⬜ White</button>
                <button class="btn btn-secondary btn-sm" id="color-black" onclick="App.setPlayerColor('b')">⬛ Black</button>
              </div>
            </div>
          </div>
          
          <!-- Move List -->
          <div class="card">
            <h3 style="font-weight: 700; margin-bottom: var(--space-md);">📋 Moves</h3>
            <div class="move-list" id="play-moves" style="min-height: 150px;">
              <div style="color: var(--text-tertiary); text-align: center; padding: var(--space-lg);">Game not started</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// AI Chess Coach Page
// ============================================
function renderAICoachPage() {
  const coachData = AICoach.getTrainingPlan();
  return `
    ${renderHeader([{ label: 'AI Coach' }])}
    <div class="page-content">
      <h1 class="page-title">Personalized <span class="page-title-gradient">AI Chess Coach</span></h1>
      <p class="page-subtitle">Dynamic performance tracking, weakness diagnosis, and roadmaps.</p>
      
      <div class="grid-2" style="margin-bottom: var(--space-2xl);">
        <!-- Recommendations -->
        <div class="card">
          <h2 style="margin-bottom: var(--space-md);">Daily Training Routine</h2>
          <div style="display: flex; flex-direction: column; gap: var(--space-md);">
            ${coachData.plan.map(p => `
              <div class="card-glass" style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h3 style="font-size: var(--text-base);">${p.title}</h3>
                  <p style="font-size: var(--text-sm); color: var(--text-secondary);">${p.desc}</p>
                </div>
                <button class="btn btn-primary btn-sm" onclick="location.hash='${p.action}'">Launch</button>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Weekly Targets -->
        <div class="card">
          <h2 style="margin-bottom: var(--space-sm);">Weekly Target Goals</h2>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">${coachData.weeklyGoal}</p>
          <div class="flex justify-between" style="font-weight: 700; margin-bottom: 2px;">
            <span>Target Progress</span>
            <span>${coachData.weeklyProgress}%</span>
          </div>
          <div class="progress-bar" style="height: 10px;">
            <div class="progress-bar-fill" style="width: ${coachData.weeklyProgress}%; background: linear-gradient(90deg, var(--emerald-600), var(--emerald-400));"></div>
          </div>
        </div>
      </div>
      
      <!-- Performance Diagnosis -->
      <div class="card">
        <h2 style="margin-bottom: var(--space-md);">Coach's Skills Diagnosis</h2>
        <div class="grid-2">
          <div>
            <h3 style="color: var(--emerald-400); margin-bottom: var(--space-xs);">Verified Strengths</h3>
            <ul>
              ${coachData.stats.strengths.map(s => `<li>✓ Highly developed ${s}</li>`).join('')}
              ${coachData.stats.strengths.length === 0 ? '<li>None detected yet</li>' : ''}
            </ul>
          </div>
          <div>
            <h3 style="color: var(--red-400); margin-bottom: var(--space-xs);">Identified Weaknesses</h3>
            <ul>
              ${coachData.stats.weaknesses.map(w => `<li>✗ Action required: improve ${w}</li>`).join('')}
              ${coachData.stats.weaknesses.length === 0 ? '<li>No critical weaknesses found! Great job.</li>' : ''}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Gamification Skill Tree & Bot Challenges Page
// ============================================
function renderGamificationPage() {
  const pState = Gamification.getPlayerState();
  return `
    ${renderHeader([{ label: 'Skill Tree' }])}
    <div class="page-content">
      <h1 class="page-title">Mastery <span class="page-title-gradient">Skill Tree</span></h1>
      <p class="page-subtitle">Unlock advanced chess nodes and challenge historical chess masters.</p>
      
      <div class="grid-2" style="margin-bottom: var(--space-2xl);">
        <!-- Skill Tree -->
        <div class="card">
          <h2 style="margin-bottom: var(--space-md);">Learning Road Skill Tree</h2>
          <div class="skill-tree-container">
            ${pState.skills.map((s, idx) => `
              <div class="skill-node ${s.unlocked ? 'unlocked' : 'locked'}" id="skill-${s.id}">
                <h3>${s.title}</h3>
                <p style="font-size: var(--text-xs); color: var(--text-secondary);">${s.desc}</p>
                ${!s.unlocked && pState.level >= s.levelRequired ? `
                  <button class="btn btn-primary btn-sm" style="margin-top: var(--space-sm);" onclick="App.unlockSkillNode('${s.id}')">Unlock Node</button>
                ` : ''}
                ${!s.unlocked && pState.level < s.levelRequired ? `
                  <div style="font-size: var(--text-xs); color: var(--red-400); margin-top: var(--space-sm);">Requires Level ${s.levelRequired}</div>
                ` : ''}
              </div>
              ${idx < pState.skills.length - 1 ? '<div class="skill-node-connector"></div>' : ''}
            `).join('')}
          </div>
        </div>
        
        <!-- Achievements -->
        <div class="card">
          <h2 style="margin-bottom: var(--space-md);">Achievements Unlocked</h2>
          <div style="display: flex; flex-direction: column; gap: var(--space-md);">
            ${pState.achievements.map(a => `
              <div class="achievement-card ${a.unlocked ? 'unlocked' : ''}">
                <div class="achievement-icon-container">${a.icon}</div>
                <div>
                  <h3 style="font-size: var(--text-base);">${a.title}</h3>
                  <p style="font-size: var(--text-sm); color: var(--text-secondary);">${a.desc}</p>
                  ${a.unlocked ? '<span style="font-size: var(--text-xs); color: var(--amber-400); font-weight:700;">Unlocked</span>' : '<span style="font-size: var(--text-xs); color: var(--text-tertiary);">Locked</span>'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Specialized Training Labs: Tactical Solver Page
// ============================================
function renderTacticalSolverPage() {
  const puzzles = getProceduralPuzzles().slice(0, 15);
  
  return `
    ${renderHeader([{ label: 'Tactical Solver' }])}
    <div class="page-content">
      <h1 class="page-title">Tactical <span class="page-title-gradient">Guided Solver</span></h1>
      <p class="page-subtitle">Complete guided steps to think, evaluate, and solve like a grandmaster.</p>
      
      <div class="lesson-layout">
        <!-- Chessboard Column -->
        <div>
          <div class="board-container">
            <div class="board-wrapper" id="tactics-board"></div>
          </div>
          <div id="tactics-feedback-popup"></div>
        </div>
        
        <!-- Guided Coach Column -->
        <div>
          <!-- Solver Controls -->
          <div class="card" style="margin-bottom: var(--space-md);">
            <div class="flex justify-between" style="margin-bottom: var(--space-sm);">
              <h3>Guided Puzzle Selection</h3>
            </div>
            <select id="tactics-puzzle-select" style="width: 100%;" onchange="App.loadTacticalPuzzle(this.value)">
              <option value="" disabled selected>-- Select a tactical motif --</option>
              ${puzzles.map(p => `<option value="${p.id}">${p.motif} (${p.difficulty})</option>`).join('')}
            </select>
          </div>
          
          <!-- Step Panel -->
          <div class="card" id="guided-solve-panel" style="display: none;">
            <div class="guided-steps">
              <div class="guided-step-indicator active" id="indicator-1"></div>
              <div class="guided-step-indicator" id="indicator-2"></div>
              <div class="guided-step-indicator" id="indicator-3"></div>
              <div class="guided-step-indicator" id="indicator-4"></div>
              <div class="guided-step-indicator" id="indicator-5"></div>
              <div class="guided-step-indicator" id="indicator-6"></div>
              <div class="guided-step-indicator" id="indicator-7"></div>
            </div>
            
            <div id="guided-step-content" style="min-height: 200px;">
              <!-- Dynamic content goes here -->
            </div>
          </div>

          <!-- Variation & Replay Panel -->
          <div class="card" id="guided-replay-panel" style="display: none;">
            <h2 style="margin-bottom: var(--space-sm);">Exploration & Explanations</h2>
            
            <!-- Controls -->
            <div class="flex gap-sm justify-center" style="margin-bottom: var(--space-md);">
              <button class="btn btn-secondary btn-sm" onclick="App.replayPrev()">◀ Prev</button>
              <button class="btn btn-secondary btn-sm" onclick="App.replayTogglePlay()">▶/⏸ Auto</button>
              <button class="btn btn-secondary btn-sm" onclick="App.replayNext()">Next ▶</button>
            </div>
            
            <div id="replay-annotation-box" class="card-glass" style="margin-bottom: var(--space-md); font-size: var(--text-sm);">
              Select moves to inspect strategies and evaluation changes.
            </div>
            
            <h4 style="margin-bottom: var(--space-xs);">Variation Tree</h4>
            <div id="replay-tree-box"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Specialized Training Labs: Calculation Trainer Page
// ============================================
function renderCalculationPage() {
  return `
    ${renderHeader([{ label: 'Calculation' }])}
    <div class="page-content">
      <h1 class="page-title">Mental <span class="page-title-gradient">Calculation Lab</span></h1>
      <p class="page-subtitle">Pieces disappear from the board. Calculate the sequence mentally.</p>
      
      <div class="lesson-layout">
        <div>
          <div class="board-container">
            <div class="board-wrapper" id="calc-board"></div>
          </div>
          <div class="flex justify-center" style="margin-top: var(--space-md);">
            <button class="btn btn-primary" id="calc-start-btn" onclick="App.startCalculationExercise()">Start Calculation Exercise</button>
          </div>
        </div>
        <div>
          <div class="card" id="calc-instruction-card">
            <h2>Exercise Instructions</h2>
            <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
              1. A tactical position will be loaded on the board for **10 seconds**.<br/>
              2. Memorize the piece locations.<br/>
              3. The pieces will fade completely.<br/>
              4. You will be asked to calculate a forced sequence mentally (e.g. 3 plies deep).<br/>
              5. Click on the final target landing square of the key pieces to solve.
            </p>
          </div>
          
          <div class="card" id="calc-question-card" style="display: none;">
            <h2 id="calc-challenge-header" style="margin-bottom: var(--space-md);"></h2>
            <div id="calc-choices-box"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Specialized Training Labs: Blindfold Trainer Page
// ============================================
function renderBlindfoldPage() {
  return `
    ${renderHeader([{ label: 'Blindfold Trainer' }])}
    <div class="page-content">
      <h1 class="page-title">Blindfold <span class="page-title-gradient">Calculation Lab</span></h1>
      <p class="page-subtitle">Solve puzzles without the help of visual pieces.</p>
      
      <div class="lesson-layout">
        <div>
          <div class="board-container">
            <!-- Completely blank board renderer -->
            <div class="board-wrapper" id="blindfold-board"></div>
          </div>
        </div>
        <div>
          <div class="card">
            <h2>Calculation Log</h2>
            <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">Calculate the lines mentally and input your move in SAN notation (e.g. Nf3, Qh5).</p>
            
            <div id="blindfold-log-box" class="card-glass" style="min-height: 120px; font-family: var(--font-mono); font-size: var(--text-sm); margin-bottom: var(--space-md);">
              Click Start to begin a blindfold exercise.
            </div>

            <div class="blindfold-input-container">
              <input type="text" id="blindfold-move-input" class="blindfold-input" placeholder="Type move e.g. Bxf7" onkeydown="if(event.key==='Enter') App.submitBlindfoldMove(this.value)">
              <button class="btn btn-primary" onclick="App.submitBlindfoldMove(document.getElementById('blindfold-move-input').value)">Submit</button>
            </div>
            
            <div class="flex justify-center" style="margin-top: var(--space-lg);">
              <button class="btn btn-amber btn-sm" onclick="App.startBlindfoldExercise()">Start Blindfold Exercise</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Specialized Training Labs: Endgame Trainer Page
// ============================================
function renderEndgamePage() {
  return `
    ${renderHeader([{ label: 'Endgame Trainer' }])}
    <div class="page-content">
      <h1 class="page-title">Theoretical <span class="page-title-gradient">Endgame Lab</span></h1>
      <p class="page-subtitle">Play theoretical endgame structures against Stockfish.</p>
      
      <div class="lesson-layout">
        <div>
          <div class="board-container">
            <div class="board-wrapper" id="endgame-board"></div>
          </div>
          <div class="board-controls" style="margin-top: var(--space-md); justify-content: center;">
            <button class="btn btn-secondary btn-sm" onclick="App.resetEndgame()">Reset Position</button>
          </div>
        </div>
        <div>
          <div class="card">
            <h2>Select Theoretical Structure</h2>
            <div class="flex flex-col gap-sm" style="margin-top: var(--space-md); margin-bottom: var(--space-lg);">
              <button class="btn btn-secondary btn-sm text-left" onclick="App.loadEndgameStructure('opposition')">King & Pawn: The Opposition</button>
              <button class="btn btn-secondary btn-sm text-left" onclick="App.loadEndgameStructure('lucena')">Rook Ending: Lucena Bridge</button>
              <button class="btn btn-secondary btn-sm text-left" onclick="App.loadEndgameStructure('philidor')">Rook Ending: Philidor Defense</button>
            </div>
            
            <div class="card-glass" id="endgame-coach-note" style="font-size: var(--text-sm);">
              Select a position above to practice against Stockfish.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Specialized Training Labs: Opening Trainer Page
// ============================================
function renderOpeningPage() {
  const openings = openingsContent.modules;
  return `
    ${renderHeader([{ label: 'Opening Trainer' }])}
    <div class="page-content">
      <h1 class="page-title">Opening <span class="page-title-gradient">Spaced Review</span></h1>
      <p class="page-subtitle">Construct and review your opening repertoire with spaced repetition scheduling.</p>
      
      <div class="lesson-layout">
        <div>
          <div class="board-container">
            <div class="board-wrapper" id="opening-rep-board"></div>
          </div>
        </div>
        <div>
          <div class="card">
            <h2>Repertoire List</h2>
            <div style="display: flex; flex-direction: column; gap: var(--space-sm); margin-top: var(--space-md);">
              ${openings.map(o => `
                <div class="card-glass flex justify-between items-center">
                  <div>
                    <strong>${o.title}</strong>
                    <div style="font-size: var(--text-xs); color: var(--text-secondary);">Spaced interval: 1 day</div>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="App.startOpeningRepertoireReview('${o.id}')">Review</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Specialized Training Labs: Strategy Trainer Page
// ============================================
function renderStrategyPage() {
  return `
    ${renderHeader([{ label: 'Strategy Lab' }])}
    <div class="page-content">
      <h1 class="page-title">Positional <span class="page-title-gradient">Strategy Lab</span></h1>
      <p class="page-subtitle">Assess static imbalances and decide optimal strategic plans.</p>
      
      <div class="card card-glow" style="margin-bottom: var(--space-xl);">
        <h2>Imbalances Assessment Challenge</h2>
        <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">Evaluate the pawn structure, outposts, and piece activity to choose the best strategic plan.</p>
        
        <div class="lesson-layout">
          <div class="board-wrapper" id="strategy-board"></div>
          <div>
            <div class="card-glass" style="margin-bottom: var(--space-md);">
              <strong>Imbalances Clues:</strong>
              <ul style="margin-top: var(--space-sm); font-size: var(--text-sm);">
                <li>• White knight has potential outpost on d5.</li>
                <li>• Black has an isolated pawn on d5.</li>
                <li>• White king safety is secure.</li>
              </ul>
            </div>
            
            <h3>Choose the correct plan:</h3>
            <div class="flex flex-col gap-sm" style="margin-top: var(--space-md);">
              <button class="btn btn-secondary btn-sm text-left" onclick="App.submitStrategyPlan(true)">Blockade the isolated d5 pawn with the knight, then trade active minor pieces.</button>
              <button class="btn btn-secondary btn-sm text-left" onclick="App.submitStrategyPlan(false)">Launch an immediate king pawn storm on the g-file to exploit open files.</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Interactive Master Games List Page
// ============================================
function renderMasterGamesPage() {
  return `
    ${renderHeader([{ label: 'Master Games' }])}
    <div class="page-content">
      <h1 class="page-title">Master <span class="page-title-gradient">Game Studies</span></h1>
      <p class="page-subtitle">Learn from legendary games using the interactive Guess-the-Move trainer.</p>
      
      <div class="grid-3">
        ${MASTER_GAMES.map(g => `
          <div class="module-card" onclick="App.navigate('/learn/master-games/${g.id}')">
            <div class="module-card-icon">🏆</div>
            <div class="module-card-title">${g.white} vs ${g.black}</div>
            <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-top: var(--space-xs);">${g.event} (${g.date})</p>
            <div class="module-card-meta" style="margin-top: var(--space-md);">
              <span class="badge badge-emerald">${g.result}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============================================
// Interactive Master Game Study View Page
// ============================================
function renderMasterGameStudyView(gameId) {
  const game = getMasterGame(gameId);
  if (!game) return renderNotFound();

  return `
    ${renderHeader([
      { label: 'Master Games', path: '/games-study' },
      { label: `${game.white} vs ${game.black}` }
    ])}
    <div class="page-content">
      <div class="flex justify-between items-center" style="margin-bottom: var(--space-xl);">
        <div>
          <h1 class="page-title">${game.white} vs ${game.black}</h1>
          <p class="page-subtitle" style="margin-bottom: 0;">${game.event} (${game.date}) — Result: ${game.result}</p>
        </div>
        <div id="guess-score-badge" class="badge badge-amber" style="display: none; font-size: var(--text-lg); padding: var(--space-sm) var(--space-lg);">Score: 0</div>
      </div>

      <div class="lesson-layout">
        <!-- Board Column -->
        <div>
          <div class="board-container">
            <div class="board-wrapper" id="master-study-board"></div>
          </div>
          
          <div class="board-controls" style="margin-top: var(--space-md); justify-content: center;">
            <button class="btn btn-secondary btn-sm" onclick="App.replayPrev()">◀ Prev</button>
            <button class="btn btn-secondary btn-sm" onclick="App.replayTogglePlay()">▶/⏸ Auto</button>
            <button class="btn btn-secondary btn-sm" onclick="App.replayNext()">Next ▶</button>
          </div>
        </div>
        
        <!-- Sidebar Column -->
        <div>
          <!-- Guess the Move Challenge -->
          <div class="card" id="guess-move-card" style="margin-bottom: var(--space-md);">
            <h2>Guess the Master's Move</h2>
            <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">Can you predict Paul Morphy's next moves? Make a move on the board to check accuracy!</p>
            <button class="btn btn-primary btn-sm" onclick="App.startGuessMoveChallenge()">Start Challenge</button>
          </div>

          <!-- Explanations Box -->
          <div class="card" id="master-replay-card">
            <h3 style="margin-bottom: var(--space-sm);">GM Commentary</h3>
            <div id="master-commentary-box" class="card-glass" style="min-height: 120px; font-size: var(--text-sm);">
              Press Next or Play to review move-by-move strategies.
            </div>
            
            <h4 style="margin-top: var(--space-lg); margin-bottom: var(--space-xs);">Moves Replayed</h4>
            <div id="master-moves-list-box"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Interactive Spaced Repetition Review Page
// ============================================
function renderReviewPage() {
  const dueCards = SpacedRepetition.getDueCards();
  const stats = SpacedRepetition.getStats();
  
  return `
    ${renderHeader([{ label: 'Spaced Review' }])}
    <div class="page-content">
      <h1 class="page-title">Spaced <span class="page-title-gradient">Review</span></h1>
      <p class="page-subtitle">${dueCards.length} cards due for review.</p>
      
      ${dueCards.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">🎉</div>
          <div class="empty-state-title">All caught up!</div>
          <div class="empty-state-desc">No cards are due for review. Complete more lessons and solve puzzles to add cards to your review queue.</div>
          <button class="btn btn-primary" onclick="App.navigate('/learn/foundations')">Continue Learning</button>
        </div>
      ` : `
        <div style="max-width: 600px; margin: 0 auto;">
          <div class="flashcard" id="flashcard" onclick="App.flipCard()">
            <div class="flashcard-inner" id="flashcard-inner">
              <div class="flashcard-front">
                <div style="font-size: var(--text-sm); color: var(--text-tertiary); margin-bottom: var(--space-md);">
                  ${dueCards[0].category.toUpperCase()}
                </div>
                <div style="font-size: var(--text-lg); font-weight: 600; text-align: center;">
                  ${dueCards[0].front}
                </div>
                ${dueCards[0].fen ? '<div class="board-wrapper" id="srs-board" style="margin-top: var(--space-lg);"></div>' : ''}
                <div style="margin-top: var(--space-lg); font-size: var(--text-sm); color: var(--text-tertiary);">
                  Click to reveal answer
                </div>
              </div>
              <div class="flashcard-back">
                <div style="font-size: var(--text-lg); font-weight: 600; text-align: center; margin-bottom: var(--space-lg);">
                  ${dueCards[0].back}
                </div>
                <div class="flashcard-rating-buttons">
                  <button class="btn btn-sm" style="background: var(--red-500); color: white;" onclick="event.stopPropagation(); App.rateCard('${dueCards[0].id}', 1)">Again</button>
                  <button class="btn btn-sm" style="background: var(--amber-500); color: white;" onclick="event.stopPropagation(); App.rateCard('${dueCards[0].id}', 3)">Hard</button>
                  <button class="btn btn-sm" style="background: var(--emerald-500); color: white;" onclick="event.stopPropagation(); App.rateCard('${dueCards[0].id}', 4)">Good</button>
                  <button class="btn btn-sm" style="background: var(--blue-500); color: white;" onclick="event.stopPropagation(); App.rateCard('${dueCards[0].id}', 5)">Easy</button>
                </div>
              </div>
            </div>
          </div>
          <div style="text-align: center; margin-top: var(--space-lg); color: var(--text-tertiary);">
            ${dueCards.length - 1} cards remaining
          </div>
        </div>
      `}
    </div>
  `;
}

// ============================================
// Lessons Overhaul Rendering (Watch, Read, Play, Practice, Test)
// ============================================
function renderLearnPage(moduleId, lessonId) {
  const content = ALL_CONTENT.find(c => c.id === moduleId);
  if (!content) return renderNotFound();
  
  if (lessonId) {
    const lesson = content.modules.find(m => m.id === lessonId);
    if (!lesson) return renderNotFound();
    return renderLessonPageHTML(content, lesson);
  }
  
  const progress = Storage.getProgress();
  
  return `
    ${renderHeader([{ label: content.title }])}
    <div class="page-content">
      <div class="flex items-center gap-lg" style="margin-bottom: var(--space-xl);">
        <div style="font-size: 3rem;">${content.icon}</div>
        <div>
          <h1 class="page-title">${content.title}</h1>
          <p class="page-subtitle" style="margin-bottom: 0;">${content.description}</p>
        </div>
      </div>
      
      <div class="progress-bar" style="margin-bottom: var(--space-2xl); height: 8px;">
        <div class="progress-bar-fill" style="width: ${getModuleCompletionPercent(moduleId)}%"></div>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        ${content.modules.map((module, i) => {
          const isComplete = progress.completedLessons.includes(`${moduleId}/${module.id}`);
          return `
            <div class="card card-glow animate-fade-in stagger-${(i % 6) + 1}" 
                 style="cursor: pointer;" 
                 onclick="App.navigate('/learn/${moduleId}/${module.id}')">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-md">
                  <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: ${isComplete ? 'var(--emerald-600)' : 'var(--bg-tertiary)'}; display: flex; align-items: center; justify-content: center; font-weight: 700; color: ${isComplete ? 'white' : 'var(--text-tertiary)'};">
                    ${isComplete ? '✓' : i + 1}
                  </div>
                  <div>
                    <div style="font-weight: 700; font-size: var(--text-lg);">${module.title}</div>
                    <div style="font-size: var(--text-sm); color: var(--text-secondary);">
                      <span class="badge badge-${getDifficultyBadge(module.difficulty)}">${module.difficulty}</span>
                    </div>
                  </div>
                </div>
                <div style="font-size: var(--text-xl); color: var(--text-tertiary);">→</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderLessonPageHTML(content, lesson) {
  const lessonId = `${content.id}/${lesson.id}`;
  const isComplete = Storage.getProgress().completedLessons.includes(lessonId);
  
  return `
    ${renderHeader([
      { label: content.title, path: `/learn/${content.id}` },
      { label: lesson.title }
    ])}
    <div class="page-content">
      <div class="flex items-center justify-between" style="margin-bottom: var(--space-xl);">
        <div>
          <h1 class="page-title">${lesson.title}</h1>
          <div class="flex items-center gap-md">
            <span class="badge badge-${getDifficultyBadge(lesson.difficulty)}">${lesson.difficulty}</span>
            ${isComplete ? '<span class="badge badge-emerald">✓ Completed</span>' : ''}
          </div>
        </div>
      </div>
      
      <!-- Tabs (Watch, Read, Play, Practice, Test) -->
      <div class="tabs" id="lesson-tabs">
        <button class="tab active" onclick="App.switchLessonTab('watch')">🎬 Watch</button>
        <button class="tab" onclick="App.switchLessonTab('theory')">📖 Read</button>
        <button class="tab" onclick="App.switchLessonTab('examples')">🎯 Play</button>
        <button class="tab" onclick="App.switchLessonTab('exercises')">✏️ Practice</button>
        <button class="tab" onclick="App.switchLessonTab('test')">🧩 Test</button>
      </div>
      
      <!-- Watch Tab -->
      <div id="tab-watch" class="lesson-tab-content">
        <div class="lesson-layout">
          <div class="lesson-text">
            <h2>Animated Overview</h2>
            <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
              Study the visual patterns and laser lines projected on the board. These rays demonstrate the geometry of the specific motif.
            </p>
            <button class="btn btn-primary" onclick="App.triggerWatchAnimation('${lesson.id}')">Play Animation</button>
          </div>
          <div>
            <div class="board-wrapper" id="watch-board"></div>
          </div>
        </div>
      </div>
      
      <!-- Read/Theory Tab -->
      <div id="tab-theory" class="lesson-tab-content" style="display: none;">
        <div class="lesson-layout">
          <div class="lesson-text">${lesson.theory || ''}</div>
          <div>
            <div class="board-wrapper" id="lesson-board"></div>
          </div>
        </div>
      </div>
      
      <!-- Play/Examples Tab -->
      <div id="tab-examples" class="lesson-tab-content" style="display: none;">
        <div class="lesson-layout">
          <div>
            ${(lesson.examples || []).map((ex, i) => `
              <div class="card" style="margin-bottom: var(--space-md); cursor: pointer;" 
                   onclick="App.loadExample('${ex.fen}', ${i})">
                <div style="font-weight: 700; margin-bottom: var(--space-xs);">${ex.title}</div>
                <p style="font-size: var(--text-sm); color: var(--text-secondary);">${ex.description}</p>
              </div>
            `).join('')}
          </div>
          <div>
            <div class="board-wrapper" id="example-board"></div>
          </div>
        </div>
      </div>
      
      <!-- Practice/Exercises Tab -->
      <div id="tab-exercises" class="lesson-tab-content" style="display: none;">
        <div id="exercises-container">
          ${renderExercises(lesson.exercises || [])}
        </div>
      </div>
      
      <!-- Test Tab -->
      <div id="tab-test" class="lesson-tab-content" style="display: none;">
        <div class="lesson-layout">
          <div>
            <h3>Theme Test Challenges</h3>
            <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">Solve tactical puzzles directly associated with the lesson material to secure full completion.</p>
            ${(lesson.puzzles || []).map((puzzle, i) => `
              <div class="card" style="margin-bottom: var(--space-md);" id="puzzle-card-${i}">
                <div class="flex justify-between items-center" style="margin-bottom: var(--space-sm);">
                  <strong>Challenge #${i + 1}</strong>
                  <button class="btn btn-primary btn-sm" onclick="App.loadLessonTestPuzzle(${i}, '${content.id}', '${lesson.id}')">Start solving</button>
                </div>
              </div>
            `).join('')}
          </div>
          <div>
            <div class="board-wrapper" id="puzzle-board"></div>
            <div id="puzzle-status" class="card" style="margin-top: var(--space-md); padding: var(--space-md); text-align: center; display: none;"></div>
          </div>
        </div>
      </div>
      
      <!-- Complete Button -->
      <div style="text-align: center; margin-top: var(--space-2xl);">
        ${!isComplete ? `
          <button class="btn btn-primary btn-lg" onclick="App.completeLesson('${lessonId}')">
            ✓ Mark as Complete (+50 XP)
          </button>
        ` : `
          <div class="badge badge-emerald" style="font-size: var(--text-lg); padding: var(--space-sm) var(--space-xl);">
            ✓ Lesson Completed
          </div>
        `}
      </div>
    </div>
  `;
}

function renderExercises(exercises) {
  if (!exercises || exercises.length === 0) {
    return '<div class="empty-state"><div class="empty-state-icon">✏️</div><div class="empty-state-title">No exercises yet</div></div>';
  }
  
  return exercises.map((ex, i) => {
    if (ex.type === 'quiz') {
      return `
        <div class="quiz-card" id="quiz-${i}" style="margin-bottom: var(--space-md);">
          <div class="quiz-question">${i + 1}. ${ex.question}</div>
          <div class="quiz-options" style="margin-top: var(--space-sm); display: flex; flex-direction: column; gap: var(--space-xs);">
            ${ex.options.map((opt, j) => `
              <button class="quiz-option" onclick="App.answerQuiz(${i}, ${j}, ${ex.answer})" id="quiz-${i}-opt-${j}" style="text-align: left; padding: var(--space-sm); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                <span>${opt}</span>
              </button>
            `).join('')}
          </div>
          <div id="quiz-explanation-${i}" style="display: none; margin-top: var(--space-md);">
            <div class="hint-box">
              <div style="font-size: var(--text-sm); color: var(--text-secondary);">${ex.explanation}</div>
            </div>
          </div>
        </div>
      `;
    }
    return '';
  }).join('');
}

// ============================================
// Not Found & Helpers
// ============================================
function renderNotFound() {
  return `
    ${renderHeader()}
    <div class="page-content">
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-title">Page Not Found</div>
        <button class="btn btn-primary" onclick="App.navigate('/')">Go Home</button>
      </div>
    </div>
  `;
}

function getModuleCompletionPercent(moduleId) {
  const content = ALL_CONTENT.find(c => c.id === moduleId);
  if (!content) return 0;
  const progress = Storage.getProgress();
  const completed = content.modules.filter(m => 
    progress.completedLessons.includes(`${moduleId}/${m.id}`)
  ).length;
  return content.modules.length > 0 ? Math.round((completed / content.modules.length) * 100) : 0;
}

function getDifficultyBadge(difficulty) {
  const map = { beginner: 'emerald', intermediate: 'blue', advanced: 'amber', expert: 'red', master: 'purple' };
  return map[difficulty] || 'emerald';
}

// ============================================
// App Controller Implementation
// ============================================
const App = {
  // Navigation
  navigate(path) {
    state.router.navigate(path);
  },

  toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open', state.sidebarOpen);
    }
  },

  // Main Render entry
  render() {
    const app = document.getElementById('app');
    const path = state.router.currentPath();
    
    let content = '';
    
    if (path === '/' || path === '') {
      state.currentPage = 'home';
      content = renderHomePage();
    } else if (path === '/play') {
      state.currentPage = 'play';
      content = renderPlayPage();
    } else if (path === '/review') {
      state.currentPage = 'review';
      content = renderReviewPage();
    } else if (path === '/coach') {
      state.currentPage = 'coach';
      content = renderAICoachPage();
    } else if (path === '/gamification') {
      state.currentPage = 'gamification';
      content = renderGamificationPage();
    } else if (path === '/trainer/tactics') {
      state.currentPage = 'trainer-tactics';
      content = renderTacticalSolverPage();
    } else if (path === '/trainer/calculation') {
      state.currentPage = 'trainer-calculation';
      content = renderCalculationPage();
    } else if (path === '/trainer/blindfold') {
      state.currentPage = 'trainer-blindfold';
      content = renderBlindfoldPage();
    } else if (path === '/trainer/endgame') {
      state.currentPage = 'trainer-endgame';
      content = renderEndgamePage();
    } else if (path === '/trainer/openings') {
      state.currentPage = 'trainer-openings';
      content = renderOpeningPage();
    } else if (path === '/trainer/strategy') {
      state.currentPage = 'trainer-strategy';
      content = renderStrategyPage();
    } else if (path === '/games-study') {
      state.currentPage = 'games-study';
      content = renderMasterGamesPage();
    } else if (path.startsWith('/learn/master-games/')) {
      state.currentPage = 'master-study';
      const parts = path.split('/').filter(Boolean);
      content = renderMasterGameStudyView(parts[2]);
    } else if (path.startsWith('/learn/')) {
      state.currentPage = 'learn';
      const parts = path.split('/').filter(Boolean);
      state.currentModule = parts[1];
      state.currentLesson = parts[2] || null;
      content = renderLearnPage(parts[1], parts[2]);
    } else {
      content = renderNotFound();
    }

    app.innerHTML = `
      <div class="app-layout">
        ${renderSidebar()}
        <main class="main-content">
          ${content}
        </main>
      </div>
    `;

    // Post-render initialization
    this._postRender(path);
    Storage.updateStreak();
  },

  _postRender(path) {
    if (path === '/play') {
      this._initPlayBoard();
    } else if (path === '/trainer/tactics') {
      this._initTacticsBoard();
    } else if (path === '/trainer/calculation') {
      this._initCalculationBoard();
    } else if (path === '/trainer/blindfold') {
      this._initBlindfoldBoard();
    } else if (path === '/trainer/endgame') {
      this._initEndgameBoard();
    } else if (path === '/trainer/openings') {
      this._initOpeningRepBoard();
    } else if (path === '/trainer/strategy') {
      this._initStrategyBoard();
    } else if (path.startsWith('/learn/master-games/')) {
      const parts = path.split('/').filter(Boolean);
      this._initMasterStudyBoard(parts[2]);
    } else if (path.startsWith('/learn/') && state.currentLesson) {
      this._initLessonBoards();
    }
  },

  // ============================================
  // Play vs Bots
  // ============================================
  _playerColor: 'w',
  _aiLevel: 'intermediate',

  _initPlayBoard() {
    state.engine = new ChessEngine();
    const container = document.getElementById('play-board');
    if (!container) return;
    
    const size = Math.min(container.parentElement.offsetWidth - 16, 420);
    state.board = new BoardRenderer(container, {
      size,
      interactive: true,
      onMove: (from, to, promotion) => {
        const move = state.engine.move({ from, to, promotion });
        if (move) {
          this._updatePlayBoard();
          if (!state.engine.isGameOver() && state.engine.turn() !== this._playerColor) {
            setTimeout(() => this._aiMove(), 300);
          }
        }
      },
      onSquareClick: (square, piece) => {
        if (piece.color === state.engine.turn() && piece.color === this._playerColor) {
          return state.engine.legalMoves(square);
        }
        return null;
      }
    });

    this._updatePlayBoard();
  },

  _updatePlayBoard() {
    if (!state.board || !state.engine) return;
    state.board.setPosition(state.engine.board(), state.engine.lastMove());
    
    // Status text
    const statusEl = document.getElementById('play-status');
    if (statusEl) {
      statusEl.innerHTML = `<strong>${state.engine.statusText()}</strong>`;
    }
  },

  _aiMove() {
    if (!state.engine || state.engine.isGameOver()) return;
    
    // Check if playing a Boss Bot
    if (this._aiLevel.startsWith('bot_')) {
      this._handleBossBotMove();
    } else {
      const move = state.ai.findBestMove(state.engine.fen(), this._aiLevel);
      if (move) {
        state.engine.move(move);
        this._updatePlayBoard();
      }
    }
  },

  _handleBossBotMove() {
    // Custom bot behaviors using Stockfish worker or Minimax
    const fen = state.engine.fen();
    stockfishService.analyze(fen, 10).then(result => {
      if (result.bestMove) {
        state.engine.move(result.bestMove);
        this._updatePlayBoard();
      }
    });
  },

  playUndo() {
    if (state.engine) {
      state.engine.undo();
      state.engine.undo();
      this._updatePlayBoard();
    }
  },

  playFlip() {
    if (state.board) state.board.flip();
  },

  playNewGame() {
    if (state.engine) {
      state.engine.reset();
      this._updatePlayBoard();
      if (this._playerColor === 'b') {
        setTimeout(() => this._aiMove(), 500);
      }
    }
  },

  setAILevel(level) {
    this._aiLevel = level;
  },

  setPlayerColor(color) {
    this._playerColor = color;
    this.playNewGame();
  },

  // ============================================
  // Tactical Solver (Guided Solve Mode)
  // ============================================
  _initTacticsBoard() {
    const container = document.getElementById('tactics-board');
    if (!container) return;
    const size = Math.min(container.parentElement.offsetWidth - 16, 420);
    state.board = new BoardRenderer(container, {
      size,
      interactive: true,
      onMove: (from, to) => {
        if (state.guidedSolver) {
          if (state.guidedSolver.step === 4) {
            state.guidedSolver.addCandidateMove(from, to);
          } else if (state.guidedSolver.step === 6) {
            state.guidedSolver.submitResponseMove(from, to);
          }
        }
      },
      onSquareClick: (square, piece) => {
        if (state.guidedSolver && (state.guidedSolver.step === 4 || state.guidedSolver.step === 6)) {
          return state.guidedSolver.engine.legalMoves(square);
        }
        return null;
      }
    });
  },

  loadTacticalPuzzle(puzzleId) {
    const puzzle = queryPuzzles({ id: puzzleId })[0];
    if (!puzzle) return;
    state.activePuzzle = puzzle;

    // Reset panel visibility
    document.getElementById('guided-solve-panel').style.display = 'block';
    document.getElementById('guided-replay-panel').style.display = 'none';

    state.board.setFEN(puzzle.FEN);
    
    // Initialize Guided Solver controller
    state.guidedSolver = new GuidedSolver(state.board, puzzle, {
      onStepChange: (step) => this._renderGuidedSolveStep(step),
      onComplete: () => this._onGuidedSolveComplete(),
      onFeedback: (fb) => this._renderGuidedFeedback(fb)
    });

    this._renderGuidedSolveStep(1);
  },

  _renderGuidedSolveStep(step) {
    // Clear indicator states
    for (let i = 1; i <= 7; i++) {
      const ind = document.getElementById(`indicator-${i}`);
      if (ind) {
        ind.className = 'guided-step-indicator';
        if (i < step) ind.classList.add('complete');
        if (i === step) ind.classList.add('active');
      }
    }

    const box = document.getElementById('guided-step-content');
    if (!box) return;

    if (step === 1) {
      box.innerHTML = `
        <h3 style="margin-bottom: var(--space-sm);">Step 1: King Safety Analysis</h3>
        <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">Analyze which king has fewer defenders and faces open files.</p>
        <div class="option-grid">
          <button class="option-button" onclick="App.submitKingSafety('White')">White King</button>
          <button class="option-button" onclick="App.submitKingSafety('Black')">Black King</button>
          <button class="option-button" onclick="App.submitKingSafety('Equal')">Equally Safe</button>
        </div>
      `;
    } else if (step === 2) {
      box.innerHTML = `
        <h3 style="margin-bottom: var(--space-sm);">Step 2: Tactical Motif Identification</h3>
        <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">Which of these geometry cues matches the position?</p>
        <div class="option-grid">
          <button class="option-button" onclick="App.submitMotif('forks')">Double Attack (Fork)</button>
          <button class="option-button" onclick="App.submitMotif('pins')">Relative/Absolute Pin</button>
          <button class="option-button" onclick="App.submitMotif('skewers')">Skewer Target</button>
          <button class="option-button" onclick="App.submitMotif('mate_in_1')">Mating Net</button>
        </div>
      `;
    } else if (step === 3) {
      // Step 3: Overloaded piece click
      box.innerHTML = `
        <h3 style="margin-bottom: var(--space-sm);">Step 3: Identify Overloaded Defender</h3>
        <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">Is there any piece guarding multiple squares or pieces? Type "None" or enter square coordinates below.</p>
        <div class="flex gap-sm">
          <input type="text" id="overload-input" style="flex: 1;" placeholder="e.g. c6, f3, or None">
          <button class="btn btn-primary" onclick="App.submitOverloaded(document.getElementById('overload-input').value)">Check</button>
        </div>
      `;
    } else if (step === 4) {
      box.innerHTML = `
        <h3 style="margin-bottom: var(--space-sm);">Step 4: Generate Candidate Moves</h3>
        <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">Make moves on the board to input your top candidates. Excellent move continues.</p>
        <div id="candidates-box" class="card-glass" style="min-height: 80px; font-size: var(--text-sm);">
          No candidate moves registered yet.
        </div>
      `;
    } else if (step === 5) {
      box.innerHTML = `
        <h3 style="margin-bottom: var(--space-sm);">Step 5: Engine Evaluation Results</h3>
        <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">Your candidate move has been validated as excellent. Transitioning to calculation.</p>
      `;
      setTimeout(() => state.guidedSolver.nextStep(), 1500);
    } else if (step === 6) {
      box.innerHTML = `
        <h3 style="margin-bottom: var(--space-sm);">Step 6: Force Calculation</h3>
        <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">Now calculate and play Black's defensive responses on the board.</p>
      `;
    }
  },

  submitKingSafety(choice) {
    if (state.guidedSolver) {
      state.guidedSolver.answerKingSafety(choice);
    }
  },

  submitMotif(choice) {
    if (state.guidedSolver) {
      state.guidedSolver.answerMotif(choice);
    }
  },

  submitOverloaded(choice) {
    if (state.guidedSolver) {
      state.guidedSolver.answerOverloaded(choice);
    }
  },

  _renderGuidedFeedback(fb) {
    const pop = document.getElementById('tactics-feedback-popup');
    if (pop) {
      pop.innerHTML = `
        <div class="card-glass ${fb.isCorrect ? 'badge-emerald' : 'badge-red'}" style="margin-top: var(--space-md); text-align: center;">
          ${fb.message}
        </div>
      `;
    }

    // If step 4, render candidates list
    if (state.guidedSolver && state.guidedSolver.step === 4) {
      const candBox = document.getElementById('candidates-box');
      if (candBox && fb.candidates) {
        candBox.innerHTML = fb.candidates.map(c => `
          <div style="margin-bottom: 4px;">
            <strong>${c.move}</strong> — ${c.rating}
          </div>
        `).join('');
      }
    }
  },

  _onGuidedSolveComplete() {
    // Hide guided solve panel and display replay panel
    document.getElementById('guided-solve-panel').style.display = 'none';
    document.getElementById('guided-replay-panel').style.display = 'block';

    // Award XP
    Gamification.grantXP(30, 'Guided Puzzle Solved');
    this._showXPAwardPopup('+30 XP');

    // Load Replay System
    const mainlineMoves = state.activePuzzle.solution.split(' ').map(m => ({
      move: m,
      idea: 'Forcing move',
      motif: state.activePuzzle.theme
    }));

    state.replaySystem = new ReplaySystem(state.board, mainlineMoves, {
      initialFen: state.activePuzzle.FEN,
      onMoveChange: (idx, step) => {
        const box = document.getElementById('replay-annotation-box');
        if (box) {
          box.innerHTML = `
            <strong>Move:</strong> ${step.move}<br/>
            <strong>Idea:</strong> ${step.idea}<br/>
            <strong>Motif:</strong> ${step.motif}
          `;
        }
      }
    });

    const treeBox = document.getElementById('replay-tree-box');
    if (treeBox) {
      treeBox.innerHTML = state.replaySystem.renderVariationTreeHTML();
    }
  },

  replayNext() {
    if (state.replaySystem) state.replaySystem.next();
  },

  replayPrev() {
    if (state.replaySystem) state.replaySystem.prev();
  },

  replayGoTo(idx) {
    if (state.replaySystem) state.replaySystem.goTo(idx);
  },

  replayTogglePlay() {
    if (state.replaySystem) {
      if (state.replaySystem.isPlaying) {
        state.replaySystem.pause();
      } else {
        state.replaySystem.play(1500);
      }
    }
  },

  _showXPAwardPopup(text) {
    const pop = document.createElement('div');
    pop.className = 'xp-gained-popup';
    pop.innerText = text;
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 2000);
  },

  // ============================================
  // Mental Calculation Trainer
  // ============================================
  _initCalculationBoard() {
    const container = document.getElementById('calc-board');
    if (!container) return;
    const size = Math.min(container.parentElement.offsetWidth - 16, 420);
    
    state.board = new BoardRenderer(container, {
      size,
      interactive: true,
      onMove: (from, to) => {
        if (state.calcActive) {
          this._submitCalculationAnswer(`${from}${to}`);
        }
      }
    });
    
    // Set typical tactical position
    state.board.setFEN('r1b1k2r/ppppqppp/2n5/4P3/2B1n3/B4N2/P4PPP/R2Q1RK1 w kq - 1 10');
  },

  startCalculationExercise() {
    document.getElementById('calc-start-btn').style.display = 'none';
    const note = document.getElementById('calc-instruction-card');
    note.innerHTML = '<h2>Memorizing position...</h2><p>Observe the piece alignments. Pieces will fade in 10 seconds.</p>';
    
    state.board.setFEN('r1b1k2r/ppppqppp/2n5/4P3/2B1n3/B4N2/P4PPP/R2Q1RK1 w kq - 1 10');
    
    setTimeout(() => {
      // Fade out pieces
      const piecesLayer = document.querySelector('.chess-board-svg g g g');
      if (piecesLayer) {
        piecesLayer.style.transition = 'opacity 2.5s ease';
        piecesLayer.style.opacity = '0';
      }
      
      setTimeout(() => {
        state.calcActive = true;
        note.style.display = 'none';
        
        const qCard = document.getElementById('calc-question-card');
        qCard.style.display = 'block';
        document.getElementById('calc-challenge-header').innerText = 'Calculate: 1. Bxf7+ Kxf7 2. Qd5+ Ke8. What is White\'s next move?';
        
        const choices = document.getElementById('calc-choices-box');
        choices.innerHTML = `
          <div class="calc-option-grid">
            <button class="option-button" onclick="App._submitCalculationChoice('Qxe4')">Qxe4</button>
            <button class="option-button" onclick="App._submitCalculationChoice('Nxe5')">Nxe5</button>
            <button class="option-button" onclick="App._submitCalculationChoice('Qxd7')">Qxd7</button>
          </div>
        `;
      }, 3000);
    }, 10000);
  },

  _submitCalculationChoice(choice) {
    const isCorrect = choice === 'Qxe4';
    const card = document.getElementById('calc-question-card');
    
    if (isCorrect) {
      card.innerHTML = `
        <h2 style="color: var(--emerald-400);">Excellent Calculation!</h2>
        <p>You calculated the line accurately. +25 XP awarded.</p>
      `;
      Gamification.grantXP(25, 'Calculation Solved');
      this._showXPAwardPopup('+25 XP');
    } else {
      card.innerHTML = `
        <h2 style="color: var(--red-400);">Calculation Error</h2>
        <p>The queen takes the overloaded knight on e4. Practice more visual retention.</p>
      `;
    }
  },

  // ============================================
  // Blindfold Trainer
  // ============================================
  _initBlindfoldBoard() {
    const container = document.getElementById('blindfold-board');
    if (!container) return;
    const size = Math.min(container.parentElement.offsetWidth - 16, 420);
    
    // Initialize standard board but force pieces to hide (or draw empty board)
    state.board = new BoardRenderer(container, {
      size,
      interactive: false,
      showCoords: true
    });
    // Setting blank position
    state.board.setFEN('8/8/8/8/8/8/8/8 w - - 0 1');
  },

  startBlindfoldExercise() {
    state.blindfoldMoveList = ['1. e4 e5', '2. Nf3 Nc6', '3. Bc4 Nf6'];
    state.blindfoldExpected = 'Ng5';
    
    const logBox = document.getElementById('blindfold-log-box');
    logBox.innerHTML = `
      <div style="font-size: var(--text-base); font-weight:700; margin-bottom: var(--space-sm);">Moves played:</div>
      ${state.blindfoldMoveList.join('<br/>')}<br/><br/>
      <strong>Calculate: What is the sharpest tactical move for White here?</strong>
    `;
  },

  submitBlindfoldMove(move) {
    if (!state.blindfoldExpected) return;
    
    const isCorrect = move.toLowerCase().trim() === state.blindfoldExpected.toLowerCase();
    const logBox = document.getElementById('blindfold-log-box');
    
    if (isCorrect) {
      logBox.innerHTML = `
        <h3 style="color: var(--emerald-400); margin-bottom: var(--space-xs);">Correct!</h3>
        <p>Ng5 attacks f7 with two pieces (bishop and knight), a classic fork threat. +20 XP awarded.</p>
      `;
      Gamification.grantXP(20, 'Blindfold Solve');
      this._showXPAwardPopup('+20 XP');
    } else {
      logBox.innerHTML = `
        <h3 style="color: var(--red-400); margin-bottom: var(--space-xs);">Incorrect Move</h3>
        <p>The correct tactical option was **Ng5**, preparing a double strike on f7.</p>
      `;
    }
    state.blindfoldExpected = null;
  },

  // ============================================
  // Endgame Trainer (Play vs Stockfish)
  // ============================================
  _initEndgameBoard() {
    const container = document.getElementById('endgame-board');
    if (!container) return;
    const size = Math.min(container.parentElement.offsetWidth - 16, 420);
    
    state.engine = new ChessEngine('8/8/4k3/8/4K3/8/8/8 w - - 0 1');
    state.board = new BoardRenderer(container, {
      size,
      interactive: true,
      onMove: (from, to) => {
        const move = state.engine.move({ from, to, promotion: 'q' });
        if (move) {
          state.board.setPosition(state.engine.board(), state.engine.lastMove());
          
          // Stockfish replies
          setTimeout(() => {
            stockfishService.analyze(state.engine.fen(), 12).then(res => {
              if (res.bestMove) {
                state.engine.move(res.bestMove);
                state.board.setPosition(state.engine.board(), state.engine.lastMove());
              }
            });
          }, 400);
        }
      },
      onSquareClick: (square, piece) => {
        if (piece.color === state.engine.turn()) {
          return state.engine.legalMoves(square);
        }
        return null;
      }
    });
    
    state.board.setPosition(state.engine.board());
  },

  loadEndgameStructure(structure) {
    state.endgameCategory = structure;
    const notes = document.getElementById('endgame-coach-note');

    if (structure === 'opposition') {
      state.engine.load('8/8/4k3/8/4K3/8/8/8 w - - 0 1');
      notes.innerHTML = `
        <strong>Structure: The Opposition</strong><br/>
        Goal: As White, lock the opposition and force the black king to retreat so your king can advance.
      `;
    } else if (structure === 'lucena') {
      state.engine.load('8/8/4k3/8/3R4/8/1r6/4K3 w - - 0 1');
      notes.innerHTML = `
        <strong>Structure: Lucena Bridge</strong><br/>
        Goal: Build a bridge using your rook on the 4th rank to shield the king and promote the pawn.
      `;
    } else if (structure === 'philidor') {
      state.engine.load('8/8/8/8/8/8/8/8 w - - 0 1'); // Empty fallback or standard Philidor
      notes.innerHTML = `
        <strong>Structure: Philidor Defense</strong><br/>
        Goal: Prevent the king from advancing to the 6th rank.
      `;
    }
    
    state.board.setPosition(state.engine.board());
  },

  resetEndgame() {
    this.loadEndgameStructure(state.endgameCategory);
  },

  // ============================================
  // Opening spaced reviews
  // ============================================
  _initOpeningRepBoard() {
    const container = document.getElementById('opening-rep-board');
    if (!container) return;
    const size = Math.min(container.parentElement.offsetWidth - 16, 420);
    state.board = new BoardRenderer(container, {
      size,
      interactive: false
    });
    state.board.setFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  },

  startOpeningRepertoireReview(id) {
    this._showXPAwardPopup('Reviewing Opening...');
    // Simply highlight or simulate moves
    Gamification.grantXP(15, 'Opening Repertoire Reviewed');
    this._showXPAwardPopup('+15 XP');
  },

  // ============================================
  // Strategy Lab
  // ============================================
  _initStrategyBoard() {
    const container = document.getElementById('strategy-board');
    if (!container) return;
    const size = Math.min(container.parentElement.offsetWidth - 16, 380);
    state.board = new BoardRenderer(container, {
      size,
      interactive: false
    });
    // Middle-game structures FEN
    state.board.setFEN('r4rk1/pp1nbppp/2p1pn2/3p4/3P4/2NBP3/PPPB1PPP/R4RK1 w - - 0 10');
  },

  submitStrategyPlan(isCorrect) {
    if (isCorrect) {
      alert('Correct! Establishing blockades on isolated pawns prevents dynamics and secures positional advantage.');
      Gamification.grantXP(25, 'Strategy Lab Solved');
      this._showXPAwardPopup('+25 XP');
    } else {
      alert('Incorrect. Pawn storms when center is fluid are highly risky and fail to blockade targets.');
    }
  },

  // ============================================
  // Guess the Move Master Games
  // ============================================
  _initMasterStudyBoard(gameId) {
    const container = document.getElementById('master-study-board');
    if (!container) return;
    
    const size = Math.min(container.parentElement.offsetWidth - 16, 420);
    const game = getMasterGame(gameId);
    if (!game) return;
    
    state.engine = new ChessEngine(game.initialFen);
    
    state.board = new BoardRenderer(container, {
      size,
      interactive: true,
      onMove: (from, to) => {
        if (state.guessActive) {
          this._submitGuessedMove(from, to, game);
        }
      },
      onSquareClick: (square, piece) => {
        if (state.guessActive && piece.color === state.engine.turn()) {
          return state.engine.legalMoves(square);
        }
        return null;
      }
    });

    state.board.setPosition(state.engine.board());
    
    // Initialize Replay system
    state.replaySystem = new ReplaySystem(state.board, game.moves, {
      initialFen: game.initialFen,
      onMoveChange: (idx, step) => {
        const box = document.getElementById('master-commentary-box');
        if (box) {
          box.innerHTML = `
            <strong>Move ${Math.floor(idx/2)+1}:</strong> ${step.move}<br/>
            <strong>Delta:</strong> ${step.delta}<br/>
            <strong>Comment:</strong> ${step.comment}
          `;
        }
        this._updateMasterMoveList();
      }
    });

    this._updateMasterMoveList();
  },

  _updateMasterMoveList() {
    const box = document.getElementById('master-moves-list-box');
    if (box && state.replaySystem) {
      box.innerHTML = state.replaySystem.renderMoveListHTML();
    }
  },

  startGuessMoveChallenge() {
    state.guessActive = true;
    state.guessMoveIdx = 0;
    state.guessScore = 0;
    
    document.getElementById('guess-score-badge').style.display = 'block';
    document.getElementById('guess-score-badge').innerText = `Score: 0`;
    alert('Guess-the-Move started! White is to move. Play your move on the board.');
  },

  _submitGuessedMove(from, to, game) {
    const expectedMove = game.moves[state.guessMoveIdx];
    if (!expectedMove) return;

    // Verify move match
    const testEngine = state.engine.clone();
    const move = testEngine.move({ from, to, promotion: 'q' });
    
    if (!move) return;

    const isMatch = move.san === expectedMove.move || `${from}${to}` === expectedMove.move;

    if (isMatch) {
      state.guessScore += 10;
      document.getElementById('guess-score-badge').innerText = `Score: ${state.guessScore}`;
      state.engine.move({ from, to, promotion: 'q' });
      state.board.setPosition(state.engine.board(), state.engine.lastMove());
      
      // Auto-play opponent response automatically
      state.guessMoveIdx++;
      const blackResponse = game.moves[state.guessMoveIdx];
      
      if (blackResponse) {
        setTimeout(() => {
          state.engine.move(blackResponse.move);
          state.board.setPosition(state.engine.board(), state.engine.lastMove());
          state.guessMoveIdx++;
          alert('Correct! Black replied with ' + blackResponse.move + '. Guess White\'s next move.');
        }, 800);
      } else {
        alert('Completed challenge! final score: ' + state.guessScore);
        Gamification.grantXP(state.guessScore, 'Guess the Move Complete');
        this._showXPAwardPopup(`+${state.guessScore} XP`);
        state.guessActive = false;
      }
    } else {
      alert(`Wrong move. The master played ${expectedMove.move}. Stockfish evaluation delta: ${expectedMove.delta}`);
      // Force correct move
      state.engine.move(expectedMove.move);
      state.board.setPosition(state.engine.board(), state.engine.lastMove());
      
      state.guessMoveIdx++;
      const blackResponse = game.moves[state.guessMoveIdx];
      if (blackResponse) {
        state.engine.move(blackResponse.move);
        state.board.setPosition(state.engine.board(), state.engine.lastMove());
        state.guessMoveIdx++;
      } else {
        state.guessActive = false;
      }
    }
  },

  // ============================================
  // Repertoire / Skill nodes unlock
  // ============================================
  unlockSkillNode(skillId) {
    const unlocked = Gamification.unlockSkill(skillId);
    if (unlocked) {
      alert(`Skill node unlocked successfully!`);
      this.render();
    }
  },

  // ============================================
  // Lesson Board & animations
  // ============================================
  _initLessonBoards() {
    const container = document.getElementById('lesson-board');
    if (container) {
      container._board = new BoardRenderer(container, { size: 380, interactive: false });
      container._board.setFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    }
    const watchCont = document.getElementById('watch-board');
    if (watchCont) {
      watchCont._board = new BoardRenderer(watchCont, { size: 380, interactive: false });
      watchCont._board.setFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    }
  },

  triggerWatchAnimation(lessonId) {
    const watchCont = document.getElementById('watch-board');
    if (watchCont?._board) {
      const board = watchCont._board;
      
      // Load standard pin position
      board.setFEN('r1bqk2r/pppp1ppp/2n2n2/1B2p3/4P3/2NP1N2/PPP2PPP/R1BQK2R b KQkq - 0 5');
      
      // Animate Pin Ray overlay
      setTimeout(() => {
        board.setHighlights([
          { square: 'c6', color: 'rgba(239, 68, 68, 0.4)', class: 'pinned-piece-pulse' }
        ]);
        board.setArrows([
          { from: 'b5', to: 'c6', color: 'rgba(239, 68, 68, 0.85)', class: 'pin-laser', dashed: true }
        ]);
      }, 1000);
    }
  },

  loadLessonTestPuzzle(idx, contentId, lessonId) {
    const content = ALL_CONTENT.find(c => c.id === contentId);
    const lesson = content.modules.find(m => m.id === lessonId);
    const puzzle = lesson.puzzles[idx];
    
    const container = document.getElementById('puzzle-board');
    if (container && puzzle) {
      container._board = new BoardRenderer(container, {
        size: 380,
        interactive: true,
        onMove: (from, to) => {
          const expected = puzzle.solution.split(' ')[0];
          const testEngine = new ChessEngine(puzzle.fen);
          const move = testEngine.move({ from, to, promotion: 'q' });
          
          const isCorrect = move && (move.san === expected || `${from}${to}` === expected);
          const status = document.getElementById('puzzle-status');
          
          if (isCorrect) {
            status.innerHTML = `<span style="color: var(--emerald-400); font-weight:700;">Correct! ${puzzle.explanation}</span>`;
            container._board.setFEN(testEngine.fen());
            Gamification.grantXP(15, 'Lesson Test Solved');
            this._showXPAwardPopup('+15 XP');
          } else {
            status.innerHTML = `<span style="color: var(--red-400); font-weight:700;">Incorrect. Try again.</span>`;
          }
        }
      });
      container._board.setFEN(puzzle.fen);
      
      const status = document.getElementById('puzzle-status');
      status.style.display = 'block';
      status.innerHTML = `<strong>Find the best move for White!</strong>`;
    }
  },

  switchLessonTab(tabName) {
    document.querySelectorAll('.lesson-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('#lesson-tabs .tab').forEach(el => el.classList.remove('active'));
    
    const tab = document.getElementById(`tab-${tabName}`);
    if (tab) tab.style.display = 'block';
    
    // Highlight active button
    const buttons = document.querySelectorAll('#lesson-tabs .tab');
    const tabsList = ['watch', 'theory', 'examples', 'exercises', 'test'];
    const idx = tabsList.indexOf(tabName);
    if (idx >= 0 && buttons[idx]) buttons[idx].classList.add('active');
  },

  answerQuiz(quizIndex, selected, correct) {
    const options = document.querySelectorAll(`#quiz-${quizIndex} button`);
    options.forEach((opt, i) => {
      opt.disabled = true;
      if (i === correct) opt.style.borderColor = 'var(--emerald-500)';
      if (i === selected && selected !== correct) opt.style.borderColor = 'var(--red-500)';
    });
    
    document.getElementById(`quiz-explanation-${quizIndex}`).style.display = 'block';
    if (selected === correct) {
      Gamification.grantXP(10, 'Lesson Quiz Answered');
      this._showXPAwardPopup('+10 XP');
    }
  },

  completeLesson(lessonId) {
    Storage.completeLesson(lessonId);
    Gamification.grantXP(50, 'Lesson Completed');
    this._showXPAwardPopup('+50 XP');
    this.render();
  },

  flipCard() {
    const card = document.getElementById('flashcard');
    if (card) card.classList.toggle('flipped');
  },

  rateCard(cardId, quality) {
    SpacedRepetition.reviewCard(cardId, quality);
    Gamification.grantXP(10, 'Card Reviewed');
    this._showXPAwardPopup('+10 XP');
    this.render();
  }
};

// ============================================
// Initialize App routing
// ============================================
function init() {
  state.router.route('/', () => App.render());
  state.router.route('/play', () => App.render());
  state.router.route('/review', () => App.render());
  state.router.route('/coach', () => App.render());
  state.router.route('/gamification', () => App.render());
  state.router.route('/trainer/tactics', () => App.render());
  state.router.route('/trainer/calculation', () => App.render());
  state.router.route('/trainer/blindfold', () => App.render());
  state.router.route('/trainer/endgame', () => App.render());
  state.router.route('/trainer/openings', () => App.render());
  state.router.route('/trainer/strategy', () => App.render());
  state.router.route('/games-study', () => App.render());
  state.router.route('/learn/master-games/:id', () => App.render());
  state.router.route('/learn/:module', () => App.render());
  state.router.route('/learn/:module/:lesson', () => App.render());
  state.router.route('*', () => App.render());

  window.App = App;

  // Fade loading screen
  setTimeout(() => {
    const loading = document.getElementById('loading-screen');
    if (loading) {
      loading.classList.add('fade-out');
      setTimeout(() => loading.remove(), 600);
    }
    App.render();
  }, 500);
}

init();
