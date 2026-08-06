import type { Classroom } from "@/core/types/classroom.types";
import { buildCourseHref } from "@/features/course/api/course.utils";

import type {
  ComingSoonCardData,
  DefaultHomeMode,
  EducationCardData,
} from "../types";

const PLATFORM_BY_MODE: Partial<Record<DefaultHomeMode, string>> = {
  "wise-rise": "wisenrise",
};

export function filterClassroomsByHomeMode(
  classrooms: Classroom[],
  mode: DefaultHomeMode,
): Classroom[] {
  const platform = PLATFORM_BY_MODE[mode];
  if (!platform) return classrooms;
  return classrooms.filter((classroom) => classroom.platform === platform);
}

export function mapClassroomToEducationCard(
  classroom: Classroom,
): EducationCardData {
  return {
    id: classroom.id,
    title: classroom.name,
    thumbnail: classroom.thumbnail?.path ?? classroom.cover?.path ?? "",
    authorName: classroom.teacher?.name ?? "",
    authorLogo:
      classroom.teacher?.logo?.path ?? classroom.teacher?.photo?.path ?? null,
    is_favorite: classroom.is_favorite ?? false,
    href: buildCourseHref(classroom.teacher?.slug, classroom.slug),
  };
}

/** Drop classrooms that cannot render a usable EducationCard thumbnail. */
export function mapClassroomsToEducationCards(
  classrooms: Classroom[],
): EducationCardData[] {
  return classrooms
    .map(mapClassroomToEducationCard)
    .filter((card) => Boolean(card.thumbnail));
}

export function mapClassroomToComingSoonCard(
  classroom: Classroom,
): ComingSoonCardData {
  return {
    id: classroom.id,
    title: classroom.name,
    thumbnail: classroom.thumbnail?.path ?? classroom.cover?.path ?? "",
    authorName: classroom.teacher?.name ?? "",
    authorLogo:
      classroom.teacher?.logo?.path ?? classroom.teacher?.photo?.path ?? null,
    comingSoonDate: classroom.coming_soon_date ?? null,
  };
}

/** Drop classrooms that cannot render a usable ComingSoonCard thumbnail. */
export function mapClassroomsToComingSoonCards(
  classrooms: Classroom[],
): ComingSoonCardData[] {
  return classrooms
    .map(mapClassroomToComingSoonCard)
    .filter((card) => Boolean(card.thumbnail));
}
