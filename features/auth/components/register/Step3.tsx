"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/core/i18n/navigation";
import type { PlanPeriod } from "@/core/types/plan.types";
import {
  getAuthErrorMessage,
  useRegisterStep3Mutation,
} from "@/features/auth/api/auth.mutations";
import {
  canAccessStep,
  useRegisterDraft,
} from "@/features/auth/hooks/useRegisterDraft";
import { MembershipPlanCard } from "@/features/membership-plans/components/MembershipPlanCard";
import { useDisplayPlansQuery } from "@/features/plans/api/plan.queries";

import { RegisterFormShell } from "./RegisterFormShell";
import { StickyContinueButton } from "./StickyContinueButton";

export function Step3() {
  const t = useTranslations("register.step3");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { draft, ready, updateDraft } = useRegisterDraft();
  const registerStep3 = useRegisterStep3Mutation();
  const { data, isLoading, isError, refetch, isFetching } = useDisplayPlansQuery();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!canAccessStep(3, draft)) {
      router.replace("/kayit-ol");
      return;
    }
    setSelectedPlanId(draft.planId);
  }, [ready, draft, router]);

  const monthlyFeatures = useMemo(
    () => [
      t("feature1"),
      t("feature2"),
      t("feature3"),
      t("feature4"),
      t("feature5"),
    ],
    [t],
  );
  const yearlyFeatures = useMemo(
    () => [
      t("feature6"),
      t("feature2"),
      t("feature3"),
      t("feature4"),
      t("feature5"),
    ],
    [t],
  );

  const handleContinue = async () => {
    setError(null);
    const monthly = data?.monthly;
    const yearly = data?.yearly;
    const selected =
      selectedPlanId === monthly?.id
        ? monthly
        : selectedPlanId === yearly?.id
          ? yearly
          : null;

    if (!selected) {
      setError(t("planRequired"));
      return;
    }

    if (!draft.registrationId) {
      router.replace("/kayit-ol");
      return;
    }

    const period = (String(selected.period).toLowerCase() === "yearly"
      ? "Yearly"
      : "Monthly") as PlanPeriod;

    setIsSubmitting(true);
    try {
      await registerStep3.mutateAsync({
        id: draft.registrationId,
        data: { plan_id: selected.id },
      });
      updateDraft({
        planId: selected.id,
        planPeriod: period,
        planPrice: selected.price,
        planName: selected.product?.name || selected.description || selected.name,
        step: 4,
      });
      router.push("/kayit-ol/odeme");
    } catch (err) {
      setError(getAuthErrorMessage(err, tCommon("errorMessage")));
    } finally {
      setIsSubmitting(false);
    }
  };

  const continueLoading = isSubmitting || registerStep3.isPending;

  return (
    <RegisterFormShell title={t("title")} step={3}>
      <div className="flex w-full flex-col gap-5">
        {isLoading ? (
          <div className="flex min-h-40 items-center justify-center text-sm text-white/70">
            {tCommon("loading")}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-6 text-center">
            <p className="text-sm text-red-400">{t("plansLoadError")}</p>
            <Button
              type="button"
              nativeButton
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-10"
            >
              {t("retry")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data?.monthly ? (
              <MembershipPlanCard
                plan={data.monthly}
                period="Monthly"
                title={t("profile")}
                selected={selectedPlanId === data.monthly.id}
                features={monthlyFeatures}
                onSelect={() => setSelectedPlanId(data.monthly!.id)}
                actionLabel={t("buyNow")}
              />
            ) : null}
            {data?.yearly ? (
              <MembershipPlanCard
                plan={data.yearly}
                period="Yearly"
                title={t("profile")}
                selected={selectedPlanId === data.yearly.id}
                badge={t("sale50")}
                features={yearlyFeatures}
                onSelect={() => setSelectedPlanId(data.yearly!.id)}
                actionLabel={t("buyNow")}
              />
            ) : null}
          </div>
        )}

        {error ? (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        ) : null}

        <div className="h-8" />

        <StickyContinueButton
          type="button"
          label={tCommon("continue")}
          loadingLabel={tCommon("loading")}
          loading={continueLoading}
          disabled={!ready || isLoading || isError || !selectedPlanId || continueLoading}
          onClick={handleContinue}
        />
      </div>
    </RegisterFormShell>
  );
}
