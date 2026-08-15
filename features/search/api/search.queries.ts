"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";

import {
  SEARCH_INITIAL_PAGE,
  SEARCH_PAGE_SIZE,
} from "../constants";
import { searchService } from "./search.service";

export function useSearchClassroomsQuery(q: string) {
  const term = q.trim();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.search.list(term, SEARCH_PAGE_SIZE),
    queryFn: ({ pageParam, signal }) =>
      searchService.search({
        q: term,
        page: pageParam,
        per_page: SEARCH_PAGE_SIZE,
        signal,
      }),
    initialPageParam: SEARCH_INITIAL_PAGE,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.lastPage
        ? lastPage.currentPage + 1
        : undefined,
    enabled: term.length > 0,
    staleTime: 60 * 1000,
  });
}
