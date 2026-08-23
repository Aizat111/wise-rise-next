"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { HomeFeed } from "@/core/types/home.types";

import { homeService } from "./home.service";

export function useHomeFeedQuery(platform: string, enabled = true) {
  return useQuery<HomeFeed>({
    queryKey: QUERY_KEYS.home.feed(platform),
    queryFn: () => homeService.getFeed(platform),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
