import { getFormattedDate } from './dateTimeUtils';
import { ChatMessageV2 } from '@/shared/components/chats/partials/chat-item/ChatItemV2';

export const normalizeUsername = (value: string) => value.trim().replace(/^@/, '').toLowerCase();

export const isTipCommand = (message: string) => /^\s*\/tip\b/i.test(message);

export const getTipCommandUsername = (message: string) => {
  if (!isTipCommand(message)) return null;
  const match = message.trim().match(/^\/tip\s+(.+)$/i);
  if (!match) return null;
  const normalized = normalizeUsername(match[1]);
  return normalized || null;
};

export const compareMessages = (x: ChatMessageV2, y: ChatMessageV2) => {
  const dx = new Date(x.created_at).getTime();
  const dy = new Date(y.created_at).getTime();
  if (dx !== dy) return dx - dy;
  const ix = Number(x.id);
  const iy = Number(y.id);
  if (!Number.isNaN(ix) && !Number.isNaN(iy)) return ix - iy;
  return x.id.toString().localeCompare(y.id.toString());
};

export const mergeDedupe = (a: ChatMessageV2[], b: ChatMessageV2[]) => {
  const map = new Map<string, ChatMessageV2>();
  for (const m of [...a, ...b]) map.set(m.id.toString(), m);
  return [...map.values()].sort(compareMessages);
};

export const filterSuppressed = (list: ChatMessageV2[]) => list.filter(message => !message?.suppressed);

export const parseDateValue = (value: string | number | Date | null | undefined) => {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number' || /^\d+$/.test(String(value))) {
    const numeric = Number(value);
    if (!numeric) return null;
    const ms = numeric < 1e12 ? numeric * 1000 : numeric;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatSafeDate = (value: string | number | Date | null | undefined, format: string) => {
  const date = parseDateValue(value);
  if (!date) return '-';
  return getFormattedDate(date, format);
};

export const reconcileMessages = (prev: ChatMessageV2[], latest: ChatMessageV2[]) => {
  const map = new Map<string, ChatMessageV2>();
  for (const msg of prev) {
    map.set(msg.id.toString(), msg);
  }
  for (const msg of latest) {
    const key = msg.id.toString();
    if (msg.suppressed) {
      map.delete(key);
      continue;
    }
    map.set(key, { ...map.get(key), ...msg });
  }
  return [...map.values()].sort(compareMessages);
};

export const scrollToBottom = (
  container: HTMLDivElement | null,
  bottom: HTMLDivElement | null,
  behavior: ScrollBehavior
) => {
  if (container) {
    container.scrollTop = container.scrollHeight;
    return;
  }
  bottom?.scrollIntoView({ behavior, block: 'end' });
};
