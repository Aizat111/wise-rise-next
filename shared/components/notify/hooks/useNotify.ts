"use client";

import { useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  notify,
  subscribe,
} from "../store/notify.store";
import type { NotifyApi, NotifyItem } from "../types";

/** Subscribe to the notify list (SSR-safe). */
export function useNotifyStore(): NotifyItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Hook form of the notify API for components.
 * Prefer the imperative `notify` export when calling outside React.
 */
export function useNotify(): NotifyApi {
  return notify;
}
