"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { ProfileVideoWatch } from "@/core/types/video-watch.types";

import { watchProgressService } from "./watch-progress.service";

export function useProfileVideoWatchesQuery(
  profileId: string | number | null | undefined,
  enabled = true,
) {
  return useQuery<ProfileVideoWatch[], Error>({
    queryKey: QUERY_KEYS.profile.videos(profileId ?? "none"),
    queryFn: ({ signal }) => watchProgressService.list(profileId!, signal),
    enabled: profileId != null && enabled,
    staleTime: 30_000,
    retry: false,
  });
}
