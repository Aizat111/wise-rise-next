"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import { hasAccessToken } from "@/core/lib/token";
import type { INotificationsResponse } from "@/core/types/user.types";

import { notificationService } from "./notification.service";

export function useNotificationsQuery(enabled = true) {
  return useQuery<INotificationsResponse>({
    queryKey: QUERY_KEYS.notification.all,
    queryFn: () => notificationService.list(),
    enabled: enabled && typeof window !== "undefined" && hasAccessToken(),
    staleTime: 30 * 1000,
    retry: 1,
  });
}
