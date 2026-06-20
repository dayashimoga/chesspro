import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-bg-secondary/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-xl transition-all duration-300 ${
        hoverEffect ? 'hover:border-emerald-500/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
