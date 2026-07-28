'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import Image from '../Images/Image';

import { cn } from '@/core/lib/utils';

const inputVariants = cva('block w-full rounded-md border bg-gray-800 text-white flex items-center shadow-inner', {
  variants: {
    size: {
      sm: 'min-h-9 px-3 text-sm py-1',
      md: 'min-h-10 px-3.5 text-base py-1',
      lg: 'min-h-12 px-4 text-base py-1'
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
      default: 'border-gray-500/60 focus:ring-primary-300 focus:border-primary-300',
      error: 'border-red-500 focus:ring-red-500 focus:border-red-500'
    },
    background: {
      default: 'bg-gray-800',
      slate: 'bg-slate-950',
      transparent: 'bg-transparent',
      dark: 'bg-bg_color',
      outline: 'bg-toshi_body border border-white10'
    },
    isLongText: {
      true: '',
      false: ''
    }
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
    hasLeftIcon: false,
    hasRightIcon: false,
    isLongText: true
  }
});

export interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'size'>, VariantProps<typeof inputVariants> {
  label?: React.ReactNode;
  error?: string;
  singleLine?: boolean;
  singleLineWrapped?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  inputWrapperClassName?: string;
  iconClassName?: string;
  registration?: UseFormRegisterReturn;
  isTranslated?: boolean;
  isRequired?: boolean;
  value?: React.ReactNode;
  background?: 'default' | 'slate' | 'transparent' | 'dark' | 'outline';
}

const ShowTextInput = React.forwardRef<React.ElementRef<'div'>, InputProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      singleLine,
      singleLineWrapped,
      leftIcon,
      rightIcon,
      size,
      className,
      containerClassName,
      labelClassName,
      inputClassName,
      inputWrapperClassName,
      iconClassName,
      value,
      isTranslated,
      isRequired,
      background,
      ...props
    },
    ref
  ) => {
    const t = useTranslations();
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const state: 'default' | 'error' = error ? 'error' : 'default';
    const isLong = Boolean(value) && !singleLine;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label ? (
          <label htmlFor={inputId} className={cn('mb-1 block text-sm text-gray-300', labelClassName)}>
            {isTranslated ? t(label as string) : label} {isRequired && <span className="">*</span>}
          </label>
        ) : null}

        <div
          className={cn(
            'relative',
            singleLineWrapped
              ? inputVariants({
                  size,
                  state,
                  hasLeftIcon: Boolean(leftIcon),
                  hasRightIcon: Boolean(rightIcon),
                  isLongText: Boolean(value),
                  background
                })
              : '',
            // Extra spacing so content never sits under the right icon
            singleLine && rightIcon ? 'pr-14' : '',
            inputWrapperClassName
          )}
        >
          {leftIcon ? (
            <div className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-gray-400', iconClassName)}>
              {typeof leftIcon === 'string' ? (
                <Image src={leftIcon} alt={label as string} width={20} height={20} />
              ) : (
                leftIcon
              )}
            </div>
          ) : null}

          <p
            id={inputId}
            ref={ref}
            className={cn(
              singleLine ? 'overflow-x-auto overflow-y-hidden whitespace-nowrap no-scrollbar w-full' : '',
              !singleLine
                ? cn(
                    'overflow-hidden whitespace-pre-wrap break-all',
                    inputVariants({
                      size,
                      state,
                      hasLeftIcon: Boolean(leftIcon),
                      hasRightIcon: Boolean(rightIcon),
                      isLongText: Boolean(value),
                      background
                    })
                  )
                : '',
              // When wrapper is styled, keep content transparent
              singleLineWrapped ? 'bg-transparent border-0 shadow-none' : '',
              inputClassName,
              className
            )}
            {...props}
            style={
              !singleLine && isLong
                ? {
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }
                : undefined
            }
          >
            {value}
          </p>
          {rightIcon ? (
            <div className={cn('absolute right-3 top-1/2 -translate-y-1/2 text-gray-300', iconClassName)}>
              {typeof rightIcon === 'string' ? (
                <Image src={rightIcon} alt={label as string} width={20} height={20} />
              ) : (
                rightIcon
              )}
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-gray-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

ShowTextInput.displayName = 'ShowTextInput';

export default ShowTextInput;
