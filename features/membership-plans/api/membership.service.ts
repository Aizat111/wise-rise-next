import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type { SubscriptionStatus } from "@/core/types/order.types";

export const membershipService = {
  async disableAccount(): Promise<unknown> {
    return clientRequest({
      url: ENDPOINTS.account.disable,
      method: "PUT",
      data: {},
    });
  },

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const response = await clientRequest<
      SubscriptionStatus | { data: SubscriptionStatus }
    >({
      url: ENDPOINTS.account.subscriptionStatus,
      method: "GET",
    });

    if (response && typeof response === "object" && "data" in response) {
      const nested = (response as { data: SubscriptionStatus }).data;
      if (nested && typeof nested === "object") return nested;
    }

    return (response ?? {}) as SubscriptionStatus;
  },
};
