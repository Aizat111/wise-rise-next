"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/core/i18n/navigation";
import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";
import { RegisterFormShell } from "@/features/auth/components/register/RegisterFormShell";
import { StickyContinueButton } from "@/features/auth/components/register/StickyContinueButton";
import { MembershipPlanCard } from "@/features/membership-plans/components/MembershipPlanCard";
import { useDisplayPlansQuery } from "@/features/plans/api/plan.queries";
import { useAppSelector } from "@/store/hooks";

import { RENEWAL_PAYMENT_ROUTE } from "../constants";
import { useRenewalDraft } from "../hooks/useRenewalDraft";
import {
  getPlanDisplayName,
  getPlanFeatureList,
  normalizePlanPeriod,
} from "../utils/plan-features";

export function RenewalPlanStep() {
  const t = useTranslations("subscription");
  const tPlans = useTranslations("register.step3");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { draft, ready, updateDraft } = useRenewalDraft();
  const { data, isLoading, isError, refetch, isFetching } = useDisplayPlansQuery();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [hasUserSelectedPlan, setHasUserSelectedPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const restoredPlanId = draft.planId;
  const activePlanId = hasUserSelectedPlan ? selectedPlanId : restoredPlanId;

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/giris");
    }
  }, [isAuthenticated, ready, router]);

  const monthlyFeatures = useMemo(
    () => [
      tPlans("feature1"),
      tPlans("feature2"),
      tPlans("feature3"),
      tPlans("feature4"),
      tPlans("feature5"),
    ],
    [tPlans],
  );
  const yearlyFeatures = useMemo(
    () => [
      tPlans("feature6"),
      tPlans("feature2"),
      tPlans("feature3"),
      tPlans("feature4"),
      tPlans("feature5"),
    ],
    [tPlans],
  );

  const handleContinue = () => {
    setError(null);
    const monthly = data?.monthly;
    const yearly = data?.yearly;
    const selected =
      activePlanId === monthly?.id
        ? monthly
        : activePlanId === yearly?.id
          ? yearly
          : null;

    if (!selected) {
      setError(tPlans("planRequired"));
      return;
    }

    const period = normalizePlanPeriod(String(selected.period)) ?? "Monthly";

    updateDraft({
      planId: selected.id,
      planPeriod: period,
      planPrice: selected.price,
      planName: getPlanDisplayName(selected),
    });
    router.push(RENEWAL_PAYMENT_ROUTE);
  };

  if (!ready || !isAuthenticated) {
    return null;
  }

  const showBothPlans = Boolean(data?.monthly && data?.yearly);

  return (
    <AuthLayout>
      <RegisterFormShell title={t("renewTitle")} subtitle={t("selectPlan")} step={1} totalSteps={2}>
        <div className="flex w-full flex-col gap-5">
          {isLoading ? (
            <div className="flex min-h-40 items-center justify-center text-sm text-white/70">
              {tCommon("loading")}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-6 text-center">
              <p className="text-sm text-red-400">{tPlans("plansLoadError")}</p>
              <Button
                type="button"
                nativeButton
                variant="outline"
                onClick={() => refetch()}
                disabled={isFetching}
                className="h-10"
              >
                {tPlans("retry")}
              </Button>
            </div>
          ) : (
            <div
              className={
                showBothPlans
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
                  : "grid grid-cols-1 gap-4"
              }
            >
              {data?.monthly ? (
                <MembershipPlanCard
                  plan={data.monthly}
                  period="Monthly"
                  title={tPlans("profile")}
                  selected={activePlanId === data.monthly.id}
                  features={getPlanFeatureList(data.monthly, monthlyFeatures)}
                  onSelect={() => {
                    setHasUserSelectedPlan(true);
                    setSelectedPlanId(data.monthly!.id);
                  }}
                  actionLabel={tPlans("buyNow")}
                />
              ) : null}
              {data?.yearly ? (
                <MembershipPlanCard
                  plan={data.yearly}
                  period="Yearly"
                  title={tPlans("profile")}
                  selected={activePlanId === data.yearly.id}
                  badge={tPlans("sale50")}
                  features={getPlanFeatureList(data.yearly, yearlyFeatures)}
                  onSelect={() => {
                    setHasUserSelectedPlan(true);
                    setSelectedPlanId(data.yearly!.id);
                  }}
                  actionLabel={tPlans("buyNow")}
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
            disabled={!ready || isLoading || isError || !activePlanId}
            onClick={handleContinue}
          />
        </div>
      </RegisterFormShell>
    </AuthLayout>
  );
}
