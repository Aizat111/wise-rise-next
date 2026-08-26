"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { CheckGiftCodeResponse } from "@/core/types/gift.types";

import { giftService } from "./gift.service";

export function useCheckGiftCodeQuery(code: string) {
  const trimmed = code.trim();

  return useQuery<CheckGiftCodeResponse, Error>({
    queryKey: QUERY_KEYS.gift.checkCode(trimmed),
    queryFn: ({ signal }) => giftService.checkCode({ code: trimmed }, signal),
    enabled: trimmed.length > 0,
    retry: false,
    staleTime: 15_000,
  });
}
