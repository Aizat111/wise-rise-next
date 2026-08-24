"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { DisplayMembershipPlans, MembershipPlan, PlanPeriod } from "@/core/types/plan.types";
import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import { GIFT_PLAN_IMAGE } from "../constants";
import { formatGiftPrice } from "../utils/format-gift-price";

type GiftPlanCardProps = {
  plans: DisplayMembershipPlans;
  selectedPeriod: PlanPeriod;
  onPeriodChange: (period: PlanPeriod) => void;
};

export function GiftPlanCard({
  plans,
  selectedPeriod,
  onPeriodChange,
}: GiftPlanCardProps) {
  const t = useTranslations("giveGift");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const selectedPlan: MembershipPlan | null =
    selectedPeriod === "Yearly" ? plans.yearly : plans.monthly;

  const title =
    selectedPeriod === "Yearly" ? t("yearlyGiftTitle") : t("monthlyGiftTitle");

  return (
    <article
      className="grid w-full min-w-0 overflow-hidden rounded-2xl border border-white bg-black shadow-[0_16px_40px_rgba(0,0,0,0.45)] md:grid-cols-2"
      aria-label={title}
    >
      <div className="relative min-h-52 w-full min-w-0 md:min-h-60">
        <Image
          src={GIFT_PLAN_IMAGE}
          alt={t("planImageAlt")}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />

        {/* Sağ tarafta siyah gölge */}
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black/90 via-black/70 to-transparent" />
      </div>

      <div className="relative flex min-w-0 flex-col justify-center bg-black px-5 py-6 shadow-[inset_12px_0_28px_rgba(0,0,0,0.55)] sm:px-8 sm:py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-l from-black via-black/95 to-black/80"
        />
        <div className="relative z-10 flex min-w-0 flex-col gap-5">
          <motion.h1
            key={title}
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {title}
          </motion.h1>

          <div
            className="flex min-w-0 flex-wrap gap-2"
            role="group"
            aria-label={t("planSelection")}
          >
            {plans.monthly ? (
              <PeriodButton
                selected={selectedPeriod === "Monthly"}
                onClick={() => onPeriodChange("Monthly")}
              >
                {t("monthlyPayment")}
              </PeriodButton>
            ) : null}
            {plans.yearly ? (
              <PeriodButton
                selected={selectedPeriod === "Yearly"}
                onClick={() => onPeriodChange("Yearly")}
              >
                {t("yearlyPayment")}
              </PeriodButton>
            ) : null}
          </div>

          {selectedPlan ? (
            <motion.p
              key={`${selectedPlan.id}-${selectedPlan.price}`}
              className="flex min-w-0 flex-wrap items-baseline gap-2 text-white"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-sm font-medium text-white/80 sm:text-base">
                {t("totalPrice")}:
              </span>
              <span className="text-sm font-medium text-white/45 line-through sm:text-base">
                {formatGiftPrice(selectedPlan.oldPrice, locale)}
              </span>
              <span className="text-xl font-semibold sm:text-2xl">
                {formatGiftPrice(selectedPlan.price, locale)}
              </span>
            </motion.p>
          ) : (
            <p className="text-sm text-red-400" role="alert">
              {t("planUnavailable")}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function PeriodButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <Button
      type="button"
      nativeButton
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "h-10 min-w-0 px-4 text-sm font-medium sm:h-11 sm:text-base",
        selected
          ? "bg-white text-primary hover:bg-white/90"
          : "border border-white/15 bg-black text-white hover:bg-white/10",
      )}
    >
      {children}
    </Button>
  );
}
