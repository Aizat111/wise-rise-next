import type { Hero, HeroesResponse } from "@/core/types/hero.types";

import type { DefaultHomeMode } from "../types";

/** API platform query value for each DefaultHome mode. */
const HERO_PLATFORM_BY_MODE: Record<DefaultHomeMode, string> = {
  all: "",
  "wise-rise": "wisenrise",
};

export function getHeroPlatformParam(mode: DefaultHomeMode): string {
  return HERO_PLATFORM_BY_MODE[mode];
}

export function normalizeHeroes(
  response: HeroesResponse | Hero[] | null | undefined,
): Hero[] {
  const list = Array.isArray(response)
    ? response
    : response && Array.isArray(response.data)
      ? response.data
      : [];

  return list
    .filter((hero) => hero.is_active && hero.show_on_homepage && hero.image_url)
    .sort((a, b) => a.order - b.order);
}
