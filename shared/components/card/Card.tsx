import type { FC } from 'react';

import { cn } from '@/core/lib/utils';

type CardProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const Card: FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      aria-hidden={!!onClick}
      className={cn('relative bg-toshi_body flex-col justify-between flex rounded-xl gap-2 p-6 h-full', className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
