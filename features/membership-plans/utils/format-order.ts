import { dateFormat } from "@/core/constants/dateFormats";
import type { MembershipOrder } from "@/core/types/order.types";
import { backendToDateWithFormat } from "@/shared/utils/dateTimeUtils";
import {
  formatPlanPrice,
  toSafePrice,
} from "@/shared/ui/banners/format-plan-price";

export function formatOrderDate(value: string | null | undefined): string {
  if (!value) return "—";
  try {
    const formatted = backendToDateWithFormat(value, dateFormat);
    return formatted || "—";
  } catch {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "—";
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }
}

export function formatOrderPrice(
  order: MembershipOrder,
  locale = "tr",
): string {
  const price = toSafePrice(order.price);
  if (price == null) return "—";

  const currency = order.currency?.trim();
  if (currency && currency.toUpperCase() !== "TRY" && currency !== "TL") {
    try {
      return new Intl.NumberFormat(locale === "az" ? "az-AZ" : "tr-TR", {
        style: "currency",
        currency: currency.toUpperCase(),
        maximumFractionDigits: 0,
      }).format(price);
    } catch {
      return `${price} ${currency}`;
    }
  }

  return formatPlanPrice(price, locale);
}

const STATUS_KEYS = {
  SUCCESS: "statusCompleted",
  COMPLETED: "statusCompleted",
  PAID: "statusPaid",
  ACTIVE: "statusActive",
  PENDING: "statusPending",
  WAITING: "statusPending",
  WAIT: "statusPending",
  CANCELLED: "statusCancelled",
  CANCELED: "statusCancelled",
  DISABLED: "statusCancelled",
  FAILED: "statusFailed",
} as const;

export type OrderStatusI18nKey = (typeof STATUS_KEYS)[keyof typeof STATUS_KEYS];

export type OrderStatusTone = "success" | "warning" | "danger" | "default";

export function getOrderStatusKey(
  status: string | null | undefined,
): OrderStatusI18nKey | null {
  if (!status) return null;
  const key = status.trim().toUpperCase() as keyof typeof STATUS_KEYS;
  return STATUS_KEYS[key] ?? null;
}

export function getOrderStatusTone(
  status: string | null | undefined,
): OrderStatusTone {
  const key = getOrderStatusKey(status);
  if (key === "statusCompleted" || key === "statusPaid" || key === "statusActive") {
    return "success";
  }
  if (key === "statusPending") return "warning";
  if (key === "statusCancelled" || key === "statusFailed") return "danger";
  return "default";
}
