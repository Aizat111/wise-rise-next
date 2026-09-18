import type { ReactNode } from "react";

import type { PlanPeriod, SubscriptionPlan } from "@/core/types/plan.types";

export type MembershipPlansShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export type MembershipPlanCardProps = {
  plan: SubscriptionPlan;
  period: PlanPeriod;
  title: string;
  selected?: boolean;
  badge?: string;
  features: string[];
  onSelect?: () => void;
  actionLabel?: string;
  statusLabel?: string;
  statusTone?: "success" | "danger";
  /** Replaces the live price with strikethrough + promo copy (free campaigns). */
  promoLabel?: string;
};

export type PlanSkeletonProps = {
  count?: number;
  label?: string;
};
