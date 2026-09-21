import type { SubscriptionStatus } from "@/core/types/order.types";

import {
  EXPIRING_WARNING_MAX_DAYS,
  EXPIRING_WARNING_MIN_DAYS,
} from "../constants";
import { getRemainingMembershipDays } from "./subscription-days";

export type SubscriptionLifecycle = "unknown" | "active" | "expiring" | "expired";

export type SubscriptionEvaluation = {
  state: SubscriptionLifecycle;
  remainingDays: number | null;
  endDate: string | null;
};

export function evaluateSubscription(
  status: SubscriptionStatus | null | undefined,
): SubscriptionEvaluation {
  const endDate = status?.end_date ?? null;
  const remainingDays = getRemainingMembershipDays(endDate);

  if (remainingDays == null) {
    return { state: "unknown", remainingDays: null, endDate };
  }

  if (remainingDays <= 0) {
    return { state: "expired", remainingDays, endDate };
  }

  if (
    remainingDays >= EXPIRING_WARNING_MIN_DAYS &&
    remainingDays <= EXPIRING_WARNING_MAX_DAYS
  ) {
    return { state: "expiring", remainingDays, endDate };
  }

  return { state: "active", remainingDays, endDate };
}
