"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "@/core/i18n/navigation";
import { GOAL_SELECTION_HREF } from "@/features/profile/constants";
import { evaluateSubscription } from "@/features/membership-plans/utils/evaluate-subscription";
import { useSubscriptionStatusQuery } from "@/features/membership-plans/api/membership.queries";
import { useAppSelector } from "@/store/hooks";

import { isSurveyGuardExcludedPath } from "../constants";
import { useIsClient } from "../hooks/useIsClient";

export function SurveyGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useIsClient();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const activeProfile = useAppSelector((state) => state.profile.activeProfile);
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id == null ? null : String(user.id);
  const subscriptionQuery = useSubscriptionStatusQuery(
    mounted && isAuthenticated && Boolean(userId),
  );
  const subscription = evaluateSubscription(subscriptionQuery.data);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) return;
    if (!activeProfile) return;
    if (subscription.state === "expired") return;
    if (isSurveyGuardExcludedPath(pathname)) return;
    if (activeProfile.is_survey === false) {
      router.replace(GOAL_SELECTION_HREF);
    }
  }, [
    activeProfile,
    isAuthenticated,
    mounted,
    pathname,
    router,
    subscription.state,
  ]);

  return null;
}
