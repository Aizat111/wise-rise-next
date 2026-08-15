"use client";

import { useEffect, useState } from "react";

import { useMeQuery } from "@/features/auth/api/auth.queries";
import { useOrdersQuery } from "@/features/orders/api/order.queries";
import { useDisplayPlansQuery } from "@/features/plans/api/plan.queries";
import { useAppSelector } from "@/store/hooks";

import { useSubscriptionStatusQuery } from "../api/membership.queries";
import { CurrentMembershipPlan } from "./CurrentMembershipPlan";
import { GuestMembershipPlans } from "./GuestMembershipPlans";
import { PaymentHistory } from "./PaymentHistory";
import { PlanSkeleton } from "./PlanSkeleton";

export function MembershipPlansView() {
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <PlanSkeleton count={2} />;
  }

  if (!isAuthenticated) {
    return <GuestMembershipPlans />;
  }

  return <AuthenticatedMembership />;
}

function AuthenticatedMembership() {
  const plansQuery = useDisplayPlansQuery();
  const ordersQuery = useOrdersQuery(true);
  const meQuery = useMeQuery(true);
  const statusQuery = useSubscriptionStatusQuery(true);

  const planLoading =
    plansQuery.isLoading || meQuery.isLoading || ordersQuery.isLoading;
  const planError = plansQuery.isError && !plansQuery.data;

  return (
    <div className="flex w-full flex-col">
      <CurrentMembershipPlan
        display={plansQuery.data}
        orders={ordersQuery.data ?? []}
        me={meQuery.data}
        subscription={statusQuery.data}
        isLoading={planLoading}
        isError={planError}
        onRetry={() => {
          void plansQuery.refetch();
          void meQuery.refetch();
          void statusQuery.refetch();
        }}
        isRetrying={plansQuery.isFetching || meQuery.isFetching}
      />

      <PaymentHistory
        orders={ordersQuery.data ?? []}
        isLoading={ordersQuery.isLoading}
        isError={ordersQuery.isError}
        onRetry={() => {
          void ordersQuery.refetch();
        }}
        isRetrying={ordersQuery.isFetching}
      />
    </div>
  );
}
