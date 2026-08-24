export function formatGiftPrice(price: number, locale: string): string {
  const intlLocale = locale === "az" ? "az-AZ" : "tr-TR";
  return `${new Intl.NumberFormat(intlLocale, {
    maximumFractionDigits: 0,
  }).format(price)}₺`;
}
