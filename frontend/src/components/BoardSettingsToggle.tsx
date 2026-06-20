import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

const BOARD_THEMES = [
  { id: 'green' as const, label: 'Forest Green', desc: 'Default green', colorLight: '#e8dcc8', colorDark: '#7b945d' },
  { id: 'brown' as const, label: 'Wood Brown', desc: 'Classic wood look', colorLight: '#f0d9b5', colorDark: '#b58863' },
  { id: 'blue' as const, label: 'Ocean Blue', desc: 'Calming marine blue', colorLight: '#dee3e6', colorDark: '#8ca2ad' },
  { id: 'tournament' as const, label: 'Tournament', desc: 'Official blue-grey', colorLight: '#e1e1e1', colorDark: '#4b7399' },
];

const PIECE_SETS = [
  { id: 'standard' as const, label: 'Standard', desc: 'Classic CBurnett style', icon: '♟️' },
  { id: 'neo' as const, label: 'Neon Glow', desc: 'Vibrant custom glows', icon: '⚡' },
  { id: 'alpha' as const, label: 'Alpha Minimalist', desc: 'Sleek flat design', icon: '🅰️' },
  { id: 'merida' as const, label: 'Merida Wood', desc: 'Vintage warm tones', icon: '🪵' },
];

export const BoardSettingsToggle: React.FC = () => {
  const boardTheme = useAppStore(s => s.boardTheme);
  const setBoardTheme = useAppStore(s => s.setBoardTheme);
  const pieceSet = useAppStore(s => s.pieceSet);
  const setPieceSet = useAppStore(s => s.setPieceSet);
  const boardFlipped = useAppStore(s => s.boardFlipped);
  const toggleBoardFlip = useAppStore(s => s.toggleBoardFlip);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 border border-white/5 hover:border-emerald-500/20 text-slate-300 hover:text-white transition-all duration-300"
        title="Board settings"
        id="board-settings-menu-button"
      >
        <span className="text-sm">⚙️</span>
        <span className="hidden md:inline">Board Options</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-bg-secondary border border-white/10 shadow-2xl p-4 animate-scaleIn flex flex-col gap-4">
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Board Themes</h4>
            <div className="grid grid-cols-2 gap-2">
              {BOARD_THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setBoardTheme(theme.id)}
                  className={`p-2 rounded-xl text-left border transition-all flex flex-col gap-1.5 ${
                    boardTheme === theme.id
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex gap-0.5 rounded overflow-hidden h-4 w-8 border border-white/10 shrink-0">
                    <div style={{ backgroundColor: theme.colorLight }} className="flex-1" />
                    <div style={{ backgroundColor: theme.colorDark }} className="flex-1" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold block">{theme.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Piece Styles</h4>
            <div className="flex flex-col gap-1.5">
              {PIECE_SETS.map(set => (
                <button
                  key={set.id}
                  onClick={() => setPieceSet(set.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-left border transition-all ${
                    pieceSet === set.id
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{set.icon}</span>
                    <div>
                      <span className="text-[10px] font-bold block">{set.label}</span>
                      <span className="text-[8px] text-slate-500 block leading-tight">{set.desc}</span>
                    </div>
                  </div>
                  {pieceSet === set.id && <span className="text-[10px] text-emerald-400">●</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-3">
            <button
              onClick={() => toggleBoardFlip()}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent text-[10px] font-bold text-slate-300 transition-all"
            >
              <span>🔄 Flip Chess Board</span>
              <span className="text-slate-400 font-mono text-[9px] uppercase">{boardFlipped ? 'Black' : 'White'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardSettingsToggle;
