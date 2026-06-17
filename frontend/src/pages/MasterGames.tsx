import React, { useState, useEffect } from 'react';
import { Board } from '../components/Board';
import { ReplayPanel } from '../components/ReplayPanel';
import { VariationExplorer } from '../components/VariationExplorer';
import { Chess } from 'chess.js';
import { ALL_MASTER_GAMES, MasterGame } from '../content/master-games-db';
import { useAppStore } from '../store/useAppStore';

export interface MoveDetails {
  move: string;
  eval: string;
  comment: string;
  alternatives?: string[];
}

export interface UIMasterGame {
  id: string;
  white: string;
  black: string;
  result: string;
  event: string;
  date: string;
  initialFen: string;
  moves: MoveDetails[];
}

const parsePgnToMoves = (pgn: string, annotations: Record<number, string>): MoveDetails[] => {
  const tokens = pgn.split(/\s+/).filter(t => t.length > 0);
  const moves: MoveDetails[] = [];
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.match(/^\d+\.+\.?$/)) {
      continue;
    }
    
    const isWhite = moves.length % 2 === 0;
    const currentMoveNum = Math.ceil((moves.length + 1) / 2);
    let comment = '';
    if (isWhite && annotations[currentMoveNum]) {
      comment = annotations[currentMoveNum];
    }
    
    moves.push({
      move: token,
      eval: '0.00',
      comment: comment || 'Analyzed master line move.'
    });
  }
  return moves;
};

const MASTER_GAMES_UI: UIMasterGame[] = ALL_MASTER_GAMES.map(g => ({
  id: g.id,
  white: g.white,
  black: g.black,
  result: g.result,
  event: g.event,
  date: String(g.year),
  initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  moves: parsePgnToMoves(g.pgn, g.annotations)
}));

export const MasterGames: React.FC = () => {
  const [games, setGames] = useState<UIMasterGame[]>(MASTER_GAMES_UI);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [currentMoveIdx, setCurrentMoveIdx] = useState<number>(-1);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [showVariations, setShowVariations] = useState<boolean>(false);
  
  // Guess the Move States
  const [playMode, setPlayMode] = useState<'study' | 'guess'>('study');
  const [guessMsg, setGuessMsg] = useState<string>('Try to guess White\'s starting move.');
  const [toast, setToast] = useState<string | null>(null);

  const addXP = useAppStore(state => state.addXP);
  const currentGame = games[selectedIdx] || MASTER_GAMES_UI[0];

  // Fetch games from Worker API on mount with local fallback
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('http://localhost:8787/api/master-games');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            // Get full game info for each
            const fullGames = await Promise.all(data.slice(0, 10).map(async (g: any) => {
              const r = await fetch(`http://localhost:8787/api/master-games/${g.id}`);
              if (r.ok) {
                const details = await r.json();
                return {
                  id: details.id,
                  white: details.white,
                  black: details.black,
                  result: details.result,
                  event: 'Grandmaster Clash',
                  date: '2026',
                  initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                  moves: details.pgn.split(' ').filter((_: any, idx: number) => idx % 3 !== 0).map((m: string) => ({
                    move: m,
                    comment: 'Analyzed master line move.',
                    eval: '0.00'
                  }))
                };
              }
              return null;
            }));
            const filtered = fullGames.filter(g => g !== null) as UIMasterGame[];
            if (filtered.length > 0) {
              setGames(filtered);
              return;
            }
          }
        }
      } catch {
        // Fallback
      }
      setGames(MASTER_GAMES_UI);
    };
    fetchGames();
  }, []);

  // Derive board FEN based on move index
  const getFenForMoveIndex = (moves: MoveDetails[], index: number) => {
    if (index === -1) return currentGame.initialFen;
    
    const game = new Chess();
    for (let i = 0; i <= index; i++) {
      try {
        game.move(moves[i].move);
      } catch {
        break;
      }
    }
    return game.fen();
  };

  const currentFen = getFenForMoveIndex(currentGame.moves, currentMoveIdx);

  useEffect(() => {
    setCurrentMoveIdx(-1);
    setGuessMsg('Try to guess White\'s starting move.');
  }, [selectedIdx, playMode]);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleBoardMove = (from: string, to: string, san: string) => {
    if (playMode !== 'guess') return;

    const game = new Chess(currentFen);
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (move) {
        const expectedMoveIdx = currentMoveIdx + 1;
        const expected = currentGame.moves[expectedMoveIdx];

        if (expected && move.san.toLowerCase().replace(/[#x+]/g, '') === expected.move.toLowerCase().replace(/[#x+]/g, '')) {
          const nextIdx = expectedMoveIdx + 1;
          
          if (nextIdx >= currentGame.moves.length) {
            setGuessMsg('🎉 Masterpiece! You guessed the entire line correctly. (+25 XP)');
            addXP(25);
            setCurrentMoveIdx(currentGame.moves.length - 1);
            setPlayMode('study');
          } else {
            // Play opponent's response
            const reply = currentGame.moves[nextIdx].move;
            game.move(reply);
            setCurrentMoveIdx(nextIdx);
            setGuessMsg(`Correct! Opponent responded ${reply}. Guess White's next move.`);
            addXP(5);
          }
        } else {
          setGuessMsg(`❌ Incorrect. ${move.san} was not played. Try again!`);
        }
      }
    } catch {
      // Illegal move
    }
  };

  // Build variation tree
  const buildVariationTree = () => {
    const moves = currentGame.moves;
    if (moves.length === 0) return { move: 'Start', children: [] };
    
    const root: any = {
      move: moves[0]?.move || 'Start',
      eval: moves[0]?.eval,
      comment: moves[0]?.comment,
      children: [],
    };

    let current = root;
    for (let i = 1; i < Math.min(moves.length, 20); i++) {
      const child: any = {
        move: moves[i].move,
        eval: moves[i].eval,
        comment: moves[i].comment,
        children: [],
      };
      if (moves[i].alternatives && moves[i].alternatives!.length > 0) {
        for (const alt of moves[i].alternatives!) {
          current.children.push({
            move: alt,
            eval: '?',
            comment: 'Alternative continuation',
            children: [],
          });
        }
      }
      current.children.unshift(child);
      current = child;
    }

    return root;
  };

  const handleVariationSelect = (moveSequence: string[]) => {
    const targetMove = moveSequence[moveSequence.length - 1];
    const idx = currentGame.moves.findIndex((m: any) => m.move === targetMove);
    if (idx >= 0) {
      setCurrentMoveIdx(idx);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Master Game University</span>
          <h2 className="text-2xl font-black text-white font-serif">Master Game Study System</h2>
        </div>

        <div className="flex bg-[#0c0c14] border border-white/5 p-1 rounded-xl gap-1">
          <button
            onClick={() => setPlayMode('study')}
            className={`py-1 px-3.5 text-xs font-bold rounded-lg transition-all ${
              playMode === 'study' ? 'bg-emerald-500 text-bg-primary shadow-glow' : 'text-slate-400'
            }`}
          >
            Study Mode
          </button>
          <button
            onClick={() => setPlayMode('guess')}
            className={`py-1 px-3.5 text-xs font-bold rounded-lg transition-all ${
              playMode === 'guess' ? 'bg-emerald-500 text-bg-primary shadow-glow' : 'text-slate-400'
            }`}
          >
            Guess Move Mode
          </button>
          <button
            onClick={() => setShowVariations(!showVariations)}
            className={`py-1 px-3.5 text-xs font-bold rounded-lg transition-all ${
              showVariations ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'text-slate-400'
            }`}
          >
            🌳 Tree View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game list sidebar */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Game Library</span>
          <div className="max-h-[380px] overflow-y-auto flex flex-col gap-2 pr-1 scrollbar-thin">
            {games.map((g, idx) => (
              <button
                key={g.id}
                onClick={() => { setSelectedIdx(idx); setCurrentMoveIdx(-1); }}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  idx === selectedIdx ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <h4 className="font-bold text-xs text-white leading-tight">{g.white} vs {g.black}</h4>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded font-bold text-slate-400">
                    {g.result}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{g.event} • {g.date}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Board */}
        <div className="flex flex-col gap-4 items-center justify-center bg-[#0c0c14]/50 rounded-3xl p-6 border border-white/5">
          <Board
            fen={currentFen}
            interactive={playMode === 'guess'}
            flipped={flipped}
            onMove={handleBoardMove}
          />
          
          {playMode === 'guess' ? (
            <div className="text-xs text-amber-400 mt-2 bg-amber-500/5 px-4 py-1.5 rounded-full border border-amber-500/10 font-bold text-center">
              🎯 {guessMsg}
            </div>
          ) : (
            <div className="text-xs text-slate-400 font-mono mt-2 bg-[#06060b] px-3 py-1 rounded-full border border-white/5 max-w-full truncate">
              {currentGame.white} vs {currentGame.black} • Move {currentMoveIdx + 1}/{currentGame.moves.length}
            </div>
          )}
        </div>

        {/* Right Panel: Replay Controls & Commentaries */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Coach Commentary</span>
            <div className="bg-[#0c0c14] border border-white/5 p-4 rounded-xl text-xs text-slate-300 leading-normal min-h-[100px]">
              <strong className="block text-white mb-1">
                Move {currentMoveIdx + 1}: {currentGame.moves[currentMoveIdx]?.move || 'Start'} (Eval: {currentGame.moves[currentMoveIdx]?.eval || 'N/A'})
              </strong>
              {currentGame.moves[currentMoveIdx]?.comment || 'Study the opening development and pawn structure alignments of this master match.'}
            </div>
          </div>

          <ReplayPanel
            moves={currentGame.moves}
            currentIndex={currentMoveIdx}
            onChangeIndex={setCurrentMoveIdx}
            onFlipBoard={() => setFlipped(!flipped)}
          />

          {showVariations && (
            <VariationExplorer
              tree={buildVariationTree()}
              onSelectMove={handleVariationSelect}
            />
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500/90 border border-emerald-400/30 px-5 py-3 rounded-xl shadow-2xl text-xs font-bold animate-fadeIn text-white">
          {toast}
        </div>
      )}
    </div>
  );
};

export default MasterGames;
