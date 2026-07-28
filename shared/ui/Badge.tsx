import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        danger: 'border-transparent bg-red-500 text-white',
        success: 'border-transparent bg-green-500 text-white',
        // Toshi Casino specific variants
        toshi: 'border-transparent bg-toshi-primary text-white',
        toshiWarning: 'border-transparent bg-orange-500 text-white',
        toshiDanger: 'border-transparent bg-red-500 text-white',
        toshiNeon: 'border-transparent bg-toshi-green-neon text-toshi-dark-100 shadow-glow font-bold'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
