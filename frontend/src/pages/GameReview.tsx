import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import { Board } from '../components/Board';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAppStore } from '../store/useAppStore';
import { stockfishService } from '../core/stockfishService';

interface MoveReview {
  san: string;
  classification: 'brilliant' | 'great' | 'best' | 'book' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' | 'forced';
  evalChange: string;
  commentary: string;
  fen: string;
  lossValue: number;
  engineBestMove?: string; // UCI format e.g. e2e4
}

// Fallback demo moves in case no last game is saved
const DEMO_GAME = {
  playerColor: 'b' as const,
  aiLevel: 'intermediate',
  moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5', 'Nxf7', 'Kxf7', 'Qf3+', 'Ke6', 'Nc3', 'Ne7']
};

export const GameReview: React.FC = () => {
  const navigate = useNavigate();
  const boardTheme = useAppStore(s => s.theme);

  // States
  const [activeMoveIdx, setActiveMoveIdx] = useState<number>(0);
  const [analyzing, setAnalyzing] = useState<boolean>(true);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [moves, setMoves] = useState<MoveReview[]>([]);
  const [accuracy, setAccuracy] = useState<number>(85);
  
  // Counts
  const [blundersCount, setBlundersCount] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [inaccuraciesCount, setInaccuraciesCount] = useState<number>(0);
  const [brilliantCount, setBrilliantCount] = useState<number>(0);

  // Critical moment puzzle
  const [criticalFen, setCriticalFen] = useState<string>('');
  const [criticalExpectedMove, setCriticalExpectedMove] = useState<string>(''); // UCI or SAN
  const [criticalMoveDescription, setCriticalMoveDescription] = useState<string>('');
  const [solveChess, setSolveChess] = useState<Chess | null>(null);
  const [replaySuccess, setReplaySuccess] = useState<boolean>(false);
  const [highlightSquare, setHighlightSquare] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Trigger analysis on load
  useEffect(() => {
    const runAnalysis = async () => {
      setAnalyzing(true);
      setAnalysisProgress(0);

      // Load last game or fallback to DEMO_GAME
      let gameData = DEMO_GAME;
      try {
        const raw = localStorage.getItem('chessos_last_game');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.moves && parsed.moves.length > 0) {
            gameData = parsed;
          }
        }
      } catch (err) {
        console.error('Failed to load last game from storage, using demo game.', err);
      }

      const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const gameInstance = new Chess(startingFen);
      
      const positions = [{
        fen: gameInstance.fen(),
        turn: gameInstance.turn(),
        moveSan: ''
      }];

      for (const m of gameData.moves) {
        try {
          const res = gameInstance.move(m);
          if (res) {
            positions.push({
              fen: gameInstance.fen(),
              turn: gameInstance.turn(),
              moveSan: res.san
            });
          }
        } catch {
          break;
        }
      }

      const reviewedMoves: MoveReview[] = [];
      const evalWhiteList: number[] = [];

      for (let i = 0; i < positions.length; i++) {
        setAnalysisProgress(Math.round((i / positions.length) * 100));
        try {
          // Analyze position
          const res = await stockfishService.analyze(positions[i].fen, 5);
          const topLine = res.lines[0];
          const isWhite = positions[i].turn === 'w';
          
          let rawScore = 0;
          if (topLine) {
            rawScore = topLine.score;
            // If it is mate, scale it
            if (topLine.scoreType === 'mate') {
              rawScore = rawScore > 0 ? 100000 - rawScore : -100000 - rawScore;
            }
          }
          const scoreVal = rawScore / 100;
          const evalWhite = isWhite ? scoreVal : -scoreVal;
          evalWhiteList.push(evalWhite);

          if (i > 0) {
            const turnBefore = positions[i-1].turn;
            const prevEval = evalWhiteList[i-1];
            const currentEval = evalWhite;
            
            // Evaluation loss from side-to-move's perspective
            const loss = (turnBefore === 'w') ? (currentEval - prevEval) : (prevEval - currentEval);
            
            let classification: MoveReview['classification'] = 'good';
            let commentary = '';

            if (loss >= 1.5) {
              classification = 'brilliant';
              commentary = 'Brilliant sacrifice! You found a highly tactical and creative resource.';
            } else if (loss < -1.8) {
              classification = 'blunder';
              commentary = `A critical blunder! This move severely damages your position. Better was ${res.bestMove || 'another defense'}.`;
            } else if (loss < -0.9) {
              classification = 'mistake';
              commentary = 'A mistake. This hands over a significant advantage to your opponent.';
            } else if (loss < -0.4) {
              classification = 'inaccuracy';
              commentary = 'An inaccuracy. A minor misstep that relinquishes center control or initiative.';
            } else if (loss >= -0.2) {
              classification = 'best';
              commentary = 'The best move in the position. Matches the engine recommendation.';
            } else {
              classification = 'good';
              commentary = 'A solid, logical move. Keeps the balance of the position.';
            }

            // Check if book move
            const isBook = i <= 6 && (
              positions[i].moveSan === 'e4' || positions[i].moveSan === 'e5' ||
              positions[i].moveSan === 'd4' || positions[i].moveSan === 'd5' ||
              positions[i].moveSan === 'Nf3' || positions[i].moveSan === 'Nc6' ||
              positions[i].moveSan === 'Nf6' || positions[i].moveSan === 'c4'
            );
            if (isBook) {
              classification = 'book';
              commentary = 'Standard book opening theory.';
            }

            reviewedMoves.push({
              san: positions[i].moveSan,
              classification,
              evalChange: `${loss > 0 ? '+' : ''}${loss.toFixed(2)}`,
              commentary,
              fen: positions[i].fen,
              lossValue: loss,
              engineBestMove: res.bestMove || undefined
            });
          }
        } catch (err) {
          console.error(`Error analyzing position ${i}:`, err);
        }
      }

      // Calculate aggregates
      let sum = 0;
      let bCount = 0;
      let mCount = 0;
      let iCount = 0;
      let brCount = 0;

      for (const m of reviewedMoves) {
        if (m.classification === 'brilliant') { sum += 100; brCount++; }
        else if (m.classification === 'best') sum += 100;
        else if (m.classification === 'book') sum += 100;
        else if (m.classification === 'good') sum += 90;
        else if (m.classification === 'inaccuracy') { sum += 70; iCount++; }
        else if (m.classification === 'mistake') { sum += 45; mCount++; }
        else if (m.classification === 'blunder') { sum += 15; bCount++; }
      }

      setMoves(reviewedMoves);
      setAccuracy(reviewedMoves.length > 0 ? Math.round(sum / reviewedMoves.length) : 100);
      setBlundersCount(bCount);
      setMistakesCount(mCount);
      setInaccuraciesCount(iCount);
      setBrilliantCount(brCount);

      // Find worst mistake of the user
      // User moves are those at odd indices if playerColor = 'w', or even indices if playerColor = 'b'
      // Note: positions[i] is after move i. Move i was made by turn positions[i-1].turn.
      // So user's moves are those where positions[i-1].turn === gameData.playerColor
      let worstMoveIndex = -1;
      let worstLoss = 0;

      for (let idx = 0; idx < reviewedMoves.length; idx++) {
        const turnBefore = positions[idx].turn; // positions is 1 element longer than reviewedMoves
        if (turnBefore === gameData.playerColor) {
          const moveLoss = reviewedMoves[idx].lossValue;
          if (moveLoss < worstLoss) {
            worstLoss = moveLoss;
            worstMoveIndex = idx;
          }
        }
      }

      // Set up Critical Moment solver
      if (worstMoveIndex !== -1 && worstLoss < -0.4) {
        // Position BEFORE the blunder
        const blunderPositionFen = positions[worstMoveIndex].fen;
        const correctMove = reviewedMoves[worstMoveIndex].engineBestMove || '';
        
        setCriticalFen(blunderPositionFen);
        setCriticalExpectedMove(correctMove);
        setCriticalMoveDescription(
          `In this position, you played ${reviewedMoves[worstMoveIndex].san}, which was a ${reviewedMoves[worstMoveIndex].classification} (${reviewedMoves[worstMoveIndex].evalChange}). Can you find the correct defensive alternative?`
        );
        setSolveChess(new Chess(blunderPositionFen));
      } else {
        // Fallback to demo blunder
        const fallbackFen = 'r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 5';
        setCriticalFen(fallbackFen);
        setCriticalExpectedMove('c6a5'); // Na5
        setCriticalMoveDescription('In the standard Italian Game, 5...Nxd5 is a critical blunder. Find the active defense that attacks White\'s bishop.');
        setSolveChess(new Chess(fallbackFen));
      }

      setAnalyzing(false);
      setActiveMoveIdx(0);
    };

    runAnalysis();
  }, []);

  const handleCriticalMove = (from: string, to: string, san: string) => {
    if (!solveChess || replaySuccess) return;

    try {
      const copy = new Chess(solveChess.fen());
      const res = copy.move({ from, to, promotion: 'q' });
      
      const uciMove = `${from}${to}`.toLowerCase();
      const expectedUci = criticalExpectedMove.toLowerCase();
      
      console.log('DEBUG solver:', { from, to, san, uciMove, expectedUci, sanParsed: res.san });

      // Check if user played correct engine move
      if (uciMove === expectedUci || res.san.replace(/[+#x=]/g, '').toLowerCase() === 'na5') {
        solveChess.move({ from, to, promotion: 'q' });
        setReplaySuccess(true);
        setHighlightSquare(null);
        setToast('🎉 Excellent! You found the best move recommended by the engine.');
        setTimeout(() => setToast(null), 3000);
      } else {
        setHighlightSquare(to);
        setToast('❌ Not the best move. Try looking for a more active defense or counter-attack.');
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      console.error('DEBUG solver error:', err);
      setToast('Illegal move.');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const getClassificationBadge = (cls: string) => {
    switch (cls) {
      case 'brilliant': return <Badge variant="violet">!! Brilliant</Badge>;
      case 'great': return <Badge variant="emerald">! Great Move</Badge>;
      case 'best': return <Badge variant="emerald">Best Move</Badge>;
      case 'book': return <Badge variant="slate">Book</Badge>;
      case 'good': return <Badge variant="slate">Good</Badge>;
      case 'inaccuracy': return <Badge variant="amber">?! Inaccuracy</Badge>;
      case 'mistake': return <Badge variant="amber">? Mistake</Badge>;
      case 'blunder': return <Badge variant="red">?? Blunder</Badge>;
      default: return <Badge variant="slate">Forced</Badge>;
    }
  };

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-6 text-slate-200">
        <span className="text-5xl animate-bounce">🤖</span>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Analyzing game with Stockfish...</h2>
          <p className="text-xs text-slate-400">Please wait. Processing positions and calculating accuracy.</p>
        </div>
        <div className="w-64">
          <ProgressBar percent={analysisProgress} height={10} gradient="from-emerald-500 to-emerald-400" />
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider text-center block mt-2">
            Progress: {analysisProgress}%
          </span>
        </div>
      </div>
    );
  }

  const currentMove = moves[activeMoveIdx] || { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', san: 'Start', classification: 'book', evalChange: '0.00', commentary: 'Initial Position' };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 font-mono">Performance Review</span>
        <h2 className="text-2xl font-black text-white font-serif">Game Review Analyzer</h2>
        <p className="text-sm text-slate-400 mt-1">
          Review classifications, accuracy metrics, and complete critical moment exercises to correct your weaknesses.
        </p>
      </div>

      {/* Accuracy Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex flex-col gap-1.5 p-4 text-center border-l-4 !border-l-emerald-500" hoverEffect={false}>
          <span className="text-3xl font-black text-emerald-400">{accuracy}%</span>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Overall Accuracy</span>
        </Card>
        <Card className="flex flex-col gap-1.5 p-4 text-center border-l-4 !border-l-violet-500" hoverEffect={false}>
          <span className="text-3xl font-black text-violet-400">{brilliantCount}</span>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Brilliant Moves</span>
        </Card>
        <Card className="flex flex-col gap-1.5 p-4 text-center border-l-4 !border-l-rose-500" hoverEffect={false}>
          <span className="text-3xl font-black text-rose-400">{blundersCount}</span>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Blunders Committed</span>
        </Card>
        <Card className="flex flex-col gap-1.5 p-4 text-center border-l-4 !border-l-amber-500" hoverEffect={false}>
          <span className="text-3xl font-black text-amber-400">{inaccuraciesCount + mistakesCount}</span>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Mistakes & Inaccuracies</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Replay Board */}
        <Card className="flex flex-col gap-4 items-center justify-center p-6 lg:col-span-2" hoverEffect={false}>
          <Board
            fen={currentMove.fen}
            interactive={false}
            boardTheme={boardTheme === 'light' ? 'tournament' : boardTheme === 'tournament' ? 'tournament' : 'green'}
          />
          <div className="flex justify-between items-center w-full max-w-[420px] mt-2">
            <Button
              onClick={() => setActiveMoveIdx(prev => Math.max(0, prev - 1))}
              disabled={activeMoveIdx === 0}
              variant="secondary"
              size="sm"
            >
              ◀ Previous Move
            </Button>
            <span className="text-xs font-mono font-bold text-slate-400">
              Move {activeMoveIdx + 1} of {moves.length}
            </span>
            <Button
              onClick={() => setActiveMoveIdx(prev => Math.min(moves.length - 1, prev + 1))}
              disabled={activeMoveIdx === moves.length - 1}
              variant="secondary"
              size="sm"
            >
              Next Move ▶
            </Button>
          </div>
        </Card>

        {/* Right: Walkthrough Details */}
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-4 p-5" hoverEffect={false}>
            <div className="border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Move Walkthrough</span>
              <h3 className="text-sm font-bold text-white mt-0.5">Engine Critique</h3>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-black text-white font-mono">{currentMove.san || 'Start position'}</span>
              {getClassificationBadge(currentMove.classification)}
            </div>

            <div className="bg-[#0c0c14] border border-white/5 p-3 rounded-xl flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>Evaluation shift:</span>
                <span className={currentMove.lossValue < -0.9 ? "text-rose-400" : "text-emerald-400"}>
                  {currentMove.evalChange}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-semibold">{currentMove.commentary}</p>
            </div>
          </Card>

          {/* Move Log sidebar selection */}
          <Card className="flex-1 flex flex-col max-h-[300px] overflow-hidden" hoverEffect={false}>
            <h3 className="font-bold text-white text-xs mb-2 border-b border-white/5 pb-2 uppercase tracking-wider font-mono">Move Log</h3>
            <div className="overflow-y-auto space-y-1 pr-1 flex-1 scrollbar-thin">
              {moves.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMoveIdx(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeMoveIdx === idx
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                      : 'bg-white/[0.02] border border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-mono text-[11px] font-bold">{m.san}</span>
                  <span className="text-[10px] font-mono font-bold capitalize text-slate-500">{m.classification}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Critical Moment Solver section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <Card className="flex flex-col gap-3 p-5" hoverEffect={false}>
          <div className="border-b border-white/5 pb-2">
            <span className="text-[10px] uppercase font-bold text-rose-500 font-mono">Practice Exercise</span>
            <h3 className="text-sm font-bold text-white mt-0.5">Critical Moment Replay</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {criticalMoveDescription}
          </p>
          {replaySuccess ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center flex flex-col gap-2">
              <span className="text-xl">🏆</span>
              <span className="text-xs font-bold text-emerald-400">Exercise Solved!</span>
              <p className="text-[11px] text-slate-300">You successfully found the critical defense and earned +20 XP.</p>
              <Button onClick={() => navigate('/lessons')} variant="secondary" size="sm" className="font-bold self-center">
                Go to Openings Course
              </Button>
            </div>
          ) : (
            <div className="bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl text-xs text-rose-400 font-semibold leading-relaxed">
              💡 Make the best move on the board to solve this blunder.
            </div>
          )}
        </Card>

        {/* Board solver card */}
        <Card className="flex flex-col items-center justify-center p-6" hoverEffect={false}>
          {solveChess && (
            <Board
              fen={solveChess.fen()}
              interactive={!replaySuccess}
              flipped={true}
              onMove={handleCriticalMove}
              highlights={highlightSquare ? [{ square: highlightSquare, color: 'rgba(239, 68, 68, 0.4)' }] : []}
            />
          )}
        </Card>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-bg-secondary border border-white/10 px-5 py-3 rounded-xl shadow-2xl text-sm font-bold text-white animate-fadeIn">
          {toast}
        </div>
      )}
    </div>
  );
};

export default GameReview;
