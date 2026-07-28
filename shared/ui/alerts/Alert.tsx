'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import * as React from 'react';

import Image from '../Images/Image';
import CloseBtn from '../buttons/CloseBtn';

import { cn } from '@/core/lib/utils';
import { Link } from '@/shared/ui/LoadingLink';

// Defer framer-motion via lightweight client wrappers
const AnimatePresence = dynamic(() => import('../motion/AnimatePresenceClient'), { ssr: false });
const MotionDiv = dynamic(() => import('../motion/MotionDiv'), { ssr: false });

const parseTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s)\]}]+)/g;
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)\]}]+)\)/g;
  const processedText = text;
  const markdownParts: React.ReactElement[] = [];
  let lastIndex = 0;

  const markdownMatches = Array.from(text.matchAll(markdownLinkRegex));

  if (markdownMatches.length > 0) {
    markdownMatches.forEach((match, idx) => {
      const [fullMatch, linkText, url] = match;
      const matchIndex = match.index as number;

      if (matchIndex > lastIndex)
        markdownParts.push(<span key={`text-${idx}`}>{processedText.substring(lastIndex, matchIndex)}</span>);

      markdownParts.push(
        <Link
          key={`link-${idx}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-yellow-300 transition-colors"
        >
          {linkText}
        </Link>
      );

      lastIndex = matchIndex + fullMatch.length;
    });

    if (lastIndex < processedText.length)
      markdownParts.push(<span key={`text-final`}>{processedText.substring(lastIndex)}</span>);

    return <>{markdownParts}</>;
  }

  if (!text.match(urlRegex)) return <span>{text}</span>;

  const parts = text.split(urlRegex);
  const matches = text.match(urlRegex) || [];

  return (
    <>
      {parts.map((part, index) => {
        if (index === parts.length - 1) return <span key={index}>{part}</span>;
        return (
          <React.Fragment key={index}>
            <span>{part}</span>
            {matches[index] && (
              <Link
                href={matches[index]}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                {matches[index]}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

const alertVariants = cva(
  'relative flex items-start gap-3 rounded-lg border px-4 py-3 text-white transition-all duration-300',
  {
    variants: {
      variant: {
        // Standard variants
        success: 'border-green-500 bg-green-900/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]',
        error: 'border-red-500 bg-red-900/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
        warning: 'border-yellow-500 bg-yellow-900/20 shadow-[0_0_15px_rgba(234,179,8,0.3)]',
        info: 'border-blue-500 bg-blue-900/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]',

        // Toshi Casino specific variants
        toshi: 'border-toshi-primary bg-toshi-primary/10 shadow-[0_0_15px_rgba(255,97,0,0.3)]',
        toshiNeon: 'border-toshi-green-neon bg-toshi-green-neon/10 shadow-[0_0_20px_rgba(103,223,48,0.4)]',
        toshiBlue: 'border-toshi-blue-neon bg-toshi-blue-neon/10 shadow-[0_0_20px_rgba(52,174,255,0.4)]',
        toshiPurple: 'border-toshi-purple-neon bg-toshi-purple-neon/10 shadow-[0_0_20px_rgba(168,85,247,0.4)]',
        toshiPink: 'border-toshi-pink-neon bg-toshi-pink-neon/10 shadow-[0_0_20px_rgba(236,72,153,0.4)]',

        // Special variants
        announcement: 'border-green-300 text-white bg-green-600 shadow-[15_14_15px_rgba(27,32,49,1)]',
        promotion:
          'border-toshi-primary bg-gradient-to-r from-orange-900/30 to-red-900/30 shadow-[0_0_25px_rgba(255,97,0,0.5)]',
        maintenance:
          'border-yellow-500 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 shadow-[0_0_25px_rgba(234,179,8,0.5)]',
        security:
          'border-red-500 bg-gradient-to-r from-red-900/30 to-pink-900/30 shadow-[0_0_25px_rgba(239,68,68,0.5)]',

        // Minimal variants
        subtle: 'border-gray-500/60 bg-gray-800/50 shadow-none',
        ghost: 'border-transparent bg-transparent shadow-none'
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg',
        xl: 'px-6 py-5 text-xl'
      },
      layout: {
        horizontal: 'flex-row items-center',
        vertical: 'flex-col items-start',
        compact: 'flex-row items-center gap-2'
      },
      dismissible: {
        true: 'pr-12',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'info',
      size: 'md',
      layout: 'horizontal',
      dismissible: false
    }
  }
);

const iconVariants = cva('flex-shrink-0', {
  variants: {
    variant: {
      success: 'text-green-400',
      error: 'text-red-400',
      warning: 'text-yellow-400',
      info: 'text-blue-400',
      toshi: 'text-toshi-primary',
      toshiNeon: 'text-toshi-green-neon',
      toshiBlue: 'text-toshi-blue-neon',
      toshiPurple: 'text-toshi-purple-neon',
      toshiPink: 'text-toshi-pink-neon',
      announcement: 'text-toshi-green-neon',
      promotion: 'text-toshi-primary',
      maintenance: 'text-yellow-400',
      security: 'text-red-400',
      subtle: 'text-gray-400',
      ghost: 'text-gray-500'
    },
    size: {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8'
    }
  },
  defaultVariants: {
    variant: 'info',
    size: 'md'
  }
});

const contentVariants = cva('flex-1', {
  variants: {
    layout: {
      horizontal: 'space-y-1',
      vertical: 'space-y-2',
      compact: 'space-y-0'
    }
  },
  defaultVariants: {
    layout: 'horizontal'
  }
});

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof alertVariants> {
  // Content
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;

  // Icons and images
  icon?: React.ReactNode;
  image?: string;
  showIcon?: boolean;

  // Behavior
  dismissible?: boolean;
  onDismiss?: () => void;
  visible?: boolean;

  // Animation
  animation?: 'slide' | 'fade' | 'scale' | 'none';
  duration?: number;

  // Internationalization
  isTranslated?: boolean;

  // Custom styling
  className?: string;
  contentClassName?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  learnMoreText?: string;
  onLearnMoreClick?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      size = 'md',
      layout = 'horizontal',
      dismissible = false,
      title,
      description,
      children,
      icon,
      image,
      showIcon = true,
      onDismiss,
      visible = true,
      animation = 'slide',
      duration = 300,
      isTranslated = false,
      className,
      contentClassName,
      iconClassName,
      titleClassName,
      descriptionClassName,
      learnMoreText,
      onLearnMoreClick,
      ...props
    },
    ref
  ) => {
    const t = useTranslations();

    // Animation variants
    const animationVariants = {
      slide: {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 100, opacity: 0 }
      },
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      },
      scale: {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.95, opacity: 0 }
      },
      none: {
        initial: {},
        animate: {},
        exit: {}
      }
    };

    const currentAnimation = animationVariants[animation];

    const renderIcon = () => {
      if (!showIcon) return null;

      if (image) {
        return (
          <div className={cn(iconVariants({ variant, size }), iconClassName)}>
            <Image
              src={image}
              alt={(title as string) || 'Alert'}
              width={size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 32 : 20}
              height={size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 32 : 20}
              className="rounded-full"
            />
          </div>
        );
      }

      if (icon) {
        return <div className={cn(iconVariants({ variant, size }), iconClassName)}>{icon}</div>;
      }

      return null;
    };

    const renderContent = () => {
      const content = (
        <div className={cn(contentVariants({ layout }), contentClassName)}>
          {title && (
            <div
              className={cn(
                'font-semibold leading-tight',
                size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : size === 'xl' ? 'text-xl' : 'text-base',
                titleClassName
              )}
            >
              {isTranslated && typeof title === 'string' ? t(title) : title}
            </div>
          )}

          {description && (
            <div
              className={cn(
                'opacity-90 leading-relaxed',
                size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : size === 'xl' ? 'text-lg' : 'text-sm',
                descriptionClassName
              )}
            >
              {typeof description === 'string' ? parseTextWithLinks(description) : description}
            </div>
          )}

          {learnMoreText && (
            <span
              onClick={onLearnMoreClick}
              className="underline cursor-pointer text-xs"
              aria-label={learnMoreText}
              aria-hidden="true"
            >
              {learnMoreText}
            </span>
          )}

          {children}
        </div>
      );

      return content;
    };

    const alertContent = (
      <div
        ref={ref}
        className={cn(
          alertVariants({
            variant,
            size,
            layout,
            dismissible
          }),
          className
        )}
        {...props}
      >
        {renderIcon()}
        {renderContent()}

        {dismissible && onDismiss && (
          <div className="absolute top-3 right-0.5">
            <CloseBtn
              onClick={onDismiss}
              size="sm"
              className="text-white border-white hover:text-white transition-colors"
            />
          </div>
        )}
      </div>
    );

    if (animation === 'none') {
      return visible ? alertContent : null;
    }

    return (
      <AnimatePresence>
        {visible && (
          <MotionDiv
            initial={currentAnimation.initial}
            animate={currentAnimation.animate}
            exit={currentAnimation.exit}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              duration: duration / 1000
            }}
          >
            {alertContent}
          </MotionDiv>
        )}
      </AnimatePresence>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
