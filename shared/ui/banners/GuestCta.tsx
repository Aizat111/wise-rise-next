"use client";

import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/core/i18n/navigation";
import { useDisplayPlansQuery } from "@/features/plans/api/plan.queries";
import { cn } from "@/lib/utils";

import { GUEST_REGISTER_HREF } from "./constants";
import { toSafePrice } from "./format-plan-price";
import { GuestPlanPrice } from "./GuestPlanPrice";
import { PriceSwitcher, useCyclingPlanPeriod } from "./PriceSwitcher";
import type { CyclingPlanPeriod } from "./types";

export function GuestRegisterCta({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Button
      nativeButton={false}
      render={<Link href={GUEST_REGISTER_HREF} />}
      className={cn(
        "h-11 shrink-0 px-5 text-sm font-bold tracking-wide text-primary-foreground transition-all duration-200 hover:bg-primary/80 sm:h-12 sm:px-7 sm:text-base",
        className,
      )}
    >
      {label}
    </Button>
  );
}

export function GuestPlanPriceSlot({
  period,
  monthlyPrice,
  yearlyPrice,
  isLoading,
  monthlyLabel,
  yearlyLabel,
  locale,
}: {
  period: CyclingPlanPeriod;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  isLoading: boolean;
  monthlyLabel: string;
  yearlyLabel: string;
  locale: string;
}) {
  if (isLoading) {
    return (
      <GuestPlanPrice
        period={period}
        currentPrice={null}
        isLoading
        periodLabel={yearlyLabel}
        locale={locale}
      />
    );
  }

  return (
    <PriceSwitcher
      period={period}
      monthly={
        <GuestPlanPrice
          period="Monthly"
          currentPrice={monthlyPrice}
          periodLabel={monthlyLabel}
          locale={locale}
        />
      }
      yearly={
        <GuestPlanPrice
          period="Yearly"
          currentPrice={yearlyPrice}
          periodLabel={yearlyLabel}
          locale={locale}
        />
      }
    />
  );
}

export function GuestRegisterOffer({ className }: { className?: string }) {
  const t = useTranslations("banners.guestLearning");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const period = useCyclingPlanPeriod();
  const { data, isLoading, isError } = useDisplayPlansQuery();

  const monthlyPrice = isError ? null : toSafePrice(data?.monthly?.price);
  const yearlyPrice = isError ? null : toSafePrice(data?.yearly?.price);

  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <GuestRegisterCta label={t("cta")} />
      <GuestPlanPriceSlot
        period={period}
        monthlyPrice={monthlyPrice}
        yearlyPrice={yearlyPrice}
        isLoading={isLoading}
        monthlyLabel={tCommon("monthly")}
        yearlyLabel={tCommon("yearly")}
        locale={locale}
      />
    </div>
  );
}
