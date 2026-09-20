"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type {
  Teacher,
  TeachersListParams,
  TeachersListResult,
} from "@/core/types/teacher.types";

import { teacherService } from "./teacher.service";

export function useBestTeachersQuery(enabled = true) {
  return useQuery<Teacher[]>({
    queryKey: QUERY_KEYS.teacher.theBest,
    queryFn: () => teacherService.listTheBest(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export type TeachersListFilters = {
  categoryId?: number | null;
  page?: number;
  pageSize?: number;
};

export function useTeachersListQuery(filters: TeachersListFilters) {
  const categoryId = filters.categoryId ?? undefined;
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;

  return useQuery<TeachersListResult>({
    queryKey: QUERY_KEYS.teacher.list({
      category_id: categoryId,
      page,
      per_page: pageSize,
    }),
    queryFn: () => {
      const params: TeachersListParams = {
        page,
        per_page: pageSize,
        ...(categoryId != null ? { category_id: categoryId } : {}),
      };
      return teacherService.list(params);
    },
    staleTime: 5 * 60 * 1000,
  });
}
