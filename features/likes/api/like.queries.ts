"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";

import { likeService } from "./like.service";

export const LIKED_INITIAL_PAGE = 0;

function hasMorePages(
  lastPage: { items: unknown[]; perPage: number },
  lastPageParam: number,
) {
  if (lastPage.items.length < lastPage.perPage) return undefined;
  return lastPageParam + 1;
}

export function useLikedClassroomsQuery(
  profileId: string | number | null | undefined,
  pageSize: number,
) {
  const enabled = profileId != null && profileId !== "";

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.like.classroomsList(profileId ?? "none", pageSize),
    queryFn: ({ pageParam, signal }) =>
      likeService.listLikedClassrooms({
        profileId: profileId as string | number,
        page: pageParam,
        per_page: pageSize,
        signal,
      }),
    initialPageParam: LIKED_INITIAL_PAGE,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      hasMorePages(lastPage, lastPageParam),
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useLikedTeachersQuery(
  profileId: string | number | null | undefined,
  pageSize: number,
) {
  const enabled = profileId != null && profileId !== "";

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.like.teachersList(profileId ?? "none", pageSize),
    queryFn: ({ pageParam, signal }) =>
      likeService.listLikedTeachers({
        profileId: profileId as string | number,
        page: pageParam,
        per_page: pageSize,
        signal,
      }),
    initialPageParam: LIKED_INITIAL_PAGE,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      hasMorePages(lastPage, lastPageParam),
    enabled,
    staleTime: 60 * 1000,
  });
}
