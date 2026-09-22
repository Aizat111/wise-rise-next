"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { Classroom } from "@/core/types/classroom.types";

import { CourseNotFoundError, courseService } from "./course.service";

export function useCourseDetailQuery(
  slug: string,
  enabled = true,
  options?: {
    initialData?: Classroom | null;
    refetchOnMount?: boolean | "always";
  },
) {
  const seeded =
    options?.initialData && options.initialData.slug === slug
      ? options.initialData
      : undefined;

  return useQuery<Classroom, Error>({
    queryKey: QUERY_KEYS.course.detail(slug),
    queryFn: () => courseService.getBySlug(slug),
    enabled: Boolean(slug) && enabled,
    initialData: seeded,
    staleTime: 5 * 60 * 1000,
    refetchOnMount:
      options?.refetchOnMount ?? (seeded ? false : undefined),
    retry: (failureCount, error) => {
      if (error instanceof CourseNotFoundError) return false;
      return failureCount < 2;
    },
  });
}

export { CourseNotFoundError };
