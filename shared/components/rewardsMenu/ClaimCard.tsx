'use client';

import { Button } from '@investorcentretb/toshi-ui';
import type { FC } from 'react';

import { cn } from '@/core/lib/utils';

interface ClaimCardProps {
  title: string;
  buttonText: string;
  onButtonClick: () => void;
  disabled?: boolean;
  Icon: React.ReactNode;
  containerClassName?: string;
}

export const ClaimCard: FC<ClaimCardProps> = ({
  title,
  buttonText,
  onButtonClick,
  disabled = false,
  Icon,
  containerClassName
}) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center justify-between gap-2 bg-bg_color rounded-md px-2 py-2',
        containerClassName
      )}
    >
      <div className="flex flex-row items-center gap-1">
        <div className="w-7 h-7 inline-flex items-center justify-center">{Icon}</div>

        <p className="text-white font-semibold text-sm whitespace-nowrap"> {title}</p>
      </div>

      <Button
        intent={disabled ? 'gray' : 'green'}
        appearance={disabled ? 'solid' : 'green'}
        borderRadius="md"
        className="text-xs text-bg_color font-bold disabled:bg-green-500/10 border border-green-500 disabled:text-white"
        disabled={disabled}
        size="sm"
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default ClaimCard;
