import React, { useState, useEffect, useCallback } from 'react';
import { Board } from '../components/Board';
import { SpacedRepetition } from '../core/storage';
import { Chess } from 'chess.js';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';

interface OpeningItem {
  id: string;
  name: string;
  side: 'White' | 'Black';
  moves: string[]; // parsed moves array
  fen: string;
  trap: string;
  middlegameTheme: string;
  endgameTransition: string;
}

export const OpeningTrainer: React.FC = () => {
  const [openings, setOpenings] = useState<OpeningItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [exploringFen, setExploringFen] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  
  // Guess the Move states
  const [trainMode, setTrainMode] = useState<'explore' | 'guess'>('explore');
  const [guessMoveIdx, setGuessMoveIdx] = useState<number>(0);
  const [guessMessage, setGuessMessage] = useState<string>('Play the starting move of the opening.');

  const [practiceToast, setPracticeToast] = useState<string | null>(null);

  const addXP = useAppStore(state => state.addXP);
  const user = useAppStore(state => state.user);

  const localOpenings: OpeningItem[] = [
    {
      id: 'ruy_lopez',
      name: 'Ruy Lopez',
      side: 'White',
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
      fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      trap: 'Noah\'s Ark Trap: Black traps White\'s light-squared bishop on b3 using a pawn storm (a6, b5, c5, c4).',
      middlegameTheme: 'Fight for the d4 square, queenside expansion for Black, kingside attack build-ups for White.',
      endgameTransition: 'White has a pawn majority on the kingside; Black has the bishop pair to compensate.'
    },
    {
      id: 'sicilian',
      name: 'Sicilian Defense',
      side: 'Black',
      moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4'],
      fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c5 0 2',
      trap: 'Siberian Trap: Black sacrifices a pawn in the Smith-Morra Gambit to deliver checkmate on h2.',
      middlegameTheme: 'Asymmetrical battles, d5 break for Black, f4 expansion for White, queenside counterplay.',
      endgameTransition: 'Black usually enjoys a central pawn majority (2 vs 1 pawns in center).'
    }
  ];

  // Fetch openings from Worker API on mount with local fallback
  useEffect(() => {
    const fetchOpenings = async () => {
      try {
        const res = await fetch('http://localhost:8787/api/openings');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            // Map edge schema structures
            const formatted = data.map((row: any) => ({
              id: row.id,
              name: row.name,
              side: row.id.includes('sicilian') || row.id.includes('french') ? 'Black' : 'White',
              moves: JSON.parse(row.moves || '[]'),
              fen: row.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
              trap: row.traps || 'Avoid standard traps.',
              middlegameTheme: row.core_ideas || 'Fight for the center.',
              endgameTransition: row.history || 'Solid theoretical ending.'
            }));
            setOpenings(formatted);
            return;
          }
        }
      } catch {
        // Fallback
      }
      setOpenings(localOpenings);
    };
    fetchOpenings();
  }, []);

  const currentOpening = openings[selectedIdx] || localOpenings[0];
  const displayFen = exploringFen || (trainMode === 'guess' ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' : currentOpening.fen);

  // Sync exploration / guess state when opening or mode changes
  useEffect(() => {
    setExploringFen(null);
    setMoveHistory([]);
    setGuessMoveIdx(0);
    setGuessMessage(`Your turn! Guess the 1st move for White: ${currentOpening.moves[0] ? '?' : ''}`);
  }, [selectedIdx, trainMode, openings]);

  const handleMove = useCallback((from: string, to: string, san: string) => {
    const game = new Chess(displayFen);

    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (move) {
        if (trainMode === 'guess') {
          // Verify user guess
          const cleanSan = (s: string) => s.replace(/[+#x=]/g, '').toLowerCase();
          const expected = currentOpening.moves[guessMoveIdx];

          if (cleanSan(move.san) === cleanSan(expected)) {
            const nextIdx = guessMoveIdx + 1;
            
            if (nextIdx >= currentOpening.moves.length) {
              setGuessMessage('🎉 Brilliant! You matched the entire opening line. (+15 XP)');
              addXP(15);
              setExploringFen(game.fen());
              setMoveHistory(currentOpening.moves);
              setTrainMode('explore');
            } else {
              // Opponent plays next move automatically
              const replyMove = currentOpening.moves[nextIdx];
              game.move(replyMove);
              setExploringFen(game.fen());
              setGuessMoveIdx(nextIdx + 1);
              setGuessMessage(`Correct! Opponent played ${replyMove}. Guess the next move.`);
            }
          } else {
            setGuessMessage(`❌ Incorrect. ${move.san} is not the standard line. Try again!`);
            // Snap back
            setTimeout(() => {
              const resetGame = new Chess();
              for (let i = 0; i < guessMoveIdx; i++) {
                resetGame.move(currentOpening.moves[i]);
              }
              setExploringFen(resetGame.fen());
            }, 1000);
          }
        } else {
          // Free explore mode
          setExploringFen(game.fen());
          setMoveHistory(prev => [...prev, move.san]);
        }
      }
    } catch {
      // Illegal move
    }
  }, [displayFen, trainMode, guessMoveIdx, currentOpening]);

  const resetExploration = () => {
    setExploringFen(null);
    setMoveHistory([]);
    setGuessMoveIdx(0);
    setGuessMessage('Guess the starting move of the opening.');
  };

  const addToSRS = async () => {
    // Save to local storage SRS card
    SpacedRepetition.addCard({
      id: `opening-${currentOpening.id}`,
      front: `${currentOpening.name}\n\nMoves: ${currentOpening.moves.join(' ')}`,
      back: `${currentOpening.middlegameTheme}\n\nTrap: ${currentOpening.trap}`,
      category: 'openings',
    });

    // Save to Cloudflare Workers Repertoire API
    try {
      const token = localStorage.getItem('chessos_token') || `token_${user.id}`;
      await fetch('http://localhost:8787/api/coach/repertoire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          moveId: currentOpening.id,
          pgnLine: currentOpening.moves.join(' '),
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
          nextReview: Date.now() + 86400000
        })
      });
    } catch {
      // Offline fallback
    }

    setPracticeToast('✅ Opening added to your Spaced Repetition queue & Cloud Repertoire!');
    setTimeout(() => setPracticeToast(null), 3500);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Opening Builder</span>
          <h2 className="text-2xl font-black text-white font-serif">Interactive Opening Trainer</h2>
        </div>

        {/* Explore vs Guess Mode */}
        <div className="flex bg-bg-secondary border border-white/5 p-1 rounded-xl gap-1 shrink-0">
          <Button
            onClick={() => setTrainMode('explore')}
            variant={trainMode === 'explore' ? 'primary' : 'ghost'}
            size="sm"
          >
            Explore Mode
          </Button>
          <Button
            onClick={() => setTrainMode('guess')}
            variant={trainMode === 'guess' ? 'primary' : 'ghost'}
            size="sm"
          >
            Guess Move Mode
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Selector */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Openings Library</span>
          <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
            {openings.map((op, idx) => (
              <button
                key={op.id}
                onClick={() => setSelectedIdx(idx)}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  idx === selectedIdx ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <h4 className="font-bold text-xs text-white leading-tight">{op.name}</h4>
                  <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-slate-400 font-bold uppercase">
                    {op.side}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-500 truncate max-w-[200px]">{op.moves.join(' ')}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Interactive Board */}
        <Card className="flex flex-col gap-4 items-center justify-center p-6" hoverEffect={false}>
          <Board
            fen={displayFen}
            interactive={true}
            onMove={handleMove}
          />
          
          {trainMode === 'guess' ? (
            <div className="text-xs text-amber-400 mt-2 bg-amber-500/5 px-4 py-1.5 rounded-full border border-amber-500/10 font-bold text-center">
              🎯 Guess: {guessMessage}
            </div>
          ) : (
            <div className="text-xs text-slate-500 mt-2 text-center flex flex-col gap-1.5 items-center">
              {exploringFen ? (
                <>
                  <span className="text-emerald-400 truncate max-w-[280px]">Exploring: {moveHistory.join(' ')}</span>
                  <Button onClick={resetExploration} variant="secondary" size="sm">
                    ↩ Reset Line
                  </Button>
                </>
              ) : (
                <span>Explore variations on the board directly.</span>
              )}
            </div>
          )}
        </Card>

        {/* Right: Strategy details */}
        <Card className="flex flex-col justify-between" hoverEffect={false}>
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Opening Strategy</span>
              <h3 className="text-base font-extrabold text-white mt-0.5">{currentOpening.name}</h3>
            </div>

            <div className="bg-bg-primary border border-white/5 p-4 rounded-xl flex flex-col gap-1 font-semibold">
              <strong className="text-[11px] text-emerald-400 uppercase font-mono tracking-wider">⚡ Core Trap:</strong>
              <p className="text-[11px] text-slate-300 leading-normal">{currentOpening.trap}</p>
            </div>

            <div className="bg-bg-primary border border-white/5 p-4 rounded-xl flex flex-col gap-1 font-semibold">
              <strong className="text-[11px] text-amber-400 uppercase font-mono tracking-wider">🛡️ Middlegame Goals:</strong>
              <p className="text-[11px] text-slate-300 leading-normal">{currentOpening.middlegameTheme}</p>
            </div>

            <div className="bg-bg-primary border border-white/5 p-4 rounded-xl flex flex-col gap-1 font-semibold">
              <strong className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">🏁 Endings structure:</strong>
              <p className="text-[11px] text-slate-300 leading-normal">{currentOpening.endgameTransition}</p>
            </div>

            <Button
              onClick={addToSRS}
              fullWidth
              size="sm"
              className="mt-2"
            >
              Add to Repertoire Spaced Repetition 📚
            </Button>
          </div>
        </Card>
      </div>

      {practiceToast && (
        <Toast message={practiceToast} type="success" onClose={() => setPracticeToast(null)} />
      )}
    </div>
  );
};

export default OpeningTrainer;
