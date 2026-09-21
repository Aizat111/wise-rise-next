"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import type { IRegisterStep4Request } from "@/core/types/auth.types";
import { useRouter } from "@/core/i18n/navigation";
import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";
import { PaymentForm } from "@/features/auth/components/register/PaymentForm";
import { RegisterFormShell } from "@/features/auth/components/register/RegisterFormShell";
import { useAppSelector } from "@/store/hooks";

import { useRenewMembershipMutation } from "../api/membership.mutations";
import { getAuthUserId, useRefreshSubscriptionStatus } from "../api/membership.queries";
import { RENEWAL_ROUTE } from "../constants";
import { useRenewalDraft } from "../hooks/useRenewalDraft";
import { evaluateSubscription } from "../utils/evaluate-subscription";
import { markSubscriptionCheckStale } from "../utils/subscription-persistence";

export function RenewalPaymentStep() {
  const t = useTranslations("subscription");
  const tPayment = useTranslations("register.step4");
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userId = getAuthUserId(useAppSelector((state) => state.auth.user));
  const { draft, ready, clearDraft } = useRenewalDraft();
  const renewMembership = useRenewMembershipMutation();
  const refreshSubscriptionStatus = useRefreshSubscriptionStatus();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/giris");
      return;
    }
    if (!draft.planId) {
      router.replace(RENEWAL_ROUTE);
    }
  }, [draft.planId, isAuthenticated, ready, router]);

  const handleSubmitPayment = async (data: IRegisterStep4Request) => {
    if (!draft.planId) {
      throw new Error(tPayment("checkoutError"));
    }

    await renewMembership.mutateAsync({
      ...data,
      plan_id: draft.planId,
    });
  };

  const handleSuccess = async () => {
    try {
      const status = await refreshSubscriptionStatus();
      const evaluation = evaluateSubscription(status);
      if (evaluation.state !== "expired") {
        clearDraft();
        router.replace("/");
      }
    } catch {
      if (userId) markSubscriptionCheckStale(userId);
    }
  };

  if (!ready || !isAuthenticated || !draft.planId) {
    return null;
  }

  return (
    <AuthLayout solid>
      <RegisterFormShell
        title={t("renewTitle")}
        subtitle={t("payment")}
        step={2}
        totalSteps={2}
      >
        <PaymentForm
          draft={{
            planId: draft.planId,
            planPeriod: draft.planPeriod,
            planPrice: draft.planPrice,
          }}
          submitPayment={handleSubmitPayment}
          successMessage={t("renewSuccess")}
          submitLabel={tPayment("finishPayment")}
          onSuccess={handleSuccess}
        />
      </RegisterFormShell>
    </AuthLayout>
  );
}
