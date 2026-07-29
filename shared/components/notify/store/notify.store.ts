import {
  DEFAULT_NOTIFY_DURATION,
  MAX_VISIBLE_NOTIFICATIONS,
} from "../constants";
import type {
  NotifyApi,
  NotifyItem,
  NotifyOptions,
  NotifyType,
} from "../types";

const EMPTY_NOTIFICATIONS: NotifyItem[] = [];

let notifications: NotifyItem[] = EMPTY_NOTIFICATIONS;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `notify-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function add(
  type: NotifyType,
  message: string,
  options?: NotifyOptions,
): string {
  const id = options?.id ?? createId();
  const duration = options?.duration ?? DEFAULT_NOTIFY_DURATION;

  const item: NotifyItem = {
    id,
    type,
    message,
    duration,
    createdAt: Date.now(),
  };

  // Newest first; replace existing id if provided
  const withoutSameId = notifications.filter((n) => n.id !== id);
  notifications = [item, ...withoutSameId].slice(0, MAX_VISIBLE_NOTIFICATIONS);
  emit();

  return id;
}

function dismiss(id: string) {
  const next = notifications.filter((n) => n.id !== id);
  if (next.length === notifications.length) return;
  notifications = next.length === 0 ? EMPTY_NOTIFICATIONS : next;
  emit();
}

function dismissAll() {
  if (notifications.length === 0) return;
  notifications = EMPTY_NOTIFICATIONS;
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): NotifyItem[] {
  return notifications;
}

/** SSR / hydration-safe empty snapshot */
export function getServerSnapshot(): NotifyItem[] {
  return EMPTY_NOTIFICATIONS;
}

export const notify: NotifyApi = {
  success: (message, options) => add("success", message, options),
  error: (message, options) => add("error", message, options),
  warning: (message, options) => add("warning", message, options),
  info: (message, options) => add("info", message, options),
  dismiss,
  dismissAll,
};
