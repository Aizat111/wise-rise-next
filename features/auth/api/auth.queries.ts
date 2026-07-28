"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { IUser } from "@/core/types/user.types";
import { hasAccessToken } from "@/core/lib/token";

import { authService } from "./auth.service";

export function useMeQuery(enabled = true) {
  return useQuery<IUser>({
    queryKey: QUERY_KEYS.auth.me,
    queryFn: () => authService.me(),
    enabled: enabled && typeof window !== "undefined" && hasAccessToken(),
    staleTime: 60 * 1000,
  });
}
