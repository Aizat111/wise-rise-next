'use client';

import { cn } from '@/core/lib/utils';

type ProgressBarProps = {
  progress: number;
  height?: string;
  backgroundColor?: string;
  progressColor?: string | 'bg-yellow';
  showPercentage?: boolean;
  className?: string;
  animated?: boolean;
  footerTitleVariant?: 'default' | 'badge';
  footerClassName?: string;
  footerTitleTextClassName?: string;
  footerValueTextClassName?: string;
  footer?: {
    title: string;
    value: string;
  };
};

const ProgressBar = ({
  progress,
  height = 'h-[12px]',
  backgroundColor = 'bg-gray-700',
  progressColor = 'bg-yellow',
  className = '',
  animated = true,
  footerTitleVariant = 'default',
  footerClassName = 'mt-3',
  footerTitleTextClassName,
  footerValueTextClassName,
  footer,
  showPercentage = false
}: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className={`relative ${height} ${backgroundColor} rounded-sm overflow-hidden`}>
        <div
          className={cn(
            'rounded-sm transition-all duration-500 ease-out',
            `${height} ${progressColor}`,
            animated ? 'transition-all duration-500 ease-out' : '',
            `shadow-[0px_0px_24px_0px_#FFF200]`
          )}
          style={{ width: `${clampedProgress}%` }}
        />
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{Math.round(clampedProgress)}%</span>
          </div>
        )}
      </div>
      {footer && (
        <div className={cn('flex justify-between items-center', footerClassName)}>
          {footerTitleVariant === 'badge' ? (
            <div
              className={cn(
                'px-3 py-2 bg-[#7B7B7B] font-byrd text-white rounded-lg',
                footerTitleTextClassName ?? 'text-sm'
              )}
            >
              {footer.title}
            </div>
          ) : (
            <span className={cn('text-white30', footerTitleTextClassName ?? 'text-xs')}>{footer.title}</span>
          )}
          <span className={cn('font-semibold text-white70', footerValueTextClassName ?? 'text-xs')}>
            {footer.value}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
