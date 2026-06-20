import React, { useState, useMemo, useEffect } from 'react';
import { Board } from '../components/Board';
import { useAppStore } from '../store/useAppStore';
import { ALL_MASTER_GAMES as BASE_GAMES, MASTER_GAME_PLAYERS as BASE_PLAYERS, getGamesByPlayer as baseGetGamesByPlayer, getGameById, MasterGame } from '../content/master-games-db';
import { EXTENDED_MASTER_GAMES, EXTENDED_PLAYERS } from '../content/master-games-extended';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Merge original + extended games and players
const ALL_MASTER_GAMES = [...BASE_GAMES, ...EXTENDED_MASTER_GAMES];
const MASTER_GAME_PLAYERS = [...BASE_PLAYERS, ...EXTENDED_PLAYERS];
const getGamesByPlayer = (playerId: string) => {
  return ALL_MASTER_GAMES.filter(g => {
    const name = MASTER_GAME_PLAYERS.find(p => p.id === playerId)?.name || '';
    return g.white.includes(name.split(', ')[0]) || g.black.includes(name.split(', ')[0]);
  });
};

type ViewMode = 'browse' | 'replay';

export const MasterGameUniversity: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<MasterGame | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [showAnnotation, setShowAnnotation] = useState(true);
  const [guessMode, setGuessMode] = useState(false);
  const [userGuess, setUserGuess] = useState<string>('');
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null);

  // Autoplay states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1000); // ms per move (1x = 1000ms)

  const addXP = useAppStore(s => s.addXP);

  const displayGames = selectedPlayer
    ? getGamesByPlayer(selectedPlayer)
    : ALL_MASTER_GAMES;

  const criticalMomentForCurrentMove = useMemo(() => {
    if (!selectedGame) return null;
    return selectedGame.criticalMoments.find(cm => cm.moveNumber === Math.ceil(moveIndex / 2));
  }, [selectedGame, moveIndex]);

  const annotationForCurrentMove = useMemo(() => {
    if (!selectedGame) return null;
    const moveNum = Math.ceil(moveIndex / 2);
    return selectedGame.annotations[moveNum] || null;
  }, [selectedGame, moveIndex]);

  const pgnMoves = useMemo(() => {
    if (!selectedGame) return [];
    const moves: string[] = [];
    const pgnText = selectedGame.pgn;
    // Simple PGN parser — extract moves
    const tokens = pgnText.replace(/\d+\.\s*/g, '').trim().split(/\s+/);
    tokens.forEach(t => {
      if (t && !t.match(/^(1-0|0-1|1\/2-1\/2|\*)$/)) {
        moves.push(t);
      }
    });
    return moves;
  }, [selectedGame]);

  const currentFen = useMemo(() => {
    if (!selectedGame || moveIndex === 0) {
      return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }
    // Use critical moments if available
    const moveNum = Math.ceil(moveIndex / 2);
    const cm = selectedGame.criticalMoments.find(c => c.moveNumber === moveNum);
    if (cm) return cm.fen;
    return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  }, [selectedGame, moveIndex]);

  // Autoplay Effect
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setMoveIndex(prev => {
        if (prev >= pgnMoves.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, pgnMoves]);

  // Stop playback on game/viewmode change
  useEffect(() => {
    setIsPlaying(false);
  }, [selectedGame, viewMode]);

  const handleSelectGame = (game: MasterGame) => {
    setSelectedGame(game);
    setMoveIndex(0);
    setViewMode('replay');
    setGuessFeedback(null);
  };

  const handleGuess = () => {
    if (!userGuess.trim() || moveIndex >= pgnMoves.length) return;
    const correctMove = pgnMoves[moveIndex];
    const normalized = (s: string) => s.replace(/[+#!?]/g, '').toLowerCase();
    if (normalized(userGuess) === normalized(correctMove)) {
      setGuessFeedback('🟢 Correct! ' + correctMove);
      addXP(20);
      setMoveIndex(moveIndex + 1);
    } else {
      setGuessFeedback(`🔴 Not quite. The move was ${correctMove}. Your guess: ${userGuess}`);
      setMoveIndex(moveIndex + 1);
    }
    setUserGuess('');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2 animate-fadeIn text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-500 font-mono">Master Game University</span>
          <h2 className="text-2xl font-black text-white font-serif">Learn from the Legends</h2>
          <p className="text-xs text-slate-400 mt-1">Study annotated games from the greatest players in chess history</p>
        </div>
        {viewMode === 'replay' && (
          <Button
            onClick={() => { setViewMode('browse'); setSelectedGame(null); }}
            variant="secondary"
            size="sm"
          >
            ← Back to Library
          </Button>
        )}
      </div>

      {/* Browse Mode */}
      {viewMode === 'browse' && (
        <>
          {/* Player Selector */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <Button
              onClick={() => setSelectedPlayer(null)}
              variant={!selectedPlayer ? 'primary' : 'secondary'}
              size="sm"
              className="whitespace-nowrap font-bold shrink-0"
            >
              All Games ({ALL_MASTER_GAMES.length})
            </Button>
            {MASTER_GAME_PLAYERS.map(player => (
              <Button
                key={player.id}
                onClick={() => setSelectedPlayer(player.id)}
                variant={selectedPlayer === player.id ? 'primary' : 'secondary'}
                size="sm"
                className="whitespace-nowrap font-bold shrink-0"
              >
                {player.name.split(', ')[0]} ({player.count})
              </Button>
            ))}
          </div>

          {/* Player Bio Card */}
          {selectedPlayer && (
            <Card hoverEffect={false}>
              {(() => {
                const p = MASTER_GAME_PLAYERS.find(pl => pl.id === selectedPlayer);
                return p ? (
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">♚</div>
                    <div className="font-semibold">
                      <h3 className="text-lg font-black text-white">{p.name}</h3>
                      <div className="flex gap-3 mt-1.5 flex-wrap">
                        <span className="text-[9px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold font-mono">{p.title}</span>
                        <span className="text-[9px] bg-white/5 border border-white/5 text-slate-400 px-2 py-0.5 rounded-full font-bold font-mono">{p.era}</span>
                        <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold font-mono">{p.style}</span>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </Card>
          )}

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayGames.map(game => (
              <Card
                key={game.id}
                onClick={() => handleSelectGame(game)}
                className="p-5 text-left hover:border-purple-500/20 cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2 font-mono">
                  <span className="text-[10px] font-bold text-purple-400">{game.event}, {game.year}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                    game.difficulty === 'beginner' ? 'text-green-400 bg-green-500/10 border-green-500/30' :
                    game.difficulty === 'intermediate' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                    game.difficulty === 'advanced' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                    'text-purple-400 bg-purple-500/10 border-purple-500/30'
                  }`}>{game.difficulty}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                  {game.white} vs {game.black}
                </h4>
                <div className="flex gap-2 mb-2 font-semibold">
                  <span className="text-[10px] text-slate-500">{game.opening}</span>
                  <span className="text-[10px] text-slate-600">•</span>
                  <span className="text-[10px] font-bold text-amber-400">{game.result}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {game.themes.slice(0, 3).map(t => (
                    <span key={t} className="text-[9px] bg-white/5 border border-white/5 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed font-semibold">
                  {game.coachCommentary.substring(0, 120)}...
                </p>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Replay Mode */}
      {viewMode === 'replay' && selectedGame && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slideUp">
          {/* Left: Game Info + Annotations */}
          <div className="flex flex-col gap-4">
            <Card className="p-5 flex flex-col gap-2" hoverEffect={false}>
              <h3 className="text-sm font-bold text-white leading-snug">
                {selectedGame.white} vs {selectedGame.black}
              </h3>
              <div className="flex gap-2 items-center font-semibold">
                <span className="text-[10px] text-purple-400 font-bold font-mono">{selectedGame.event}, {selectedGame.year}</span>
                <span className="text-slate-600 font-bold">•</span>
                <span className="text-[10px] font-bold text-amber-400">{selectedGame.result}</span>
              </div>
              <span className="text-[10px] bg-white/5 border border-white/5 text-slate-400 px-2 py-0.5 rounded-full font-bold font-mono self-start mt-1">
                {selectedGame.eco} — {selectedGame.opening}
              </span>
            </Card>

            {/* Annotation Panel */}
            {annotationForCurrentMove && (
              <Card className="border-purple-500/20 bg-purple-500/5" hoverEffect={false}>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-2 font-mono">📝 Annotation</span>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">{annotationForCurrentMove}</p>
              </Card>
            )}

            {/* Critical Moment */}
            {criticalMomentForCurrentMove && (
              <Card className="border-amber-500/20 bg-amber-500/5 animate-pulse-glow" hoverEffect={false}>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2 font-mono">⚡ Critical Moment</span>
                <p className="text-xs text-white leading-relaxed font-bold">{criticalMomentForCurrentMove.description}</p>
              </Card>
            )}

            {/* Coach Commentary */}
            <Card hoverEffect={false}>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-2 font-mono">🎙️ Coach Commentary</span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">{selectedGame.coachCommentary}</p>
            </Card>
          </div>

          {/* Center: Board */}
          <div className="flex flex-col items-center gap-4">
            <Card className="w-full flex flex-col items-center p-6" hoverEffect={false}>
              <Board fen={currentFen} interactive={false} onMove={() => {}} />
            </Card>

            {/* Move Timeline Slider */}
            <div className="w-full flex flex-col gap-1.5 px-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 font-bold">
                <span>START</span>
                <span className="text-purple-400 font-black">Move {moveIndex} / {pgnMoves.length}</span>
                <span>END</span>
              </div>
              <input
                type="range"
                min="0"
                max={pgnMoves.length}
                value={moveIndex}
                onChange={e => setMoveIndex(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Move Navigation & Autoplay Controls */}
            <div className="flex gap-2 w-full items-center">
              <Button onClick={() => setMoveIndex(0)} variant="secondary">⏮</Button>
              <Button onClick={() => setMoveIndex(Math.max(0, moveIndex - 1))} variant="secondary" className="flex-1">◀ Back</Button>
              
              {/* Autoplay Play/Pause */}
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                variant={isPlaying ? 'primary' : 'secondary'}
                className="px-4"
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </Button>

              <Button onClick={() => setMoveIndex(Math.min(pgnMoves.length, moveIndex + 1))} variant="secondary" className="flex-1">Forward ▶</Button>
              <Button onClick={() => setMoveIndex(pgnMoves.length)} variant="secondary">⏭</Button>
            </div>

            {/* Speed & Mode Selectors */}
            <div className="flex gap-2 w-full">
              <select
                value={playSpeed}
                onChange={e => setPlaySpeed(Number(e.target.value))}
                className="flex-1 bg-bg-secondary border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value={2000}>Speed: 0.5x</option>
                <option value={1000}>Speed: 1.0x</option>
                <option value={500}>Speed: 2.0x</option>
              </select>

              <Button
                onClick={() => setGuessMode(!guessMode)}
                variant={guessMode ? 'primary' : 'secondary'}
                className="flex-1 text-[11px]"
                size="sm"
              >
                {guessMode ? 'Guess Mode: ON' : 'Enable Guess Mode'}
              </Button>
            </div>

            {/* Guess Input */}
            {guessMode && moveIndex < pgnMoves.length && (
              <div className="flex gap-2 w-full animate-fadeIn mt-1">
                <input
                  type="text"
                  value={userGuess}
                  onChange={e => setUserGuess(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleGuess()}
                  placeholder="Enter your guess (e.g., Nf6, Bxh7+)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                />
                <Button onClick={handleGuess} size="sm">
                  Guess
                </Button>
              </div>
            )}

            {guessFeedback && (
              <div className={`w-full text-center p-2.5 rounded-xl text-xs font-bold font-mono animate-fadeIn ${
                guessFeedback.startsWith('🟢') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {guessFeedback}
              </div>
            )}
          </div>

          {/* Right: Move List */}
          <div className="flex flex-col gap-4">
            <Card className="overflow-y-auto max-h-[500px]" hoverEffect={false}>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">Move List</h4>
              <div className="grid grid-cols-3 gap-1 text-xs font-mono font-semibold">
                <span className="text-slate-600 font-bold">#</span>
                <span className="text-slate-600 font-bold">White</span>
                <span className="text-slate-600 font-bold">Black</span>
                {Array.from({ length: Math.ceil(pgnMoves.length / 2) }).map((_, i) => (
                  <React.Fragment key={i}>
                    <span className="text-slate-600">{i + 1}.</span>
                    <button
                      onClick={() => setMoveIndex(i * 2 + 1)}
                      className={`text-left rounded px-1 py-0.5 transition-all ${
                        moveIndex === i * 2 + 1
                          ? 'bg-purple-500/20 text-purple-400 font-bold'
                          : selectedGame.annotations[i + 1]
                          ? 'text-amber-400 hover:bg-white/5'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {pgnMoves[i * 2] || ''}
                      {selectedGame.annotations[i + 1] && <span className="text-amber-500 ml-0.5">*</span>}
                    </button>
                    <button
                      onClick={() => setMoveIndex(i * 2 + 2)}
                      className={`text-left rounded px-1 py-0.5 transition-all ${
                        moveIndex === i * 2 + 2
                          ? 'bg-purple-500/20 text-purple-400 font-bold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {pgnMoves[i * 2 + 1] || ''}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </Card>

            {/* Alternative Lines */}
            {selectedGame.alternatives.length > 0 && (
              <Card className="flex flex-col gap-2.5" hoverEffect={false}>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-mono">Alternative Lines</h4>
                {selectedGame.alternatives.map((alt, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs font-semibold">
                    <div className="flex justify-between mb-1">
                      <span className="font-mono font-bold text-white">Move {alt.moveNumber}: {alt.move}</span>
                      <span className="font-mono text-slate-400">{alt.eval}</span>
                    </div>
                    <p className="text-slate-400">{alt.reason}</p>
                  </div>
                ))}
              </Card>
            )}

            {/* Themes */}
            <div className="flex gap-1.5 flex-wrap">
              {selectedGame.themes.map(t => (
                <span key={t} className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-1 rounded-lg font-bold font-mono">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterGameUniversity;
