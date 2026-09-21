"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { HomeFeed } from "@/core/types/home.types";

import { homeService } from "./home.service";

type HomeFeedQueryOptions = Pick<
  UseQueryOptions<HomeFeed>,
  "enabled" | "refetchOnMount"
>;

export function useHomeFeedQuery(
  platform: string,
  options: HomeFeedQueryOptions = {},
) {
  const { enabled = true, refetchOnMount } = options;

  return useQuery<HomeFeed>({
    queryKey: QUERY_KEYS.home.feed(platform),
    queryFn: () => homeService.getFeed(platform),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnMount,
  });
}
