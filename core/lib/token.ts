import {
  ACCESS_TOKEN_KEY,
  ACTIVE_PROFILE_KEY,
  USER_KEY,
} from "@/core/constants/auth.constants";
import type { ILoginResponse } from "@/core/types/auth.types";
import type { UserProfile } from "@/core/types/profile.types";
import storage from "@/shared/utils/storage";

export type StoredAuthUser = {
  id: string | number;
  email?: string;
  name?: string;
  [key: string]: unknown;
};

function readJson<T>(key: string): T | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (!storage) return;
  storage.setItem(key, JSON.stringify(value));
}

export function getAccessToken(): string | null {
  if (!storage) return null;
  return storage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  storage?.setItem(ACCESS_TOKEN_KEY, token);
}

export function getStoredUser<T = StoredAuthUser>(): T | null {
  return readJson<T>(USER_KEY);
}

export function setStoredUser(user: StoredAuthUser | null) {
  if (!storage) return;
  if (!user) {
    storage.removeItem(USER_KEY);
    return;
  }
  writeJson(USER_KEY, user);
}

export function getSelectedProfile(): UserProfile | null {
  return readJson<UserProfile>(ACTIVE_PROFILE_KEY);
}

export function setSelectedProfile(profile: UserProfile | null) {
  if (!storage) return;
  if (!profile) {
    storage.removeItem(ACTIVE_PROFILE_KEY);
    return;
  }
  writeJson(ACTIVE_PROFILE_KEY, profile);
}

export function persistAuthSession(
  tokens: Pick<ILoginResponse, "token"> & {
    user?: StoredAuthUser | null;
  },
) {
  if (tokens.token) setAccessToken(tokens.token);
  if (tokens.user) setStoredUser(tokens.user);
}

export function clearAuthSession() {
  if (!storage) return;
  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(USER_KEY);
  storage.removeItem(ACTIVE_PROFILE_KEY);
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken());
}
