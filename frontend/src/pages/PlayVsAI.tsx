import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Board } from '../components/Board';
import { ChessEngine } from '../core/chess-engine';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store/useAppStore';
import { stockfishService } from '../core/stockfishService';

// Time-based AI levels for instant responses
const AI_LEVELS = [
  { id: 'beginner', name: '🟢 Beginner (800)', movetime: 50, rating: 800, targetMs: 100 },
  { id: 'intermediate', name: '🟡 Intermediate (1200)', movetime: 150, rating: 1200, targetMs: 300 },
  { id: 'advanced', name: '🟠 Advanced (1600)', movetime: 400, rating: 1600, targetMs: 800 },
  { id: 'expert', name: '🔴 Expert (2000)', movetime: 800, rating: 2000, targetMs: 1500 },
  { id: 'master', name: '👑 Master (2400)', movetime: 1200, rating: 2400, targetMs: 2000 },
];

interface MoveEval {
  fen: string;
  move: string;
  evalBefore: number; // centipawns from side-to-move perspective
  bestMove: string | null;
  bestEval: number;
  classification: 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
}

interface GameAnalysis {
  totalMoves: number;
  accuracy: number;
  blunders: number;
  mistakes: number;
  inaccuracies: number;
  bestMoveRate: number;
  moveEvals: MoveEval[];
}

function classifyMove(evalLoss: number): MoveEval['classification'] {
  if (evalLoss < 10) return 'best';
  if (evalLoss < 30) return 'good';
  if (evalLoss < 100) return 'inaccuracy';
  if (evalLoss < 300) return 'mistake';
  return 'blunder';
}

export const PlayVsAI: React.FC = () => {
  const navigate = useNavigate();
  const [engine] = useState(() => new ChessEngine());
  const [fen, setFen] = useState(engine.fen());
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [aiLevel, setAiLevel] = useState('intermediate');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [status, setStatus] = useState('White to move');
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null);
  const [aiLatency, setAiLatency] = useState<number | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Store position evals during game for real post-game analysis
  const positionEvalsRef = useRef<Array<{ fen: string; move: string; isPlayerMove: boolean }>>([]);

  const boardTheme = useAppStore(s => s.theme);

  const updateState = useCallback(() => {
    setFen(engine.fen());
    setStatus(engine.statusText());
    setLastMove(engine.lastMove());
    setMoveHistory(engine.history());
  }, [engine]);

  const makeAIMove = useCallback(() => {
    if (engine.isGameOver()) return;
    if (engine.turn() === playerColor) return;
    if (isAiThinking) return;

    const level = AI_LEVELS.find(l => l.id === aiLevel) || AI_LEVELS[1];
    setIsAiThinking(true);
    const startTime = performance.now();

    // Use time-based search for predictable response times
    stockfishService.quickMove(engine.fen(), level.movetime)
      .then(result => {
        if (engine.turn() === playerColor || engine.isGameOver()) {
          setIsAiThinking(false);
          return;
        }
        
        if (result.bestMove) {
          // Record the position before AI moves
          const fenBefore = engine.fen();
          engine.move(result.bestMove);
          const duration = Math.round(performance.now() - startTime);
          setAiLatency(duration);
          
          // Store eval for post-game analysis
          positionEvalsRef.current.push({
            fen: fenBefore,
            move: result.bestMove,
            isPlayerMove: false,
          });
          
          updateState();
        }
        setIsAiThinking(false);
      })
      .catch(err => {
        console.error('AI move generation error:', err);
        setIsAiThinking(false);
        // Fallback to quick minimax if Stockfish worker fails
        const fallbackMove = engine.findBestMove(1);
        if (fallbackMove) {
          engine.move(fallbackMove);
          updateState();
        }
      });
  }, [engine, playerColor, aiLevel, isAiThinking, updateState]);

  useEffect(() => {
    if (engine.turn() !== playerColor && !engine.isGameOver() && !isAiThinking) {
      makeAIMove();
    }
  }, [fen, makeAIMove, playerColor, engine, isAiThinking]);

  // Real post-game analysis using Stockfish
  const analyzeGame = useCallback(async () => {
    const moves = positionEvalsRef.current;
    if (moves.length === 0) return;

    setIsAnalyzing(true);
    const moveEvals: MoveEval[] = [];

    // Evaluate each player move by comparing their move's eval with the best move
    const playerMoves = moves.filter(m => m.isPlayerMove);
    
    for (const pm of playerMoves) {
      try {
        // Get best move eval for this position
        const bestResult = await stockfishService.quickEval(pm.fen);
        const bestEval = bestResult.evalScore ?? 0;
        const bestMove = bestResult.bestMove;

        // Now get eval after player's actual move was played
        // We need the position after the player's move
        const { Chess } = await import('chess.js');
        const game = new Chess(pm.fen);
        const moveObj = game.move(pm.move);
        if (!moveObj) continue;
        
        const afterMoveFen = game.fen();
        const afterResult = await stockfishService.quickEval(afterMoveFen);
        // afterResult eval is from the opponent's perspective, so negate it
        const evalAfterMove = -(afterResult.evalScore ?? 0);

        // Eval loss = best eval minus actual eval (from the moving side's perspective)
        const evalLoss = Math.max(0, bestEval - evalAfterMove);
        
        moveEvals.push({
          fen: pm.fen,
          move: pm.move,
          evalBefore: bestEval,
          bestMove,
          bestEval,
          classification: classifyMove(evalLoss),
        });
      } catch {
        // Skip positions that fail to evaluate
      }
    }

    const blunders = moveEvals.filter(e => e.classification === 'blunder').length;
    const mistakes = moveEvals.filter(e => e.classification === 'mistake').length;
    const inaccuracies = moveEvals.filter(e => e.classification === 'inaccuracy').length;
    const bestMoves = moveEvals.filter(e => e.classification === 'best').length;
    const goodMoves = moveEvals.filter(e => e.classification === 'good').length;
    const total = moveEvals.length || 1;

    // Accuracy: weighted formula (best=100, good=80, inaccuracy=50, mistake=20, blunder=0)
    const accuracySum = moveEvals.reduce((sum, e) => {
      switch (e.classification) {
        case 'best': return sum + 100;
        case 'good': return sum + 80;
        case 'inaccuracy': return sum + 50;
        case 'mistake': return sum + 20;
        case 'blunder': return sum + 0;
        default: return sum + 50;
      }
    }, 0);
    const accuracy = Math.round(accuracySum / total);
    const bestMoveRate = Math.round(((bestMoves + goodMoves) / total) * 100);

    const result: GameAnalysis = {
      totalMoves: moveHistory.length,
      accuracy,
      blunders,
      mistakes,
      inaccuracies,
      bestMoveRate,
      moveEvals,
    };

    // Save game for review
    localStorage.setItem('chessos_last_game', JSON.stringify({
      moves: moveHistory,
      playerColor,
      aiLevel,
      moveEvals,
    }));

    setAnalysis(result);
    setShowAnalysis(true);
    setIsAnalyzing(false);
  }, [moveHistory, playerColor, aiLevel]);

  // Trigger analysis when game ends
  useEffect(() => {
    if (engine.isGameOver() && moveHistory.length > 0 && !showAnalysis && !isAnalyzing) {
      analyzeGame();
    }
  }, [status]);

  const handleMove = (from: string, to: string, san: string) => {
    // Record the position before player moves
    positionEvalsRef.current.push({
      fen: engine.fen(),
      move: san,
      isPlayerMove: true,
    });
    
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
    setIsAnalyzing(false);
    positionEvalsRef.current = [];
    if (playerColor === 'b') {
      makeAIMove();
    }
  };

  const handleUndo = () => {
    engine.undo();
    engine.undo();
    // Remove last 2 evals
    positionEvalsRef.current = positionEvalsRef.current.slice(0, -2);
    updateState();
  };

  const handleColorChange = (color: 'w' | 'b') => {
    setPlayerColor(color);
    engine.reset();
    updateState();
    setMoveHistory([]);
    setShowAnalysis(false);
    setAnalysis(null);
    setIsAnalyzing(false);
    positionEvalsRef.current = [];
    if (color === 'b') {
      setTimeout(() => makeAIMove(), 300);
    }
  };

  const formattedMoves = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    formattedMoves.push({
      num: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1] || '',
    });
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Arena</span>
        <h2 className="text-2xl font-black text-white">Play vs <span className="text-emerald-400">Chess AI</span></h2>
        <p className="text-sm text-slate-400 mt-1">Challenge the engine at various difficulty levels. Real Stockfish analysis after every game.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Board column */}
        <div className="flex flex-col items-center gap-4">
          <Card className="flex items-center justify-center p-6 bg-bg-secondary/40 border-white/5 w-full max-w-[500px]" hoverEffect={false}>
            <Board
              fen={fen}
              interactive={true}
              flipped={playerColor === 'b'}
              onMove={handleMove}
              lastMoveSquares={lastMove}
              boardTheme={boardTheme === 'light' ? 'tournament' : boardTheme === 'tournament' ? 'tournament' : boardTheme === 'focus' ? 'blue' : 'green'}
              pieceSet={boardTheme === 'focus' ? 'alpha' : 'standard'}
            />
          </Card>
          <div className="flex gap-2">
            <Button onClick={handleUndo} variant="secondary">
              ↩ Undo
            </Button>
            <Button onClick={handleNewGame}>
              ✨ New Game
            </Button>
          </div>
          <Card className="!py-3 !px-6 text-center font-bold text-white text-sm flex flex-col items-center gap-1 min-w-[200px]" hoverEffect={false}>
            <div className="flex items-center gap-2">
              {isAiThinking && (
                <span className="ai-thinking-dot" />
              )}
              <span>{isAiThinking ? '🤖 AI is thinking...' : isAnalyzing ? '🔬 Analyzing game...' : status}</span>
            </div>
            {aiLatency !== null && !isAiThinking && (
              <div className={`text-[10px] font-mono font-bold ${aiLatency < 200 ? 'text-emerald-400' : aiLatency < 500 ? 'text-amber-400' : 'text-orange-400'}`}>
                AI Response: {aiLatency}ms
              </div>
            )}
          </Card>
        </div>

        {/* Controls and Move List column */}
        <div className="flex flex-col gap-4">
          {/* Post-Game Analysis */}
          {showAnalysis && analysis && (
            <Card className="flex flex-col gap-4 border-l-4 !border-l-emerald-500" hoverEffect={false}>
              <h3 className="font-bold text-white text-sm">📊 Stockfish Post-Game Analysis</h3>
              <div className="grid grid-cols-2 gap-3 shadow-inner">
                <div className="bg-white/5 rounded-xl p-3.5 text-center border border-white/5">
                  <div className={`text-2xl font-black ${analysis.accuracy >= 85 ? 'text-emerald-400' : analysis.accuracy >= 65 ? 'text-amber-400' : 'text-red-400'}`}>
                    {analysis.accuracy}%
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Accuracy</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3.5 text-center border border-white/5">
                  <div className="text-2xl font-black text-amber-400">{analysis.bestMoveRate}%</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Best Moves</div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between items-center bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                  <span className="text-slate-400 font-semibold">🔴 Blunders</span>
                  <Badge variant="red">{analysis.blunders}</Badge>
                </div>
                <div className="flex justify-between items-center bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                  <span className="text-slate-400 font-semibold">🟡 Mistakes</span>
                  <Badge variant="amber">{analysis.mistakes}</Badge>
                </div>
                <div className="flex justify-between items-center bg-slate-500/5 p-2 rounded-lg border border-white/5">
                  <span className="text-slate-400 font-semibold">⚪ Inaccuracies</span>
                  <Badge variant="slate">{analysis.inaccuracies}</Badge>
                </div>
              </div>
              <div className="text-xs text-slate-400 leading-relaxed font-semibold">
                {analysis.accuracy >= 85 ? '🏆 Excellent play! Your technique is sharp.' :
                 analysis.accuracy >= 70 ? '👍 Good game. Focus on reducing mistakes.' :
                 analysis.accuracy >= 50 ? '📈 Keep practicing — work on calculation depth.' :
                 '💪 Every game is a learning opportunity. Review your blunders!'}
              </div>
              <Button onClick={() => navigate('/game-review')} variant="primary" fullWidth className="mt-2">
                🔎 Review Game with Stockfish
              </Button>
            </Card>
          )}

          {/* Analyzing indicator */}
          {isAnalyzing && (
            <Card className="flex flex-col items-center gap-3 py-6" hoverEffect={false}>
              <div className="ai-thinking-ring" />
              <h4 className="text-sm font-bold text-white">Analyzing with Stockfish...</h4>
              <p className="text-[10px] text-slate-500 text-center">Evaluating each position to calculate real accuracy</p>
            </Card>
          )}

          {/* Settings */}
          <Card hoverEffect={false} className="flex flex-col gap-3">
            <h3 className="font-bold text-white text-sm">⚙️ Game Setup</h3>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">AI Difficulty</label>
              <select
                id="ai-difficulty"
                value={aiLevel}
                onChange={e => setAiLevel(e.target.value)}
                className="w-full bg-bg-primary border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
              >
                {AI_LEVELS.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              <div className="text-[9px] text-slate-600 mt-1 font-mono">
                Target response: &lt;{AI_LEVELS.find(l => l.id === aiLevel)?.targetMs}ms
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Play as</label>
              <div className="flex gap-2">
                <button
                  id="play-white"
                  onClick={() => handleColorChange('w')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                    playerColor === 'w' 
                      ? 'bg-emerald-500 text-bg-primary border-emerald-500 shadow-glow' 
                      : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  ⬜ White
                </button>
                <button
                  id="play-black"
                  onClick={() => handleColorChange('b')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                    playerColor === 'b' 
                      ? 'bg-emerald-500 text-bg-primary border-emerald-500 shadow-glow' 
                      : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  ⬛ Black
                </button>
              </div>
            </div>
          </Card>

          {/* Move List */}
          <Card hoverEffect={false} className="flex-1 flex flex-col min-h-[220px]">
            <h3 className="font-bold text-white text-sm mb-3">📋 Game Moves</h3>
            <div className="font-mono text-xs overflow-y-auto space-y-1 pr-1 flex-1 shadow-inner">
              {formattedMoves.length === 0 && (
                <div className="text-slate-500 text-center italic py-8 font-semibold">Game not started</div>
              )}
              {formattedMoves.map(m => (
                <div key={m.num} className="flex gap-2 text-slate-300 py-1 px-2 rounded-lg hover:bg-white/5 font-bold">
                  <span className="text-slate-500 w-6 shrink-0">{m.num}.</span>
                  <span className="w-16">{m.white}</span>
                  <span className="w-16 text-slate-400">{m.black}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlayVsAI;
