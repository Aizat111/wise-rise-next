import type { Classroom } from "@/core/types/classroom.types";

import type { DefaultHomeMode, EducationCardData } from "../types";

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
  };
}
