// Daily streak helpers — pure functions. Shared between the /streaks page
// and any future surfaces (header chip, dashboard tile, etc.).
import type { MilestoneRule, MilestoneRuleWithStatus } from '@/core/types/streaks.types';

// Fixed milestone ladder before yearly steps kick in.
export const FIXED_MILESTONES: readonly number[] = [30, 60, 180, 365];

/**
 * Returns the next milestone strictly greater than `current`. After 365,
 * milestones step by one full year forever (730, 1095, 1460, ...).
 */
export const nextMilestone = (current: number): number => {
  for (const m of FIXED_MILESTONES) {
    if (m > current) return m;
  }
  const yearsCompleted = Math.floor(current / 365);
  return (yearsCompleted + 1) * 365;
};

/**
 * Returns the previous milestone — used as the lower bound of the segment
 * the progress bar fills against, so the bar feels responsive between
 * milestones instead of crawling from zero.
 */
export const prevMilestone = (current: number): number => {
  const next = nextMilestone(current);
  const idx = FIXED_MILESTONES.indexOf(next);
  if (idx > 0) return FIXED_MILESTONES[idx - 1];
  if (idx === 0) return 0;
  return next - 365;
};

/**
 * Human-readable label for a milestone count:
 *   30  -> "30-day"
 *   365 -> "1-year"
 *   730 -> "2-year"
 *   1460 -> "4-year"
 */
export const milestoneLabel = (days: number): string => {
  if (days < 365) return `${days}-day`;
  const years = days / 365;
  // Only emit integer-year labels — the ladder above only ever produces
  // multiples of 365 past the 365 mark.
  if (Number.isInteger(years)) return `${years}-year`;
  return `${days}-day`;
};

/**
 * Fractional fill of the progress bar between prev and next milestone.
 * Clamped to [0, 1].
 */
export const milestoneFillFraction = (current: number): number => {
  const prev = prevMilestone(current);
  const next = nextMilestone(current);
  const span = next - prev;
  if (span <= 0) return 0;
  const fill = (current - prev) / span;
  if (fill < 0) return 0;
  if (fill > 1) return 1;
  return fill;
};

// Ordinal suffix for a day-of-month: 1 -> "1st", 22 -> "22nd", etc.
export const ordinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/**
 * Formats an ISO date ("YYYY-MM-DD") as "22nd January 2025".
 * Parses as local midnight to avoid timezone drift on the day display.
 */
export const formatStreakStartDate = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const day = ordinal(d.getDate());
  const month = d.toLocaleString('en', { month: 'long' });
  return `${day} ${month} ${d.getFullYear()}`;
};

/** Short date for the stats row — e.g. "Jul 22, 2025". */
export const formatStreakStartDateShort = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Convert cents to a 2-decimal dollar string ("$1,234.56"). Used for the
 * today's progress chip.
 */
export const centsToDollars = (cents: number): string => {
  const dollars = cents / 100;
  return dollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Whole-dollar formatter for milestone payouts. Milestone rewards are
 * always rounded amounts ($50, $100, ...) — drop the decimals so the row
 * reads at a glance. Falls back to the 2-decimal form only when the
 * payoutCents doesn't land on a whole dollar.
 */
export const centsToWholeDollars = (cents: number): string => {
  const dollars = cents / 100;
  const wholeDollar = cents % 100 === 0;
  return dollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: wholeDollar ? 0 : 2,
    maximumFractionDigits: wholeDollar ? 0 : 2
  });
};

/**
 * Assign a status to every milestone tier relative to the user's current
 * streak length. Server sends `rules` sorted ascending by `days` — we do
 * not re-sort here.
 *
 * Rules:
 *   - `received` — currentStreak >= tier.days (already crossed on this run)
 *   - `next`     — the FIRST tier where currentStreak < tier.days
 *   - `locked`   — every tier after `next`
 *
 * Pure function: fully derivable from (currentStreak, rules) so the UI
 * recomputes automatically when the streakProgress subscription pushes a
 * new currentStreak — no refetch required.
 */
export const assignMilestoneStatuses = (
  currentStreak: number,
  rules: readonly MilestoneRule[]
): MilestoneRuleWithStatus[] => {
  let foundNext = false;
  return rules.map(rule => {
    if (currentStreak >= rule.days) {
      return { ...rule, status: 'received' as const };
    }
    if (!foundNext) {
      foundNext = true;
      return { ...rule, status: 'next' as const };
    }
    return { ...rule, status: 'locked' as const };
  });
};
