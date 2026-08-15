import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type { MembershipOrder, OrdersResponse } from "@/core/types/order.types";

type OrdersApiResponse = MembershipOrder[] | OrdersResponse;

function normalizeOrders(response: OrdersApiResponse): MembershipOrder[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  return [];
}

export const orderService = {
  async list(): Promise<MembershipOrder[]> {
    const response = await clientRequest<OrdersApiResponse>({
      url: ENDPOINTS.order.list,
      method: "GET",
    });

    return normalizeOrders(response);
  },
};
