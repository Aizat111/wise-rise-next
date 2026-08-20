import type { Classroom } from "@/core/types/classroom.types";

import type { EducationProgressCardData } from "./types";

function getFirstVideoSlug(classroom: Classroom): string | null {
  const videos = classroom.videos;
  if (!videos?.length) return null;

  const [first] = [...videos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return first?.slug ?? null;
}

function getCompletionRate(classroom: Classroom): number {
  const raw = classroom.completion_rate;
  const numeric = typeof raw === "number" ? raw : Number(raw);
  if (Number.isNaN(numeric)) return 0;
  return Math.min(Math.max(numeric, 0), 100);
}

export function mapClassroomToEducationProgressCard(
  classroom: Classroom,
): EducationProgressCardData {
  return {
    id: classroom.id,
    title: classroom.name,
    thumbnail: classroom.thumbnail?.path ?? classroom.cover?.path ?? "",
    teacherName: classroom.teacher?.name ?? "",
    categoryName: classroom.category?.name ?? null,
    completionRate: getCompletionRate(classroom),
    isFavorite: classroom.is_favorite ?? false,
    teacherSlug: classroom.teacher?.slug ?? null,
    courseSlug: classroom.slug,
    firstVideoSlug: getFirstVideoSlug(classroom),
  };
}

export function mapClassroomsToEducationProgressCards(
  classrooms: Classroom[],
): EducationProgressCardData[] {
  return classrooms
    .map(mapClassroomToEducationProgressCard)
    .filter((card) => Boolean(card.thumbnail));
}
