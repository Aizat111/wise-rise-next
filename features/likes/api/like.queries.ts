"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";

import { LIKED_INITIAL_PAGE } from "../constants";
import { likeService } from "./like.service";

export { LIKED_INITIAL_PAGE };

function getNextLikedPage(lastPage: {
  items: unknown[];
  currentPage: number;
  lastPage: number;
}) {
  if (lastPage.items.length === 0) return undefined;
  if (lastPage.currentPage < lastPage.lastPage) {
    return lastPage.currentPage + 1;
  }
  return undefined;
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
    getNextPageParam: getNextLikedPage,
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
    getNextPageParam: getNextLikedPage,
    enabled,
    staleTime: 60 * 1000,
  });
}
