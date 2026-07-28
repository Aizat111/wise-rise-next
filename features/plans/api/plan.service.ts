import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  DisplayPlans,
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
  async list(): Promise<SubscriptionPlan[]> {
    const response = await clientRequest<PlansApiResponse>({
      url: ENDPOINTS.plan.list,
      method: "GET",
    });

    return normalizePlans(response);
  },

  async getDisplayPlans(): Promise<DisplayPlans> {
    const plans = await planService.list();
    return selectDisplayPlans(plans);
  },
};
