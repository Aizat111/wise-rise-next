"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { SubscriptionStatus } from "@/core/types/order.types";
import { hasAccessToken } from "@/core/lib/token";

import { membershipService } from "./membership.service";

export function useSubscriptionStatusQuery(enabled = true) {
  return useQuery<SubscriptionStatus>({
    queryKey: QUERY_KEYS.account.subscriptionStatus,
    queryFn: () => membershipService.getSubscriptionStatus(),
    enabled: enabled && typeof window !== "undefined" && hasAccessToken(),
    staleTime: 60 * 1000,
  });
}
