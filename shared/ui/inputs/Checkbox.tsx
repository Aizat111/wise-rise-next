'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import { cn } from '@/core/lib/utils';

const checkboxVariants = cva(
  'relative inline-flex items-center justify-center rounded border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 rounded-sm',
        md: 'h-5 w-5 rounded-md',
        lg: 'h-6 w-6 rounded-md'
      },
      state: {
        default: 'border-gray-500/60 focus:ring-primary-300 focus:border-primary-300',
        error: 'border-red-500 focus:ring-red-500 focus:border-red-500'
      },
      background: {
        default: 'bg-gray-800 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500',
        slate: 'bg-slate-950 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500',
        transparent: 'bg-transparent data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500',
        dark: 'bg-bg_color data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500'
      }
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
      background: 'default'
    }
  }
);

const checkIconVariants = cva('text-white transition-all duration-200', {
  variants: {
    size: {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'type'>, VariantProps<typeof checkboxVariants> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  iconClassName?: string;
  registration?: UseFormRegisterReturn;
  isTranslated?: boolean;
  isRequired?: boolean;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  description?: string;
  descriptionClassName?: string;
  inputWrapperClassName?: string;
}

const Checkbox = React.forwardRef<React.ElementRef<'input'>, CheckboxProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      size,
      state,
      background,
      className,
      containerClassName,
      labelClassName,
      checkboxClassName,
      iconClassName,
      registration,
      isTranslated = true,
      isRequired,
      labelPosition = 'right',
      description,
      descriptionClassName,
      inputWrapperClassName,
      checked,
      disabled,
      ...props
    },
    ref
  ) => {
    const t = useTranslations();
    const generatedId = React.useId();
    const checkboxId = id ?? generatedId;
    const labelId = `${checkboxId}-label`;
    const [isChecked, setIsChecked] = React.useState(checked ?? false);

    const currentChecked = checked !== undefined ? checked : isChecked;

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (checked === undefined) {
          setIsChecked(e.target.checked);
        }
        props.onChange?.(e);
      },
      [checked, disabled, props]
    );

    const checkboxState: 'default' | 'error' = error ? 'error' : (state ?? 'default');

    return (
      <div className={cn('w-full', containerClassName)}>
        <label
          htmlFor={checkboxId}
          className={cn(
            'flex items-center cursor-pointer gap-2 ',
            labelPosition === 'left' && 'flex-row',
            labelPosition === 'right' && 'flex-row-reverse',
            (labelPosition === 'bottom' || labelPosition === 'top') && 'flex-col',
            labelPosition === 'top' && 'flex-col',
            labelPosition === 'bottom' && 'flex-col-reverse',
            disabled && 'cursor-not-allowed opacity-50',
            !disabled && 'cursor-pointer',
            inputWrapperClassName
          )}
        >
          {/* Checkbox Input */}
          <div className="relative flex items-center flex-shrink-0">
            <input
              id={checkboxId}
              ref={ref}
              type="checkbox"
              checked={currentChecked}
              disabled={disabled}
              onChange={handleChange}
              aria-checked={currentChecked}
              aria-labelledby={label ? labelId : undefined}
              aria-invalid={error ? 'true' : 'false'}
              className="sr-only peer"
              {...registration}
              {...props}
            />
            <div
              aria-hidden="true"
              data-state={currentChecked ? 'checked' : 'unchecked'}
              className={cn(
                checkboxVariants({
                  size,
                  state: checkboxState,
                  background
                }),
                currentChecked && 'data-[state=checked]:opacity-100',
                !currentChecked && 'data-[state=unchecked]:opacity-100',
                checkboxClassName,
                className
              )}
            >
              {currentChecked && <Check className={cn(checkIconVariants({ size }), iconClassName)} />}
            </div>
          </div>

          {/* Label Section */}
          {(label || description) && (
            <div
              id={labelId}
              className={cn(
                'flex flex-col',
                labelPosition === 'left' && 'mr-3',
                labelPosition === 'right' && 'ml-3',
                labelPosition === 'top' && 'mb-2',
                labelPosition === 'bottom' && 'mt-2'
              )}
            >
              {label ? (
                <span className={cn('text-sm font-medium text-white70 transition-colors', labelClassName)}>
                  {isTranslated ? t(label as string) : label}
                  {isRequired && <span className="ml-1 text-red-500">*</span>}
                </span>
              ) : null}
              {description ? (
                <p className={cn('text-xs text-white70 mt-0.5', descriptionClassName)}>
                  {isTranslated ? t(description as string) : description}
                </p>
              ) : null}
            </div>
          )}
        </label>

        {error ? (
          <p className={cn('mt-1 text-xs text-red-500', labelPosition === 'top' && 'mt-1')}>{error}</p>
        ) : helperText ? (
          <p className={cn('mt-1 text-xs text-white70', labelPosition === 'top' && 'mt-1')}>{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
