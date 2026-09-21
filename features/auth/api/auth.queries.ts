"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { ICheckCouponCodeResponse } from "@/core/types/auth.types";
import type { IUser } from "@/core/types/user.types";
import { hasAccessToken } from "@/core/lib/token";

import { authService } from "./auth.service";

export function useCheckCouponCodeQuery(code: string, planId: string | null) {
  const trimmed = code.trim();
  const enabled = trimmed.length > 0 && Boolean(planId);

  return useQuery<ICheckCouponCodeResponse, Error>({
    queryKey: QUERY_KEYS.coupon.checkCode(planId ?? "", trimmed),
    queryFn: ({ signal }) =>
      authService.checkCouponCode(planId as string, { code: trimmed }, signal),
    enabled,
    retry: false,
    staleTime: 15_000,
  });
}

export function useMeQuery(enabled = true) {
  return useQuery<IUser>({
    queryKey: QUERY_KEYS.auth.me,
    queryFn: () => authService.me(),
    enabled: enabled && typeof window !== "undefined" && hasAccessToken(),
    staleTime: 60 * 1000,
  });
}
