"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { VideoNote } from "@/core/types/notes.types";

import { NOTES_PAGE_SIZE } from "../constants";
import { notesService } from "./notes.service";
import { getNoteVideoId } from "../utils/notePlayback";

const NOTES_REFETCH_INTERVAL_MS = 30_000;

export function useVideoNotesQuery(videoId: string, enabled = true) {
  return useQuery<VideoNote[], Error>({
    queryKey: QUERY_KEYS.notes.byVideo(videoId),
    queryFn: async () => {
      const items = await notesService.listByVideo({ videoId });
      return items.map((note) => ({
        ...note,
        video_id: getNoteVideoId(note, videoId),
      }));
    },
    enabled: Boolean(videoId) && enabled,
    staleTime: 15_000,
    refetchInterval: NOTES_REFETCH_INTERVAL_MS,
  });
}

export function useCourseNotesQuery(videoIds: string[], enabled = true) {
  const idsKey = videoIds.filter(Boolean).join("|");
  const uniqueIds = useMemo(
    () => [...new Set(idsKey ? idsKey.split("|") : [])],
    [idsKey],
  );
  const [loadedPages, setLoadedPages] = useState(1);

  useEffect(() => {
    setLoadedPages(1);
  }, [idsKey]);

  const queries = useQueries({
    queries: uniqueIds.flatMap((videoId) =>
      Array.from({ length: loadedPages }, (_, page) => ({
        queryKey:
          page === 0
            ? QUERY_KEYS.notes.byVideo(videoId)
            : [...QUERY_KEYS.notes.byVideo(videoId), page],
        queryFn: async () => {
          const items = await notesService.listByVideo({
            videoId,
            page,
            pageSize: NOTES_PAGE_SIZE,
          });
          return items.map((note) => ({
            ...note,
            video_id: getNoteVideoId(note, videoId),
          }));
        },
        enabled: enabled && Boolean(videoId),
        staleTime: 15_000,
      })),
    ),
  });

  const notes = useMemo(() => {
    const seen = new Set<string>();
    const items: VideoNote[] = [];

    for (const query of queries) {
      for (const note of query.data ?? []) {
        if (seen.has(note.id)) continue;
        seen.add(note.id);
        items.push(note);
      }
    }

    return items;
  }, [queries]);

  const lastPageQueries = uniqueIds.map((_, videoIndex) => {
    const index = videoIndex * loadedPages + (loadedPages - 1);
    return queries[index];
  });

  const hasMore = lastPageQueries.some(
    (query) => (query?.data?.length ?? 0) >= NOTES_PAGE_SIZE,
  );
  const isLoading =
    enabled &&
    uniqueIds.length > 0 &&
    notes.length === 0 &&
    queries.some((query) => query.isPending);
  const isError =
    uniqueIds.length > 0 &&
    notes.length === 0 &&
    queries.some((query) => query.isError) &&
    queries.every((query) => !query.isPending);
  const isFetchingNextPage =
    loadedPages > 1 && lastPageQueries.some((query) => query?.isFetching);

  return {
    notes,
    isLoading,
    isError,
    isFetchingNextPage,
    hasMore,
    refetch: () => Promise.all(queries.map((query) => query.refetch())),
    fetchNextPage: () => {
      if (!hasMore) return;
      setLoadedPages((current) => current + 1);
    },
  };
}
