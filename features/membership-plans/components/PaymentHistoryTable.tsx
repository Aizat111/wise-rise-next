"use client";

import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/shared/ui/Badge";
import type { MembershipOrder } from "@/core/types/order.types";
import { cn } from "@/lib/utils";

import {
  formatOrderDate,
  formatOrderPrice,
  getOrderStatusKey,
  getOrderStatusTone,
} from "../utils/format-order";

type PaymentHistoryTableProps = {
  orders: MembershipOrder[];
};

const TONE_CLASS: Record<string, string> = {
  success: "border-transparent bg-green-600/90 text-white",
  warning: "border-transparent bg-amber-500/90 text-black",
  danger: "border-transparent bg-red-600/90 text-white",
  default: "border-white/20 bg-white/10 text-white",
};

export function PaymentHistoryTable({ orders }: PaymentHistoryTableProps) {
  const t = useTranslations("pracingPlan");
  const locale = useLocale();

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03] text-white/70">
            <th scope="col" className="px-4 py-3 font-semibold">
              {t("columnId")}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t("startDate")}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t("endDate")}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t("status")}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t("price")}
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const statusKey = getOrderStatusKey(order.status);
            const tone = getOrderStatusTone(order.status);
            const statusLabel = statusKey
              ? t(statusKey)
              : (order.status ?? "—");

            return (
              <tr
                key={String(order.id)}
                className="border-b border-white/5 last:border-0"
              >
                <td className="px-4 py-3 font-medium break-all text-white">
                  {order.id}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-white/80">
                  {formatOrderDate(order.start_period)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-white/80">
                  {formatOrderDate(order.end_period)}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={cn("capitalize", TONE_CLASS[tone])}
                    variant="outline"
                  >
                    {statusLabel}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-white">
                  {formatOrderPrice(order, locale)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
