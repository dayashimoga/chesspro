// ChessOS — Main Application Entry Point
import { ChessEngine } from './core/chess-engine.js';
import { AIEngine } from './core/ai-engine.js';
import { BoardRenderer } from './core/board-renderer.js';
import { Router } from './core/router.js';
import { Storage, SpacedRepetition } from './core/storage.js';

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
  router: new Router()
};

// ============================================
// Navigation Component
// ============================================
function renderSidebar() {
  const progress = Storage.getProgress();
  const totalLessons = ALL_CONTENT.reduce((sum, c) => sum + c.modules.length, 0);
  const completedCount = progress.completedLessons.length;

  return `
    <aside class="sidebar ${state.sidebarOpen ? 'open' : ''}" id="sidebar">
      <div class="sidebar-brand">
        <div class="sidebar-brand-icon">♚</div>
        <div class="sidebar-brand-text">
          <h2>ChessOS</h2>
          <span>Chess Mastery Platform</span>
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
            <span>Play Chess</span>
          </button>
          <button class="nav-item ${state.currentPage === 'puzzles' ? 'active' : ''}" onclick="App.navigate('/puzzles')">
            <span class="nav-item-icon">🧩</span>
            <span>Puzzles</span>
            <span class="nav-item-badge">${getAllPuzzles().length}</span>
          </button>
          <button class="nav-item ${state.currentPage === 'review' ? 'active' : ''}" onclick="App.navigate('/review')">
            <span class="nav-item-icon">🔄</span>
            <span>Spaced Review</span>
            ${SpacedRepetition.getDueCards().length > 0 ? `<span class="nav-item-badge">${SpacedRepetition.getDueCards().length}</span>` : ''}
          </button>
        </div>
        
        <div class="nav-section">
          <div class="nav-section-title">Curriculum</div>
          ${ALL_CONTENT.map(content => {
            const moduleProgress = getModuleCompletionPercent(content.id);
            return `
              <button class="nav-item ${state.currentPage === 'learn' && state.currentModule === content.id ? 'active' : ''}" 
                      onclick="App.navigate('/learn/${content.id}')">
                <span class="nav-item-icon">${content.icon}</span>
                <span>${content.title}</span>
                <div class="nav-item-progress">
                  <div class="nav-item-progress-fill" style="width: ${moduleProgress}%"></div>
                </div>
              </button>
            `;
          }).join('')}
        </div>
        
        <div class="nav-section">
          <div class="nav-section-title">Tools</div>
          <button class="nav-item ${state.currentPage === 'openings-explorer' ? 'active' : ''}" onclick="App.navigate('/openings-explorer')">
            <span class="nav-item-icon">🌳</span>
            <span>Opening Explorer</span>
          </button>
          <button class="nav-item ${state.currentPage === 'progress' ? 'active' : ''}" onclick="App.navigate('/progress')">
            <span class="nav-item-icon">📊</span>
            <span>Progress</span>
          </button>
          <button class="nav-item ${state.currentPage === 'games-study' ? 'active' : ''}" onclick="App.navigate('/games-study')">
            <span class="nav-item-icon">🏆</span>
            <span>Master Games</span>
          </button>
        </div>
      </nav>
      
      <div class="sidebar-footer">
        <div class="sidebar-stats">
          <div class="sidebar-stat">
            <div class="sidebar-stat-value">${completedCount}</div>
            <div class="sidebar-stat-label">Lessons</div>
          </div>
          <div class="sidebar-stat">
            <div class="sidebar-stat-value">${progress.puzzlesSolved}</div>
            <div class="sidebar-stat-label">Puzzles</div>
          </div>
          <div class="sidebar-stat">
            <div class="sidebar-stat-value">${progress.puzzleRating}</div>
            <div class="sidebar-stat-label">Rating</div>
          </div>
          <div class="sidebar-stat">
            <div class="sidebar-stat-value">🔥${progress.streak}</div>
            <div class="sidebar-stat-label">Streak</div>
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
  const totalLessons = ALL_CONTENT.reduce((sum, c) => sum + c.modules.length, 0);
  const overallPercent = totalLessons > 0 ? Math.round((progress.completedLessons.length / totalLessons) * 100) : 0;
  
  return `
    ${renderHeader()}
    <div class="page-content">
      <div class="flex items-center justify-between" style="margin-bottom: var(--space-xl);">
        <div>
          <h1 class="page-title">Welcome to <span class="page-title-gradient">ChessOS</span></h1>
          <p class="page-subtitle">Your journey from beginner to master starts here.</p>
        </div>
      </div>
      
      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card animate-fade-in stagger-1">
          <div class="stat-card-value" style="color: var(--emerald-400);">${overallPercent}%</div>
          <div class="stat-card-label">Overall Progress</div>
          <div class="progress-bar" style="margin-top: 8px;">
            <div class="progress-bar-fill" style="width: ${overallPercent}%"></div>
          </div>
        </div>
        <div class="stat-card animate-fade-in stagger-2">
          <div class="stat-card-value" style="color: var(--amber-400);">${progress.puzzleRating}</div>
          <div class="stat-card-label">Puzzle Rating</div>
        </div>
        <div class="stat-card animate-fade-in stagger-3">
          <div class="stat-card-value" style="color: var(--blue-400);">${progress.puzzlesSolved}</div>
          <div class="stat-card-label">Puzzles Solved</div>
        </div>
        <div class="stat-card animate-fade-in stagger-4">
          <div class="stat-card-value" style="color: var(--purple-400);">${progress.completedLessons.length}</div>
          <div class="stat-card-label">Lessons Completed</div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div style="margin-bottom: var(--space-2xl);">
        <h2 class="section-title">Quick Start</h2>
        <div class="grid-4">
          <button class="card card-glow animate-fade-in stagger-1" onclick="App.navigate('/play')" style="cursor:pointer; text-align:center;">
            <div style="font-size: 3rem; margin-bottom: var(--space-md);">♟️</div>
            <div style="font-weight: 700; margin-bottom: var(--space-xs);">Play Chess</div>
            <div style="font-size: var(--text-sm); color: var(--text-secondary);">Challenge the AI</div>
          </button>
          <button class="card card-glow animate-fade-in stagger-2" onclick="App.navigate('/puzzles')" style="cursor:pointer; text-align:center;">
            <div style="font-size: 3rem; margin-bottom: var(--space-md);">🧩</div>
            <div style="font-weight: 700; margin-bottom: var(--space-xs);">Solve Puzzles</div>
            <div style="font-size: var(--text-sm); color: var(--text-secondary);">${getAllPuzzles().length}+ puzzles</div>
          </button>
          <button class="card card-glow animate-fade-in stagger-3" onclick="App.navigate('/learn/foundations')" style="cursor:pointer; text-align:center;">
            <div style="font-size: 3rem; margin-bottom: var(--space-md);">📚</div>
            <div style="font-weight: 700; margin-bottom: var(--space-xs);">Start Learning</div>
            <div style="font-size: var(--text-sm); color: var(--text-secondary);">Begin your journey</div>
          </button>
          <button class="card card-glow animate-fade-in stagger-4" onclick="App.navigate('/games-study')" style="cursor:pointer; text-align:center;">
            <div style="font-size: 3rem; margin-bottom: var(--space-md);">🏆</div>
            <div style="font-weight: 700; margin-bottom: var(--space-xs);">Master Games</div>
            <div style="font-size: var(--text-sm); color: var(--text-secondary);">Study the legends</div>
          </button>
        </div>
      </div>
      
      <!-- Curriculum Overview -->
      <h2 class="section-title">Curriculum</h2>
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
// Play Page (Full Chess Player)
// ============================================
function renderPlayPage() {
  return `
    ${renderHeader([{ label: 'Play Chess' }])}
    <div class="page-content">
      <h1 class="page-title">Play <span class="page-title-gradient">Chess</span></h1>
      <p class="page-subtitle">Challenge the AI at different difficulty levels.</p>
      
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
            <h3 style="font-weight: 700; margin-bottom: var(--space-md);">⚙️ Game Settings</h3>
            <div style="margin-bottom: var(--space-md);">
              <label class="label">Difficulty</label>
              <select id="ai-level" style="width: 100%; margin-top: 4px;" onchange="App.setAILevel(this.value)">
                ${Object.entries(AIEngine.LEVELS).map(([key, val]) => 
                  `<option value="${key}" ${key === 'intermediate' ? 'selected' : ''}>${val.name}</option>`
                ).join('')}
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
            <div class="move-list" id="play-moves" style="min-height: 200px;">
              <div style="color: var(--text-tertiary); text-align: center; padding: var(--space-lg);">Game not started</div>
            </div>
          </div>
          
          <!-- Material -->
          <div class="card" style="margin-top: var(--space-md);">
            <h3 style="font-weight: 700; margin-bottom: var(--space-md);">⚖️ Material</h3>
            <div id="play-material" class="flex justify-between" style="font-size: var(--text-lg);">
              <span>White: 39</span>
              <span>Black: 39</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Learn Page
// ============================================
function renderLearnPage(moduleId, lessonId) {
  const content = ALL_CONTENT.find(c => c.id === moduleId);
  if (!content) return renderNotFound();
  
  if (lessonId) {
    const lesson = content.modules.find(m => m.id === lessonId);
    if (!lesson) return renderNotFound();
    return renderLessonPage(content, lesson);
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
                      ${module.puzzles ? `<span style="margin-left: 8px;">${module.puzzles.length} puzzles</span>` : ''}
                      ${module.exercises ? `<span style="margin-left: 8px;">${module.exercises.length} exercises</span>` : ''}
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

// ============================================
// Lesson Page
// ============================================
function renderLessonPage(content, lesson) {
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
      
      <!-- Tabs -->
      <div class="tabs" id="lesson-tabs">
        <button class="tab active" onclick="App.switchLessonTab('theory')">📖 Theory</button>
        <button class="tab" onclick="App.switchLessonTab('examples')">🎯 Examples</button>
        <button class="tab" onclick="App.switchLessonTab('exercises')">✏️ Exercises</button>
        ${lesson.puzzles ? '<button class="tab" onclick="App.switchLessonTab(\'puzzles\')">🧩 Puzzles</button>' : ''}
      </div>
      
      <!-- Theory Tab -->
      <div id="tab-theory" class="lesson-tab-content">
        <div class="lesson-layout">
          <div class="lesson-text">${lesson.theory || ''}</div>
          <div>
            <div class="board-wrapper" id="lesson-board" style="margin-bottom: var(--space-md);"></div>
            ${lesson.examples && lesson.examples.length > 0 ? `
              <div class="card" style="padding: var(--space-md);">
                <div style="font-weight: 600; margin-bottom: var(--space-sm);">Interactive Board</div>
                <p style="font-size: var(--text-sm); color: var(--text-secondary);">
                  Click examples below to load positions on the board.
                </p>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
      
      <!-- Examples Tab -->
      <div id="tab-examples" class="lesson-tab-content" style="display: none;">
        <div class="lesson-layout">
          <div>
            ${(lesson.examples || []).map((ex, i) => `
              <div class="card" style="margin-bottom: var(--space-md); cursor: pointer;" 
                   onclick="App.loadExample('${ex.fen}', ${i})">
                <div style="font-weight: 700; margin-bottom: var(--space-xs);">${ex.title}</div>
                <p style="font-size: var(--text-sm); color: var(--text-secondary);">${ex.description}</p>
                <code style="font-size: var(--text-xs); color: var(--text-tertiary);">${ex.fen}</code>
              </div>
            `).join('')}
            ${(!lesson.examples || lesson.examples.length === 0) ? '<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">No examples yet</div></div>' : ''}
          </div>
          <div>
            <div class="board-wrapper" id="example-board"></div>
          </div>
        </div>
      </div>
      
      <!-- Exercises Tab -->
      <div id="tab-exercises" class="lesson-tab-content" style="display: none;">
        <div id="exercises-container">
          ${renderExercises(lesson.exercises || [])}
        </div>
      </div>
      
      <!-- Puzzles Tab -->
      <div id="tab-puzzles" class="lesson-tab-content" style="display: none;">
        <div class="lesson-layout">
          <div>
            ${(lesson.puzzles || []).map((puzzle, i) => `
              <div class="card" style="margin-bottom: var(--space-md);" id="puzzle-card-${i}">
                <div class="flex items-center justify-between" style="margin-bottom: var(--space-sm);">
                  <div class="flex items-center gap-sm">
                    <span class="badge badge-${getDifficultyBadge(puzzle.difficulty)}">${puzzle.difficulty}</span>
                    <span style="font-weight: 700;">${puzzle.theme}</span>
                  </div>
                  <span style="font-size: var(--text-sm); color: var(--text-tertiary);">#${i + 1}</span>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="App.loadPuzzle(${i}, '${content.id}', '${lesson.id}')">
                  Load on Board
                </button>
                <div class="hint-box" style="margin-top: var(--space-sm); display: none;" id="puzzle-hint-${i}">
                  <span class="hint-icon">💡</span>
                  <div>
                    <div style="font-weight: 600;">Solution: ${puzzle.solution}</div>
                    <p style="font-size: var(--text-sm); color: var(--text-secondary);">${puzzle.explanation}</p>
                  </div>
                </div>
                <button class="btn btn-ghost btn-sm" style="margin-top: var(--space-xs);" 
                        onclick="document.getElementById('puzzle-hint-${i}').style.display='flex'">
                  Show Solution
                </button>
              </div>
            `).join('')}
            ${(!lesson.puzzles || lesson.puzzles.length === 0) ? '<div class="empty-state"><div class="empty-state-icon">🧩</div><div class="empty-state-title">No puzzles for this lesson</div></div>' : ''}
          </div>
          <div>
            <div class="board-wrapper" id="puzzle-board"></div>
            <div id="puzzle-status" class="card" style="margin-top: var(--space-md); padding: var(--space-md); text-align: center; display: none;">
            </div>
          </div>
        </div>
      </div>
      
      <!-- Complete Button -->
      <div style="text-align: center; margin-top: var(--space-2xl);">
        ${!isComplete ? `
          <button class="btn btn-primary btn-lg" onclick="App.completeLesson('${lessonId}')">
            ✓ Mark as Complete
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
        <div class="quiz-card animate-fade-in stagger-${(i % 6) + 1}" id="quiz-${i}">
          <div class="quiz-question">${i + 1}. ${ex.question}</div>
          <div class="quiz-options">
            ${ex.options.map((opt, j) => `
              <button class="quiz-option" onclick="App.answerQuiz(${i}, ${j}, ${ex.answer})" id="quiz-${i}-opt-${j}">
                <div class="quiz-option-marker">${String.fromCharCode(65 + j)}</div>
                <span>${opt}</span>
              </button>
            `).join('')}
          </div>
          <div id="quiz-explanation-${i}" style="display: none; margin-top: var(--space-md);">
            <div class="hint-box">
              <span class="hint-icon">💡</span>
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
// Puzzles Page
// ============================================
function renderPuzzlesPage() {
  const allPuzzles = getAllPuzzles();
  const progress = Storage.getProgress();
  
  return `
    ${renderHeader([{ label: 'Puzzles' }])}
    <div class="page-content">
      <h1 class="page-title">Puzzle <span class="page-title-gradient">Trainer</span></h1>
      <p class="page-subtitle">Sharpen your tactical vision with ${allPuzzles.length}+ puzzles across all difficulty levels.</p>
      
      <div class="stats-grid" style="margin-bottom: var(--space-2xl);">
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--amber-400);">${progress.puzzleRating}</div>
          <div class="stat-card-label">Puzzle Rating</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--emerald-400);">${progress.puzzlesSolved}</div>
          <div class="stat-card-label">Solved</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--blue-400);">${progress.puzzlesAttempted}</div>
          <div class="stat-card-label">Attempted</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--purple-400);">${progress.puzzlesAttempted > 0 ? Math.round((progress.puzzlesSolved / progress.puzzlesAttempted) * 100) : 0}%</div>
          <div class="stat-card-label">Accuracy</div>
        </div>
      </div>
      
      <div class="lesson-layout">
        <div>
          <h2 class="section-title">Puzzles by Theme</h2>
          ${ALL_CONTENT.filter(c => c.modules.some(m => m.puzzles && m.puzzles.length > 0)).map(content => `
            <div class="card" style="margin-bottom: var(--space-md);">
              <div style="font-weight: 700; margin-bottom: var(--space-sm);">${content.icon} ${content.title}</div>
              <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">
                ${content.modules.filter(m => m.puzzles && m.puzzles.length > 0).map(m => `
                  <button class="btn btn-secondary btn-sm" onclick="App.startPuzzleSet('${content.id}', '${m.id}')">
                    ${m.title} (${m.puzzles.length})
                  </button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div>
          <div class="board-wrapper" id="puzzle-trainer-board"></div>
          <div id="puzzle-trainer-status" class="card" style="margin-top: var(--space-md); padding: var(--space-lg); text-align: center;">
            <div style="font-size: 3rem; margin-bottom: var(--space-md);">🧩</div>
            <div style="font-weight: 700;">Select a puzzle set to begin</div>
            <p style="font-size: var(--text-sm); color: var(--text-secondary);">Choose a theme from the left panel</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Progress Page
// ============================================
function renderProgressPage() {
  const progress = Storage.getProgress();
  const srsStats = SpacedRepetition.getStats();
  const totalLessons = ALL_CONTENT.reduce((sum, c) => sum + c.modules.length, 0);
  
  return `
    ${renderHeader([{ label: 'Progress' }])}
    <div class="page-content">
      <h1 class="page-title">Your <span class="page-title-gradient">Progress</span></h1>
      <p class="page-subtitle">Track your chess mastery journey.</p>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--emerald-400);">${progress.completedLessons.length}/${totalLessons}</div>
          <div class="stat-card-label">Lessons Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--amber-400);">${progress.puzzleRating}</div>
          <div class="stat-card-label">Puzzle Rating</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--blue-400);">${progress.puzzlesSolved}/${progress.puzzlesAttempted}</div>
          <div class="stat-card-label">Puzzles (Solved/Total)</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--purple-400);">🔥 ${progress.streak}</div>
          <div class="stat-card-label">Day Streak</div>
        </div>
      </div>
      
      <!-- Module Progress -->
      <h2 class="section-title" style="margin-top: var(--space-2xl);">Module Progress</h2>
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        ${ALL_CONTENT.map(content => {
          const percent = getModuleCompletionPercent(content.id);
          const completed = content.modules.filter(m => progress.completedLessons.includes(`${content.id}/${m.id}`)).length;
          return `
            <div class="card">
              <div class="flex items-center justify-between" style="margin-bottom: var(--space-sm);">
                <div class="flex items-center gap-md">
                  <span style="font-size: 1.5rem;">${content.icon}</span>
                  <span style="font-weight: 700;">${content.title}</span>
                </div>
                <span style="font-weight: 600; color: var(--emerald-400);">${percent}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${percent}%"></div>
              </div>
              <div style="font-size: var(--text-sm); color: var(--text-tertiary); margin-top: var(--space-xs);">
                ${completed} of ${content.modules.length} lessons complete
              </div>
            </div>
          `;
        }).join('')}
      </div>
      
      <!-- SRS Stats -->
      <h2 class="section-title" style="margin-top: var(--space-2xl);">Spaced Repetition</h2>
      <div class="grid-3">
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--emerald-400);">${srsStats.total}</div>
          <div class="stat-card-label">Total Cards</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--amber-400);">${srsStats.due}</div>
          <div class="stat-card-label">Due for Review</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color: var(--blue-400);">${srsStats.mature}</div>
          <div class="stat-card-label">Mature Cards</div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Spaced Repetition Review Page
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
// Opening Explorer Page
// ============================================
function renderOpeningsExplorerPage() {
  const openings = openingsContent.modules;
  
  return `
    ${renderHeader([{ label: 'Opening Explorer' }])}
    <div class="page-content">
      <h1 class="page-title">Opening <span class="page-title-gradient">Explorer</span></h1>
      <p class="page-subtitle">Explore opening theory with interactive move trees.</p>
      
      <div class="lesson-layout">
        <div>
          <h2 class="section-title">Select an Opening</h2>
          ${openings.map(op => `
            <div class="card" style="margin-bottom: var(--space-sm); cursor: pointer;" onclick="App.loadOpeningTree('${op.id}')">
              <div style="font-weight: 700;">${op.title}</div>
            </div>
          `).join('')}
          
          <div class="opening-tree" id="opening-tree" style="margin-top: var(--space-lg);">
            <div style="text-align: center; color: var(--text-tertiary); padding: var(--space-lg);">
              Select an opening to explore its move tree
            </div>
          </div>
        </div>
        <div>
          <div class="board-wrapper" id="opening-board"></div>
          <div id="opening-info" class="card" style="margin-top: var(--space-md); padding: var(--space-md); display: none;">
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Master Games Study Page
// ============================================
function renderGamesStudyPage() {
  const content = masterGamesContent;
  
  return `
    ${renderHeader([{ label: 'Master Games' }])}
    <div class="page-content">
      <h1 class="page-title">Master <span class="page-title-gradient">Game Studies</span></h1>
      <p class="page-subtitle">Learn from the greatest players in chess history.</p>
      
      <div class="grid-3">
        ${content.modules.map(module => `
          <div class="module-card" onclick="App.navigate('/learn/master-games/${module.id}')">
            <div class="module-card-icon">🏆</div>
            <div class="module-card-title">${module.title}</div>
            <div class="module-card-desc" style="-webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;">
              ${module.theory.replace(/<[^>]*>/g, '').substring(0, 150)}...
            </div>
            <div class="module-card-meta">
              <span>${module.games ? module.games.length : 0} annotated games</span>
              <span class="badge badge-${getDifficultyBadge(module.difficulty)}">${module.difficulty}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============================================
// Not Found
// ============================================
function renderNotFound() {
  return `
    ${renderHeader()}
    <div class="page-content">
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-title">Page Not Found</div>
        <div class="empty-state-desc">The page you're looking for doesn't exist.</div>
        <button class="btn btn-primary" onclick="App.navigate('/')">Go Home</button>
      </div>
    </div>
  `;
}

// ============================================
// Helper Functions
// ============================================
function getAllPuzzles() {
  const puzzles = [];
  for (const content of ALL_CONTENT) {
    for (const module of content.modules) {
      if (module.puzzles) {
        puzzles.push(...module.puzzles);
      }
    }
  }
  return puzzles;
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
// App Controller
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

  // Render the full page
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
    } else if (path === '/puzzles') {
      state.currentPage = 'puzzles';
      content = renderPuzzlesPage();
    } else if (path === '/progress') {
      state.currentPage = 'progress';
      content = renderProgressPage();
    } else if (path === '/review') {
      state.currentPage = 'review';
      content = renderReviewPage();
    } else if (path === '/openings-explorer') {
      state.currentPage = 'openings-explorer';
      content = renderOpeningsExplorerPage();
    } else if (path === '/games-study') {
      state.currentPage = 'games-study';
      content = renderGamesStudyPage();
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

    // Post-render setup
    this._postRender(path);
    
    // Update streak
    Storage.updateStreak();
  },

  _postRender(path) {
    // Initialize boards based on current page
    if (path === '/play') {
      this._initPlayBoard();
    } else if (path.startsWith('/learn/') && state.currentLesson) {
      this._initLessonBoard();
    } else if (path === '/puzzles') {
      this._initPuzzleTrainerBoard();
    } else if (path === '/openings-explorer') {
      this._initOpeningBoard();
    }
    
    // Mobile sidebar handling
    if (window.innerWidth <= 768) {
      state.sidebarOpen = false;
    }
  },

  // ============================================
  // Chess Player
  // ============================================
  _playerColor: 'w',
  _aiLevel: 'intermediate',

  _initPlayBoard() {
    state.engine = new ChessEngine();
    const container = document.getElementById('play-board');
    if (!container) return;
    
    const size = Math.min(container.parentElement.offsetWidth - 16, 480);
    
    state.board = new BoardRenderer(container, {
      size,
      interactive: true,
      onMove: (from, to, promotion) => {
        const move = state.engine.move({ from, to, promotion });
        if (move) {
          this._updatePlayBoard();
          
          // AI response
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
    
    // If playing as black, AI moves first
    if (this._playerColor === 'b') {
      setTimeout(() => this._aiMove(), 500);
    }
  },

  _updatePlayBoard() {
    if (!state.board || !state.engine) return;
    
    const lastMove = state.engine.lastMove();
    let checkSquare = null;
    if (state.engine.isCheck()) {
      const pieces = state.engine.pieces(state.engine.turn());
      const king = pieces.find(p => p.type === 'k');
      if (king) checkSquare = king.square;
    }
    
    state.board.setPosition(state.engine.board(), lastMove, checkSquare);
    
    // Update status
    const statusEl = document.getElementById('play-status');
    if (statusEl) {
      const status = state.engine.statusText();
      statusEl.innerHTML = `<span style="font-weight: 600;">${status}</span>`;
    }
    
    // Update moves
    const movesEl = document.getElementById('play-moves');
    if (movesEl) {
      const history = state.engine.moveHistory();
      if (history.length === 0) {
        movesEl.innerHTML = '<div style="color: var(--text-tertiary); text-align: center; padding: var(--space-lg);">Game not started</div>';
      } else {
        movesEl.innerHTML = history.map(pair => `
          <div class="move-row">
            <span class="move-number">${pair.number}.</span>
            <span class="move-white">${pair.white.san}</span>
            <span class="move-black">${pair.black ? pair.black.san : ''}</span>
          </div>
        `).join('');
        movesEl.scrollTop = movesEl.scrollHeight;
      }
    }
    
    // Update material
    const matEl = document.getElementById('play-material');
    if (matEl) {
      const mat = state.engine.material();
      matEl.innerHTML = `
        <span>White: ${mat.white}</span>
        <span style="color: ${mat.advantage > 0 ? 'var(--emerald-400)' : mat.advantage < 0 ? 'var(--red-400)' : 'var(--text-tertiary)'};">
          ${mat.advantage > 0 ? '+' : ''}${mat.advantage}
        </span>
        <span>Black: ${mat.black}</span>
      `;
    }
  },

  _aiMove() {
    if (!state.engine || state.engine.isGameOver()) return;
    
    const move = state.ai.findBestMove(state.engine.fen(), this._aiLevel);
    if (move) {
      state.engine.move(move);
      this._updatePlayBoard();
    }
  },

  playUndo() {
    if (!state.engine) return;
    // Undo both player and AI moves
    state.engine.undo();
    state.engine.undo();
    this._updatePlayBoard();
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
    // Update button styles
    document.getElementById('color-white').className = `btn btn-sm ${color === 'w' ? 'btn-primary' : 'btn-secondary'}`;
    document.getElementById('color-black').className = `btn btn-sm ${color === 'b' ? 'btn-primary' : 'btn-secondary'}`;
    this.playNewGame();
  },

  // ============================================
  // Lesson Board
  // ============================================
  _lessonBoard: null,

  _initLessonBoard() {
    const container = document.getElementById('lesson-board');
    if (!container) return;
    
    const size = Math.min(380, window.innerWidth - 40);
    this._lessonBoard = new BoardRenderer(container, { size, interactive: false });
    this._lessonBoard.setFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  },

  loadExample(fen, index) {
    // Try lesson board first, then example board
    const boards = [this._lessonBoard];
    const exContainer = document.getElementById('example-board');
    if (exContainer && !exContainer._board) {
      const size = Math.min(380, window.innerWidth - 40);
      exContainer._board = new BoardRenderer(exContainer, { size, interactive: false });
    }
    if (exContainer?._board) boards.push(exContainer._board);
    
    for (const board of boards) {
      if (board) board.setFEN(fen);
    }
  },

  loadPuzzle(index, contentId, lessonId) {
    const content = ALL_CONTENT.find(c => c.id === contentId);
    if (!content) return;
    const lesson = content.modules.find(m => m.id === lessonId);
    if (!lesson || !lesson.puzzles) return;
    const puzzle = lesson.puzzles[index];
    if (!puzzle) return;

    const container = document.getElementById('puzzle-board');
    if (!container) return;
    
    if (!container._board) {
      const size = Math.min(380, window.innerWidth - 40);
      container._board = new BoardRenderer(container, { size, interactive: false });
    }
    container._board.setFEN(puzzle.fen);

    const status = document.getElementById('puzzle-status');
    if (status) {
      status.style.display = 'block';
      status.innerHTML = `
        <div class="badge badge-${getDifficultyBadge(puzzle.difficulty)}" style="margin-bottom: var(--space-sm);">${puzzle.theme}</div>
        <div style="font-weight: 600;">Find the best move!</div>
      `;
    }
  },

  // ============================================
  // Lesson Tabs
  // ============================================
  switchLessonTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.lesson-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('#lesson-tabs .tab').forEach(el => el.classList.remove('active'));
    
    // Show selected tab
    const tab = document.getElementById(`tab-${tabName}`);
    if (tab) tab.style.display = 'block';
    
    // Highlight tab button
    const buttons = document.querySelectorAll('#lesson-tabs .tab');
    const tabNames = ['theory', 'examples', 'exercises', 'puzzles'];
    const idx = tabNames.indexOf(tabName);
    if (idx >= 0 && buttons[idx]) buttons[idx].classList.add('active');
    
    // Init boards for tabs
    if (tabName === 'examples') {
      const exContainer = document.getElementById('example-board');
      if (exContainer && !exContainer._board) {
        const size = Math.min(380, window.innerWidth - 40);
        exContainer._board = new BoardRenderer(exContainer, { size, interactive: false });
        exContainer._board.setFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      }
    } else if (tabName === 'puzzles') {
      const pzContainer = document.getElementById('puzzle-board');
      if (pzContainer && !pzContainer._board) {
        const size = Math.min(380, window.innerWidth - 40);
        pzContainer._board = new BoardRenderer(pzContainer, { size, interactive: false });
        pzContainer._board.setFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      }
    }
  },

  // ============================================
  // Quiz
  // ============================================
  answerQuiz(quizIndex, selected, correct) {
    const options = document.querySelectorAll(`#quiz-${quizIndex} .quiz-option`);
    options.forEach((opt, i) => {
      opt.onclick = null;
      opt.style.pointerEvents = 'none';
      if (i === correct) opt.classList.add('correct');
      if (i === selected && selected !== correct) opt.classList.add('incorrect');
    });
    
    const explanation = document.getElementById(`quiz-explanation-${quizIndex}`);
    if (explanation) explanation.style.display = 'block';
    
    if (selected === correct) {
      Storage.recordPuzzleAttempt(true, 5);
    } else {
      Storage.recordPuzzleAttempt(false, -3);
    }
  },

  // ============================================
  // Complete Lesson
  // ============================================
  completeLesson(lessonId) {
    Storage.completeLesson(lessonId);
    this.render();
  },

  // ============================================
  // Puzzle Trainer
  // ============================================
  _currentPuzzleSet: [],
  _currentPuzzleIndex: 0,

  _initPuzzleTrainerBoard() {
    const container = document.getElementById('puzzle-trainer-board');
    if (!container) return;
    const size = Math.min(400, window.innerWidth - 40);
    container._board = new BoardRenderer(container, { size, interactive: false });
    container._board.setFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  },

  startPuzzleSet(contentId, lessonId) {
    const content = ALL_CONTENT.find(c => c.id === contentId);
    if (!content) return;
    const lesson = content.modules.find(m => m.id === lessonId);
    if (!lesson || !lesson.puzzles) return;
    
    this._currentPuzzleSet = lesson.puzzles;
    this._currentPuzzleIndex = 0;
    this._showPuzzle();
  },

  _showPuzzle() {
    if (this._currentPuzzleIndex >= this._currentPuzzleSet.length) {
      const status = document.getElementById('puzzle-trainer-status');
      if (status) {
        status.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: var(--space-md);">🎉</div>
          <div style="font-weight: 700; margin-bottom: var(--space-sm);">Puzzle Set Complete!</div>
          <button class="btn btn-primary btn-sm" onclick="App._currentPuzzleIndex = 0; App._showPuzzle();">Restart</button>
        `;
      }
      return;
    }
    
    const puzzle = this._currentPuzzleSet[this._currentPuzzleIndex];
    const container = document.getElementById('puzzle-trainer-board');
    if (container?._board) {
      container._board.setFEN(puzzle.fen);
    }
    
    const status = document.getElementById('puzzle-trainer-status');
    if (status) {
      status.innerHTML = `
        <div class="flex items-center justify-between" style="margin-bottom: var(--space-md);">
          <span class="badge badge-${getDifficultyBadge(puzzle.difficulty)}">${puzzle.theme}</span>
          <span style="color: var(--text-tertiary);">${this._currentPuzzleIndex + 1} / ${this._currentPuzzleSet.length}</span>
        </div>
        <div style="font-weight: 700; font-size: var(--text-lg); margin-bottom: var(--space-md);">Find the best move!</div>
        <div class="flex gap-sm justify-center">
          <button class="btn btn-amber btn-sm" onclick="App._revealPuzzleSolution()">💡 Show Hint</button>
          <button class="btn btn-primary btn-sm" onclick="App._nextPuzzle()">Next →</button>
        </div>
        <div id="puzzle-solution-reveal" style="display: none; margin-top: var(--space-md);">
          <div class="hint-box">
            <span class="hint-icon">💡</span>
            <div>
              <div style="font-weight: 700; color: var(--emerald-400);">${puzzle.solution}</div>
              <div style="font-size: var(--text-sm); color: var(--text-secondary);">${puzzle.explanation}</div>
            </div>
          </div>
        </div>
      `;
    }
  },

  _revealPuzzleSolution() {
    const el = document.getElementById('puzzle-solution-reveal');
    if (el) el.style.display = 'block';
  },

  _nextPuzzle() {
    this._currentPuzzleIndex++;
    this._showPuzzle();
  },

  // ============================================
  // Opening Explorer
  // ============================================
  _openingBoard: null,

  _initOpeningBoard() {
    const container = document.getElementById('opening-board');
    if (!container) return;
    const size = Math.min(400, window.innerWidth - 40);
    this._openingBoard = new BoardRenderer(container, { size, interactive: false });
    this._openingBoard.setFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  },

  loadOpeningTree(openingId) {
    const opening = openingsContent.modules.find(m => m.id === openingId);
    if (!opening || !opening.openingTree) return;
    
    const treeEl = document.getElementById('opening-tree');
    if (treeEl) {
      treeEl.innerHTML = `
        <div style="font-weight: 700; margin-bottom: var(--space-md);">${opening.title}</div>
        ${opening.openingTree.map((node, i) => `
          <div class="opening-move-row" onclick="App._loadOpeningMove('${node.fen}', '${node.comment}')">
            <span class="opening-move-san">${node.move}</span>
            <span class="opening-move-name">${node.comment}</span>
          </div>
        `).join('')}
      `;
    }
    
    // Load first position
    if (opening.openingTree.length > 0) {
      this._loadOpeningMove(opening.openingTree[0].fen, opening.openingTree[0].comment);
    }
  },

  _loadOpeningMove(fen, comment) {
    if (this._openingBoard) {
      this._openingBoard.setFEN(fen);
    }
    const info = document.getElementById('opening-info');
    if (info) {
      info.style.display = 'block';
      info.innerHTML = `<div style="font-size: var(--text-sm); color: var(--text-secondary);">${comment || 'Click moves to navigate the opening tree.'}</div>`;
    }
  },

  // ============================================
  // Spaced Repetition
  // ============================================
  flipCard() {
    const card = document.getElementById('flashcard');
    if (card) card.classList.toggle('flipped');
  },

  rateCard(cardId, quality) {
    SpacedRepetition.reviewCard(cardId, quality);
    this.render();
  },
};

// ============================================
// Initialize App
// ============================================
function init() {
  // Setup routing
  state.router.route('/', () => App.render());
  state.router.route('/play', () => App.render());
  state.router.route('/puzzles', () => App.render());
  state.router.route('/progress', () => App.render());
  state.router.route('/review', () => App.render());
  state.router.route('/openings-explorer', () => App.render());
  state.router.route('/games-study', () => App.render());
  state.router.route('/learn/:module', () => App.render());
  state.router.route('/learn/:module/:lesson', () => App.render());
  state.router.route('*', () => App.render());

  // Make App available globally
  window.App = App;

  // Hide loading screen
  setTimeout(() => {
    const loading = document.getElementById('loading-screen');
    if (loading) {
      loading.classList.add('fade-out');
      setTimeout(() => loading.remove(), 600);
    }
    
    // First render
    App.render();
  }, 800);

  // Seed some SRS cards from content
  seedSRSCards();
}

function seedSRSCards() {
  // Add some initial SRS cards from tactics
  const tacticsModules = tacticsContent.modules;
  for (const module of tacticsModules) {
    if (module.puzzles) {
      for (const puzzle of module.puzzles.slice(0, 3)) {
        SpacedRepetition.addCard({
          id: puzzle.id,
          front: `${puzzle.theme}\nFind the best move`,
          back: `${puzzle.solution}\n${puzzle.explanation}`,
          category: 'tactics',
          fen: puzzle.fen
        });
      }
    }
  }
}

// Start the app
init();
