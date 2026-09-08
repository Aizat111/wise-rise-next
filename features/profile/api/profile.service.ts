import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  AvatarsResponse,
  CreateProfileRequest,
  ProfilesResponse,
  ProfileAvatar,
  UpdateProfileRequest,
  UserProfile,
} from "@/core/types/profile.types";

function normalizeProfiles(response: ProfilesResponse): UserProfile[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  return [];
}

function normalizeAvatars(response: AvatarsResponse): ProfileAvatar[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  return [];
}

function unwrapProfile(
  response: UserProfile | { data: UserProfile } | null | undefined,
): UserProfile {
  const profile = tryUnwrapProfile(response);
  if (!profile) {
    throw new Error("Invalid profile response");
  }
  return profile;
}

function looksLikeProfile(
  value: Record<string, unknown>,
): value is UserProfile & Record<string, unknown> {
  if (value.id == null) return false;
  return (
    typeof value.name === "string" ||
    typeof value.is_main === "boolean" ||
    "is_survey_completed" in value ||
    "avatar_id" in value
  );
}

export function tryUnwrapProfile(value: unknown): UserProfile | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;

  if (looksLikeProfile(record)) {
    return record;
  }

  if (record.data) {
    const nested = tryUnwrapProfile(record.data);
    if (nested) return nested;
  }

  if (record.profile) {
    const nested = tryUnwrapProfile(record.profile);
    if (nested) return nested;
  }

  return null;
}

export const profileService = {
  async list(): Promise<UserProfile[]> {
    const response = await clientRequest<ProfilesResponse>({
      url: ENDPOINTS.profile.list,
      method: "GET",
    });
    return normalizeProfiles(response);
  },

  async get(id: string | number): Promise<UserProfile> {
    const response = await clientRequest<UserProfile | { data: UserProfile }>({
      url: ENDPOINTS.profile.detail(id),
      method: "GET",
    });
    return unwrapProfile(response);
  },

  async create(data: CreateProfileRequest): Promise<UserProfile> {
    const response = await clientRequest<UserProfile | { data: UserProfile }>({
      url: ENDPOINTS.profile.list,
      method: "POST",
      data,
    });
    return unwrapProfile(response);
  },

  async update(
    id: string | number,
    data: UpdateProfileRequest,
  ): Promise<UserProfile> {
    const response = await clientRequest<UserProfile | { data: UserProfile }>({
      url: ENDPOINTS.profile.detail(id),
      method: "PUT",
      data,
    });
    return unwrapProfile(response);
  },

  async remove(id: string | number): Promise<void> {
    await clientRequest({
      url: ENDPOINTS.profile.detail(id),
      method: "DELETE",
    });
  },

  async select(id: string | number): Promise<UserProfile | null> {
    const response = await clientRequest<
      UserProfile | { data: UserProfile } | { success?: boolean } | null
    >({
      url: ENDPOINTS.profile.select(id),
      method: "PUT",
    });

    try {
      return unwrapProfile(response as UserProfile | { data: UserProfile });
    } catch {
      return null;
    }
  },

  async listAvatars(): Promise<ProfileAvatar[]> {
    const response = await clientRequest<AvatarsResponse>({
      url: ENDPOINTS.avatar.list,
      method: "GET",
    });
    return normalizeAvatars(response);
  },
};
