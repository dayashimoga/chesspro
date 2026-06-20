import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-bg-primary shadow-glow hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    secondary: 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-200',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200',
    danger: 'bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
