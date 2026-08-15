export interface MembershipOrder {
  id: string | number;
  start_period?: string | null;
  end_period?: string | null;
  status?: string | null;
  price?: number | string | null;
  currency?: string | null;
  plan_id?: string | null;
  period?: string | null;
  plan?: {
    id?: string;
    period?: string;
    price?: number;
    name?: string;
  } | null;
}

export interface OrdersResponse {
  data: MembershipOrder[];
  success?: boolean;
  message?: string;
}

export interface SubscriptionStatus {
  end_date?: string | null;
  start_date?: string | null;
  status?: string | null;
  period?: string | null;
  plan_id?: string | null;
}
