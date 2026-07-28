import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/core/lib/utils';

type Intent = 'primary' | 'gray' | 'white';
type Appearance = 'solid' | 'outline' | 'glossy';
type Size = 'sm' | 'md' | 'lg';
type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface UIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: Intent;
  appearance?: Appearance;
  size?: Size;
  borderRadius?: Radius;
  isActive?: boolean;
  icon?: ReactNode;
  iconOnly?: boolean;
  mobileIcon?: ReactNode;
  hideTextInSize?: number; // px breakpoint to hide text
}

const sizeMap: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-11 px-5 text-base'
};

const radiusMap: Record<Radius, string> = {
  none: 'rounded-none',
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full'
};

function intentClasses(intent: Intent, appearance: Appearance, active?: boolean) {
  if (appearance === 'outline') {
    if (intent === 'white') return 'border border-white text-white hover:bg-white/10';
    if (intent === 'primary') return 'border border-primary-500 text-primary-500 hover:bg-primary-500/10';
    return 'border border-white20 text-white hover:bg-white10';
  }
  if (appearance === 'glossy') {
    if (intent === 'primary') return cn('bg-primary-500/90 text-white hover:bg-primary-500');
    if (intent === 'white') return 'bg-white/90 text-black hover:bg-white';
    return 'bg-bg_menu text-white hover:bg-bg_content';
  }
  // solid
  if (intent === 'primary') return cn('bg-primary-500 text-white hover:bg-primary-400', active && 'ring-1 ring-white');
  if (intent === 'white') return cn('bg-white text-black hover:bg-white/90', active && 'ring-1 ring-white');
  return cn('bg-bg_menu text-white hover:bg-bg_content', active && 'ring-1 ring-white');
}

export default function Button(props: UIButtonProps) {
  const {
    intent = 'gray',
    appearance = 'solid',
    size = 'md',
    borderRadius = 'md',
    isActive,
    icon,
    iconOnly,
    mobileIcon,
    hideTextInSize,
    className,
    children,
    ...rest
  } = props;

  const base =
    'inline-flex items-center justify-center gap-2 select-none transition-colors duration-200 focus:outline-none';
  const classes = cn(
    base,
    sizeMap[size],
    radiusMap[borderRadius],
    intentClasses(intent, appearance, isActive),
    className
  );

  return (
    <button className={classes} {...rest}>
      {iconOnly ? (
        (mobileIcon ?? icon)
      ) : (
        <>
          {icon}
          {hideTextInSize ? (
            <span className={cn(`hidden @[${hideTextInSize}px]:inline`)}>{children}</span>
          ) : (
            <span>{children}</span>
          )}
        </>
      )}
    </button>
  );
}
