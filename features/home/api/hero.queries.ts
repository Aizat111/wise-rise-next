"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { Hero } from "@/core/types/hero.types";

import { heroService } from "./hero.service";

export function useHeroesQuery(
  platform = "",
  mediaType: "image" | "video" = "image",
  enabled = true,
) {
  return useQuery<Hero[]>({
    queryKey: QUERY_KEYS.hero.list(platform),
    queryFn: () => heroService.list({ platform, mediaType }),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
