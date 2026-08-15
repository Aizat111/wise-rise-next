"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { MembershipOrder } from "@/core/types/order.types";

import { PaymentHistorySkeleton } from "./PaymentHistorySkeleton";
import { PaymentHistoryTable } from "./PaymentHistoryTable";

type PaymentHistoryProps = {
  orders: MembershipOrder[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  isRetrying?: boolean;
};

export function PaymentHistory({
  orders,
  isLoading,
  isError,
  onRetry,
  isRetrying = false,
}: PaymentHistoryProps) {
  const t = useTranslations("pracingPlan");

  return (
    <section className="mt-12 w-full" aria-labelledby="payment-history-heading">
      <h2
        id="payment-history-heading"
        className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
      >
        {t("paymentHistory")}
      </h2>
      {t("paymentHistoryDescription") ? (
        <p className="mt-2 text-sm text-white/65">{t("paymentHistoryDescription")}</p>
      ) : null}

      <div className="mt-6">
        {isLoading ? (
          <PaymentHistorySkeleton label={t("loading")} />
        ) : isError ? (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-6 text-center"
          >
            <p className="text-sm text-red-400">{t("ordersLoadError")}</p>
            <Button
              type="button"
              nativeButton
              variant="outline"
              onClick={onRetry}
              disabled={isRetrying}
              className="h-10"
            >
              {t("retry")}
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
            <p className="max-w-md text-sm text-white/65 sm:text-base">
              {t("emptyPayments")}
            </p>
          </div>
        ) : (
          <PaymentHistoryTable orders={orders} />
        )}
      </div>
    </section>
  );
}
