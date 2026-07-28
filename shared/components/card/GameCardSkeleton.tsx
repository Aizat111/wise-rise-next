import type { FC } from 'react';

import { cn } from '@/core/lib/utils';

interface GameCardSkeletonProps {
  className?: string;
}

const GameCardSkeleton: FC<GameCardSkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn('game-card w-full aspect-[3/4] max-h-none animate-pulse bg-gray-500/25', className)}
      aria-label="Game card skeleton"
    />
  );
};

export default GameCardSkeleton;
