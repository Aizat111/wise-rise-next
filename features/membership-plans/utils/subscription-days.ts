import { differenceInCalendarDays, parseISO, startOfDay } from "date-fns";

export function parseMembershipEndDate(
  endDate: string | null | undefined,
): Date | null {
  if (!endDate || typeof endDate !== "string" || !endDate.trim()) return null;

  const parsed = parseISO(endDate.trim());
  if (!Number.isNaN(parsed.getTime())) return parsed;

  const fallback = new Date(endDate);
  if (Number.isNaN(fallback.getTime())) return null;
  return fallback;
}

/**
 * Whole calendar days from today to `end_date`, using the local timezone.
 * `0` means the membership ends today; negative means it already ended.
 */
export function getRemainingMembershipDays(
  endDate: string | null | undefined,
): number | null {
  const parsed = parseMembershipEndDate(endDate);
  if (!parsed) return null;

  return differenceInCalendarDays(startOfDay(parsed), startOfDay(new Date()));
}
