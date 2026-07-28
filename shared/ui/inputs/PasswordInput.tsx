import { type VariantProps, cva } from 'class-variance-authority';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import { cn } from '@/core/lib/utils';

const inputVariants = cva(
  'block w-full rounded-md  text-white placeholder:text-white70 transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-9 px-2 text-sm',
        md: 'h-10 px-2 text-base',
        lg: 'h-11 px-2.5 text-base'
      },
      hasLeftIcon: {
        true: 'pl-12',
        false: ''
      },
      hasRightIcon: {
        true: 'pr-10',
        false: ''
      },
      state: {
        default: 'border-gray-500/60 focus:ring-green-400 focus:bg-white10 focus:border-primary-300',
        error: 'border-red-500 focus:ring-red-500 focus:border-red-500 focus:bg-[#F24822]/10'
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
      state: 'default',
      hasLeftIcon: false,
      hasRightIcon: false,
      background: 'default'
    }
  }
);

export interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'>, VariantProps<typeof inputVariants> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
  registration?: UseFormRegisterReturn;
  isTranslated?: boolean;
  isRequired?: boolean;
  background?: 'default' | 'slate' | 'transparent' | 'dark';
}

const PasswordInput = React.forwardRef<React.ElementRef<'input'>, InputProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size,
      background,
      className,
      containerClassName,
      labelClassName,
      inputClassName,
      iconClassName,
      registration,
      isTranslated,
      placeholder,
      isRequired,
      ...props
    },
    ref
  ) => {
    const t = useTranslations();
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePassword = () => setShowPassword(!showPassword);
    const state: 'default' | 'error' = error ? 'error' : 'default';

    return (
      <div className={cn('w-full', containerClassName)}>
        {label ? (
          <label htmlFor={inputId} className={cn('mb-1 block text-sm text-white70', labelClassName)}>
            {isTranslated ? t(label as string) : label} {isRequired && <span className="">*</span>}
          </label>
        ) : null}

        <div className="relative w-full">
          {leftIcon ? (
            <div className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-white70', iconClassName)}>{leftIcon}</div>
          ) : null}

          <input
            id={inputId}
            ref={ref}
            className={cn(
              inputVariants({
                size,
                state,
                background,
                hasLeftIcon: Boolean(leftIcon),
                hasRightIcon: Boolean(rightIcon)
              }),
              'pr-12',
              inputClassName,
              className
            )}
            {...registration}
            placeholder={isTranslated && placeholder ? t(placeholder as string) : placeholder}
            type={showPassword ? 'text' : 'password'}
            required={isRequired}
            {...props}
          />

          <div
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && togglePassword()}
            className={cn('absolute right-3 top-1/2 -translate-y-1/2 text-white70 z-10', iconClassName)}
            onClick={togglePassword}
          >
            {showPassword ? <EyeOff className="size-25" /> : <Eye className="size-25" />}
          </div>
        </div>

        {error ? (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-white70">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
