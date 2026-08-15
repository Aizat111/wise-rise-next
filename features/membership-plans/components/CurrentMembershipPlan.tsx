"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { MembershipOrder, SubscriptionStatus } from "@/core/types/order.types";
import type { DisplayPlans } from "@/core/types/plan.types";
import type { IUser } from "@/core/types/user.types";

import { getPlanFeatureList, normalizePlanPeriod } from "../utils/plan-features";
import { resolveCurrentPlan } from "../utils/resolve-current-plan";
import { CancelMembershipDialog } from "./CancelMembershipDialog";
import { MembershipPlanCard } from "./MembershipPlanCard";
import { PlanSkeleton } from "./PlanSkeleton";

type CurrentMembershipPlanProps = {
  display: DisplayPlans | undefined;
  orders: MembershipOrder[];
  me: IUser | null | undefined;
  subscription: SubscriptionStatus | null | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  isRetrying?: boolean;
};

export function CurrentMembershipPlan({
  display,
  orders,
  me,
  subscription,
  isLoading,
  isError,
  onRetry,
  isRetrying = false,
}: CurrentMembershipPlanProps) {
  const t = useTranslations("register.step3");
  const tPage = useTranslations("pracingPlan");
  const tCommon = useTranslations("common");
  const [cancelOpen, setCancelOpen] = useState(false);

  const monthlyFeatures = useMemo(
    () => [t("feature1"), t("feature2"), t("feature3"), t("feature4"), t("feature5")],
    [t],
  );
  const yearlyFeatures = useMemo(
    () => [t("feature6"), t("feature2"), t("feature3"), t("feature4"), t("feature5")],
    [t],
  );

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-md">
        <PlanSkeleton count={1} label={tCommon("loading")} />
      </div>
    );
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
          onClick={onRetry}
          disabled={isRetrying}
          className="h-10"
        >
          {tPage("retry")}
        </Button>
      </div>
    );
  }

  const plan = display
    ? resolveCurrentPlan({ display, orders, me, subscription })
    : null;

  if (!plan) {
    return (
      <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
        <p className="max-w-md text-sm text-white/65 sm:text-base">
          {tPage("noCurrentPlan")}
        </p>
      </div>
    );
  }

  const period = normalizePlanPeriod(plan.period) ?? "Yearly";
  const features = getPlanFeatureList(
    plan,
    period === "Monthly" ? monthlyFeatures : yearlyFeatures,
  );

  const statusLabel =
    me?.is_active === false ? tPage("statusCancelled") : tPage("statusActive");

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="w-full max-w-md">
        <p className="mb-4 text-center text-sm font-medium text-white/70">
          {tPage("currentPlan")}
        </p>
        <MembershipPlanCard
          plan={plan}
          period={period}
          title={t("profile")}
          selected
          features={features}
          statusLabel={statusLabel}
          statusTone={me?.is_active === false ? "danger" : "success"}
        />
      </div>

      <Button
        type="button"
        nativeButton
        variant="outline"
        onClick={() => setCancelOpen(true)}
        className="h-11 w-full max-w-md border-white/20 bg-transparent font-semibold text-white hover:bg-white/10 cursor-pointer"
      >
        {tCommon("cancel")}
      </Button>

      <CancelMembershipDialog open={cancelOpen} onOpenChange={setCancelOpen} />
    </div>
  );
}
