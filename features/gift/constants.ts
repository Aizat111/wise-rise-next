import type { PlanPeriod } from "@/core/types/plan.types";

export const GIFT_ROUTE = "/hediye-et" as const;

export const GIFT_CONTAINER_CLASS =
  "mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12";

export const GIFT_PLAN_IMAGE = "/background/giveGift.jpg" as const;
export const GIFT_CARD_IMAGE = "/cards/gift-card.jpg" as const;

export const GIFT_FORM_ID = "gift-form";

export type CountryCallingCode = {
  iso: string;
  name: string;
  code: number;
};

export const COUNTRY_CALLING_CODES: readonly CountryCallingCode[] = [
  { iso: "TR", name: "Türkiye", code: 90 },
  { iso: "AZ", name: "Azərbaycan", code: 994 },
  { iso: "DE", name: "Deutschland", code: 49 },
  { iso: "US", name: "United States", code: 1 },
  { iso: "GB", name: "United Kingdom", code: 44 },
  { iso: "NL", name: "Nederland", code: 31 },
  { iso: "FR", name: "France", code: 33 },
  { iso: "IT", name: "Italia", code: 39 },
  { iso: "ES", name: "España", code: 34 },
  { iso: "RU", name: "Россия", code: 7 },
  { iso: "AE", name: "UAE", code: 971 },
  { iso: "SA", name: "Saudi Arabia", code: 966 },
] as const;

export const DEFAULT_COUNTRY_CODE = 90;

export function installmentForPeriod(period: PlanPeriod): number {
  return period === "Yearly" ? 12 : 1;
}
