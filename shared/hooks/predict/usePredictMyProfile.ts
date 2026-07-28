'use client';

import { useMemo } from 'react';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { PREDICT_TOURNAMENT_ID } from '@/screens/predict/predict.config';
import {
  type Predict6Profile,
  type PredictStatItem,
  type PredictUserProfile,
  buildPredictProfileStats,
  mapPredictProfile
} from '@/screens/predict/predict.data';

export const usePredictMyProfile = () => {
  const { isAuthenticated } = useAppSelector(state => state.user);

  const myProfileQuery = useGraphWsFetcher<{ predict6MyProfile: Predict6Profile }>(
    GRAPHQL_TYPES.PREDICT6_MY_PROFILE_QUERY
  ).render({ tournamentId: PREDICT_TOURNAMENT_ID }, { enabled: Boolean(isAuthenticated && PREDICT_TOURNAMENT_ID) });

  const rawProfile = myProfileQuery.data?.predict6MyProfile;

  const profile = useMemo<PredictUserProfile>(() => mapPredictProfile(rawProfile), [rawProfile]);
  const stats = useMemo<PredictStatItem[]>(() => buildPredictProfileStats(rawProfile), [rawProfile]);

  return {
    profile,
    accuracy: rawProfile?.accuracy_pct ?? 0,
    stats,
    isLoading: myProfileQuery.isLoading
  };
};
