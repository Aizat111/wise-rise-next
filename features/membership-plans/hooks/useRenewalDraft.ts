"use client";

import { useCallback, useSyncExternalStore } from "react";

import { RENEWAL_FLOW_STORAGE_KEY } from "@/core/constants/auth.constants";
import type { PlanPeriod } from "@/core/types/plan.types";

export type RenewalDraft = {
  planId: string | null;
  planPeriod: PlanPeriod | null;
  planPrice: number | null;
  planName: string | null;
};

export const EMPTY_RENEWAL_DRAFT: RenewalDraft = {
  planId: null,
  planPeriod: null,
  planPrice: null,
  planName: null,
};

type Listener = () => void;

let draftMemory: RenewalDraft = EMPTY_RENEWAL_DRAFT;
let hydrated = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function readFromStorage(): RenewalDraft {
  if (typeof window === "undefined") return EMPTY_RENEWAL_DRAFT;

  try {
    const raw = sessionStorage.getItem(RENEWAL_FLOW_STORAGE_KEY);
    if (!raw) return EMPTY_RENEWAL_DRAFT;
    const parsed = JSON.parse(raw) as Partial<RenewalDraft>;
    return {
      ...EMPTY_RENEWAL_DRAFT,
      ...parsed,
      planId: typeof parsed.planId === "string" ? parsed.planId : null,
      planPeriod:
        parsed.planPeriod === "Monthly" || parsed.planPeriod === "Yearly"
          ? parsed.planPeriod
          : null,
      planPrice:
        typeof parsed.planPrice === "number" && Number.isFinite(parsed.planPrice)
          ? parsed.planPrice
          : null,
      planName: typeof parsed.planName === "string" ? parsed.planName : null,
    };
  } catch {
    return EMPTY_RENEWAL_DRAFT;
  }
}

function writeToStorage(draft: RenewalDraft) {
  sessionStorage.setItem(RENEWAL_FLOW_STORAGE_KEY, JSON.stringify(draft));
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  draftMemory = readFromStorage();
  hydrated = true;
}

function subscribe(listener: Listener) {
  hydrate();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): RenewalDraft {
  hydrate();
  return draftMemory;
}

function getServerSnapshot(): RenewalDraft {
  return EMPTY_RENEWAL_DRAFT;
}

export function updateRenewalDraft(patch: Partial<RenewalDraft>) {
  hydrate();
  draftMemory = { ...draftMemory, ...patch };
  writeToStorage(draftMemory);
  emit();
}

export function clearRenewalDraft() {
  draftMemory = EMPTY_RENEWAL_DRAFT;
  hydrated = true;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(RENEWAL_FLOW_STORAGE_KEY);
  }
  emit();
}

function subscribeReady() {
  return () => {};
}

function getClientReady() {
  return true;
}

function getServerReady() {
  return false;
}

export function useRenewalDraft() {
  const draft = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(subscribeReady, getClientReady, getServerReady);

  const updateDraft = useCallback((patch: Partial<RenewalDraft>) => {
    updateRenewalDraft(patch);
  }, []);

  return { draft, ready, updateDraft, clearDraft: clearRenewalDraft };
}
