"use client";

import { useProfilesQuery, useAvatarsQuery } from "../api/profile.queries";
import {
  useCreateProfileMutation,
  useDeleteProfileMutation,
  useSelectProfileMutation,
  useUpdateProfileMutation,
} from "../api/profile.mutations";

export function useProfiles() {
  const profilesQuery = useProfilesQuery();
  const avatarsQuery = useAvatarsQuery();
  const createProfile = useCreateProfileMutation();
  const updateProfile = useUpdateProfileMutation();
  const deleteProfile = useDeleteProfileMutation();
  const selectProfile = useSelectProfileMutation();

  return {
    profiles: profilesQuery.data ?? [],
    avatars: avatarsQuery.data ?? [],
    isLoadingProfiles: profilesQuery.isLoading,
    isLoadingAvatars: avatarsQuery.isLoading,
    isFetchingProfiles: profilesQuery.isFetching,
    profilesError: profilesQuery.error,
    avatarsError: avatarsQuery.error,
    refetchProfiles: profilesQuery.refetch,
    createProfile,
    updateProfile,
    deleteProfile,
    selectProfile,
  };
}
