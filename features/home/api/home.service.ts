import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type { HomeFeed, HomeFeedResponse } from "@/core/types/home.types";

import { normalizeHomeFeed } from "./home.utils";

export const homeService = {
  async getFeed(platform: string): Promise<HomeFeed> {
    const response = await clientRequest<HomeFeedResponse | HomeFeed>({
      url: ENDPOINTS.home.feed,
      method: "GET",
      params: { platform },
    });

    return normalizeHomeFeed(response);
  },
};
