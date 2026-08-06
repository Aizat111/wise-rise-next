import type { Classroom, ClassroomVideo } from "@/core/types/classroom.types";

import type { CourseMetaItem, CourseVideoItem } from "../types";
import { formatDuration } from "../utils/formatDuration";
import {
  resolveMediaUrl,
  resolveTrailerUrl,
  resolveVideoPlaybackUrl,
} from "../utils/mediaUrl";

export function unwrapClassroomDetail(
  response: Classroom | { data: Classroom } | null | undefined,
): Classroom | null {
  if (!response) return null;
  if ("data" in response && response.data) return response.data;
  if ("slug" in response && response.slug) return response as Classroom;
  return null;
}

export function getCourseHeroImage(course: Classroom): string | null {
  return (
    resolveMediaUrl(course.teacher?.photo?.path) ??
    resolveMediaUrl(course.banner?.path) ??
    resolveMediaUrl(course.cover?.path) ??
    resolveMediaUrl(course.thumbnail?.path)
  );
}

export function getCourseCoverImage(course: Classroom): string | null {
  return (
    resolveMediaUrl(course.cover?.path) ??
    resolveMediaUrl(course.banner?.path) ??
    resolveMediaUrl(course.thumbnail?.path)
  );
}

export function getCourseAboutImage(course: Classroom): string | null {
  return (
    resolveMediaUrl(course.thumbnail?.path) ??
    resolveMediaUrl(course.cover?.path) ??
    resolveMediaUrl(course.banner?.path)
  );
}

export function getTeacherLogo(course: Classroom): string | null {
  return resolveMediaUrl(course.teacher?.logo?.path);
}

export function getTrailerPlaybackUrl(course: Classroom): string | null {
  return resolveTrailerUrl({
    teaser: course.teaser,
    rawTeaserPath: course.raw_teaser_path,
  });
}

function getSectionLabel(video: ClassroomVideo): string | null {
  const tagEpisode = video.tags?.find((tag) => {
    const name = tag.name?.trim();
    return Boolean(name) && /^\d+$/.test(name);
  })?.name;

  if (tagEpisode) return tagEpisode;
  if (typeof video.order === "number" && video.order > 0) {
    return String(video.order);
  }
  return null;
}

export function mapClassroomVideoToItem(
  video: ClassroomVideo,
): CourseVideoItem {
  return {
    id: video.id,
    name: video.name,
    slug: video.slug,
    description: video.description?.trim() ?? "",
    duration: video.duration ?? null,
    thumbnail: video.thumbnail?.path ?? null,
    order: video.order ?? null,
    sectionLabel: getSectionLabel(video),
    playbackUrl: resolveVideoPlaybackUrl({
      streamUrl: video.stream_url,
      downloadUrl: video.download_url,
      rawFilePath: video.raw_file_path,
      podcastFile: video.podcast_file,
    }),
  };
}

export function mapClassroomVideos(
  videos: ClassroomVideo[] | null | undefined,
): CourseVideoItem[] {
  if (!videos?.length) return [];
  return [...videos]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(mapClassroomVideoToItem);
}

type MetaLabels = {
  category: string;
  duration: string;
  episodes: string;
  teacher: string;
};

export function buildCourseMetaItems(
  course: Classroom,
  labels: MetaLabels,
): CourseMetaItem[] {
  const items: CourseMetaItem[] = [];

  if (course.category?.name) {
    items.push({
      key: "category",
      label: labels.category,
      value: course.category.name,
    });
  }

  if (course.teacher?.name) {
    items.push({
      key: "teacher",
      label: labels.teacher,
      value: course.teacher.name,
    });
  }

  const duration = formatDuration(course.classroom_duration);
  if (duration) {
    items.push({
      key: "duration",
      label: labels.duration,
      value: duration,
    });
  }

  const episodeCount =
    course.videos?.length ??
    (typeof course.specs === "number" ? course.specs : Number(course.specs));

  if (episodeCount && !Number.isNaN(episodeCount) && episodeCount > 0) {
    items.push({
      key: "episodes",
      label: labels.episodes,
      value: String(episodeCount),
    });
  }

  return items;
}

export function truncateDescription(
  text: string | null | undefined,
  maxChars: number,
): string {
  if (!text) return "";
  const normalized = text.trim();
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars).trimEnd()}...`;
}

export function buildCourseHref(
  teacherSlug: string | null | undefined,
  courseSlug: string | null | undefined,
): string | null {
  if (!teacherSlug || !courseSlug) return null;
  return `/${teacherSlug}/${courseSlug}`;
}

export function buildVideoHref(
  teacherSlug: string | null | undefined,
  courseSlug: string | null | undefined,
  videoSlug: string | null | undefined,
): string | null {
  if (!teacherSlug || !courseSlug || !videoSlug) return null;
  return `/${teacherSlug}/${courseSlug}/${videoSlug}`;
}

export function findCourseVideoBySlug(
  videos: CourseVideoItem[],
  videoSlug: string,
): CourseVideoItem | null {
  return videos.find((video) => video.slug === videoSlug) ?? null;
}
