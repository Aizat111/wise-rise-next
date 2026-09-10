"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { Classroom } from "@/core/types/classroom.types";
import { classroomService } from "@/features/home/api/classroom.service";

import { RELATED_COURSES_PAGE_SIZE } from "../constants";

export function useRelatedClassroomsQuery(
  categoryId: number | undefined,
  enabled = true,
) {
  return useQuery<Classroom[]>({
    queryKey: QUERY_KEYS.course.list({
      category_id: categoryId,
      per_page: RELATED_COURSES_PAGE_SIZE,
    }),
    queryFn: async () => {
      if (categoryId == null) return [];

      const result = await classroomService.list({
        category_id: categoryId,
        page: 1,
        per_page: RELATED_COURSES_PAGE_SIZE,
      });

      return result.items;
    },
    enabled: typeof categoryId === "number" && enabled,
    staleTime: 5 * 60 * 1000,
  });
}
