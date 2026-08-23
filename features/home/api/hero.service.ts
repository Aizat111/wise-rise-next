import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type { Hero, HeroesResponse } from "@/core/types/hero.types";

import { normalizeHeroes, normalizeVideoHeroes } from "./hero.utils";

export type ListHeroesParams = {
  platform?: string;
  mediaType?: "image" | "video";
};

export const heroService = {
  async list({
    platform = "",
    mediaType = "image",
  }: ListHeroesParams = {}): Promise<Hero[]> {
    const response = await clientRequest<HeroesResponse | Hero[]>({
      url: ENDPOINTS.hero.list,
      method: "GET",
      params: {
        media_type: mediaType,
        platform,
      },
    });

    return mediaType === "video"
      ? normalizeVideoHeroes(response)
      : normalizeHeroes(response);
  },
};
