'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

import Image from '../Images/Image';
import CloseBtn from '../buttons/CloseBtn';

// Defer framer-motion via lightweight client wrappers
const AnimatePresence = dynamic(() => import('../motion/AnimatePresenceClient'), { ssr: false });
const MotionDiv = dynamic(() => import('../motion/MotionDiv'), { ssr: false });

type TranslationKey = string;
type TranslationWithParams = {
  key: string;
  params?: Record<string, unknown>;
};

interface NotificationProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: TranslationKey | TranslationWithParams;
  message: TranslationKey | TranslationWithParams | Record<'message' | 'params', unknown>; // 'message' property for backward compatibility
  onClose: () => void;
  isTranslated?: boolean;
  image?: string;
  visible?: boolean;
}

const typeStyles: Record<
  NonNullable<NotificationProps['type']>,
  { border: string; bg: string; glow: string; imgFilter: string }
> = {
  success: {
    border: 'border-2 border-green-500',
    bg: 'bg-green-900/80',
    glow: 'shadow-[0_0_15px_rgba(34,197,94,0.6)]',
    imgFilter: 'drop-shadow(0px 4px 44px #59FD9F)'
  },
  error: {
    border: 'border-2 border-red-500',
    bg: 'bg-red-900/80',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.6)]',
    imgFilter: 'drop-shadow(0px 4px 44px #ef4444)'
  },
  warning: {
    border: 'border-2 border-yellow-500',
    bg: 'bg-yellow-900/80',
    glow: 'shadow-[0_0_15px_rgba(234,179,8,0.6)]',
    imgFilter: 'drop-shadow(0px 4px 44px #eab308)'
  },
  info: {
    border: 'border-2 border-blue-500',
    bg: 'bg-blue-900/80',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.6)]',
    imgFilter: 'drop-shadow(0px 4px 44px #3b82f6)'
  }
};

// Helper function to get translation key and params from title/message
const getTranslationData = (
  value: TranslationKey | TranslationWithParams | Record<'message' | 'params', unknown>
): { key: string; params?: Record<string, unknown> } => {
  // Handle string (translation key)
  if (typeof value === 'string') {
    return { key: value };
  }

  // Handle new format: { key: string, params?: Record<string, unknown> }
  if ('key' in value && typeof value.key === 'string') {
    return { key: value.key, params: value.params as Record<string, unknown> | undefined };
  }

  // Handle old format for backward compatibility: { message: string, params?: Record<string, unknown> }
  if ('message' in value && typeof value.message === 'string') {
    return { key: value.message, params: value.params as Record<string, unknown> | undefined };
  }

  // Fallback
  return { key: String(value) };
};

export function Notification({
  type = 'info',
  title,
  message,
  onClose,
  isTranslated = true,
  image,
  visible = true
}: NotificationProps) {
  const t = useTranslations();
  const styles = typeStyles[type];

  // Get translation data for title and message
  const titleData = getTranslationData(title);
  const messageData = getTranslationData(message);

  // Render title
  const renderTitle = () => {
    if (isTranslated) {
      return titleData.params
        ? t(titleData.key, titleData.params as Record<string, string | number | Date>)
        : t(titleData.key);
    }
    return typeof title === 'string' ? title : titleData.key;
  };

  // Render message
  const renderMessage = () => {
    if (isTranslated) {
      return messageData.params
        ? t(messageData.key, messageData.params as Record<string, string | number | Date>)
        : t(messageData.key);
    }
    return typeof message === 'string' ? message : messageData.key;
  };

  return (
    <AnimatePresence>
      {visible && (
        <MotionDiv
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={clsx(
            'relative flex items-center gap-4 rounded-2xl border px-1 py-2 text-white min-w-[270px] max-w-[364px] h-[100px]',
            styles.border,
            styles.bg,
            styles.glow
          )}
        >
          <Image
            src={image || 'https://static.toshi.bet/public/samurai.png?w=200&fit=min&auto=format'}
            alt="avatar"
            width={85}
            height={85}
            style={{
              objectFit: 'cover',
              filter: styles.imgFilter
            }}
          />

          <div className="flex flex-col">
            <span className="font-semibold text-base">{renderTitle()}</span>
            <span className="text-xs opacity-80">{renderMessage()}</span>
          </div>

          <div className="absolute top-3 right-2">
            <CloseBtn onClick={onClose} size="md" />
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
