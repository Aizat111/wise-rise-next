import { Button, type ButtonProps } from '@investorcentretb/toshi-ui';
import { type VariantProps, cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

// Define switch item type
export interface SwitchItem {
  id: string | number;
  label: React.ReactNode;
  value: string | number | boolean;
  disabled?: boolean;
  className?: string;
}

// Define switch variants
const switchVariants = cva('relative inline-flex items-center gap-1.5 p-1 rounded-lg transition-all duration-200', {
  variants: {
    variant: {
      default: 'bg-gray-800 border border-gray-600 ',
      primary: 'bg-toshi-secondary border border-toshi-primary',
      minimal: 'bg-transparent border-0 p-0',
      outlined: 'bg-transparent border border-gray-600'
    },
    size: {
      sm: 'h-[48px] text-sm p-2',
      md: 'h-[52px] text-base p-1.5',
      lg: 'h-[68px] text-lg p-3'
    },
    fullWidth: {
      true: 'w-full',
      false: 'w-auto'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    fullWidth: false
  }
});

export interface SwitchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>, VariantProps<typeof switchVariants> {
  items: SwitchItem[];
  value?: string | number | boolean;
  onChange?: (_value: string | number | boolean, _item: SwitchItem) => void;
  defaultValue?: string | number | boolean;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  buttonActive?: ButtonProps['appearance'];
  buttonActiveIntent?: ButtonProps['intent'];
  orientation?: 'horizontal' | 'vertical';
  isTranslated?: boolean;
}

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  (
    {
      items,
      value,
      onChange,
      defaultValue,
      disabled = false,
      className,
      buttonClassName,
      buttonActive,
      buttonActiveIntent,
      orientation = 'horizontal',
      variant,
      size,
      fullWidth,
      isTranslated = true,
      ...props
    },
    ref
  ) => {
    const t = useTranslations();
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? items[0]?.value);

    const currentValue = value !== undefined ? value : internalValue;

    const handleChange = React.useCallback(
      (item: SwitchItem) => {
        if (disabled || item.disabled) return;

        if (value === undefined) {
          setInternalValue(item.value);
        }
        onChange?.(item.value, item);
      },
      [disabled, onChange, value]
    );

    if (!items || items.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          switchVariants({ variant, size, fullWidth }),
          orientation === 'vertical' && 'flex-col',
          className
        )}
        {...props}
      >
        {items.map(item => {
          const isActive = item.value === currentValue;

          return (
            <Button
              key={item.id}
              intent="gray"
              appearance="menu"
              isActive={isActive}
              activeAppearance={buttonActive as ButtonProps['appearance']}
              activeIntent={buttonActiveIntent as ButtonProps['intent']}
              size={size as ButtonProps['size']}
              className={cn(
                'flex-1 transition-all min-w-0',
                isActive && 'relative z-10',
                item.disabled && 'opacity-50 cursor-not-allowed',
                item.className,
                buttonClassName
              )}
              onClick={() => handleChange(item)}
              disabled={disabled || item.disabled}
              borderRadius="md"
            >
              {isTranslated ? t(item.label as string) || item.label : item.label}
            </Button>
          );
        })}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
