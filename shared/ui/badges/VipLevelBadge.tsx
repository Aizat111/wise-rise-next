'use client';

import type { FC } from 'react';
import { useSelector } from 'react-redux';

import { cn, getVipBackgroundByLevel } from '@/core/lib/utils';
import type { RootState } from '@/core/redux-toolkit/store';
import { getLevelSource } from '@/shared/utils/userUtils';

type VipLevelBadgeProps = {
  level?: number;
  widthClassName?: string;
  paddingClassName?: string;
  textSizeClassName?: string;
  className?: string;
  children?: React.ReactNode;
};

const VipLevelBadge: FC<VipLevelBadgeProps> = ({
  level,
  widthClassName = 'w-full',
  paddingClassName = 'py-2.5 px-3',
  textSizeClassName = 'text-sm',
  className,
  children
}) => {
  const userProgress = useSelector((state: RootState) => state.userProgress);
  const effectiveLevel = typeof level === 'number' ? level : Number(userProgress?.level ?? 0);

  const background = getVipBackgroundByLevel(effectiveLevel);
  const label = getLevelSource(effectiveLevel);

  return (
    <div
      className={cn(
        'rounded-md justify-start text-white text-lg font-bold uppercase leading-tight tracking-wide',
        widthClassName,
        paddingClassName,
        className
      )}
      style={{ background }}
    >
      <div
        className={cn(
          'justify-start text-white/70 text-byrd font-semibold leading-snug tracking-tight',
          textSizeClassName,
          "font-['Suisse_Int\\'l']"
        )}
      >
        {label}
        {children}
      </div>
    </div>
  );
};

export default VipLevelBadge;
