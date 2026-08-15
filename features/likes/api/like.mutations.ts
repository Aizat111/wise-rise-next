"use client";

import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { QUERY_KEYS } from "@/core/api/query-keys";
import { notify } from "@/shared/components/notify/store/notify.store";

import type { ToggleLikeResult, ToggleLikeVariables } from "../types";
import { likeService } from "./like.service";

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
    onSuccess: (result) => {
      notify.success(
        result.nextLiked ? t("classroomAdded") : t("classroomRemoved"),
      );
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
    onSuccess: (result) => {
      notify.success(
        result.nextLiked ? t("teacherAdded") : t("teacherRemoved"),
      );
      invalidateTeacherLikeQueries(queryClient);
    },
    onError: () => {
      notify.error(t("error"));
    },
  });
}
