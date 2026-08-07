"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { QUERY_KEYS } from "@/core/api/query-keys";
import { notify } from "@/shared/components/notify/store/notify.store";

import { favoriteService } from "./favorite.service";

export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();
  const tHome = useTranslations("homepage");
  const tCategories = useTranslations("categories");

  return useMutation({
    mutationFn: (classroomId: string | number) =>
      favoriteService.add(classroomId),
    onSuccess: () => {
      notify.success(tHome("addedToFavorites"));
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.course.all });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorite.all });
    },
    onError: () => {
      notify.error(tCategories("favoriteError"));
    },
  });
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();
  const tHome = useTranslations("homepage");
  const tCategories = useTranslations("categories");

  return useMutation({
    mutationFn: async ({
      classroomId,
      nextFavorite,
    }: {
      classroomId: string | number;
      nextFavorite: boolean;
    }) => {
      if (nextFavorite) {
        await favoriteService.add(classroomId);
        return { nextFavorite: true as const };
      }
      await favoriteService.remove(classroomId);
      return { nextFavorite: false as const };
    },
    onSuccess: (result) => {
      notify.success(
        result.nextFavorite
          ? tHome("addedToFavorites")
          : tHome("removedFromFavorites"),
      );
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.course.all });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorite.all });
    },
    onError: () => {
      notify.error(tCategories("favoriteError"));
    },
  });
}
