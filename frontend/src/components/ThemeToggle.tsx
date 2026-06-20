import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

const THEMES = [
  { id: 'dark' as const, label: 'Dark Mode', icon: '🌙', desc: 'Midnight default' },
  { id: 'light' as const, label: 'Light Mode', icon: '☀️', desc: 'High brightness' },
  { id: 'tournament' as const, label: 'Tournament', icon: '🌳', desc: 'Classic forest green' },
  { id: 'focus' as const, label: 'Deep Focus', icon: '👁️', desc: 'Minimalist high-contrast' },
];

export const ThemeToggle: React.FC = () => {
  const currentTheme = useAppStore(s => s.theme);
  const setTheme = useAppStore(s => s.setTheme);
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

  const activeThemeOption = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  return (
    <div ref={dropdownRef} className="relative inline-block text-left z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 border border-white/5 hover:border-emerald-500/20 text-slate-300 hover:text-white transition-all duration-300"
        title="Switch theme"
        id="theme-menu-button"
      >
        <span className="text-sm">{activeThemeOption.icon}</span>
        <span className="capitalize hidden sm:inline">{activeThemeOption.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-bg-secondary border border-white/10 shadow-2xl p-1 animate-scaleIn">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => {
                setTheme(theme.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                currentTheme === theme.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <span className="text-base">{theme.icon}</span>
              <div>
                <span className="text-xs font-bold block">{theme.label}</span>
                <span className="text-[9px] text-slate-500 block leading-tight">{theme.desc}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
