"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { useRouter } from "@/core/i18n/navigation";
import {
  canAccessStep,
  clearRegisterDraft,
  isGiftRegister,
  useRegisterDraft,
} from "@/features/auth/hooks/useRegisterDraft";

import { PaymentForm } from "./PaymentForm";
import { RegisterFormShell } from "./RegisterFormShell";

export function Step4() {
  const t = useTranslations("register.step4");
  const router = useRouter();
  const { draft, ready } = useRegisterDraft();

  useEffect(() => {
    if (!ready) return;
    if (isGiftRegister(draft)) {
      router.replace(
        draft.registrationId ? "/kayit-ol/sifre-olustur" : "/kayit-ol",
      );
      return;
    }
    if (!canAccessStep(4, draft)) {
      if (!draft.email) {
        router.replace("/kayit-ol");
      } else if (!draft.password) {
        router.replace("/kayit-ol/sifre-olustur");
      } else {
        router.replace("/kayit-ol/plan-sec");
      }
    }
  }, [ready, draft, router]);

  const handleSuccess = () => {
    clearRegisterDraft();
    router.push("/giris");
  };

  if (!ready || isGiftRegister(draft) || !canAccessStep(4, draft)) {
    return null;
  }

  return (
    <RegisterFormShell title={t("title")} subtitle={t("subtitle")} step={4}>
      <PaymentForm draft={draft} onSuccess={handleSuccess} />
    </RegisterFormShell>
  );
}
