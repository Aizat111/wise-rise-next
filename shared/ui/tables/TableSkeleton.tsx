import type { CSSProperties, FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { cn } from '@/core/lib/utils';

interface Props {
  count?: number;
  style?: CSSProperties;
  className?: string;
  containerClassName?: string;
  variant?: 'multi-column' | 'two-column';
}

export const TableSkeleton: FC<Props> = ({
  count = 10,
  className = '',
  style,
  containerClassName = 'flex ',
  variant = 'two-column'
}): ReactNode => {
  const rowHeight = variant === 'multi-column' ? 'h-[38.75px]' : 'h-[66px]';

  return (
    <div className={cn('flex flex-col pb-4 gap-2', containerClassName)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={twMerge('animate-pulse shrink-0 w-full card-loader', rowHeight, className)}
          style={style}
        />
      ))}
    </div>
  );
};
