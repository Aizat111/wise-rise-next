"use client";

import { useEffect, useState } from "react";

import { useRouter } from "@/core/i18n/navigation";
import { PROFILE_SELECT_HREF } from "@/features/likes";
import { useAppSelector } from "@/store/hooks";

import {
  ACTIVITIES_LOGIN_HREF,
  ACTIVITIES_SECTIONS_CLASS,
} from "../constants";
import type { ActivitiesContentProps } from "../types";
import { ActivitiesFallback } from "./ActivitiesFallback";
import { AssignedSection } from "./AssignedSection";
import { CertificatesSection } from "./CertificatesSection";
import { LikedTeachersSection } from "./LikedTeachersSection";
import { NotesSection } from "./NotesSection";
import { WatchedSection } from "./WatchedSection";
import { WatchingSection } from "./WatchingSection";

export function ActivitiesContent({
  watchingTitle,
  watchedTitle,
  assignedTitle,
  notesTitle,
  teachersTitle,
  certificatesTitle,
  loadingLabel,
}: ActivitiesContentProps) {
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
      router.replace(ACTIVITIES_LOGIN_HREF);
      return;
    }

    if (profileId == null) {
      router.replace(PROFILE_SELECT_HREF);
    }
  }, [isAuthenticated, mounted, profileId, router]);

  if (!mounted || !isAuthenticated || profileId == null) {
    return (
      <ActivitiesFallback
        watchingTitle={watchingTitle}
        watchedTitle={watchedTitle}
        assignedTitle={assignedTitle}
        notesTitle={notesTitle}
        teachersTitle={teachersTitle}
        certificatesTitle={certificatesTitle}
        loadingLabel={loadingLabel}
      />
    );
  }

  return (
    <div className={ACTIVITIES_SECTIONS_CLASS}>
      <WatchingSection profileId={profileId} />
      <WatchedSection profileId={profileId} />
      <AssignedSection profileId={profileId} />
      <NotesSection profileId={profileId} />
      <LikedTeachersSection profileId={profileId} />
      <CertificatesSection profileId={profileId} />
    </div>
  );
}
