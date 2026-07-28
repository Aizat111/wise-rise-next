import { Notification } from '@/shared/ui/notification/Notification';

type NotifyType = 'success' | 'error' | 'warning' | 'info';

// Rate limiting configuration (in milliseconds)
const RATE_LIMITS: Record<NotifyType, number> = {
  error: 2000, // Error toasts: max 1 per 2 seconds
  success: 1000, // Success toasts: max 1 per 1 second
  warning: 1500, // Warning toasts: max 1 per 1.5 seconds
  info: 800 // Info toasts: max 1 per 0.8 seconds
};

// Track last toast timestamps by type
const lastToastTimestamps: Map<NotifyType, number> = new Map();

// Track recent toast messages to prevent duplicates
const recentToastMessages: Map<string, number> = new Map();
const DUPLICATE_WINDOW = 3000; // Prevent same message within 3 seconds

/**
 * Checks if a toast should be rate limited
 */
const shouldRateLimit = (type: NotifyType, message: string | Record<string, unknown>, id?: string): boolean => {
  const now = Date.now();
  const lastTimestamp = lastToastTimestamps.get(type);
  const rateLimit = RATE_LIMITS[type];

  // Check type-based rate limiting
  if (lastTimestamp && now - lastTimestamp < rateLimit) {
    return true;
  }

  // Check duplicate message prevention
  const messageKey = id || `${type}-${typeof message === 'string' ? message : JSON.stringify(message)}`;
  const lastMessageTime = recentToastMessages.get(messageKey);
  if (lastMessageTime && now - lastMessageTime < DUPLICATE_WINDOW) {
    return true;
  }

  return false;
};

/**
 * Updates rate limiting tracking
 */
const updateRateLimitTracking = (type: NotifyType, message: string | Record<string, unknown>, id?: string): void => {
  const now = Date.now();
  lastToastTimestamps.set(type, now);

  const messageKey = id || `${type}-${typeof message === 'string' ? message : JSON.stringify(message)}`;
  recentToastMessages.set(messageKey, now);

  // Clean up old entries periodically (simple cleanup on every 100th call)
  if (recentToastMessages.size > 100) {
    const cutoff = now - DUPLICATE_WINDOW;
    for (const [key, timestamp] of recentToastMessages.entries()) {
      if (timestamp < cutoff) {
        recentToastMessages.delete(key);
      }
    }
  }
};

type TranslationKey = string;
type TranslationWithParams = {
  key: string;
  params?: Record<string, unknown>;
};

export const notify = (
  type: NotifyType,
  title: TranslationKey | TranslationWithParams,
  message: TranslationKey | TranslationWithParams | Record<string, unknown>,
  image?: string,
  id?: string
) => {
  // Apply rate limiting
  if (shouldRateLimit(type, message, id)) {
    return;
  }

  // Update tracking
  updateRateLimitTracking(type, message, id);

  // Defer react-hot-toast import so it's not in the initial chunk
  import('react-hot-toast').then(({ default: toast }) => {
    toast.custom(
      t => (
        <Notification
          type={type}
          title={title}
          message={message}
          image={image}
          visible={t.visible}
          onClose={() => toast.dismiss(t.id)}
        />
      ),
      {
        id,
        duration: 4000
      }
    );
  });
};
