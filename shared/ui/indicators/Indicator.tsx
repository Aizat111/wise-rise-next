import { cn } from '@/core/lib/utils';

const VARIANT_BG_500: Record<string, string> = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  info: 'bg-info-500',
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  green: 'bg-green-500'
};

export function Indicator({
  variant = 'success',
  className,
  position = '-top-1 right-1'
}: {
  variant: string;
  className?: string;
  position?: string;
}) {
  const bg = VARIANT_BG_500[variant] ?? VARIANT_BG_500.success;
  return (
    <div className={`absolute flex justify-center items-center ${position}`}>
      <div className={cn('absolute flex w-4 h-4 rounded-full animate-ping', bg)} />
      <div className={cn('flex w-3 h-3 rounded-full', bg, className)} />
    </div>
  );
}
