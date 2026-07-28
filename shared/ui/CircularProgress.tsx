import { type FC } from 'react';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
  children?: React.ReactNode;
}

const CircularProgress: FC<CircularProgressProps> = ({
  progress,
  size = 100,
  strokeWidth = 8,
  color = '#E18314',
  backgroundColor = '#888888',
  className = '',
  children
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedProgress / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute transform -rotate-90">
        {/* Background circle */}
        <circle cx={center} cy={center} r={radius} fill="none" stroke={backgroundColor} strokeWidth={strokeWidth} />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center">{children}</div>
    </div>
  );
};

export default CircularProgress;
