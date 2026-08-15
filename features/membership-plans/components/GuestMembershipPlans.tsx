"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/core/i18n/navigation";
import { GUEST_REGISTER_HREF } from "@/shared/ui/banners/constants";
import { useDisplayPlansQuery } from "@/features/plans/api/plan.queries";

import { MEMBERSHIP_PLAN_GRID_CLASS } from "../constants";
import { getPlanFeatureList, normalizePlanPeriod } from "../utils/plan-features";
import { MembershipPlanCard } from "./MembershipPlanCard";
import { PlanSkeleton } from "./PlanSkeleton";

export function GuestMembershipPlans() {
  const t = useTranslations("register.step3");
  const tPage = useTranslations("pracingPlan");
  const tLogin = useTranslations("login");
  const tCommon = useTranslations("common");
  const { data, isLoading, isError, refetch, isFetching } = useDisplayPlansQuery();

  const monthlyFeatures = useMemo(
    () => [t("feature1"), t("feature2"), t("feature3"), t("feature4"), t("feature5")],
    [t],
  );
  const yearlyFeatures = useMemo(
    () => [t("feature6"), t("feature2"), t("feature3"), t("feature4"), t("feature5")],
    [t],
  );

  if (isLoading) {
    return <PlanSkeleton count={2} label={tCommon("loading")} />;
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-6 text-center"
      >
        <p className="text-sm text-red-400">{tPage("plansLoadError")}</p>
        <Button
          type="button"
          nativeButton
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-10"
        >
          {tPage("retry")}
        </Button>
      </div>
    );
  }

  const monthly = data?.monthly;
  const yearly = data?.yearly;

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className={`${MEMBERSHIP_PLAN_GRID_CLASS} pt-3`}>
        {monthly ? (
          <MembershipPlanCard
            plan={monthly}
            period={normalizePlanPeriod(monthly.period) ?? "Monthly"}
            title={t("profile")}
            features={getPlanFeatureList(monthly, monthlyFeatures)}
          />
        ) : null}
        {yearly ? (
          <MembershipPlanCard
            plan={yearly}
            period={normalizePlanPeriod(yearly.period) ?? "Yearly"}
            title={t("profile")}
            badge={t("sale50")}
            features={getPlanFeatureList(yearly, yearlyFeatures)}
          />
        ) : null}
      </div>

      <Button
        nativeButton={false}
        render={<Link href={GUEST_REGISTER_HREF} />}
        className="h-11 w-full max-w-sm px-5 text-sm font-bold tracking-wide sm:h-12 sm:text-base"
      >
        {tLogin("registerNow")}
      </Button>
    </div>
  );
}
