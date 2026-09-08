function splitPlaybackClock(totalSeconds: number): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const safe = Number.isFinite(totalSeconds)
    ? Math.max(0, Math.floor(totalSeconds))
    : 0;

  return {
    hours: Math.floor(safe / 3600),
    minutes: Math.floor((safe % 3600) / 60),
    seconds: safe % 60,
  };
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Formats seconds as `HH:MM:SS` for the notes API.
 */
export function formatSecondsToDuration(totalSeconds: number): string {
  const { hours, minutes, seconds } = splitPlaybackClock(totalSeconds);

  return [pad2(hours), pad2(minutes), pad2(seconds)].join(":");
}

/**
 * Formats seconds for display: `MM:SS`, or `HH:MM:SS` when the video is
 * an hour or longer.
 */
export function formatVideoDuration(totalSeconds: number): string {
  const { hours, minutes, seconds } = splitPlaybackClock(totalSeconds);

  if (hours > 0) {
    return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
  }

  return `${pad2(minutes)}:${pad2(seconds)}`;
}

export function parseNoteSeekParam(value: string | null | undefined): number | null {
  if (value == null || value.trim() === "") return null;
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds < 0) return null;
  return seconds;
}

/**
 * Parses `HH:MM:SS` or `MM:SS` into total seconds for seeking.
 * Also accepts `{HH:MM:SS}` and fractional seconds (`HH:MM:SS.fffffff`).
 */
export function parseDurationToSeconds(
  duration: string | number | null | undefined,
): number {
  if (typeof duration === "number") {
    return Number.isFinite(duration) && duration >= 0 ? duration : 0;
  }

  if (typeof duration !== "string") return 0;

  const normalized = duration.trim().replace(/^\{/, "").replace(/\}$/, "");
  const parts = normalized.split(":").map((part) => Number(part));
  if (parts.some((n) => Number.isNaN(n))) return 0;

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  if (parts.length === 1) {
    return parts[0] >= 0 ? parts[0] : 0;
  }

  return 0;
}
