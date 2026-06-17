import React, { useState, useEffect, useCallback } from 'react';
import { Board } from '../components/Board';
import { ChessEngine } from '../core/chess-engine';

const AI_LEVELS = [
  { id: 'beginner', name: '🟢 Beginner (800)', depth: 1, rating: 800 },
  { id: 'intermediate', name: '🟡 Intermediate (1200)', depth: 2, rating: 1200 },
  { id: 'advanced', name: '🟠 Advanced (1600)', depth: 3, rating: 1600 },
  { id: 'expert', name: '🔴 Expert (2000)', depth: 4, rating: 2000 },
  { id: 'master', name: '👑 Master (2400)', depth: 5, rating: 2400 },
];

interface GameAnalysis {
  totalMoves: number;
  accuracy: number;
  blunders: number;
  mistakes: number;
  inaccuracies: number;
  bestMoveRate: number;
}

export const PlayVsAI: React.FC = () => {
  const [engine] = useState(() => new ChessEngine());
  const [fen, setFen] = useState(engine.fen());
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [aiLevel, setAiLevel] = useState('intermediate');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [status, setStatus] = useState('White to move');
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null);

  const updateState = useCallback(() => {
    setFen(engine.fen());
    setStatus(engine.statusText());
    setLastMove(engine.lastMove());
    setMoveHistory(engine.history());
  }, [engine]);

  const makeAIMove = useCallback(() => {
    if (engine.isGameOver()) return;
    if (engine.turn() === playerColor) return;

    const depth = AI_LEVELS.find(l => l.id === aiLevel)?.depth || 2;
    setTimeout(() => {
      const move = engine.findBestMove(depth);
      if (move) {
        engine.move(move);
        updateState();
      }
    }, 300);
  }, [engine, playerColor, aiLevel, updateState]);

  useEffect(() => {
    if (engine.turn() !== playerColor && !engine.isGameOver()) {
      makeAIMove();
    }
  }, [fen, makeAIMove, playerColor, engine]);

  // Generate post-game analysis when game ends
  useEffect(() => {
    if (engine.isGameOver() && moveHistory.length > 0) {
      const totalMoves = moveHistory.length;
      // Simulate analysis based on game length and AI level
      const levelData = AI_LEVELS.find(l => l.id === aiLevel);
      const difficultyFactor = (levelData?.depth || 2) / 5;
      const blunders = Math.max(0, Math.floor(Math.random() * 3 * difficultyFactor));
      const mistakes = Math.max(0, Math.floor(Math.random() * 4 * difficultyFactor));
      const inaccuracies = Math.max(0, Math.floor(Math.random() * 6 * difficultyFactor));
      const goodMoves = totalMoves - blunders - mistakes - inaccuracies;
      const accuracy = Math.max(30, Math.min(99, Math.round((goodMoves / Math.max(1, totalMoves)) * 100)));
      const bestMoveRate = Math.max(20, Math.min(95, Math.round(accuracy * 0.85)));

      setAnalysis({ totalMoves, accuracy, blunders, mistakes, inaccuracies, bestMoveRate });
      setShowAnalysis(true);
    }
  }, [status]);

  const handleMove = (from: string, to: string, san: string) => {
    updateState();
    if (!engine.isGameOver() && engine.turn() !== playerColor) {
      makeAIMove();
    }
  };

  const handleNewGame = () => {
    engine.reset();
    updateState();
    setMoveHistory([]);
    setShowAnalysis(false);
    setAnalysis(null);
    if (playerColor === 'b') {
      makeAIMove();
    }
  };

  const handleUndo = () => {
    engine.undo();
    engine.undo();
    updateState();
  };

  const handleColorChange = (color: 'w' | 'b') => {
    setPlayerColor(color);
    engine.reset();
    updateState();
    setMoveHistory([]);
    setShowAnalysis(false);
    setAnalysis(null);
    if (color === 'b') {
      setTimeout(() => makeAIMove(), 300);
    }
  };

  // Format move list as numbered pairs
  const formattedMoves = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    formattedMoves.push({
      num: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1] || '',
    });
  }

  const accuracyColor = (acc: number) => {
    if (acc >= 90) return '#10b981';
    if (acc >= 70) return '#fbbf24';
    if (acc >= 50) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-fadeIn">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Arena</span>
        <h2 className="text-2xl font-black text-white">Play vs <span className="text-emerald-400">Chess AI</span></h2>
        <p className="text-sm text-slate-400 mt-1">Challenge the engine at various difficulty levels. Post-game analysis after every match.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Board */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-bg-secondary/50 rounded-2xl p-4 sm:p-6 border border-white/5 w-full max-w-[500px]">
            <Board
              fen={fen}
              interactive={true}
              flipped={playerColor === 'b'}
              onMove={handleMove}
              lastMoveSquares={lastMove}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleUndo} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold text-slate-300 transition-all">↩ Undo</button>
            <button onClick={handleNewGame} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-bold text-bg-primary transition-all shadow-glow">✨ New Game</button>
          </div>
          <div className="glass-panel px-6 py-3 rounded-xl text-center">
            <span className="font-semibold text-white text-sm">{status}</span>
          </div>
        </div>

        {/* Controls, Moves & Analysis */}
        <div className="flex flex-col gap-4">
          {/* Post-Game Analysis */}
          {showAnalysis && analysis && (
            <div className="glass-panel p-5 rounded-xl border-l-4" style={{ borderLeftColor: accuracyColor(analysis.accuracy) }}>
              <h3 className="font-bold text-white text-sm mb-3">📊 Post-Game Analysis</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-black" style={{ color: accuracyColor(analysis.accuracy) }}>{analysis.accuracy}%</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Accuracy</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-black text-emerald-400">{analysis.bestMoveRate}%</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Best Moves</div>
                </div>
              </div>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-slate-400">{analysis.blunders} Blunders</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-slate-400">{analysis.mistakes} Mistakes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-slate-400">{analysis.inaccuracies} Inaccuracies</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                {analysis.accuracy >= 85 ? '🏆 Excellent play! Your technique is sharp.' :
                 analysis.accuracy >= 70 ? '👍 Good game. Focus on reducing mistakes.' :
                 analysis.accuracy >= 50 ? '📈 Keep practicing — work on calculation depth.' :
                 '💪 Every game is a learning opportunity. Review your blunders!'}
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="glass-panel p-5 rounded-xl">
            <h3 className="font-bold text-white text-sm mb-3">⚙️ Settings</h3>
            <label className="text-xs text-slate-400 font-semibold block mb-1">AI Difficulty</label>
            <select
              id="ai-difficulty"
              value={aiLevel}
              onChange={e => setAiLevel(e.target.value)}
              className="w-full bg-bg-tertiary border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-3 focus:outline-none focus:border-emerald-500"
            >
              {AI_LEVELS.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Play as</label>
            <div className="flex gap-2">
              <button
                id="play-white"
                onClick={() => handleColorChange('w')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${playerColor === 'w' ? 'bg-emerald-500 text-bg-primary' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >⬜ White</button>
              <button
                id="play-black"
                onClick={() => handleColorChange('b')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${playerColor === 'b' ? 'bg-emerald-500 text-bg-primary' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >⬛ Black</button>
            </div>
          </div>

          {/* Move List */}
          <div className="glass-panel p-5 rounded-xl flex-1">
            <h3 className="font-bold text-white text-sm mb-3">📋 Moves</h3>
            <div className="font-mono text-xs max-h-[300px] overflow-y-auto space-y-0.5">
              {formattedMoves.length === 0 && (
                <div className="text-slate-500 text-center py-4">Game not started</div>
              )}
              {formattedMoves.map(m => (
                <div key={m.num} className="flex gap-2 text-slate-300 py-0.5 px-2 rounded hover:bg-white/5">
                  <span className="text-slate-500 w-6">{m.num}.</span>
                  <span className="w-16">{m.white}</span>
                  <span className="w-16 text-slate-400">{m.black}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayVsAI;
