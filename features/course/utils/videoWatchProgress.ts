import type { ClassroomVideo } from "@/core/types/classroom.types";
import type { ProfileVideoWatch } from "@/core/types/video-watch.types";

import {
  VIDEO_RESTART_NEAR_END_SECONDS,
  VIDEO_RESTART_PERCENT,
  VIDEO_RESUME_MIN_SECONDS,
} from "../constants";
import type { CourseVideoItem } from "../types";
import { formatSecondsToDuration, parseDurationToSeconds } from "./playbackTime";
import {
  calcWatchPercent,
  toFiniteNumber,
  toWatchPercent,
} from "./watchProgress";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function parseDurationValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const numeric = toFiniteNumber(trimmed);
  if (numeric != null && numeric >= 0 && !trimmed.includes(":")) {
    return numeric;
  }

  return parseDurationToSeconds(trimmed);
}

function pickDurationSeconds(record: Record<string, unknown> | null): number | null {
  if (!record) return null;

  const nested = [record.pivot, record.watch, record.view, record.progress].map(
    asRecord,
  );

  const candidates: unknown[] = [
    record.watched_duration,
    record.watch_duration,
    record.viewed_duration,
    record.last_watched_duration,
    record.current_duration,
    record.played_duration,
    record.progress_duration,
  ];

  for (const nestedRecord of nested) {
    if (!nestedRecord) continue;
    candidates.push(
      nestedRecord.watched_duration,
      nestedRecord.watch_duration,
      nestedRecord.duration,
    );
  }

  for (const candidate of candidates) {
    if (candidate == null || candidate === "") continue;
    const seconds = parseDurationValue(candidate);
    if (seconds != null) return seconds;
  }

  return null;
}

function pickPercent(record: Record<string, unknown> | null): number | null {
  if (!record) return null;

  const nested = [record.pivot, record.watch, record.view, record.progress].map(
    asRecord,
  );

  const candidates: unknown[] = [
    record.watch_percent,
    record.watched_percent,
    record.completion_rate,
    record.progress,
    record.percent,
  ];

  for (const nestedRecord of nested) {
    if (!nestedRecord) continue;
    candidates.push(
      nestedRecord.watch_percent,
      nestedRecord.watched_percent,
      nestedRecord.completion_rate,
      nestedRecord.progress,
      nestedRecord.percent,
    );
  }

  for (const candidate of candidates) {
    if (typeof candidate === "object" && candidate != null) continue;
    const numeric = toFiniteNumber(candidate);
    if (numeric == null) continue;
    return toWatchPercent(numeric);
  }

  return null;
}

/**
 * Seconds to resume from. Returns 0 when the saved position is too early
 * or the viewer already finished (so the next play starts from the beginning).
 */
export function getResumePlaybackSeconds(
  watchedSeconds: number,
  totalSeconds?: number,
): number {
  if (!Number.isFinite(watchedSeconds) || watchedSeconds < VIDEO_RESUME_MIN_SECONDS) {
    return 0;
  }

  if (typeof totalSeconds === "number" && Number.isFinite(totalSeconds) && totalSeconds > 0) {
    if (watchedSeconds >= totalSeconds - VIDEO_RESTART_NEAR_END_SECONDS) return 0;
    if ((watchedSeconds / totalSeconds) * 100 >= VIDEO_RESTART_PERCENT) return 0;
    return Math.min(watchedSeconds, Math.max(0, totalSeconds - 0.25));
  }

  return watchedSeconds;
}

export function getClassroomVideoWatchProgress(video: ClassroomVideo): {
  watchedDuration: string | null;
  watchPercent: number;
} {
  const record = video as ClassroomVideo & Record<string, unknown>;
  const totalSeconds = parseDurationValue(video.duration);
  const watchedSeconds = pickDurationSeconds(record);
  const explicitPercent = pickPercent(record);

  const fromDuration =
    watchedSeconds != null && totalSeconds != null
      ? calcWatchPercent(watchedSeconds, totalSeconds)
      : null;

  const watchPercent = toWatchPercent(fromDuration ?? explicitPercent ?? 0);

  let watchedDuration: string | null = null;
  if (typeof record.watched_duration === "string" && record.watched_duration.trim()) {
    watchedDuration = record.watched_duration.trim();
  } else if (
    typeof record.watch_duration === "string" &&
    record.watch_duration.trim()
  ) {
    watchedDuration = record.watch_duration.trim();
  } else if (watchedSeconds != null) {
    watchedDuration = formatSecondsToDuration(watchedSeconds);
  }

  return { watchedDuration, watchPercent };
}

export function normalizeProfileVideoWatches(
  payload: unknown,
): ProfileVideoWatch[] {
  const items = extractListItems(payload);
  return items.flatMap((item) => {
    const watch = mapProfileVideoWatch(item);
    return watch ? [watch] : [];
  });
}

function extractListItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  const record = asRecord(payload);
  if (!record) return [];

  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.videos)) return record.videos;
  if (Array.isArray(record.items)) return record.items;

  const nested = asRecord(record.data);
  if (nested) {
    if (Array.isArray(nested.data)) return nested.data;
    if (Array.isArray(nested.videos)) return nested.videos;
  }

  return [];
}

function mapProfileVideoWatch(item: unknown): ProfileVideoWatch | null {
  const record = asRecord(item);
  if (!record) return null;

  const video = asRecord(record.video);
  const videoId =
    record.video_id ?? record.videoId ?? video?.id ?? record.id;

  if (videoId == null) return null;

  const watchedSeconds =
    pickDurationSeconds(record) ??
    parseDurationValue(record.duration) ??
    pickDurationSeconds(video);
  const explicitPercent = pickPercent(record) ?? pickPercent(video);
  const totalSeconds = parseDurationValue(
    video?.duration ?? record.video_duration ?? record.total_duration,
  );
  const fromDuration =
    watchedSeconds != null && totalSeconds != null
      ? calcWatchPercent(watchedSeconds, totalSeconds)
      : null;

  return {
    videoId: String(videoId),
    duration:
      watchedSeconds != null ? formatSecondsToDuration(watchedSeconds) : null,
    percent:
      fromDuration != null
        ? toWatchPercent(fromDuration)
        : explicitPercent,
  };
}

export function mergeVideoWatchProgress(
  videos: CourseVideoItem[],
  watches: ProfileVideoWatch[] | undefined,
): CourseVideoItem[] {
  if (!watches?.length) return videos;

  const byId = new Map(watches.map((watch) => [watch.videoId, watch]));

  return videos.map((video) => {
    const watch = byId.get(String(video.id));
    if (!watch) return video;

    const watchedDuration = watch.duration ?? video.watchedDuration;
    const fromDuration = calcWatchPercent(
      parseDurationToSeconds(watchedDuration ?? ""),
      parseDurationToSeconds(video.duration ?? ""),
    );
    const watchPercent = toWatchPercent(
      fromDuration ?? watch.percent ?? video.watchPercent,
    );

    return {
      ...video,
      watchedDuration,
      watchPercent,
    };
  });
}

export function upsertProfileVideoWatch(
  current: ProfileVideoWatch[] | undefined,
  videoId: string | number,
  duration: string,
  totalDuration?: string | null,
): ProfileVideoWatch[] {
  const id = String(videoId);
  const computed = calcWatchPercent(
    parseDurationToSeconds(duration),
    parseDurationToSeconds(totalDuration ?? ""),
  );
  const next: ProfileVideoWatch = {
    videoId: id,
    duration,
    percent: computed != null ? toWatchPercent(computed) : null,
  };
  if (!current?.length) return [next];

  const exists = current.some((item) => item.videoId === id);
  if (!exists) return [...current, next];

  return current.map((item) => (item.videoId === id ? next : item));
}
