import type {
  DisplayPlans,
  MembershipPlan,
  PlanPeriod,
  PlansResponse,
  SubscriptionPlan,
} from "@/core/types/plan.types";
import { PLAN_LIST_PRICES } from "@/shared/ui/banners/constants";
import { toSafePrice } from "@/shared/ui/banners/format-plan-price";

type PlansApiResponse = SubscriptionPlan[] | PlansResponse;

export function normalizePlans(response: PlansApiResponse): SubscriptionPlan[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  return [];
}

/** Pick one active Monthly and one active Yearly plan (lowest order first). */
export function selectDisplayPlans(plans: SubscriptionPlan[]): DisplayPlans {
  const active = plans
    .filter((plan) => plan.status)
    .sort((a, b) => a.order - b.order);

  return {
    monthly:
      active.find((plan) => String(plan.period).toLowerCase() === "monthly") ??
      null,
    yearly:
      active.find((plan) => String(plan.period).toLowerCase() === "yearly") ??
      null,
  };
}

export function toMembershipPlan(
  plan: SubscriptionPlan | null | undefined,
  period: PlanPeriod,
): MembershipPlan | null {
  if (!plan) return null;

  const price = toSafePrice(plan.price);
  if (price == null) return null;

  const id = typeof plan.id === "string" ? plan.id.trim() : "";
  if (!id) return null;

  return {
    id,
    period,
    price,
    oldPrice:
      period === "Monthly" ? PLAN_LIST_PRICES.monthly : PLAN_LIST_PRICES.yearly,
  };
}
