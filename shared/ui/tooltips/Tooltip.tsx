'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import * as React from 'react';

import { useWindowSize } from '@/shared/hooks/useWindowSize';

interface TooltipProps {
  label: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  marginBottom?: string;
  children: React.ReactNode;
  contentClassName?: string;
  openDelay?: number;
  triggerClassName?: string;
}

export const CustomTooltip: React.FC<TooltipProps> = ({
  label,
  children,
  openDelay,
  placement,
  contentClassName,
  triggerClassName
}) => {
  const { width } = useWindowSize();
  // Disable tooltips entirely on mobile
  if (width < 768) {
    return <>{children}</>;
  }
  return (
    <Tooltip.Provider delayDuration={openDelay ?? 300} skipDelayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild className={triggerClassName}>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={8}
            side={placement}
            className={clsx(
              'z-[1600]',
              'select-none relative text-black rounded-md px-2 py-1 text-xs shadow-lg bg-white',
              contentClassName
            )}
          >
            {label}

            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
