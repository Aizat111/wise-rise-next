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
import { useRegisterFlow } from "@/features/auth/components/register/RegisterFlowContext";
import {
  canAccessStep,
  isGiftRegister,
  useRegisterDraft,
} from "@/features/auth/hooks/useRegisterDraft";
import {
  buildRegisterStep3Data,
  getCampaignPlanId,
  getPeriodForCampaignPlanId,
  isCampaignPlanId,
} from "@/features/auth/lib/free-campaign";
import { MembershipPlanCard } from "@/features/membership-plans/components/MembershipPlanCard";
import { useDisplayPlansQuery } from "@/features/plans/api/plan.queries";

import { RegisterFormShell } from "./RegisterFormShell";
import { StickyContinueButton } from "./StickyContinueButton";

export function Step3() {
  const t = useTranslations("register.step3");
  const tCampaign = useTranslations("register.freeCampaign");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { draft, ready, updateDraft } = useRegisterDraft();
  const { routes, isFreeCampaign, campaignType, companyName } = useRegisterFlow();
  const registerStep3 = useRegisterStep3Mutation();
  const { data, isLoading, isError, refetch, isFetching } = useDisplayPlansQuery();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [hasUserSelectedPlan, setHasUserSelectedPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isGift = !isFreeCampaign && isGiftRegister(draft);
  const showMonthly = campaignType !== "freeyear";

  const restoredPlanId = useMemo(() => {
    if (campaignType === "freeyear") return data?.yearly?.id ?? null;
    if (campaignType === "freemonth") {
      const period =
        getPeriodForCampaignPlanId(draft.planId) ?? draft.planPeriod;
      if (period === "Yearly") return data?.yearly?.id ?? null;
      if (period === "Monthly") return data?.monthly?.id ?? null;
      return null;
    }
    return isCampaignPlanId(draft.planId) ? null : draft.planId;
  }, [
    campaignType,
    data?.monthly?.id,
    data?.yearly?.id,
    draft.planId,
    draft.planPeriod,
  ]);

  const activePlanId = hasUserSelectedPlan ? selectedPlanId : restoredPlanId;

  useEffect(() => {
    if (!ready) return;
    if (isGift) {
      router.replace(draft.registrationId ? routes[2] : routes[1]);
      return;
    }
    if (!canAccessStep(3, draft)) {
      router.replace(routes[1]);
    }
  }, [draft, isGift, ready, router, routes]);

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
      activePlanId === monthly?.id
        ? monthly
        : activePlanId === yearly?.id
          ? yearly
          : null;

    if (!selected) {
      setError(t("planRequired"));
      return;
    }

    if (!draft.registrationId) {
      router.replace(routes[1]);
      return;
    }

    const period = (String(selected.period).toLowerCase() === "yearly"
      ? "Yearly"
      : "Monthly") as PlanPeriod;

    const campaignPlanId =
      isFreeCampaign && campaignType
        ? getCampaignPlanId(campaignType, period)
        : null;
    const planIdToSend = campaignPlanId ?? selected.id;

    if (isFreeCampaign && !campaignPlanId) {
      setError(t("planRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await registerStep3.mutateAsync({
        id: draft.registrationId,
        data: buildRegisterStep3Data(
          planIdToSend,
          isFreeCampaign ? companyName : null,
        ),
      });
      updateDraft({
        planId: planIdToSend,
        planPeriod: period,
        planPrice: selected.price,
        planName: selected.product?.name || selected.description || selected.name,
        step: 4,
      });
      router.push(routes[4]);
    } catch (err) {
      setError(getAuthErrorMessage(err, tCommon("errorMessage")));
    } finally {
      setIsSubmitting(false);
    }
  };

  const continueLoading = isSubmitting || registerStep3.isPending;

  if (!ready || isGift || !canAccessStep(3, draft)) {
    return null;
  }

  const monthlyPromoLabel = isFreeCampaign
    ? tCampaign("oneMonthFree")
    : undefined;
  const yearlyPromoLabel = isFreeCampaign
    ? campaignType === "freeyear"
      ? tCampaign("oneYearFree")
      : tCampaign("oneMonthFree")
    : undefined;
  const showBothPlans = Boolean(showMonthly && data?.monthly && data?.yearly);

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
          <div
            className={
              showBothPlans
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
                : "grid grid-cols-1 gap-4"
            }
          >
            {showMonthly && data?.monthly ? (
              <MembershipPlanCard
                plan={data.monthly}
                period="Monthly"
                title={t("profile")}
                selected={activePlanId === data.monthly.id}
                features={monthlyFeatures}
                onSelect={() => {
                  setHasUserSelectedPlan(true);
                  setSelectedPlanId(data.monthly!.id);
                }}
                actionLabel={t("buyNow")}
                promoLabel={monthlyPromoLabel}
              />
            ) : null}
            {data?.yearly ? (
              <MembershipPlanCard
                plan={data.yearly}
                period="Yearly"
                title={t("profile")}
                selected={activePlanId === data.yearly.id}
                badge={isFreeCampaign ? undefined : t("sale50")}
                features={yearlyFeatures}
                onSelect={() => {
                  setHasUserSelectedPlan(true);
                  setSelectedPlanId(data.yearly!.id);
                }}
                actionLabel={t("buyNow")}
                promoLabel={yearlyPromoLabel}
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
          disabled={!ready || isLoading || isError || !activePlanId || continueLoading}
          onClick={handleContinue}
        />
      </div>
    </RegisterFormShell>
  );
}
