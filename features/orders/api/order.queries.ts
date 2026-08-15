"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { MembershipOrder } from "@/core/types/order.types";
import { hasAccessToken } from "@/core/lib/token";

import { orderService } from "./order.service";

export function useOrdersQuery(enabled = true) {
  return useQuery<MembershipOrder[]>({
    queryKey: QUERY_KEYS.order.all,
    queryFn: () => orderService.list(),
    enabled: enabled && typeof window !== "undefined" && hasAccessToken(),
    staleTime: 60 * 1000,
  });
}
