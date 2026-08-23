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
  /** Present when the plans API returns feature copy with the plan. */
  features?: string[] | null;
  currency?: string | null;
}

export interface PlansResponse {
  data: SubscriptionPlan[];
}

export interface DisplayPlans {
  monthly: SubscriptionPlan | null;
  yearly: SubscriptionPlan | null;
}

/** UI-ready plan model. Current `price` always comes from the API. */
export type MembershipPlan = {
  period: PlanPeriod;
  price: number;
  oldPrice: number;
};

export type DisplayMembershipPlans = {
  monthly: MembershipPlan | null;
  yearly: MembershipPlan | null;
};
