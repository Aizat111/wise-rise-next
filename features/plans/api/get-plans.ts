import { cache } from "react";

import { ENDPOINTS } from "@/core/api/endpoints";
import { serverRequest } from "@/core/api/server";
import type {
  DisplayMembershipPlans,
  MembershipPlan,
  PlanPeriod,
  PlansResponse,
  SubscriptionPlan,
} from "@/core/types/plan.types";

import {
  normalizePlans,
  selectDisplayPlans,
  toMembershipPlan,
} from "./plan.utils";

type PlansApiResponse = SubscriptionPlan[] | PlansResponse;

/**
 * Server-side `/plans?period=` fetch. One period failing does not throw,
 * so the sibling plan can still render.
 */
export const getPlans = cache(
  async (period: PlanPeriod): Promise<SubscriptionPlan[]> => {
    try {
      const response = await serverRequest<PlansApiResponse>({
        url: ENDPOINTS.plan.list,
        method: "GET",
        params: { period },
      });

      return normalizePlans(response);
    } catch {
      return [];
    }
  },
);

export const getMembershipPlan = cache(
  async (period: PlanPeriod): Promise<MembershipPlan | null> => {
    const plans = await getPlans(period);
    const selected = selectDisplayPlans(plans);
    const plan = period === "Monthly" ? selected.monthly : selected.yearly;

    return toMembershipPlan(plan, period);
  },
);

export async function getDisplayMembershipPlans(): Promise<DisplayMembershipPlans> {
  const [monthly, yearly] = await Promise.all([
    getMembershipPlan("Monthly"),
    getMembershipPlan("Yearly"),
  ]);

  return { monthly, yearly };
}
