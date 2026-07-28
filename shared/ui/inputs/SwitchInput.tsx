'use client';

import * as Switch from '@radix-ui/react-switch';
import { type VariantProps, cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import { cn } from '@/core/lib/utils';

// ===================
// Variants
// ===================
const switchInputVariants = cva(
  'relative inline-flex items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full',
  {
    variants: {
      size: {
        sm: 'h-5 w-11',
        md: 'h-6 w-12',
        lg: 'h-7 w-14'
      },
      variant: {
        default: 'bg-gray-600 data-[state=checked]:bg-primary-500',
        primary: 'bg-gray-600 data-[state=checked]:bg-primary-500',
        success: 'bg-gray-600 data-[state=checked]:bg-green-500',
        warning: 'bg-gray-600 data-[state=checked]:bg-yellow-500',
        danger: 'bg-gray-600 data-[state=checked]:bg-red-500'
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer'
      },
      background: {
        default: 'bg-gray-800',
        slate: 'bg-slate-950',
        transparent: 'bg-transparent',
        dark: 'bg-bg_color'
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      disabled: false
    }
  }
);

const switchThumbVariants = cva(
  'block rounded-full bg-white shadow-lg transition-transform duration-200 will-change-transform',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 translate-x-0.5 data-[state=checked]:translate-x-5',
        md: 'h-5 w-5 translate-x-0.5 data-[state=checked]:translate-x-6',
        lg: 'h-6 w-6 translate-x-0.5 data-[state=checked]:translate-x-7'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

// ===================
// Types
// ===================
export interface SwitchInputProps
  extends
    Omit<React.ComponentPropsWithoutRef<typeof Switch.Root>, 'size' | 'disabled'>,
    VariantProps<typeof switchInputVariants> {
  label?: React.ReactNode;
  description?: string;
  descriptionClassName?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  switchClassName?: string;
  thumbClassName?: string;
  registration?: UseFormRegisterReturn;
  isTranslated?: boolean;
  isRequired?: boolean;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  inputWrapperClassName?: string;
}

// ===================
// Subcomponents
// ===================
const Label: React.FC<{
  id: string;
  text?: React.ReactNode;
  isTranslated?: boolean;
  isRequired?: boolean;
  position: NonNullable<SwitchInputProps['labelPosition']>;
  disabled?: boolean;
  className?: string;
}> = ({ id, text, isTranslated, isRequired, position, disabled, className }) => {
  const t = useTranslations();

  if (!text) return null;

  return (
    <label
      id={id}
      htmlFor={id.replace('-label', '')}
      className={cn(
        'text-sm font-medium text-white70 transition-colors',
        disabled && 'opacity-50 cursor-not-allowed',
        position === 'top' && 'mb-2',
        position === 'bottom' && 'mt-2',
        position === 'left' && 'mr-1',
        position === 'right' && 'ml-1',
        className
      )}
    >
      {isTranslated ? t(text as string) : text}
      {isRequired && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
};

const ErrorText: React.FC<{ error?: string }> = ({ error }) =>
  error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null;

const HelperText: React.FC<{ helperText?: string; show?: boolean }> = ({ helperText, show }) =>
  show && helperText ? <p className="mt-1 text-xs text-white70">{helperText}</p> : null;

// ===================
// Main Component
// ===================
const SwitchInput = React.memo(
  React.forwardRef<React.ElementRef<typeof Switch.Root>, SwitchInputProps>(
    (
      {
        id,
        label,
        error,
        helperText,
        size,
        variant,
        disabled = false,
        className,
        containerClassName,
        labelClassName,
        switchClassName,
        thumbClassName,
        registration,
        isTranslated = true,
        isRequired,
        background,
        labelPosition = 'left',
        description,
        descriptionClassName,
        inputWrapperClassName,
        ...props
      },
      ref
    ) => {
      const t = useTranslations();
      const generatedId = React.useId();
      const switchId = id ?? generatedId;
      const labelId = `${switchId}-label`;

      const isDisabled = Boolean(disabled);
      const variantToUse = error ? 'danger' : variant;

      return (
        <div className={cn('w-auto switch-input flex items-center justify-start', containerClassName)}>
          <div
            className={cn(
              'flex items-center ',
              'space-x-3',
              labelPosition === 'left' && 'flex',
              labelPosition === 'right' && 'flex-row-reverse',
              (labelPosition === 'bottom' || labelPosition === 'top') && 'flex-col',
              inputWrapperClassName
            )}
          >
            <div>
              <Label
                id={labelId}
                text={label}
                isTranslated={isTranslated}
                isRequired={isRequired}
                position={labelPosition}
                disabled={isDisabled}
                className={labelClassName}
              />
              {description ? (
                <p
                  className={cn(
                    'text-sm text-white70',
                    descriptionClassName,
                    disabled && 'opacity-50 cursor-not-allowed',
                    labelPosition === 'top' && 'mb-2',
                    labelPosition === 'bottom' && 'mt-2',
                    labelPosition === 'left' && 'mr-1',
                    labelPosition === 'right' && 'ml-1'
                  )}
                >
                  {isTranslated ? t(description as string) : description}
                </p>
              ) : null}
            </div>

            <div className="relative flex items-center">
              <Switch.Root
                id={switchId}
                ref={ref}
                disabled={isDisabled}
                role="switch"
                aria-checked={undefined}
                aria-labelledby={label ? labelId : undefined}
                className={cn(
                  switchInputVariants({ size, variant: variantToUse, disabled: isDisabled, background }),
                  switchClassName,
                  className
                )}
                {...registration}
                {...props}
              >
                <Switch.Thumb className={cn(switchThumbVariants({ size }), thumbClassName)} />
              </Switch.Root>
            </div>
          </div>
          <ErrorText error={error} />
          <HelperText helperText={helperText} show={!error} />
        </div>
      );
    }
  )
);

SwitchInput.displayName = 'SwitchInput';

export default SwitchInput;
