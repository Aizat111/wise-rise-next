export interface ProfileAvatar {
  id: number;
  name: string;
  path: string;
  file: {
    path: string;
  };
}

export interface UserProfile {
  id: string | number;
  name: string;
  avatar_id?: number | null;
  avatar?: ProfileAvatar | null;
  is_child?: boolean;
  is_main: boolean;
  is_selected?: boolean;
  is_survey_completed?: boolean;
}

export interface CreateProfileRequest {
  name: string;
  avatar_id: number;
  timezone: string;
  language: string;
}

export interface UpdateProfileRequest {
  name: string;
  avatar_id: number;
  timezone?: string;
  language?: string;
}

export type ProfilesResponse = UserProfile[] | { data: UserProfile[] };

export type AvatarsResponse =
  | ProfileAvatar[]
  | {
      data: ProfileAvatar[];
      links?: unknown;
      meta?: unknown;
    };
