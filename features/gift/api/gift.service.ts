import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type { BuyGiftRequest, BuyGiftResponse } from "@/core/types/gift.types";

export const giftService = {
  buy(data: BuyGiftRequest) {
    return clientRequest<BuyGiftResponse>({
      url: ENDPOINTS.gift.buy,
      method: "POST",
      data,
    });
  },
};
