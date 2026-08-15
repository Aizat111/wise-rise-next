"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { PLAN_LIST_PRICES } from "./constants";
import { formatPlanPrice } from "./format-plan-price";
import type { CyclingPlanPeriod } from "./types";

export type GuestPlanPriceProps = {
  period: CyclingPlanPeriod;
  currentPrice: number | null;
  isLoading?: boolean;
  periodLabel: string;
  locale?: string;
  className?: string;
};

export function GuestPlanPrice({
  period,
  currentPrice,
  isLoading = false,
  periodLabel,
  locale = "tr",
  className,
}: GuestPlanPriceProps) {
  const listPrice =
    period === "Yearly" ? PLAN_LIST_PRICES.yearly : PLAN_LIST_PRICES.monthly;

  if (isLoading) {
    return (
      <Skeleton
        className={cn("h-5 w-40 bg-white/10 sm:h-6 sm:w-48", className)}
        aria-hidden
      />
    );
  }

  const listLabel = formatPlanPrice(listPrice, locale);
  const hasSalePrice = currentPrice != null && currentPrice !== listPrice;

  return (
    <p
      className={cn(
        "flex items-baseline gap-3 whitespace-nowrap tabular-nums text-sm text-white sm:text-base",
        className,
      )}
    >
      {hasSalePrice ? (
        <>
          <span className="font-medium text-white/45 line-through">
            {listLabel}
          </span>
          <span className="font-semibold text-white">
            {formatPlanPrice(currentPrice, locale)} / {periodLabel}
          </span>
        </>
      ) : (
        <span className="font-semibold text-white">
          {formatPlanPrice(currentPrice ?? listPrice, locale)} / {periodLabel}
        </span>
      )}
    </p>
  );
}
