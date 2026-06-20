import React from 'react';

interface ProgressBarProps {
  percent: number;
  height?: number;
  className?: string;
  gradient?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  height = 8,
  className = '',
  gradient = 'from-emerald-500 to-emerald-400',
}) => {
  const cappedPercent = Math.min(100, Math.max(0, percent));
  return (
    <div
      className={`w-full bg-white/5 rounded-full overflow-hidden border border-white/5 ${className}`}
      style={{ height }}
    >
      <div
        className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${cappedPercent}%` }}
      />
    </div>
  );
};

export default ProgressBar;
