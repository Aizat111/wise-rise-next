"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import type { MembershipPlan } from "@/core/types/plan.types";
import { getWeTheLivingHref } from "@/features/category/api/selection.utils";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

import {
  WE_THE_LIVING_MEMBERSHIP_IMAGES,
} from "./constants";
import { WeTheLivingMembershipCard } from "./WeTheLivingMembershipCard";

export type WeTheLivingMembershipBannerProps = {
  monthlyPlan: MembershipPlan | null;
  yearlyPlan: MembershipPlan | null;
  ctaHref?: string;
  className?: string;
};

export function WeTheLivingMembershipBanner({
  monthlyPlan,
  yearlyPlan,
  ctaHref,
  className,
}: WeTheLivingMembershipBannerProps) {
  const t = useTranslations("weTheLiving.membership");
  const reduceMotion = useReducedMotion();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const href = ctaHref ?? getWeTheLivingHref();
  const ctaLabel = t("cta");

  const monthlyFeatures = [
    t("features.noCommitment"),
    t("features.lessons"),
    t("features.newCourses"),
    t("features.watchAnywhere"),
    t("features.certificate"),
  ];
  const yearlyFeatures = [
    t("features.betterPrice"),
    t("features.lessons"),
    t("features.newCourses"),
    t("features.watchAnywhere"),
    t("features.certificate"),
  ];

  if (isAuthenticated || (!monthlyPlan && !yearlyPlan)) return null;

  return (
    <motion.section
      aria-label={t("title")}
      className={cn("w-full max-w-full", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="grid grid-cols-1 items-stretch gap-4 p-0.5 md:grid-cols-2 md:gap-5">
        {monthlyPlan ? (
          <WeTheLivingMembershipCard
            plan={monthlyPlan}
            variant="monthly"
            title={t("monthly.title")}
            image={WE_THE_LIVING_MEMBERSHIP_IMAGES.monthly}
            imageAlt={t("monthly.imageAlt")}
            features={monthlyFeatures}
            ctaLabel={ctaLabel}
            ctaHref={href}
          />
        ) : null}
        {yearlyPlan ? (
          <WeTheLivingMembershipCard
            plan={yearlyPlan}
            variant="yearly"
            title={t("yearly.title")}
            image={WE_THE_LIVING_MEMBERSHIP_IMAGES.yearly}
            imageAlt={t("yearly.imageAlt")}
            features={yearlyFeatures}
            ctaLabel={ctaLabel}
            ctaHref={href}
          />
        ) : null}
      </div>
    </motion.section>
  );
}
