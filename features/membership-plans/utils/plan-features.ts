import type { PlanPeriod, SubscriptionPlan } from "@/core/types/plan.types";

export function normalizePlanPeriod(
  value: string | null | undefined,
): PlanPeriod | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "monthly") return "Monthly";
  if (normalized === "yearly") return "Yearly";
  return null;
}

export function getPlanDisplayName(plan: SubscriptionPlan): string {
  return plan.product?.name || plan.description || plan.name;
}

export function getPlanFeatureList(
  plan: SubscriptionPlan,
  fallback: string[],
): string[] {
  if (Array.isArray(plan.features) && plan.features.length > 0) {
    return plan.features.filter(
      (feature): feature is string =>
        typeof feature === "string" && feature.trim().length > 0,
    );
  }

  return fallback;
}
