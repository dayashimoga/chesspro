import React, { useState, useEffect, useRef } from 'react';

interface MoveDetails {
  move: string;
  eval?: string;
  idea?: string;
  motif?: string;
  comment?: string;
  threat?: string;
  alternatives?: string[];
}

interface ReplayPanelProps {
  moves: MoveDetails[];
  currentIndex: number;
  onChangeIndex: (index: number) => void;
  onFlipBoard: () => void;
}

export const ReplayPanel: React.FC<ReplayPanelProps> = ({
  moves,
  currentIndex,
  onChangeIndex,
  onFlipBoard
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const autoplayTimerRef = useRef<any | null>(null);

  // Clear autoplay when moves change or we reach the end
  useEffect(() => {
    if (currentIndex >= moves.length - 1 && isPlaying) {
      setIsPlaying(false);
    }
  }, [currentIndex, moves]);

  // Handle Autoplay timer
  useEffect(() => {
    if (isPlaying) {
      autoplayTimerRef.current = setInterval(() => {
        if (currentIndex < moves.length - 1) {
          onChangeIndex(currentIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }, 2000); // 2 seconds per move
    } else {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isPlaying, currentIndex]);

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentIndex > -1) {
      onChangeIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentIndex < moves.length - 1) {
      onChangeIndex(currentIndex + 1);
    }
  };

  const handlePlayPause = () => {
    if (currentIndex >= moves.length - 1) {
      onChangeIndex(-1); // Restart
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const currentMove = currentIndex >= 0 ? moves[currentIndex] : null;

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 w-full max-w-md text-slate-200">
      <div className="border-b border-white/10 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Study Engine</span>
        <h3 className="text-lg font-bold text-white">Interactive Replay Panel</h3>
      </div>

      {/* Media Player Controls */}
      <div className="flex justify-center items-center gap-4 bg-[#0c0c14] py-3 px-6 rounded-2xl border border-white/5">
        <button
          onClick={onFlipBoard}
          title="Flip Board"
          className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg"
        >
          🔄
        </button>
        <button
          onClick={handlePrev}
          disabled={currentIndex <= -1}
          className="text-slate-400 hover:text-white disabled:opacity-40 transition-colors p-2 rounded-lg text-lg font-semibold"
        >
          ◀◀
        </button>
        <button
          onClick={handlePlayPause}
          className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-bg-primary rounded-full flex items-center justify-center font-bold text-lg shadow-glow transition-all"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex >= moves.length - 1}
          className="text-slate-400 hover:text-white disabled:opacity-40 transition-colors p-2 rounded-lg text-lg font-semibold"
        >
          ▶▶
        </button>
      </div>

      {/* Move Metadata / Commentary Section */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[300px]">
        {currentMove ? (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Move details */}
            <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 border border-white/5">
              <div>
                <span className="text-xs text-slate-400">Move played</span>
                <p className="text-lg font-bold text-emerald-400 font-mono">
                  {Math.floor(currentIndex / 2) + 1}.{currentIndex % 2 === 0 ? '' : '..'} {currentMove.move}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Evaluation</span>
                <p className="text-sm font-semibold font-mono text-amber-400">{currentMove.eval}</p>
              </div>
            </div>

            {/* Strategic/Tactical details */}
            <div className="grid grid-cols-2 gap-3">
              {currentMove.idea && (
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Strategic Purpose</span>
                  <span className="text-xs text-slate-300 font-semibold">{currentMove.idea}</span>
                </div>
              )}
              {currentMove.motif && (
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Tactical Motif</span>
                  <span className="text-xs text-slate-300 font-semibold">{currentMove.motif}</span>
                </div>
              )}
            </div>

            {/* Threat indicator */}
            {currentMove.threat && (
              <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-xs text-red-400 flex items-start gap-2">
                <span>⚠️</span>
                <div>
                  <strong className="block text-white mb-0.5">Threat Created:</strong>
                  {currentMove.threat}
                </div>
              </div>
            )}

            {/* Coach Commentary */}
            {currentMove.comment && (
              <div className="bg-[#0c0c14] border border-white/5 p-3.5 rounded-xl text-xs text-slate-300 leading-relaxed">
                <strong className="block text-white mb-1.5">💬 Coach Commentary:</strong>
                {currentMove.comment}
              </div>
            )}

            {/* Alternatives */}
            {currentMove.alternatives && currentMove.alternatives.length > 0 && (
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Alternative Options</span>
                <div className="flex gap-2 flex-wrap mt-1">
                  {currentMove.alternatives.map((alt, i) => (
                    <span key={i} className="text-xs font-mono bg-bg-primary py-1 px-2.5 rounded border border-white/5 text-slate-300">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm py-12 text-center">
            Click play or forward to start replaying the game moves.
          </div>
        )}
      </div>
    </div>
  );
};
export default ReplayPanel;
