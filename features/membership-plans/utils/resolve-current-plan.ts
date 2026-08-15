import type { MembershipOrder, SubscriptionStatus } from "@/core/types/order.types";
import type {
  DisplayPlans,
  PlanPeriod,
  SubscriptionPlan,
} from "@/core/types/plan.types";
import type { IUser } from "@/core/types/user.types";
import { toSafePrice } from "@/shared/ui/banners/format-plan-price";

import { normalizePlanPeriod } from "./plan-features";

function toTime(value: string | null | undefined): number {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

function inferPeriodFromRange(
  start?: string | null,
  end?: string | null,
): PlanPeriod | null {
  if (!start || !end) return null;
  const startTime = toTime(start);
  const endTime = toTime(end);
  if (!startTime || !endTime || endTime <= startTime) return null;
  const days = (endTime - startTime) / (1000 * 60 * 60 * 24);
  if (days <= 45) return "Monthly";
  return "Yearly";
}

export function pickLatestOrder(
  orders: MembershipOrder[],
): MembershipOrder | null {
  if (orders.length === 0) return null;

  const success = orders.filter(
    (order) => String(order.status ?? "").toUpperCase() === "SUCCESS",
  );
  const pool = success.length > 0 ? success : orders;

  return [...pool].sort(
    (a, b) => toTime(b.start_period) - toTime(a.start_period),
  )[0] ?? null;
}

function findPlanById(
  display: DisplayPlans,
  planId: string | null | undefined,
): SubscriptionPlan | null {
  if (!planId) return null;
  if (display.monthly?.id === planId) return display.monthly;
  if (display.yearly?.id === planId) return display.yearly;
  return null;
}

function planForPeriod(
  display: DisplayPlans,
  period: PlanPeriod | null,
): SubscriptionPlan | null {
  if (period === "Monthly") return display.monthly;
  if (period === "Yearly") return display.yearly;
  return null;
}

export function resolveCurrentPlan({
  display,
  orders,
  me,
  subscription,
}: {
  display: DisplayPlans;
  orders: MembershipOrder[];
  me?: IUser | null;
  subscription?: SubscriptionStatus | null;
}): SubscriptionPlan | null {
  const latest = pickLatestOrder(orders);

  const byId = findPlanById(
    display,
    latest?.plan_id ?? latest?.plan?.id ?? me?.plan_id ?? subscription?.plan_id,
  );
  if (byId) return byId;

  const period = normalizePlanPeriod(
    latest?.period ??
      latest?.plan?.period ??
      me?.period ??
      subscription?.period,
  );
  const byPeriod = planForPeriod(display, period);
  if (byPeriod) return byPeriod;

  const price = toSafePrice(latest?.price ?? latest?.plan?.price);
  if (price != null) {
    if (display.monthly && display.monthly.price === price) {
      return display.monthly;
    }
    if (display.yearly && display.yearly.price === price) {
      return display.yearly;
    }
  }

  const inferred = inferPeriodFromRange(
    latest?.start_period ?? subscription?.start_date,
    latest?.end_period ?? subscription?.end_date,
  );
  const byRange = planForPeriod(display, inferred);
  if (byRange) return byRange;

  return display.yearly ?? display.monthly;
}
