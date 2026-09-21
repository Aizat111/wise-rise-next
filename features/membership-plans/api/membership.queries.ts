"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import { hasAccessToken } from "@/core/lib/token";
import type { SubscriptionStatus } from "@/core/types/order.types";
import { useAppSelector } from "@/store/hooks";

import { membershipService } from "./membership.service";
import {
  getLocalDateKey,
  persistSubscriptionCheck,
  readPersistedSubscriptionCheck,
} from "../utils/subscription-persistence";

export function getSubscriptionStatusQueryKey(userId: string) {
  return [...QUERY_KEYS.account.subscriptionStatus, userId] as const;
}

export function getAuthUserId(
  user: { id?: string | number | null } | null | undefined,
): string | null {
  if (user?.id == null) return null;
  return String(user.id);
}

export async function fetchAndPersistSubscriptionStatus(
  userId: string,
): Promise<SubscriptionStatus> {
  const data = await membershipService.getSubscriptionStatus();
  persistSubscriptionCheck(userId, data);
  return data;
}

export function useSubscriptionStatusQuery(enabled = true) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userId = getAuthUserId(useAppSelector((state) => state.auth.user));
  const persisted = userId ? readPersistedSubscriptionCheck(userId) : null;
  const checkedToday = persisted?.checkedOn === getLocalDateKey();

  return useQuery<SubscriptionStatus>({
    queryKey: userId
      ? getSubscriptionStatusQueryKey(userId)
      : QUERY_KEYS.account.subscriptionStatus,
    queryFn: () => {
      if (!userId) {
        throw new Error("Missing authenticated user id");
      }
      return fetchAndPersistSubscriptionStatus(userId);
    },
    enabled:
      enabled &&
      typeof window !== "undefined" &&
      hasAccessToken() &&
      isAuthenticated &&
      Boolean(userId) &&
      !checkedToday,
    initialData: typeof window !== "undefined" ? persisted?.status : undefined,
    initialDataUpdatedAt:
      typeof window !== "undefined" ? persisted?.updatedAt : undefined,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

export function useRefreshSubscriptionStatus() {
  const queryClient = useQueryClient();
  const userId = getAuthUserId(useAppSelector((state) => state.auth.user));

  return async (): Promise<SubscriptionStatus | null> => {
    if (!userId) return null;
    return queryClient.fetchQuery({
      queryKey: getSubscriptionStatusQueryKey(userId),
      queryFn: () => fetchAndPersistSubscriptionStatus(userId),
      staleTime: 0,
    });
  };
}
