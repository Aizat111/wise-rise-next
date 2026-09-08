"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "@/core/i18n/navigation";
import { GOAL_SELECTION_HREF } from "@/features/profile/constants";
import { useAppSelector } from "@/store/hooks";

import { isSurveyGuardExcludedPath } from "../constants";
import { useIsClient } from "../hooks/useIsClient";

export function SurveyGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useIsClient();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const activeProfile = useAppSelector((state) => state.profile.activeProfile);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) return;
    if (!activeProfile) return;
    if (isSurveyGuardExcludedPath(pathname)) return;
    if (activeProfile.is_survey === false) {
      router.replace(GOAL_SELECTION_HREF);
    }
  }, [activeProfile, isAuthenticated, mounted, pathname, router]);

  return null;
}
