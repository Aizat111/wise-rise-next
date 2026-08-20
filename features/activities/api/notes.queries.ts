"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { ProfileNote } from "@/core/types/notes.types";
import { notesService } from "@/features/course/api/notes.service";

import { ACTIVITIES_SLIDER_PAGE_SIZE } from "../constants";

export function useProfileNotesQuery(
  profileId: string | number | null | undefined,
  pageSize = ACTIVITIES_SLIDER_PAGE_SIZE,
) {
  const enabled = profileId != null && profileId !== "";

  return useQuery<ProfileNote[]>({
    queryKey: QUERY_KEYS.notes.byProfile(profileId ?? "none", pageSize),
    queryFn: ({ signal }) =>
      notesService.listByProfile({
        profileId: profileId as string | number,
        page: 0,
        pageSize,
        signal,
      }),
    enabled,
    staleTime: 60 * 1000,
  });
}
