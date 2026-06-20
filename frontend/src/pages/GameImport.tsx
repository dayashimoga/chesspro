import React, { useState, useCallback } from 'react';
import { Board } from '../components/Board';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store/useAppStore';

interface ParsedGame {
  white: string;
  black: string;
  event: string;
  date: string;
  result: string;
  eco: string;
  moves: string[];
  fens: string[];
}

interface MoveAnalysis {
  moveIndex: number;
  classification: 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  evalBefore: number;
  evalAfter: number;
  evalDiff: number;
}

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Simple PGN parser
function parsePGN(pgn: string): ParsedGame | null {
  try {
    const headers: Record<string, string> = {};
    const headerRegex = /\[(\w+)\s+"([^"]+)"\]/g;
    let match;
    while ((match = headerRegex.exec(pgn)) !== null) {
      headers[match[1]] = match[2];
    }

    // Extract moves (everything after headers)
    const moveText = pgn
      .replace(/\[.*?\]/g, '')
      .replace(/\{[^}]*\}/g, '')
      .replace(/\([^)]*\)/g, '')
      .replace(/\d+\.\.\./g, '')
      .replace(/\d+\./g, '')
      .replace(/1-0|0-1|1\/2-1\/2|\*/g, '')
      .trim();

    const moves = moveText.split(/\s+/).filter(m => m.length > 0 && !m.match(/^\d+$/));

    if (moves.length === 0) return null;

    // Generate FENs (simplified — just track move count for display)
    const fens = [STARTING_FEN];
    for (let i = 0; i < moves.length; i++) {
      fens.push(STARTING_FEN); // Placeholder — real FEN generation requires a chess engine
    }

    return {
      white: headers['White'] || 'Unknown',
      black: headers['Black'] || 'Unknown',
      event: headers['Event'] || 'Unknown Event',
      date: headers['Date'] || '???',
      result: headers['Result'] || '*',
      eco: headers['ECO'] || '?',
      moves,
      fens,
    };
  } catch {
    return null;
  }
}

// Simulate move analysis
function analyzeGame(moves: string[]): MoveAnalysis[] {
  const analyses: MoveAnalysis[] = [];
  let currentEval = 0.2;

  for (let i = 0; i < moves.length; i++) {
    const isWhite = i % 2 === 0;
    const evalChange = (Math.random() - 0.48) * 0.6;
    const newEval = currentEval + evalChange;

    const absDiff = Math.abs(evalChange);
    let classification: MoveAnalysis['classification'];
    if (absDiff < 0.05) classification = 'best';
    else if (absDiff < 0.15) classification = 'excellent';
    else if (absDiff < 0.25) classification = 'good';
    else if (absDiff < 0.5) classification = 'inaccuracy';
    else if (absDiff < 1.0) classification = 'mistake';
    else classification = 'blunder';

    // Correct classification direction
    if ((isWhite && evalChange > 0) || (!isWhite && evalChange < 0)) {
      if (classification === 'inaccuracy' || classification === 'mistake' || classification === 'blunder') {
        classification = 'good';
      }
    }

    analyses.push({
      moveIndex: i,
      classification,
      evalBefore: currentEval,
      evalAfter: newEval,
      evalDiff: parseFloat(evalChange.toFixed(2)),
    });

    currentEval = newEval;
  }
  return analyses;
}

const CLASSIFICATION_COLORS: Record<string, string> = {
  best: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  excellent: 'text-green-400 bg-green-500/10 border-green-500/20',
  good: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  inaccuracy: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  mistake: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  blunder: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const CLASSIFICATION_ICONS: Record<string, string> = {
  best: '💎', excellent: '✅', good: '👍', inaccuracy: '⚠️', mistake: '❌', blunder: '💥',
};

const SAMPLE_PGN = `[Event "World Championship"]
[Site "Reykjavik"]
[Date "1972.07.23"]
[White "Spassky, Boris"]
[Black "Fischer, Robert"]
[Result "0-1"]
[ECO "D59"]

1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21. f4 Qe7 0-1`;

const GameImport: React.FC = () => {
  const [pgnInput, setPgnInput] = useState('');
  const [parsedGame, setParsedGame] = useState<ParsedGame | null>(null);
  const [analysis, setAnalysis] = useState<MoveAnalysis[]>([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const boardFlipped = useAppStore(s => s.boardFlipped);

  const handleImport = useCallback(() => {
    const game = parsePGN(pgnInput);
    if (game) {
      setParsedGame(game);
      setCurrentMove(0);
      setAnalysis([]);
      setAnalysisComplete(false);
    }
  }, [pgnInput]);

  const handleAnalyze = useCallback(() => {
    if (!parsedGame) return;
    setIsAnalyzing(true);

    // Simulate progressive analysis
    let moveIdx = 0;
    const results: MoveAnalysis[] = analyzeGame(parsedGame.moves);

    const interval = setInterval(() => {
      if (moveIdx >= results.length) {
        clearInterval(interval);
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        return;
      }
      setAnalysis(prev => [...prev, results[moveIdx]]);
      moveIdx++;
    }, 100);
  }, [parsedGame]);

  const loadSample = useCallback(() => {
    setPgnInput(SAMPLE_PGN);
  }, []);

  // Calculate accuracy stats
  const whiteAccuracy = analysis.length > 0
    ? Math.round(analysis.filter((a, i) => i % 2 === 0 && ['best', 'excellent', 'good'].includes(a.classification)).length / Math.ceil(analysis.length / 2) * 100)
    : 0;
  const blackAccuracy = analysis.length > 0
    ? Math.round(analysis.filter((a, i) => i % 2 === 1 && ['best', 'excellent', 'good'].includes(a.classification)).length / Math.floor(analysis.length / 2) * 100)
    : 0;

  const blunders = analysis.filter(a => a.classification === 'blunder').length;
  const mistakes = analysis.filter(a => a.classification === 'mistake').length;
  const inaccuracies = analysis.filter(a => a.classification === 'inaccuracy').length;

  return (
    <div className="flex flex-col gap-5 w-full max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <span className="text-3xl">📋</span> Game Import & Analysis
        </h1>
        <p className="text-sm text-slate-400 mt-1">Import your games via PGN for deep analysis and review</p>
      </div>

      {!parsedGame ? (
        /* Import View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="!p-5" hoverEffect={false}>
            <label className="text-xs font-bold text-white block mb-2">Paste PGN</label>
            <textarea
              value={pgnInput}
              onChange={(e) => setPgnInput(e.target.value)}
              placeholder="Paste your PGN here..."
              className="w-full bg-bg-primary/60 border border-white/10 focus:border-emerald-500/50 rounded-xl p-4 text-xs font-mono text-white resize-none focus:outline-none transition-colors h-64"
              spellCheck={false}
            />
            <div className="flex gap-2 mt-3">
              <Button variant="primary" onClick={handleImport} disabled={!pgnInput.trim()} className="flex-1">
                📥 Import Game
              </Button>
              <Button variant="secondary" onClick={loadSample}>
                Load Sample
              </Button>
            </div>
          </Card>

          <Card className="!p-5 flex flex-col justify-center items-center text-center" hoverEffect={false}>
            <span className="text-6xl mb-4 block">♟️</span>
            <h3 className="text-lg font-bold text-white mb-2">Import Any Game</h3>
            <p className="text-sm text-slate-400 max-w-sm mb-4">
              Paste a PGN from Chess.com, Lichess, or any chess platform. We'll analyze every move
              and identify blunders, mistakes, and brilliancies.
            </p>
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                <span className="text-lg">💥</span>
                <p className="text-[10px] text-red-400 font-bold mt-1">Blunders</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center">
                <span className="text-lg">❌</span>
                <p className="text-[10px] text-orange-400 font-bold mt-1">Mistakes</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
                <span className="text-lg">💎</span>
                <p className="text-[10px] text-emerald-400 font-bold mt-1">Best Moves</p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* Analysis View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Board */}
          <div className="lg:col-span-2">
            <div className="max-w-lg mx-auto">
              <Board
                fen={STARTING_FEN}
                interactive={false}
                flipped={boardFlipped}
                onMove={() => {}}
              />
            </div>

            {/* Move Navigation */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="secondary" size="sm" onClick={() => setCurrentMove(0)}>⏮</Button>
              <Button variant="secondary" size="sm" onClick={() => setCurrentMove(Math.max(0, currentMove - 1))}>◀</Button>
              <span className="text-xs text-slate-400 font-mono px-3">
                Move {Math.ceil((currentMove + 1) / 2)}{currentMove % 2 === 0 ? '.' : '...'} {parsedGame.moves[currentMove] || ''}
              </span>
              <Button variant="secondary" size="sm" onClick={() => setCurrentMove(Math.min(parsedGame.moves.length - 1, currentMove + 1))}>▶</Button>
              <Button variant="secondary" size="sm" onClick={() => setCurrentMove(parsedGame.moves.length - 1)}>⏭</Button>
            </div>

            {/* Move List */}
            <Card className="!p-3 mt-4 max-h-48 overflow-y-auto" hoverEffect={false}>
              <div className="flex flex-wrap gap-1">
                {parsedGame.moves.map((move, i) => {
                  const a = analysis[i];
                  const colorClass = a ? CLASSIFICATION_COLORS[a.classification] : 'text-slate-300 bg-white/3 border-white/5';
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentMove(i)}
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-all ${colorClass} ${currentMove === i ? 'ring-1 ring-white/30' : ''}`}
                    >
                      {i % 2 === 0 ? `${Math.ceil((i + 1) / 2)}.` : ''}{move}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Analysis Panel */}
          <div className="flex flex-col gap-4">
            {/* Game Info */}
            <Card className="!p-4" hoverEffect={false}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-white">Game Info</h3>
                <Badge variant="violet">{parsedGame.eco}</Badge>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">⬜ White</span>
                  <span className="text-white font-semibold">{parsedGame.white}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">⬛ Black</span>
                  <span className="text-white font-semibold">{parsedGame.black}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Event</span>
                  <span className="text-slate-300">{parsedGame.event}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Result</span>
                  <span className="text-emerald-400 font-bold">{parsedGame.result}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Moves</span>
                  <span className="text-slate-300">{parsedGame.moves.length}</span>
                </div>
              </div>
            </Card>

            {/* Analysis Button / Results */}
            {!analysisComplete ? (
              <Button
                variant="primary"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                    Analyzing ({analysis.length}/{parsedGame.moves.length})
                  </span>
                ) : '🔬 Run Full Analysis'}
              </Button>
            ) : (
              <>
                {/* Accuracy */}
                <Card className="!p-4" hoverEffect={false}>
                  <h3 className="text-xs font-bold text-white mb-3">Accuracy</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-2xl font-black text-white block">{whiteAccuracy}%</span>
                      <span className="text-[10px] text-slate-400">⬜ White</span>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-2xl font-black text-white block">{blackAccuracy}%</span>
                      <span className="text-[10px] text-slate-400">⬛ Black</span>
                    </div>
                  </div>
                </Card>

                {/* Summary */}
                <Card className="!p-4" hoverEffect={false}>
                  <h3 className="text-xs font-bold text-white mb-3">Summary</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-red-400">💥 Blunders</span>
                      <span className="font-bold text-white">{blunders}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-400">❌ Mistakes</span>
                      <span className="font-bold text-white">{mistakes}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-400">⚠️ Inaccuracies</span>
                      <span className="font-bold text-white">{inaccuracies}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400">💎 Best Moves</span>
                      <span className="font-bold text-white">{analysis.filter(a => a.classification === 'best').length}</span>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Current Move Analysis */}
            {analysis[currentMove] && (
              <Card className="!p-4" hoverEffect={false}>
                <h3 className="text-xs font-bold text-white mb-2">Move Analysis</h3>
                <div className={`p-3 rounded-lg border ${CLASSIFICATION_COLORS[analysis[currentMove].classification]}`}>
                  <div className="flex items-center gap-2">
                    <span>{CLASSIFICATION_ICONS[analysis[currentMove].classification]}</span>
                    <span className="text-xs font-bold capitalize">{analysis[currentMove].classification}</span>
                  </div>
                  <p className="text-[10px] mt-1 opacity-80">
                    Eval: {analysis[currentMove].evalBefore.toFixed(1)} → {analysis[currentMove].evalAfter.toFixed(1)}
                    ({analysis[currentMove].evalDiff >= 0 ? '+' : ''}{analysis[currentMove].evalDiff})
                  </p>
                </div>
              </Card>
            )}

            {/* Back to Import */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setParsedGame(null); setAnalysis([]); setAnalysisComplete(false); setPgnInput(''); }}
            >
              ← Import Another Game
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameImport;
