"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { Classroom } from "@/core/types/classroom.types";
import type {
  ProfileVideoWatch,
  ReportVideoWatchProgressVariables,
} from "@/core/types/video-watch.types";

import { patchClassroomVideoWatchDuration } from "./course.utils";
import { watchProgressService } from "./watch-progress.service";
import { upsertProfileVideoWatch } from "../utils/videoWatchProgress";

export function useReportVideoWatchProgressMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ReportVideoWatchProgressVariables>({
    mutationFn: ({ profileId, videoId, duration }) =>
      watchProgressService.report(profileId, videoId, duration),
    onSuccess: (_data, { profileId, videoId, duration, courseSlug }) => {
      const classroom = courseSlug
        ? queryClient.getQueryData<Classroom>(
            QUERY_KEYS.course.detail(courseSlug),
          )
        : undefined;
      const totalDuration = classroom?.videos?.find(
        (video) => String(video.id) === String(videoId),
      )?.duration;

      if (courseSlug) {
        queryClient.setQueryData<Classroom>(
          QUERY_KEYS.course.detail(courseSlug),
          (current) =>
            patchClassroomVideoWatchDuration(current, videoId, duration),
        );
      }

      queryClient.setQueryData<ProfileVideoWatch[]>(
        QUERY_KEYS.profile.videos(profileId),
        (current) =>
          upsertProfileVideoWatch(current, videoId, duration, totalDuration),
      );
    },
  });
}
