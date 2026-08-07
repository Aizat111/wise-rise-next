"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { ClassroomsListParams } from "@/core/types/classroom.types";
import { classroomService } from "@/features/home/api/classroom.service";

import { CATEGORY_PAGE_SIZE } from "../constants";

export type CategoryClassroomsFilters = {
  categoryId?: number | null;
  platform?: string | null;
};

export function useCategoryClassroomsQuery(
  filters: CategoryClassroomsFilters,
  enabled = true,
) {
  const categoryId = filters.categoryId ?? undefined;
  const platform = filters.platform ?? undefined;

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.course.list({
      category_id: categoryId,
      platform,
      per_page: CATEGORY_PAGE_SIZE,
    }),
    queryFn: ({ pageParam }) => {
      const params: ClassroomsListParams = {
        page: pageParam,
        per_page: CATEGORY_PAGE_SIZE,
        ...(categoryId != null ? { category_id: categoryId } : {}),
        ...(platform ? { platform } : {}),
      };
      return classroomService.list(params);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.lastPage
        ? lastPage.currentPage + 1
        : undefined,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
