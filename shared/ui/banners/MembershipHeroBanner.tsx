"use client";

import { useLocale, useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import type { MembershipPlan } from "@/core/types/plan.types";
import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";
import { useAppSelector } from "@/store/hooks";

import { MEMBERSHIP_HERO_IMAGE } from "./constants";
import { formatPlanPrice, toSafePrice } from "./format-plan-price";
import { GuestRegisterCta } from "./GuestCta";
import { PriceSwitcher, useCyclingPlanPeriod } from "./PriceSwitcher";
import type { CyclingPlanPeriod, MembershipHeroBannerProps } from "./types";

function isVisiblePrice(value: number | null): value is number {
  return value != null && Number.isFinite(value) && value > 0;
}

function MembershipHeroPrice({
  plan,
  periodLabel,
  locale,
}: {
  plan: MembershipPlan | null;
  periodLabel: string;
  locale: string;
}) {
  const currentPrice = toSafePrice(plan?.price);
  const oldPrice = toSafePrice(plan?.oldPrice);

  if (!isVisiblePrice(currentPrice)) {
    return (
      <Skeleton className="h-5 w-40 bg-white/10 sm:h-6 sm:w-48" aria-hidden />
    );
  }

  const showOldPrice =
    isVisiblePrice(oldPrice) && oldPrice !== currentPrice;

  return (
    <p className="flex items-baseline gap-3 whitespace-nowrap tabular-nums text-sm text-white sm:text-base">
      {showOldPrice ? (
        <s className="font-medium text-white/45">
          {formatPlanPrice(oldPrice, locale)}
        </s>
      ) : null}
      <span className="font-semibold text-white">
        {formatPlanPrice(currentPrice, locale)} {periodLabel}
      </span>
    </p>
  );
}

function MembershipHeroOffer({
  monthlyPlan,
  yearlyPlan,
}: {
  monthlyPlan: MembershipPlan | null;
  yearlyPlan: MembershipPlan | null;
}) {
  const t = useTranslations("banners.membershipHero");
  const locale = useLocale();
  const cyclingPeriod = useCyclingPlanPeriod();

  const monthlyPrice = toSafePrice(monthlyPlan?.price);
  const yearlyPrice = toSafePrice(yearlyPlan?.price);
  const hasMonthly = isVisiblePrice(monthlyPrice);
  const hasYearly = isVisiblePrice(yearlyPrice);
  const canCycle = hasMonthly && hasYearly;

  const period: CyclingPlanPeriod = canCycle
    ? cyclingPeriod
    : hasYearly
      ? "Yearly"
      : "Monthly";

  const monthlyPriceView = (
    <MembershipHeroPrice
      plan={monthlyPlan}
      periodLabel={t("perMonth")}
      locale={locale}
    />
  );
  const yearlyPriceView = (
    <MembershipHeroPrice
      plan={yearlyPlan}
      periodLabel={t("perYear")}
      locale={locale}
    />
  );

  return (
    <div className="flex min-w-0 flex-col items-start gap-3 md:flex-row md:items-center md:gap-4 lg:gap-6">
      <GuestRegisterCta label={t("cta")} />
      {canCycle ? (
        <PriceSwitcher
          period={period}
          monthly={monthlyPriceView}
          yearly={yearlyPriceView}
        />
      ) : (
        period === "Yearly"
          ? yearlyPriceView
          : monthlyPriceView
      )}
    </div>
  );
}

export function MembershipHeroBanner({
  monthlyPlan,
  yearlyPlan,
  className,
}: MembershipHeroBannerProps) {
  const t = useTranslations("banners.membershipHero");
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated || (!monthlyPlan && !yearlyPlan)) return null;

  return (
    <section
      aria-label={t("title")}
      className={cn(
        "relative w-full max-w-full overflow-hidden bg-surface md:rounded-xl",
        className,
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[400px]">
        <div className="relative z-10 flex flex-col justify-center bg-surface px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-12">
          <h2 className="text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl lg:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm font-medium leading-relaxed text-white/70 sm:mt-4 sm:text-base">
            {t("subtitle")}
          </p>
          <div className="mt-6 sm:mt-8">
            <MembershipHeroOffer
              monthlyPlan={monthlyPlan}
              yearlyPlan={yearlyPlan}
            />
          </div>
        </div>

        <div className="hidden md:relative aspect-[16/10] w-full min-w-0 md:block md:aspect-auto md:h-full md:min-h-[300px]">
          <Image
            src={MEMBERSHIP_HERO_IMAGE}
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center scale-150"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-surface to-transparent md:hidden"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-3/5 bg-linear-to-r from-surface from-0% via-surface/55 via-40% to-transparent to-100% md:block"
          />
        </div>
      </div>
    </section>
  );
}
