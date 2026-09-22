"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { Classroom } from "@/core/types/classroom.types";

import { classroomService } from "./classroom.service";

export function useMostWatchedClassroomsQuery(
  enabled = true,
  initialData?: Classroom[],
) {
  const seeded = initialData && initialData.length > 0 ? initialData : undefined;

  return useQuery<Classroom[]>({
    queryKey: QUERY_KEYS.course.mostWatched,
    queryFn: () => classroomService.listMostWatched(),
    enabled,
    initialData: seeded,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: seeded ? false : undefined,
  });
}

export function useComingSoonClassroomsQuery(enabled = true) {
  return useQuery<Classroom[]>({
    queryKey: QUERY_KEYS.course.comingSoon,
    queryFn: () => classroomService.listComingSoon(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
