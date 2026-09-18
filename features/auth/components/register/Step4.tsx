"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { useRouter } from "@/core/i18n/navigation";
import { useRegisterFlow } from "@/features/auth/components/register/RegisterFlowContext";
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
  const { routes, isFreeCampaign } = useRegisterFlow();
  const isGift = !isFreeCampaign && isGiftRegister(draft);

  useEffect(() => {
    if (!ready) return;
    if (isGift) {
      router.replace(
        draft.registrationId ? routes[2] : routes[1],
      );
      return;
    }
    if (!canAccessStep(4, draft)) {
      if (!draft.email) {
        router.replace(routes[1]);
      } else if (!draft.password) {
        router.replace(routes[2]);
      } else {
        router.replace(routes[3]);
      }
    }
  }, [ready, draft, router, routes, isGift]);

  const handleSuccess = () => {
    clearRegisterDraft();
    router.push("/giris");
  };

  if (!ready || isGift || !canAccessStep(4, draft)) {
    return null;
  }

  return (
    <RegisterFormShell title={t("title")} subtitle={t("subtitle")} step={4}>
      <PaymentForm draft={draft} onSuccess={handleSuccess} />
    </RegisterFormShell>
  );
}
