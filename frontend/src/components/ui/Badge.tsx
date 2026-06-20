import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'amber' | 'violet' | 'red' | 'slate';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  className = '',
  ...props
}) => {
  const variants = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/15',
    violet: 'bg-violet-500/10 text-violet-400 border border-violet-500/15',
    red: 'bg-red-500/10 text-red-400 border border-red-500/15',
    slate: 'bg-white/5 text-slate-400 border border-white/5',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
