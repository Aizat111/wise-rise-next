import * as React from 'react';

import ToshiIcon from './ToshiIcon';
import { Spinnertext } from '@/shared/assets/loading';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'brand' | 'spinner';
  durationMs?: number; // only used for brand variant
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  className = '',
  variant = 'brand',
  durationMs = 6000
}) => {
  const getSpinnerSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-5 w-5';
      case 'md':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-8 w-8';
    }
  };

  const getBrandPixelSize = () => {
    switch (size) {
      case 'sm':
        return 72;
      case 'md':
        return 120;
      case 'lg':
        return 160;
      default:
        return 120;
    }
  };

  if (variant === 'spinner') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div
          className={`animate-spin rounded-full border-2 border-gray-300 border-t-orange-500 ${getSpinnerSizeClasses()}`}
        />
      </div>
    );
  }

  const px = getBrandPixelSize();
  return (
    <div className={`relative inline-flex items-center justify-center animate-pulse-in ${className}`}>
      <Spinnertext width={px} height={px} className="animate-spin" style={{ animationDuration: `${durationMs}ms` }} />
      <ToshiIcon
        width={px}
        height={px}
        className="absolute ml-[3.2px] mt-[3px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};
