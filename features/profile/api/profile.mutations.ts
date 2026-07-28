"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import { setSelectedProfile } from "@/core/lib/token";
import type {
  CreateProfileRequest,
  UpdateProfileRequest,
  UserProfile,
} from "@/core/types/profile.types";

import { profileService } from "./profile.service";

export function useCreateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, CreateProfileRequest>({
    mutationFn: (data) => profileService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.all });
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    UserProfile,
    Error,
    { id: string | number; data: UpdateProfileRequest }
  >({
    mutationFn: ({ id, data }) => profileService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.all });
    },
  });
}

export function useDeleteProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string | number>({
    mutationFn: (id) => profileService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.all });
    },
  });
}

export function useSelectProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    UserProfile | null,
    Error,
    { id: string | number; profile?: UserProfile }
  >({
    mutationFn: async ({ id, profile }) => {
      const selected = await profileService.select(id);
      const next = selected ?? profile ?? null;
      if (next) setSelectedProfile(next);
      return next;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.all });
    },
  });
}
