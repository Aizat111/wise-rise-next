'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { usePredictCurrentRound } from './usePredictCurrentRound';
import { usePredictMyProfile } from './usePredictMyProfile';
import { GRAPHQL_CLIENT_CONFIG, GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { fetchGraphQL, useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { PREDICT_TOURNAMENT_ID } from '@/screens/predict/predict.config';
import {
  type Predict6LeaderboardEntry,
  type PredictLeaderboardEntry,
  mapPredictLeaderboardEntry
} from '@/screens/predict/predict.data';

const LEADERBOARD_PAGE_SIZE = 10;

const leaderboardQuery = GRAPHQL_CLIENT_CONFIG.find(c => c.TYPE === GRAPHQL_TYPES.PREDICT6_LEADERBOARD_QUERY)?.QUERY;

const fetchLeaderboardPage = async (variables: {
  tournamentId: string;
  period: string;
  roundNo?: number;
  limit: number;
  offset: number;
}) => {
  if (!leaderboardQuery) return [];

  const data = await fetchGraphQL<{ predict6Leaderboard: Predict6LeaderboardEntry[] }>(leaderboardQuery, variables);
  return (data?.predict6Leaderboard ?? []).map(mapPredictLeaderboardEntry);
};

export const usePredictLeaderboard = (selectedRoundNo?: number) => {
  const { roundNo: currentRoundNo } = usePredictCurrentRound();
  const { profile } = usePredictMyProfile();
  const roundNo = selectedRoundNo ?? currentRoundNo;

  const [roundEntries, setRoundEntries] = useState<PredictLeaderboardEntry[]>([]);
  const [overallEntries, setOverallEntries] = useState<PredictLeaderboardEntry[]>([]);
  const [roundHasMore, setRoundHasMore] = useState(false);
  const [overallHasMore, setOverallHasMore] = useState(false);
  const [isRoundLoadingMore, setIsRoundLoadingMore] = useState(false);
  const [isOverallLoadingMore, setIsOverallLoadingMore] = useState(false);

  const roundOffsetRef = useRef(0);
  const overallOffsetRef = useRef(0);

  const roundLeaderboardQuery = useGraphWsFetcher<{ predict6Leaderboard: Predict6LeaderboardEntry[] }>(
    GRAPHQL_TYPES.PREDICT6_LEADERBOARD_QUERY
  ).render(
    roundNo
      ? {
          tournamentId: PREDICT_TOURNAMENT_ID,
          period: 'ROUND',
          roundNo,
          limit: LEADERBOARD_PAGE_SIZE,
          offset: 0
        }
      : undefined,
    { enabled: Boolean(PREDICT_TOURNAMENT_ID && roundNo) }
  );

  const overallLeaderboardQuery = useGraphWsFetcher<{ predict6Leaderboard: Predict6LeaderboardEntry[] }>(
    GRAPHQL_TYPES.PREDICT6_LEADERBOARD_QUERY
  ).render(
    { tournamentId: PREDICT_TOURNAMENT_ID, period: 'OVERALL', limit: LEADERBOARD_PAGE_SIZE, offset: 0 },
    { enabled: Boolean(PREDICT_TOURNAMENT_ID) }
  );

  useEffect(() => {
    setRoundEntries([]);
    setRoundHasMore(false);
    roundOffsetRef.current = 0;
  }, [roundNo]);

  useEffect(() => {
    if (!roundLeaderboardQuery.data || roundLeaderboardQuery.isLoading) return;

    const mapped = (roundLeaderboardQuery.data.predict6Leaderboard ?? []).map(mapPredictLeaderboardEntry);
    setRoundEntries(mapped);
    setRoundHasMore(mapped.length >= LEADERBOARD_PAGE_SIZE);
    roundOffsetRef.current = mapped.length;
  }, [roundLeaderboardQuery.data, roundLeaderboardQuery.isLoading, roundNo]);

  useEffect(() => {
    if (!overallLeaderboardQuery.data || overallLeaderboardQuery.isLoading) return;

    const mapped = (overallLeaderboardQuery.data.predict6Leaderboard ?? []).map(mapPredictLeaderboardEntry);
    setOverallEntries(mapped);
    setOverallHasMore(mapped.length >= LEADERBOARD_PAGE_SIZE);
    overallOffsetRef.current = mapped.length;
  }, [overallLeaderboardQuery.data, overallLeaderboardQuery.isLoading]);

  const loadMoreRound = useCallback(async () => {
    if (!roundNo || isRoundLoadingMore || !roundHasMore) return;

    setIsRoundLoadingMore(true);
    try {
      const newEntries = await fetchLeaderboardPage({
        tournamentId: PREDICT_TOURNAMENT_ID,
        period: 'ROUND',
        roundNo,
        limit: LEADERBOARD_PAGE_SIZE,
        offset: roundOffsetRef.current
      });

      setRoundEntries(prev => [...prev, ...newEntries]);
      setRoundHasMore(newEntries.length >= LEADERBOARD_PAGE_SIZE);
      roundOffsetRef.current += newEntries.length;
    } finally {
      setIsRoundLoadingMore(false);
    }
  }, [roundNo, isRoundLoadingMore, roundHasMore]);

  const loadMoreOverall = useCallback(async () => {
    if (isOverallLoadingMore || !overallHasMore) return;

    setIsOverallLoadingMore(true);
    try {
      const newEntries = await fetchLeaderboardPage({
        tournamentId: PREDICT_TOURNAMENT_ID,
        period: 'OVERALL',
        limit: LEADERBOARD_PAGE_SIZE,
        offset: overallOffsetRef.current
      });

      setOverallEntries(prev => [...prev, ...newEntries]);
      setOverallHasMore(newEntries.length >= LEADERBOARD_PAGE_SIZE);
      overallOffsetRef.current += newEntries.length;
    } finally {
      setIsOverallLoadingMore(false);
    }
  }, [isOverallLoadingMore, overallHasMore]);

  return {
    roundEntries,
    overallEntries,
    profile,
    currentRoundNo,
    selectedRoundNo: roundNo,
    isLoading: roundLeaderboardQuery.isLoading || overallLeaderboardQuery.isLoading,
    isRoundLoading: roundLeaderboardQuery.isLoading && roundEntries.length === 0,
    isRoundLoadingMore,
    isOverallLoadingMore,
    roundHasMore,
    overallHasMore,
    loadMoreRound,
    loadMoreOverall
  };
};
