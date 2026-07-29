"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { Classroom } from "@/core/types/classroom.types";

import { classroomService } from "./classroom.service";

export function useMostWatchedClassroomsQuery(enabled = true) {
  return useQuery<Classroom[]>({
    queryKey: QUERY_KEYS.course.mostWatched,
    queryFn: () => classroomService.listMostWatched(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
