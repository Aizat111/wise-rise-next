import type { CSSProperties, FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { cn } from '@/core/lib/utils';

interface Props {
  count?: number;
  style?: CSSProperties;
  className?: string;
  containerClassName?: string;
  asFragment?: boolean;
  variant?: 'block' | 'offer-card' | 'chat-item';
}

export const SkeletonLoader: FC<Props> = ({
  count = 1,
  className = '',
  style,
  containerClassName = 'flex gap-3',
  asFragment = false,
  variant = 'block'
}): ReactNode => {
  const items = Array.from({ length: count }).map((_, index) => {
    if (variant === 'offer-card') {
      // Wrapper ensures consumer-provided sizing (e.g., explicit height) applies without
      // overriding internal layout classes for the skeleton structure.
      return (
        <div key={index} className={twMerge('shrink-0 w-full h-full min-h-[px]', className)} style={style}>
          <div className="rounded-xl bg-toshi_body inline-flex h-full w-full flex-row p-5">
            <div className="flex-1 self-stretch pr-2.5 inline-flex flex-col justify-between items-start">
              <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
                <div className="h-6 w-24 rounded bg-white10" />
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="h-4 w-3/4 rounded bg-white10" />
                  <div className="h-3 w-2/3 rounded bg-white10" />
                </div>
              </div>
              <div className="inline-flex">
                <div className="h-10 w-32 rounded bg-white10" />
              </div>
            </div>
            <div className="justify-center items-center flex flex-col">
              <div className="w-32 h-32 rounded-xl bg-white10" />
            </div>
          </div>
        </div>
      );
    }

    if (variant === 'chat-item') {
      // Wrapper ensures consumer-provided sizing (e.g., explicit height) applies without
      // overriding internal layout classes for the skeleton structure.
      return (
        <div
          key={index}
          className={twMerge(
            'animate-pulse shrink-0 rounded-xl bg-gray-500/25 inline-flex h-full max-h-[76px] w-full',
            className
          )}
          style={style}
        />
      );
    }

    // Default block variant
    return (
      <div
        key={index}
        className={twMerge(
          'animate-pulse shrink-0 rounded-xl bg-gray-500/25 inline-flex h-full min-h-[160px] w-full',
          className
        )}
        style={style}
      />
    );
  });

  if (asFragment) return <>{items}</>;

  return <div className={cn('flex gap-3', containerClassName)}>{items}</div>;
};
