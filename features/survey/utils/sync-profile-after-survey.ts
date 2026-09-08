import { QUERY_KEYS } from "@/core/api/query-keys";
import type { UserProfile } from "@/core/types/profile.types";
import {
  profileService,
  tryUnwrapProfile,
} from "@/features/profile/api/profile.service";
import type { QueryClient } from "@tanstack/react-query";

export function mergeSurveyStatus(
  storeValue: boolean | null | undefined,
  remoteValue: boolean | null | undefined,
) {
  if (storeValue === true || remoteValue === true) return true;
  if (storeValue === false || remoteValue === false) return false;
  return remoteValue ?? storeValue;
}

export async function resolveProfileAfterSurvey(
  response: unknown,
  profileId: string | number,
  fallback: UserProfile,
): Promise<UserProfile> {
  const fromResponse = tryUnwrapProfile(response);
  if (fromResponse && String(fromResponse.id) === String(profileId)) {
    return { ...fallback, ...fromResponse, is_survey: true };
  }

  try {
    const fresh = await profileService.get(profileId);
    return { ...fallback, ...fresh, is_survey: true };
  } catch {
    // Fall through to the profiles list.
  }

  try {
    const list = await profileService.list();
    const found = list.find((profile) => String(profile.id) === String(profileId));
    if (found) {
      return { ...fallback, ...found, is_survey: true };
    }
  } catch {
    // Fall through to the local contract update.
  }

  return { ...fallback, is_survey: true };
}

export function syncCompletedProfileQueries(
  queryClient: QueryClient,
  profile: UserProfile,
) {
  queryClient.setQueryData<UserProfile[]>(QUERY_KEYS.profile.all, (current) => {
    if (!current) return current;
    return current.map((item) =>
      String(item.id) === String(profile.id)
        ? { ...item, ...profile, is_survey: true }
        : item,
    );
  });
  queryClient.setQueryData<UserProfile>(
    QUERY_KEYS.profile.detail(profile.id),
    (current) =>
      current
        ? { ...current, ...profile, is_survey: true }
        : { ...profile, is_survey: true },
  );
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.all });
}
