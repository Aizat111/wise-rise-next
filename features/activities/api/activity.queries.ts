"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { Classroom } from "@/core/types/classroom.types";

import { activityService } from "./activity.service";

function isProfileEnabled(
  profileId: string | number | null | undefined,
): profileId is string | number {
  return profileId != null && profileId !== "";
}

export function useWatchingActivitiesQuery(
  profileId: string | number | null | undefined,
) {
  const enabled = isProfileEnabled(profileId);

  return useQuery<Classroom[]>({
    queryKey: QUERY_KEYS.activities.watching(profileId ?? "none"),
    queryFn: ({ signal }) =>
      activityService.listWatching({
        profileId: profileId as string | number,
        signal,
      }),
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useWatchedActivitiesQuery(
  profileId: string | number | null | undefined,
) {
  const enabled = isProfileEnabled(profileId);

  return useQuery<Classroom[]>({
    queryKey: QUERY_KEYS.activities.watched(profileId ?? "none"),
    queryFn: ({ signal }) =>
      activityService.listWatched({
        profileId: profileId as string | number,
        signal,
      }),
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useAssignedClassroomsQuery(
  profileId: string | number | null | undefined,
) {
  const enabled = isProfileEnabled(profileId);

  return useQuery<Classroom[]>({
    queryKey: QUERY_KEYS.activities.assigned(profileId ?? "none"),
    queryFn: ({ signal }) =>
      activityService.listAssigned({
        profileId: profileId as string | number,
        signal,
      }),
    enabled,
    staleTime: 60 * 1000,
  });
}
