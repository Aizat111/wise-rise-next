"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { DisplayPlans, SubscriptionPlan } from "@/core/types/plan.types";

import { planService, selectDisplayPlans } from "./plan.service";

export function usePlansQuery() {
  return useQuery<SubscriptionPlan[]>({
    queryKey: QUERY_KEYS.plan.all,
    queryFn: () => planService.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDisplayPlansQuery() {
  return useQuery<DisplayPlans>({
    queryKey: [...QUERY_KEYS.plan.all, "display"],
    queryFn: async () => {
      const plans = await planService.list();
      return selectDisplayPlans(plans);
    },
    staleTime: 5 * 60 * 1000,
  });
}
