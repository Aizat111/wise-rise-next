"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { ProfileAvatar, UserProfile } from "@/core/types/profile.types";
import { hasAccessToken } from "@/core/lib/token";

import { profileService } from "./profile.service";

export function useProfilesQuery(enabled = true) {
  return useQuery<UserProfile[]>({
    queryKey: QUERY_KEYS.profile.all,
    queryFn: () => profileService.list(),
    enabled: enabled && typeof window !== "undefined" && hasAccessToken(),
    staleTime: 30 * 1000,
  });
}

export function useAvatarsQuery(enabled = true) {
  return useQuery<ProfileAvatar[]>({
    queryKey: QUERY_KEYS.avatar.all,
    queryFn: () => profileService.listAvatars(),
    enabled,
    staleTime: 10 * 60 * 1000,
  });
}
