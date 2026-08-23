import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  DisplayPlans,
  PlanPeriod,
  PlansResponse,
  SubscriptionPlan,
} from "@/core/types/plan.types";

import { normalizePlans, selectDisplayPlans } from "./plan.utils";

type PlansApiResponse = SubscriptionPlan[] | PlansResponse;

export { normalizePlans, selectDisplayPlans } from "./plan.utils";

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
