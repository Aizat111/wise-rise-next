/**
 * Formats seconds as `HH:MM:SS` for the notes API.
 */
export function formatSecondsToDuration(totalSeconds: number): string {
  const safe = Number.isFinite(totalSeconds)
    ? Math.max(0, Math.floor(totalSeconds))
    : 0;
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
}

/**
 * Parses `HH:MM:SS` or `MM:SS` into total seconds for seeking.
 */
export function parseDurationToSeconds(duration: string): number {
  const parts = duration.split(":").map((part) => Number(part));
  if (parts.some((n) => Number.isNaN(n))) return 0;

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  return 0;
}
