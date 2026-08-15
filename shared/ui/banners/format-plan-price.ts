const LOCALE_BY_APP: Record<string, string> = {
  tr: "tr-TR",
  az: "az-AZ",
};

export function formatPlanPrice(price: number, locale = "tr"): string {
  const intlLocale = LOCALE_BY_APP[locale] ?? "tr-TR";
  const formatted = new Intl.NumberFormat(intlLocale, {
    maximumFractionDigits: 0,
  }).format(price);

  return `${formatted} TL`;
}

export function toSafePrice(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."));
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }

  return null;
}
