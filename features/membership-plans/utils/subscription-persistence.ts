import { format } from "date-fns";

import {
  SUBSCRIPTION_EXPIRED_PROMPTED_PREFIX,
  SUBSCRIPTION_STATUS_STORAGE_PREFIX,
  SUBSCRIPTION_WARNING_DISMISSED_PREFIX,
} from "@/core/constants/auth.constants";
import { dateFormatBackend } from "@/core/constants/dateFormats";
import type { SubscriptionStatus } from "@/core/types/order.types";
import storage from "@/shared/utils/storage";

export type PersistedSubscriptionCheck = {
  checkedOn: string | null;
  updatedAt: number;
  status: SubscriptionStatus;
};

export function getLocalDateKey(date: Date = new Date()): string {
  return format(date, dateFormatBackend);
}

function statusKey(userId: string) {
  return `${SUBSCRIPTION_STATUS_STORAGE_PREFIX}${userId}`;
}

function warningKey(userId: string, dateKey = getLocalDateKey()) {
  return `${SUBSCRIPTION_WARNING_DISMISSED_PREFIX}${userId}_${dateKey}`;
}

function expiredPromptKey(userId: string, dateKey = getLocalDateKey()) {
  return `${SUBSCRIPTION_EXPIRED_PROMPTED_PREFIX}${userId}_${dateKey}`;
}

function readJson<T>(key: string): T | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readPersistedSubscriptionCheck(
  userId: string,
): PersistedSubscriptionCheck | null {
  const parsed = readJson<PersistedSubscriptionCheck>(statusKey(userId));
  if (!parsed || typeof parsed !== "object") return null;
  if (!parsed.status || typeof parsed.status !== "object") return null;
  return parsed;
}

export function persistSubscriptionCheck(
  userId: string,
  status: SubscriptionStatus,
  options?: { checkedOn?: string | null },
) {
  if (!storage) return;

  const payload: PersistedSubscriptionCheck = {
    checkedOn: options?.checkedOn === undefined ? getLocalDateKey() : options.checkedOn,
    updatedAt: Date.now(),
    status,
  };

  storage.setItem(statusKey(userId), JSON.stringify(payload));
}

/** Keep last known status but force the next query to hit the network. */
export function markSubscriptionCheckStale(userId: string) {
  const current = readPersistedSubscriptionCheck(userId);
  if (!current) return;
  persistSubscriptionCheck(userId, current.status, { checkedOn: null });
}

export function wasCheckedToday(userId: string): boolean {
  return readPersistedSubscriptionCheck(userId)?.checkedOn === getLocalDateKey();
}

export function hasWarningDismissed(userId: string): boolean {
  if (!storage) return false;
  return storage.getItem(warningKey(userId)) === "1";
}

export function markWarningDismissed(userId: string) {
  storage?.setItem(warningKey(userId), "1");
}

export function hasExpiredPrompted(userId: string): boolean {
  if (!storage) return false;
  return storage.getItem(expiredPromptKey(userId)) === "1";
}

export function markExpiredPrompted(userId: string) {
  storage?.setItem(expiredPromptKey(userId), "1");
}
