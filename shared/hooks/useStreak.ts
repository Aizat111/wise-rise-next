'use client';

import { useEffect, useState } from 'react';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphQLSubscription, useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import type { RootState } from '@/core/redux-toolkit/store';
import type {
  Streak,
  StreakConfig,
  StreakProgressSubscriptionResponse,
  UserStreakResponse
} from '@/core/types/streaks.types';

// ---------------------------------------------------------------------------
// useStreak — query + live subscription. Mirrors usePromotions.ts:
// the query seeds the initial render, then `streakProgress` pushes the
// full Streak object any time today's wager crosses a step. Local state
// is replaced wholesale per push (backend returns the complete shape).
//
// `streakConfig` is fetched in the same request and treated as static for
// the session — the subscription only carries the user's Streak. Config
// updates are rare (product tuning) and pick up on the next page load.
// ---------------------------------------------------------------------------

export interface UseStreakResult {
  streak: Streak | null;
  streakConfig: StreakConfig | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}

export const useStreak = (): UseStreakResult => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.user);

  const queryResult = useGraphWsFetcher<UserStreakResponse>(GRAPHQL_TYPES.USER_STREAK_QUERY).render(undefined, {
    enabled: isAuthenticated
  });

  const [liveStreak, setLiveStreak] = useState<Streak | null>(null);

  // Hydrate from the initial query response.
  useEffect(() => {
    if (queryResult.data?.userStreak) {
      setLiveStreak(queryResult.data.userStreak);
    }
  }, [queryResult.data]);

  // Subscribe to live progress. Backend filters per-viewer via ctx.user.sub.
  useGraphQLSubscription<StreakProgressSubscriptionResponse>(
    GRAPHQL_TYPES.STREAK_PROGRESS_SUBSCRIPTION,
    {},
    {
      next: data => {
        if (data?.streakProgress) {
          setLiveStreak(data.streakProgress);
        }
      }
    },
    [isAuthenticated]
  );

  return {
    streak: liveStreak,
    streakConfig: queryResult.data?.streakConfig ?? null,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    isAuthenticated
  };
};
