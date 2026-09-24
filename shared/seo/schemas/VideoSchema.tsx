import type { Classroom, ClassroomVideo } from "@/core/types/classroom.types";
import { getCourseCoverImage } from "@/features/course/api/course.utils";
import {
  isProgressiveMediaUrl,
  resolveMediaUrl,
} from "@/features/course/utils/mediaUrl";

import JsonLd from "../JsonLd";
import { ORGANIZATION_ID } from "../schema-ids";
import { localizedPath, toAbsoluteUrl } from "../site-url";

type VideoSchemaProps = {
  course: Classroom;
  video: ClassroomVideo;
  locale: string;
  teacherSlug: string;
  courseSlug: string;
};

function toPlainText(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Converts `HH:MM:SS` or `MM:SS` into an ISO 8601 duration (`PT6M26S`). */
function toIso8601Duration(duration: string | null | undefined): string | null {
  if (!duration) return null;

  const parts = duration
    .trim()
    .split(":")
    .map((part) => Number(part));

  if (
    parts.length < 2 ||
    parts.length > 3 ||
    parts.some((part) => !Number.isFinite(part) || part < 0)
  ) {
    return null;
  }

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
  } else {
    [minutes, seconds] = parts;
  }

  const totalSeconds = Math.floor(hours * 3600 + minutes * 60 + seconds);
  if (totalSeconds <= 0) return null;

  const isoHours = Math.floor(totalSeconds / 3600);
  const isoMinutes = Math.floor((totalSeconds % 3600) / 60);
  const isoSeconds = totalSeconds % 60;

  let result = "PT";
  if (isoHours > 0) result += `${isoHours}H`;
  if (isoMinutes > 0) result += `${isoMinutes}M`;
  if (isoSeconds > 0) result += `${isoSeconds}S`;
  return result;
}

/** API timestamps like `2023-04-04 09:33:18` are stored in Turkey time. */
function toUploadDate(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim().replace(" ", "T");

  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return `${trimmed}T00:00:00+03:00`;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
    return `${trimmed}:00+03:00`;
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return `${trimmed}+03:00`;
  }

  const parsed = Date.parse(trimmed);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed).toISOString();
}

function videoContentUrl(video: ClassroomVideo): string | null {
  const candidates = [
    resolveMediaUrl(video.download_url),
    resolveMediaUrl(video.raw_file_path),
    resolveMediaUrl(video.stream_url),
  ].filter((url): url is string => Boolean(url));

  return (
    candidates.find((url) => isProgressiveMediaUrl(url)) ?? candidates[0] ?? null
  );
}

export default function VideoSchema({
  course,
  video,
  locale,
  teacherSlug,
  courseSlug,
}: VideoSchemaProps) {
  const name = toPlainText(video.name);
  const description = toPlainText(video.description) || toPlainText(course.description) || name;
  const thumbnailUrl =
    resolveMediaUrl(video.thumbnail?.path) ?? getCourseCoverImage(course);
  const uploadDate = toUploadDate(course.created_at);
  const contentUrl = videoContentUrl(video);
  const duration = toIso8601Duration(video.duration);
  const embedUrl = toAbsoluteUrl(
    localizedPath(locale, `/${teacherSlug}/${courseSlug}/${video.slug}`),
  );

  if (!name || !description || !thumbnailUrl || !uploadDate) return null;

  return (
    <JsonLd
      id="video-schema"
      data={{
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name,
        description,
        thumbnailUrl,
        uploadDate,
        ...(contentUrl ? { contentUrl } : {}),
        embedUrl,
        ...(duration ? { duration } : {}),
        inLanguage: locale,
        publisher: {
          "@id": ORGANIZATION_ID,
        },
      }}
    />
  );
}
