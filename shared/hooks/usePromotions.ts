'use client';

import { useEffect, useMemo, useState } from 'react';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphQLSubscription, useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import type { RootState } from '@/core/redux-toolkit/store';
import type { PromoBalance, UserPromotion, UserPromotionFilter } from '@/core/types/promotions.types';

// ---------------------------------------------------------------------------
// useMyPromotions — query + live subscription. The query seeds the list,
// the subscription pushes a fresh UserPromotion any time progress / status
// changes. Merge strategy: replace the row by id.
// ---------------------------------------------------------------------------

export const useMyPromotions = (status: UserPromotionFilter = 'all') => {
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.user);

  const queryResult = useGraphWsFetcher<{ myPromotions: UserPromotion[] }>(GRAPHQL_TYPES.MY_PROMOTIONS_QUERY).render(
    { status },
    { enabled: isAuthenticated }
  );

  const [livePromotions, setLivePromotions] = useState<UserPromotion[]>([]);

  // Hydrate the live list from the initial query response.
  useEffect(() => {
    if (queryResult.data?.myPromotions) {
      setLivePromotions(queryResult.data.myPromotions);
    }
  }, [queryResult.data]);

  // Subscribe to per-row updates. The backend filters per-viewer using ctx.user.sub
  // so passing the userId is informational; we still gate on auth.
  useGraphQLSubscription<{ promoProgress: UserPromotion }>(
    GRAPHQL_TYPES.PROMO_PROGRESS_SUBSCRIPTION,
    { userId: user?.id || '' },
    {
      next: data => {
        const incoming = data?.promoProgress;
        if (!incoming) return;
        setLivePromotions(prev => {
          const idx = prev.findIndex(p => p.id === incoming.id);
          if (idx === -1) return [incoming, ...prev];
          const next = prev.slice();
          next[idx] = incoming;
          return next;
        });
      }
    },
    [user?.id, isAuthenticated]
  );

  return {
    promotions: livePromotions,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch
  };
};

// ---------------------------------------------------------------------------
// usePromoBalance — header chip total. Same shape: query + subscription.
// ---------------------------------------------------------------------------

export const usePromoBalance = () => {
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.user);

  const queryResult = useGraphWsFetcher<{ promoBalance: PromoBalance }>(GRAPHQL_TYPES.PROMO_BALANCE_QUERY).render(
    undefined,
    { enabled: isAuthenticated }
  );

  const [liveBalance, setLiveBalance] = useState<PromoBalance | null>(null);

  useEffect(() => {
    if (queryResult.data?.promoBalance) {
      setLiveBalance(queryResult.data.promoBalance);
    }
  }, [queryResult.data]);

  useGraphQLSubscription<{ promoBalance: PromoBalance }>(
    GRAPHQL_TYPES.PROMO_BALANCE_SUBSCRIPTION,
    { userId: user?.id || '' },
    {
      next: data => {
        if (data?.promoBalance) setLiveBalance(data.promoBalance);
      }
    },
    [user?.id, isAuthenticated]
  );

  const balance = useMemo<PromoBalance>(
    () => liveBalance || { total: 0, claimableTotal: 0, lockedTotal: 0, activeCount: 0, unlockedCount: 0 },
    [liveBalance]
  );

  return {
    balance,
    isLoading: queryResult.isLoading,
    error: queryResult.error
  };
};
