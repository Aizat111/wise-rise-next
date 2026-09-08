import type { ProfileNote, VideoNote } from "@/core/types/notes.types";

import { buildVideoHref } from "../api/course.utils";
import { NOTE_SEEK_QUERY_PARAM } from "../constants";
import type { CourseVideoItem } from "../types";
import { parseDurationToSeconds } from "./playbackTime";

function asId(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

export function getNoteVideoId(note: VideoNote, fallbackVideoId?: string): string {
  const record = note as VideoNote & {
    videoId?: unknown;
    video?: { id?: unknown };
  };

  return (
    asId(note.video_id) ??
    asId(record.videoId) ??
    asId(record.video?.id) ??
    asId(fallbackVideoId) ??
    ""
  );
}

export function findVideoForNote(
  videos: CourseVideoItem[],
  note: VideoNote,
): CourseVideoItem | undefined {
  const videoId = getNoteVideoId(note);
  if (videoId) {
    const byId = videos.find((item) => String(item.id) === videoId);
    if (byId) return byId;
  }

  const slug = (note as ProfileNote).video?.slug;
  if (slug) {
    return videos.find((item) => item.slug === slug);
  }

  return undefined;
}

export function buildNotePlayHref(input: {
  note: VideoNote;
  videos: CourseVideoItem[];
  teacherSlug: string | null | undefined;
  courseSlug: string | null | undefined;
}): string | null {
  const video = findVideoForNote(input.videos, input.note);
  if (!video) return null;

  const href = buildVideoHref(input.teacherSlug, input.courseSlug, video.slug);
  if (!href) return null;

  const seconds = Math.max(
    0,
    Math.floor(parseDurationToSeconds(input.note.duration)),
  );

  return `${href}?${NOTE_SEEK_QUERY_PARAM}=${seconds}`;
}
