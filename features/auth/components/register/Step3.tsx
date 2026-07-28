"use client";

import { CirclePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/core/i18n/navigation";
import type { PlanPeriod, SubscriptionPlan } from "@/core/types/plan.types";
import {
  getAuthErrorMessage,
  useRegisterStep3Mutation,
} from "@/features/auth/api/auth.mutations";
import {
  canAccessStep,
  useRegisterDraft,
} from "@/features/auth/hooks/useRegisterDraft";
import { useDisplayPlansQuery } from "@/features/plans/api/plan.queries";
import { cn } from "@/lib/utils";

import { RegisterFormShell } from "./RegisterFormShell";
import { StickyContinueButton } from "./StickyContinueButton";

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

type PlanCardProps = {
  plan: SubscriptionPlan;
  period: PlanPeriod;
  selected: boolean;
  badge?: string;
  features: string[];
  onSelect: () => void;
  selectLabel: string;
};

function PlanCard({
  plan,
  period,
  selected,
  badge,
  features,
  onSelect,
  selectLabel,
}: PlanCardProps) {
  const tCommon = useTranslations("common");
  const t = useTranslations("register.step3");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "relative flex w-full cursor-pointer flex-col gap-4 rounded-xl border px-5 py-5 text-left transition-all duration-300",
        selected
          ? "border-primary bg-primary/10 shadow-[0_0_0_1px_var(--primary)]"
          : "border-white/15 bg-white/5 hover:border-white/30",
      )}
    >
      {badge ? (
        <span className="absolute -top-3 right-4 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
          {badge}
        </span>
      ) : null}

      <div>
        <p className="text-sm md:text-xl font-medium text-primary">
          {period === "Monthly" ? tCommon("monthly") : tCommon("yearly")}
        </p>
        <h3 className="mt-1 text-sm md:text-base font-semibold text-foreground">
          {t("profile")}
        </h3>
        <p className="mt-2 text-3xl font-semibold text-foreground">
          <span className="text-sm md:text-xl font-bold text-white line-through">
            {period === "Monthly" ? formatPrice(249) : formatPrice(2249)} {' '}
          </span>

          <span className="ml-1 text-md md:text-2xl font-bold text-white">
            {formatPrice(plan.price)}
          </span>
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-white/80">
            <CirclePlus className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        nativeButton
        variant={selected ? "default" : "outline"}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="mt-auto h-10 w-full font-semibold"
      >
        {t("buyNow")}
      </Button>
    </div>
  );
}

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
              <PlanCard
                plan={data.monthly}
                period="Monthly"
                selected={selectedPlanId === data.monthly.id}
                features={monthlyFeatures}
                onSelect={() => setSelectedPlanId(data.monthly!.id)}
                selectLabel={t("select")}
              />
            ) : null}
            {data?.yearly ? (
              <PlanCard
                plan={data.yearly}
                period="Yearly"
                selected={selectedPlanId === data.yearly.id}
                badge={t("sale50")}
                features={yearlyFeatures}
                onSelect={() => setSelectedPlanId(data.yearly!.id)}
                selectLabel={t("select")}
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
