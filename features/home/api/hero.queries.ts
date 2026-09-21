"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { Hero } from "@/core/types/hero.types";

import { heroService } from "./hero.service";

type HeroesQueryOptions = Pick<
  UseQueryOptions<Hero[]>,
  "enabled" | "refetchOnMount"
>;

export function useHeroesQuery(
  platform = "",
  mediaType: "image" | "video" = "image",
  options: HeroesQueryOptions = {},
) {
  const { enabled = true, refetchOnMount } = options;

  return useQuery<Hero[]>({
    queryKey: QUERY_KEYS.hero.list(platform, mediaType),
    queryFn: () => heroService.list({ platform, mediaType }),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnMount,
  });
}
