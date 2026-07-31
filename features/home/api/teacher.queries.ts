"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { Teacher } from "@/core/types/teacher.types";

import { teacherService } from "./teacher.service";

export function useBestTeachersQuery(enabled = true) {
  return useQuery<Teacher[]>({
    queryKey: QUERY_KEYS.teacher.theBest,
    queryFn: () => teacherService.listTheBest(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
