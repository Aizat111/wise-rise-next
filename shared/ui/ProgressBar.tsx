import type { FC } from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: string;
  backgroundColor?: string;
  progressColor?: string;
  showPercentage?: boolean;
  className?: string;
  animated?: boolean;
}

const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  height = 'h-0.5',
  backgroundColor = 'bg-gray-700',
  progressColor = 'bg-primary-500',
  showPercentage = false,
  className = '',
  animated = true
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className={`relative ${height} ${backgroundColor} rounded-md overflow-hidden`}>
        <div
          className={`${height} ${progressColor} rounded-md transition-all duration-500 ease-out ${
            animated ? 'transition-all duration-500 ease-out' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between items-center mt-0.5">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-semibold text-white">{clampedProgress}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
