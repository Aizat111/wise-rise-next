"use client";

import { CirclePlus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { PlanPeriod } from "@/core/types/plan.types";
import { PLAN_LIST_PRICES } from "@/shared/ui/banners/constants";
import { cn } from "@/lib/utils";

import type { MembershipPlanCardProps } from "../types";

function formatPrice(price: number, locale: string) {
  return new Intl.NumberFormat(locale === "az" ? "az-AZ" : "tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

function listPriceForPeriod(period: PlanPeriod) {
  return period === "Monthly" ? PLAN_LIST_PRICES.monthly : PLAN_LIST_PRICES.yearly;
}

export function MembershipPlanCard({
  plan,
  period,
  title,
  selected = false,
  badge,
  features,
  onSelect,
  actionLabel,
  statusLabel,
  statusTone = "success",
}: MembershipPlanCardProps) {
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const listPrice = listPriceForPeriod(period);
  const showListPrice = listPrice !== plan.price;
  const interactive = Boolean(onSelect);

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
      className={cn(
        "relative flex w-full flex-col gap-4 rounded-xl border px-5 py-5 text-left transition-all duration-300",
        interactive ? "cursor-pointer" : "cursor-default",
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

      {statusLabel ? (
        <span
          className={cn(
            "absolute -top-3 left-4 rounded-md px-2.5 py-1 text-xs font-semibold text-white",
            statusTone === "danger" ? "bg-red-600" : "bg-green-600",
          )}
        >
          {statusLabel}
        </span>
      ) : null}

      <div>
        <p className="text-sm font-medium text-primary md:text-xl">
          {period === "Monthly" ? tCommon("monthly") : tCommon("yearly")}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-foreground md:text-base">
          {title}
        </h3>
        <p className="mt-2 text-3xl font-semibold text-foreground">
          {showListPrice ? (
            <span className="text-sm font-bold text-white line-through md:text-xl">
              {formatPrice(listPrice, locale)}{" "}
            </span>
          ) : null}

          <span className="ml-1 text-md font-bold text-white md:text-2xl">
            {formatPrice(plan.price, locale)}
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

      {actionLabel && onSelect ? (
        <Button
          type="button"
          nativeButton
          variant={selected ? "default" : "outline"}
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          className="mt-auto h-10 w-full font-semibold"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
