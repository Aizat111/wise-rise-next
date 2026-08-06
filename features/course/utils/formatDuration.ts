/**
 * Formats API duration strings (`HH:MM:SS` / `MM:SS`) for display.
 * Strips a leading zero hour; returns the original value when parsing fails.
 */
export function formatDuration(
  duration: string | null | undefined,
): string | null {
  if (!duration) return null;
  const parts = duration.split(":").map((part) => Number(part));
  if (parts.some((n) => Number.isNaN(n))) return duration;

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    if (hours > 0) return `${hours}:${mm}:${ss}`;
    return `${mm}:${ss}`;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return duration;
}
