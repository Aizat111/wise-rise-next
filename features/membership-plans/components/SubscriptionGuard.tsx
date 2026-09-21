"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter } from "@/core/i18n/navigation";
import { useIsClient } from "@/features/survey/hooks/useIsClient";
import { useAppSelector } from "@/store/hooks";

import { useSubscriptionStatusQuery } from "../api/membership.queries";
import {
  EXPIRED_TODAY_REDIRECT_MS,
  RENEWAL_ROUTE,
} from "../constants";
import { evaluateSubscription } from "../utils/evaluate-subscription";
import {
  isExpiredAccessAllowedPath,
  isRenewalPath,
} from "../utils/subscription-paths";
import {
  hasExpiredPrompted,
  hasWarningDismissed,
  markExpiredPrompted,
  markWarningDismissed,
} from "../utils/subscription-persistence";
import { SubscriptionWarningDialog } from "./SubscriptionWarningDialog";

export function SubscriptionGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useIsClient();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id == null ? null : String(user.id);
  const [warningEpoch, setWarningEpoch] = useState(0);

  const query = useSubscriptionStatusQuery(mounted && isAuthenticated && Boolean(userId));
  const evaluation = evaluateSubscription(query.data);
  const onAllowedPath = isExpiredAccessAllowedPath(pathname);

  const showExpiredTodayPopup =
    warningEpoch >= 0 &&
    Boolean(mounted && isAuthenticated && userId) &&
    evaluation.state === "expired" &&
    evaluation.remainingDays === 0 &&
    !onAllowedPath &&
    Boolean(userId && !hasExpiredPrompted(userId));

  const showExpiringPopup =
    Boolean(mounted && isAuthenticated && userId) &&
    evaluation.state === "expiring" &&
    !isRenewalPath(pathname) &&
    Boolean(userId && !hasWarningDismissed(userId));

  useEffect(() => {
    if (!mounted || !isAuthenticated || !userId) return;
    if (evaluation.state !== "expired") return;
    if (onAllowedPath) return;

    if (evaluation.remainingDays === 0 && !hasExpiredPrompted(userId)) {
      const timer = window.setTimeout(() => {
        markExpiredPrompted(userId);
        router.replace(RENEWAL_ROUTE);
      }, EXPIRED_TODAY_REDIRECT_MS);
      return () => window.clearTimeout(timer);
    }

    router.replace(RENEWAL_ROUTE);
  }, [
    evaluation.remainingDays,
    evaluation.state,
    isAuthenticated,
    mounted,
    onAllowedPath,
    router,
    userId,
  ]);

  if (!mounted) return null;

  return (
    <>
      <SubscriptionWarningDialog
        open={showExpiringPopup}
        variant="expiring"
        remainingDays={evaluation.remainingDays ?? 0}
        onDismiss={() => {
          if (userId) markWarningDismissed(userId);
          setWarningEpoch((value) => value + 1);
        }}
        onRenew={() => {
          if (userId) markWarningDismissed(userId);
          setWarningEpoch((value) => value + 1);
          router.push(RENEWAL_ROUTE);
        }}
      />
      <SubscriptionWarningDialog
        open={showExpiredTodayPopup}
        variant="expiredToday"
        onRenew={() => {
          if (userId) markExpiredPrompted(userId);
          setWarningEpoch((value) => value + 1);
          router.replace(RENEWAL_ROUTE);
        }}
      />
    </>
  );
}
