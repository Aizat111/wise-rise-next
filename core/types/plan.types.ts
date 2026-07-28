export type PlanPeriod = "Monthly" | "Yearly";

export interface PlanProduct {
  id: string;
  name: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  period: PlanPeriod | string;
  price: number;
  order: number;
  status: boolean;
  product: PlanProduct;
}

export interface PlansResponse {
  data: SubscriptionPlan[];
}

export interface DisplayPlans {
  monthly: SubscriptionPlan | null;
  yearly: SubscriptionPlan | null;
}
