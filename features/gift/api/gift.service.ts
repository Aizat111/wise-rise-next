import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  BuyGiftRequest,
  BuyGiftResponse,
  CheckGiftCodeRequest,
  CheckGiftCodeResponse,
} from "@/core/types/gift.types";

export const giftService = {
  buy(data: BuyGiftRequest) {
    return clientRequest<BuyGiftResponse>({
      url: ENDPOINTS.gift.buy,
      method: "POST",
      data,
    });
  },

  checkCode(data: CheckGiftCodeRequest, signal?: AbortSignal) {
    return clientRequest<CheckGiftCodeResponse>({
      url: ENDPOINTS.gift.checkCode,
      method: "POST",
      data,
      signal,
    });
  },
};
