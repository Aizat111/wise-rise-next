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

function unwrapHeroes(
  response: HeroesResponse | Hero[] | null | undefined,
): Hero[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  return [];
}

export function normalizeHeroes(
  response: HeroesResponse | Hero[] | null | undefined,
): Hero[] {
  return unwrapHeroes(response)
    .filter((hero) => hero.is_active && hero.show_on_homepage && hero.image_url)
    .sort((a, b) => a.order - b.order);
}

/** Active heroes that have a playable `video_url`, in API response order. */
export function normalizeVideoHeroes(
  response: HeroesResponse | Hero[] | null | undefined,
): Hero[] {
  return unwrapHeroes(response).filter(
    (hero) => hero.is_active === true && Boolean(hero.video_url?.trim()),
  );
}

export function pickFirstPlayableVideo(heroes: Hero[]): Hero | null {
  return heroes[0] ?? null;
}
