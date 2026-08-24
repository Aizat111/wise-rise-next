"use client";

import { useMutation } from "@tanstack/react-query";

import type { BuyGiftRequest, BuyGiftResponse } from "@/core/types/gift.types";

import { giftService } from "./gift.service";

export function useBuyGiftMutation() {
  return useMutation<BuyGiftResponse, Error, BuyGiftRequest>({
    mutationFn: (data) => giftService.buy(data),
  });
}
