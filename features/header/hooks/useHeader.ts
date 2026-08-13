"use client";

import { useEffect, useState } from "react";

import { useMeQuery } from "@/features/auth/api/auth.queries";
import { useAppSelector } from "@/store/hooks";

export function useHeader() {
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const storedUser = useAppSelector((state) => state.auth.user);
  const activeProfile = useAppSelector((state) => state.profile.activeProfile);

  const { data: me, isLoading: isMeLoading } = useMeQuery(
    mounted && isAuthenticated,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const profileName =
    activeProfile?.name ??
    me?.username ??
    (typeof me?.full_name === "string" ? me.full_name : null) ??
    storedUser?.name ??
    storedUser?.email ??
    "";

  const email = me?.email ?? storedUser?.email ?? "";

  const avatarUrl =
    activeProfile?.avatar?.path ?? (me?.profile_img ? me.profile_img : null);

  return {
    mounted,
    isAuthenticated: mounted && isAuthenticated,
    isAuthLoading:
      mounted &&
      isAuthenticated &&
      isMeLoading &&
      !storedUser &&
      !activeProfile,
    profileName: String(profileName),
    email: String(email),
    avatarUrl,
    activeProfile,
    user: me ?? storedUser,
  };
}
