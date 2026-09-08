import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  ProfileVideoWatch,
  ReportVideoWatchProgressRequest,
} from "@/core/types/video-watch.types";

import { normalizeProfileVideoWatches } from "../utils/videoWatchProgress";

export const watchProgressService = {
  async report(
    profileId: string | number,
    videoId: string | number,
    duration: string,
  ): Promise<void> {
    const data: ReportVideoWatchProgressRequest = { duration };

    await clientRequest({
      url: ENDPOINTS.profile.video(profileId, videoId),
      method: "PUT",
      data,
    });
  },

  async list(
    profileId: string | number,
    signal?: AbortSignal,
  ): Promise<ProfileVideoWatch[]> {
    try {
      const response = await clientRequest<unknown>({
        url: ENDPOINTS.profile.videos(profileId),
        method: "GET",
        signal,
      });

      return normalizeProfileVideoWatches(response);
    } catch {
      return [];
    }
  },
};
