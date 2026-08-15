"use client";

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { ClassroomsListResult } from "@/core/types/classroom.types";
import type { TeachersListResult } from "@/core/types/teacher.types";
import { notify } from "@/shared/components/notify/store/notify.store";

import type { ToggleLikeResult, ToggleLikeVariables } from "../types";
import { likeService } from "./like.service";

function removeEntityFromInfinitePages<
  TPage extends { items: Array<{ id: string | number }> },
>(
  current: InfiniteData<TPage> | undefined,
  entityId: string | number,
): InfiniteData<TPage> | undefined {
  if (!current) return current;

  const id = String(entityId);

  return {
    ...current,
    pages: current.pages.map((page) => ({
      ...page,
      items: page.items.filter((item) => String(item.id) !== id),
    })),
  };
}

function invalidateClassroomLikeQueries(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.course.all });
  void queryClient.invalidateQueries({ queryKey: ["course"] });
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.like.classrooms });
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorite.all });
}

function invalidateTeacherLikeQueries(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teacher.all });
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.like.teachers });
}

export function useLikeClassroomMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("likes");

  return useMutation<ToggleLikeResult, Error, ToggleLikeVariables>({
    mutationFn: async ({ profileId, entityId, nextLiked }) => {
      if (nextLiked) {
        await likeService.likeClassroom(profileId, entityId);
      } else {
        await likeService.unlikeClassroom(profileId, entityId);
      }
      return { nextLiked };
    },
    onSuccess: (result, variables) => {
      notify.success(
        result.nextLiked ? t("classroomAdded") : t("classroomRemoved"),
      );

      if (!result.nextLiked) {
        queryClient.setQueriesData<InfiniteData<ClassroomsListResult>>(
          { queryKey: QUERY_KEYS.like.classrooms },
          (current) => removeEntityFromInfinitePages(current, variables.entityId),
        );
      }

      invalidateClassroomLikeQueries(queryClient);
    },
    onError: () => {
      notify.error(t("error"));
    },
  });
}

export function useLikeTeacherMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("likes");

  return useMutation<ToggleLikeResult, Error, ToggleLikeVariables>({
    mutationFn: async ({ profileId, entityId, nextLiked }) => {
      if (nextLiked) {
        await likeService.likeTeacher(profileId, entityId);
      } else {
        await likeService.unlikeTeacher(profileId, entityId);
      }
      return { nextLiked };
    },
    onSuccess: (result, variables) => {
      notify.success(
        result.nextLiked ? t("teacherAdded") : t("teacherRemoved"),
      );

      if (!result.nextLiked) {
        queryClient.setQueriesData<InfiniteData<TeachersListResult>>(
          { queryKey: QUERY_KEYS.like.teachers },
          (current) => removeEntityFromInfinitePages(current, variables.entityId),
        );
      }

      invalidateTeacherLikeQueries(queryClient);
    },
    onError: () => {
      notify.error(t("error"));
    },
  });
}
