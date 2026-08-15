"use client";

import { useEffect, useState } from "react";

import { useRouter } from "@/core/i18n/navigation";
import { PROFILE_SELECT_HREF } from "@/features/likes";
import { useAppSelector } from "@/store/hooks";

import {
  FOLLOWING_LOGIN_HREF,
  FOLLOWING_SECTIONS_CLASS,
} from "../constants";
import type { FollowingContentProps } from "../types";
import { FollowedClassroomsSection } from "./FollowedClassroomsSection";
import { FollowedTeachersSection } from "./FollowedTeachersSection";
import { FollowingFallback } from "./FollowingFallback";

export function FollowingContent({
  classroomsTitle,
  teachersTitle,
  loadingLabel,
}: FollowingContentProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const activeProfile = useAppSelector((state) => state.profile.activeProfile);
  const profileId = activeProfile?.id;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated) {
      router.replace(FOLLOWING_LOGIN_HREF);
      return;
    }

    if (profileId == null) {
      router.replace(PROFILE_SELECT_HREF);
    }
  }, [isAuthenticated, mounted, profileId, router]);

  if (!mounted || !isAuthenticated || profileId == null) {
    return (
      <FollowingFallback
        classroomsTitle={classroomsTitle}
        teachersTitle={teachersTitle}
        loadingLabel={loadingLabel}
      />
    );
  }

  return (
    <div className={FOLLOWING_SECTIONS_CLASS}>
      <FollowedClassroomsSection profileId={profileId} />
      <FollowedTeachersSection profileId={profileId} />
    </div>
  );
}
