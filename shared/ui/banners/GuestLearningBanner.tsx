"use client";

import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/core/i18n/navigation";
import { useDisplayPlansQuery } from "@/features/plans/api/plan.queries";
import { cn } from "@/lib/utils";

import { BANNER_SHELL_CLASS, GUEST_REGISTER_HREF } from "./constants";
import { toSafePrice } from "./format-plan-price";
import { GuestPlanPrice } from "./GuestPlanPrice";
import { PriceSwitcher, useCyclingPlanPeriod } from "./PriceSwitcher";
import type { CyclingPlanPeriod, GuestLearningBannerProps } from "./types";

function RegisterCta({ label }: { label: string }) {
  return (
    <Button
      nativeButton={false}
      render={<Link href={GUEST_REGISTER_HREF} />}
      className="h-11 shrink-0 px-5 text-sm font-bold tracking-wide text-primary-foreground transition-all duration-200 hover:bg-primary/80 sm:h-12 sm:px-7 sm:text-base"
    >
      {label}
    </Button>
  );
}

function PlanPriceSlot({
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

function GuestLearningBannerView({ className }: { className?: string }) {
  const t = useTranslations("banners.guestLearning");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const period = useCyclingPlanPeriod();
  const { data, isLoading, isError } = useDisplayPlansQuery();

  const monthlyPrice = isError ? null : toSafePrice(data?.monthly?.price);
  const yearlyPrice = isError ? null : toSafePrice(data?.yearly?.price);
  const monthlyLabel = tCommon("monthly");
  const yearlyLabel = tCommon("yearly");

  return (
    <section
      className={cn(BANNER_SHELL_CLASS, className)}
      aria-label={t("title")}
    >
      <div className="hidden items-center justify-between gap-8  py-8 md:flex lg:py-10">
        <div className="min-w-0 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            {t("title")} <br />   {t("subtitle")}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-4 lg:gap-6">
          <RegisterCta label={t("cta")} />
          <PlanPriceSlot
            period={period}
            monthlyPrice={monthlyPrice}
            yearlyPrice={yearlyPrice}
            isLoading={isLoading}
            monthlyLabel={monthlyLabel}
            yearlyLabel={yearlyLabel}
            locale={locale}
          />
        </div>
      </div>

      <div className="md:hidden">
        <div className=" py-8 text-center">
          <h2 className="text-xl font-bold tracking-tight text-white/75">
            {t("title")}
          </h2>
          <p className="mt-4 text-base font-medium text-white">{t("subtitle")}</p>
        </div>

        <div className="flex w-full items-center justify-center gap-3 bg-surface px-4 py-4">
          <RegisterCta label={t("cta")} />
          <PlanPriceSlot
            period={period}
            monthlyPrice={monthlyPrice}
            yearlyPrice={yearlyPrice}
            isLoading={isLoading}
            monthlyLabel={monthlyLabel}
            yearlyLabel={yearlyLabel}
            locale={locale}
          />
        </div>

      </div>
    </section>
  );
}

export function GuestLearningBanner({
  isAuthenticated = false,
  className,
}: GuestLearningBannerProps) {
  if (isAuthenticated) return null;

  return <GuestLearningBannerView className={className} />;
}
