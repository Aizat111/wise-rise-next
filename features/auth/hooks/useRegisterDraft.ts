"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { REGISTER_FLOW_STORAGE_KEY } from "@/core/constants/auth.constants";
import type { PlanPeriod } from "@/core/types/plan.types";

export type RegisterStep = 1 | 2 | 3 | 4;

export type RegisterDraft = {
  /** User / registration id returned from POST /register/1/steps */
  registrationId: string | null;
  email: string;
  commercialConsent: boolean;
  privacyConsent: boolean;
  password: string;
  planId: string | null;
  planPeriod: PlanPeriod | null;
  planPrice: number | null;
  planName: string | null;
  step: RegisterStep;
  /** Verified gift coupon code — present only in the 2-step gift register flow */
  giftCode: string | null;
};

export const REGISTER_ROUTES = {
  1: "/kayit-ol",
  2: "/kayit-ol/sifre-olustur",
  3: "/kayit-ol/plan-sec",
  4: "/kayit-ol/odeme",
} as const;

export const EMPTY_REGISTER_DRAFT: RegisterDraft = {
  registrationId: null,
  email: "",
  commercialConsent: false,
  privacyConsent: false,
  password: "",
  planId: null,
  planPeriod: null,
  planPrice: null,
  planName: null,
  step: 1,
  giftCode: null,
};

type Listener = () => void;

let draftMemory: RegisterDraft = EMPTY_REGISTER_DRAFT;
let hydrated = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function readFromStorage(): RegisterDraft {
  if (typeof window === "undefined") return EMPTY_REGISTER_DRAFT;

  try {
    const raw = sessionStorage.getItem(REGISTER_FLOW_STORAGE_KEY);
    if (!raw) return EMPTY_REGISTER_DRAFT;
    const parsed = JSON.parse(raw) as Partial<RegisterDraft>;
    return {
      ...EMPTY_REGISTER_DRAFT,
      ...parsed,
      giftCode:
        typeof parsed.giftCode === "string" && parsed.giftCode.trim()
          ? parsed.giftCode
          : null,
    };
  } catch {
    return EMPTY_REGISTER_DRAFT;
  }
}

function writeToStorage(draft: RegisterDraft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(REGISTER_FLOW_STORAGE_KEY, JSON.stringify(draft));
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  draftMemory = readFromStorage();
  hydrated = true;
}

function getSnapshot(): RegisterDraft {
  ensureHydrated();
  return draftMemory;
}

function getServerSnapshot(): RegisterDraft {
  return EMPTY_REGISTER_DRAFT;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setDraft(updater: Partial<RegisterDraft> | ((prev: RegisterDraft) => RegisterDraft)) {
  ensureHydrated();
  const next =
    typeof updater === "function"
      ? updater(draftMemory)
      : { ...draftMemory, ...updater };
  draftMemory = next;
  writeToStorage(next);
  emit();
}

export function clearRegisterDraft() {
  draftMemory = EMPTY_REGISTER_DRAFT;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(REGISTER_FLOW_STORAGE_KEY);
  }
  emit();
}

export function useRegisterDraft() {
  const draft = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureHydrated();
    emit();
    setReady(true);
  }, []);

  const updateDraft = useCallback(
    (updater: Partial<RegisterDraft> | ((prev: RegisterDraft) => RegisterDraft)) => {
      setDraft(updater);
    },
    [],
  );

  const resetDraft = useCallback(() => {
    clearRegisterDraft();
  }, []);

  const startGiftRegister = useCallback((giftCode: string) => {
    setDraft({
      ...EMPTY_REGISTER_DRAFT,
      giftCode,
      step: 1,
    });
  }, []);

  return {
    draft,
    ready,
    updateDraft,
    resetDraft,
    startGiftRegister,
  };
}

export function isGiftRegister(draft: RegisterDraft): boolean {
  return Boolean(draft.giftCode?.trim());
}

export function canAccessStep(step: RegisterStep, draft: RegisterDraft): boolean {
  if (step <= 1) return true;
  if (!draft.email || !draft.privacyConsent || !draft.registrationId) return false;
  if (step === 2) return true;
  if (isGiftRegister(draft)) return false;
  if (!draft.password) return false;
  if (step === 3) return true;
  if (!draft.planId) return false;
  return true;
}
