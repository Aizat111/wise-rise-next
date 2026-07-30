/**
 * Formats an ISO date (`YYYY-MM-DD`) for the Coming Soon badge.
 * TR/AZ → "12 Ağustos" / long month; EN → "12 Aug".
 */
export function formatComingSoonDate(
  date: string | null | undefined,
  locale: string,
): string | null {
  if (!date) return null;

  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;

  const normalized = locale.toLowerCase();
  const isEnglish = normalized.startsWith("en");

  const intlLocale = normalized.startsWith("az")
    ? "az-AZ"
    : isEnglish
      ? "en-GB"
      : "tr-TR";

  return new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: isEnglish ? "short" : "long",
  }).format(parsed);
}
