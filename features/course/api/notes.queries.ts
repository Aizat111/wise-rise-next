"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { VideoNote } from "@/core/types/notes.types";

import { notesService } from "./notes.service";

const NOTES_REFETCH_INTERVAL_MS = 30_000;

export function useVideoNotesQuery(videoId: string, enabled = true) {
  return useQuery<VideoNote[], Error>({
    queryKey: QUERY_KEYS.notes.byVideo(videoId),
    queryFn: () => notesService.listByVideo({ videoId }),
    enabled: Boolean(videoId) && enabled,
    staleTime: 15_000,
    refetchInterval: NOTES_REFETCH_INTERVAL_MS,
  });
}
