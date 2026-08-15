import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  DisplayPlans,
  PlanPeriod,
  PlansResponse,
  SubscriptionPlan,
} from "@/core/types/plan.types";

type PlansApiResponse = SubscriptionPlan[] | PlansResponse;

function normalizePlans(response: PlansApiResponse): SubscriptionPlan[] {
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

export const planService = {
  async list(period?: PlanPeriod): Promise<SubscriptionPlan[]> {
    const response = await clientRequest<PlansApiResponse>({
      url: ENDPOINTS.plan.list,
      method: "GET",
      params: period ? { period } : undefined,
    });

    return normalizePlans(response);
  },

  async getDisplayPlans(): Promise<DisplayPlans> {
    const [monthlyPlans, yearlyPlans] = await Promise.all([
      planService.list("Monthly"),
      planService.list("Yearly"),
    ]);

    return {
      monthly: selectDisplayPlans(monthlyPlans).monthly,
      yearly: selectDisplayPlans(yearlyPlans).yearly,
    };
  },
};
