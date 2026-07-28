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
  if (!response || typeof response !== "object") {
    throw new Error("Invalid profile response");
  }

  if (
    "data" in response &&
    response.data &&
    typeof response.data === "object" &&
    "id" in response.data
  ) {
    return response.data;
  }

  if ("id" in response) {
    return response as UserProfile;
  }

  throw new Error("Invalid profile response");
}

export const profileService = {
  async list(): Promise<UserProfile[]> {
    const response = await clientRequest<ProfilesResponse>({
      url: ENDPOINTS.profile.list,
      method: "GET",
    });
    return normalizeProfiles(response);
  },

  async create(data: CreateProfileRequest): Promise<UserProfile> {
    const response = await clientRequest<
      UserProfile | { data: UserProfile }
    >({
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
    const response = await clientRequest<
      UserProfile | { data: UserProfile }
    >({
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
