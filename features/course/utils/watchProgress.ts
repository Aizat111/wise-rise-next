/**
 * Safe watch-percent helper. Returns null when duration is missing/invalid
 * so callers can skip updates instead of throwing.
 */
export function calcWatchPercent(
  currentTime: number,
  duration: number,
): number | null {
  if (!Number.isFinite(duration) || duration <= 0) return null;
  if (!Number.isFinite(currentTime) || currentTime < 0) return null;

  const raw = (currentTime / duration) * 100;
  if (!Number.isFinite(raw)) return null;

  return Math.min(100, Math.max(0, raw));
}

/** Round down to a whole percent; clamp to 0–100. */
export function toWatchPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.floor(value)));
}

export function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) return numeric;
  }
  return null;
}
