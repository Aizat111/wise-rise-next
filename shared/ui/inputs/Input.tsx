'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import Image from '../Images/Image';
import MaxBtn from '../buttons/MaxBtn';

import { cn } from '@/core/lib/utils';

const inputVariants = cva(
  'block w-full rounded-lg  text-white placeholder:text-white50 transition focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
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
        error: 'border-red-500 focus:ring-red-500 focus:border-red-500'
      },
      background: {
        default: 'bg-gray-800',
        slate: 'bg-lightgrey',
        transparent: 'bg-transparent',
        dark: 'bg-bg_color',
        outline: 'bg-toshi_body border border-white10'
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
  variant?: 'default' | 'chat';
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
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  maxIcon?: boolean;
  setMaxIconValue?: React.Dispatch<React.SetStateAction<string>>;
  disabledOnlyInput?: boolean;
  background?: 'default' | 'slate' | 'transparent' | 'dark' | 'outline';
  selectAllOnFocus?: boolean;
}

type InputElement = HTMLInputElement | HTMLTextAreaElement;

const Input = React.forwardRef<InputElement, InputProps>(
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
      fontSize,
      className,
      containerClassName,
      labelClassName,
      inputClassName,
      iconClassName,
      registration,
      placeholder,
      isTranslated,
      isRequired,
      maxIcon,
      setMaxIconValue,
      disabledOnlyInput,
      selectAllOnFocus = true,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const t = useTranslations();
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const state: 'default' | 'error' = error ? 'error' : 'default';
    const fontSizeClass = fontSize
      ? (
          {
            xs: 'text-xs',
            sm: 'text-sm',
            base: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
            '2xl': 'text-2xl'
          } as const
        )[fontSize]
      : undefined;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label ? (
          <label htmlFor={inputId} className={cn('mb-1 block text-sm text-white70', labelClassName)}>
            {isTranslated ? t(label as string) : label} {isRequired && <span className="">*</span>}
          </label>
        ) : null}

        <div className="relative w-full">
          {leftIcon ? (
            <div className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-white70', iconClassName)}>
              {typeof leftIcon === 'string' ? (
                <Image src={leftIcon} alt={label as string} width={20} height={20} />
              ) : (
                leftIcon
              )}
            </div>
          ) : null}

          {variant === 'chat' ? (
            <ChatTextarea
              id={inputId}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={cn(
                inputVariants({
                  size,
                  state,
                  background,
                  hasLeftIcon: Boolean(leftIcon),
                  hasRightIcon: Boolean(rightIcon)
                }),
                'h-auto min-h-10 resize-none overflow-hidden whitespace-pre-wrap break-words',
                fontSizeClass,
                inputClassName,
                className,
                disabledOnlyInput && 'disabled:opacity-100 text-white70'
              )}
              disabled={disabledOnlyInput ? disabledOnlyInput : props.disabled}
              placeholder={isTranslated && placeholder ? t(placeholder as string) : placeholder}
              required={isRequired}
              {...(registration as any)}
              {...(props as any)}
            />
          ) : (
            (() => {
              const {
                onFocus: _onFocus,
                onMouseUp: _onMouseUp,
                ...restProps
              } = (props as React.InputHTMLAttributes<HTMLInputElement>) || {};
              return (
                <input
                  id={inputId}
                  ref={ref as React.Ref<HTMLInputElement>}
                  className={cn(
                    inputVariants({
                      size,
                      state,
                      background,
                      hasLeftIcon: Boolean(leftIcon),
                      hasRightIcon: Boolean(rightIcon)
                    }),
                    fontSizeClass,
                    inputClassName,
                    className,
                    disabledOnlyInput && 'disabled:opacity-100 text-white70'
                  )}
                  disabled={disabledOnlyInput ? disabledOnlyInput : props.disabled}
                  placeholder={isTranslated && placeholder ? t(placeholder as string) : placeholder}
                  required={isRequired}
                  onFocus={e => {
                    if (selectAllOnFocus) {
                      // Select entire value on focus
                      e.currentTarget.select();
                    }
                    _onFocus?.(e);
                  }}
                  onMouseUp={e => {
                    if (selectAllOnFocus) {
                      // Prevent default mouseup from clearing the programmatic selection
                      e.preventDefault();
                    }
                    _onMouseUp?.(e);
                  }}
                  {...registration}
                  {...restProps}
                />
              );
            })()
          )}

          {rightIcon ? (
            typeof rightIcon === 'string' ? (
              <Image
                src={rightIcon}
                alt={(label as string) || 'icon'}
                width={20}
                height={20}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2 text-white70 pointer-events-none',
                  iconClassName
                )}
              />
            ) : React.isValidElement(rightIcon) ? (
              React.cloneElement(
                rightIcon as React.ReactElement<any>,
                {
                  className: cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 text-white70',
                    (rightIcon as any).props?.className,
                    iconClassName
                  )
                } as any
              )
            ) : (
              <span
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2 text-white70 pointer-events-none',
                  iconClassName
                )}
                aria-hidden="true"
              >
                {rightIcon}
              </span>
            )
          ) : null}

          {maxIcon ? (
            <MaxBtn
              onClick={() => {
                setMaxIconValue?.(props.value as string);
              }}
            />
          ) : null}
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

Input.displayName = 'Input';

export default Input;

// Auto-growing textarea used for chat variant
const ChatTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ onChange, style, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRefs = (node: HTMLTextAreaElement | null) => {
      internalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
    };

    const autoResize = () => {
      const el = internalRef.current;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    };

    React.useLayoutEffect(() => {
      autoResize();
    }, []);

    React.useEffect(() => {
      autoResize();
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      autoResize();
      onChange?.(e as unknown as React.ChangeEvent<HTMLTextAreaElement>);
    };

    return <textarea {...props} ref={setRefs} rows={1} onChange={handleChange} style={{ ...style, height: 'auto' }} />;
  }
);
ChatTextarea.displayName = 'ChatTextarea';
