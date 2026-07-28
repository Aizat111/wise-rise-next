'use client';

import { useMemo, useState } from 'react';

import { usePredictCurrentRound } from './usePredictCurrentRound';
import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { PREDICT_TOURNAMENT_ID } from '@/screens/predict/predict.config';
import {
  type Predict6Prediction,
  type Predict6RoundHistoryData,
  formatPredictDateTime,
  getPredictTeamFlagSrc
} from '@/screens/predict/predict.data';

export interface PredictHistoryEntry {
  fixtureId: string;
  displayOrder: number;
  datetime: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamFlagSrc: string;
  awayTeamFlagSrc: string;
  actualHomeScore?: number;
  actualAwayScore?: number;
  hasResult: boolean;
  predictedHomeScore?: number;
  predictedAwayScore?: number;
  hasPrediction: boolean;
}

export const usePredictHistory = () => {
  const { roundNo: currentRoundNo } = usePredictCurrentRound();
  const { isAuthenticated } = useAppSelector(state => state.user);

  const [selectedRoundNo, setSelectedRoundNo] = useState<number | null>(null);

  // Fall back to the current round until the user explicitly picks one
  const effectiveRoundNo = selectedRoundNo ?? (currentRoundNo ? currentRoundNo - 1 : null);

  const historyQuery = useGraphWsFetcher<{
    predict6RoundFixtures: Predict6RoundHistoryData;
    predict6MyPredictions: Predict6Prediction[];
  }>(GRAPHQL_TYPES.PREDICT6_ROUND_HISTORY_QUERY).render(
    effectiveRoundNo ? { tournamentId: PREDICT_TOURNAMENT_ID, roundNo: effectiveRoundNo } : undefined,
    { enabled: Boolean(PREDICT_TOURNAMENT_ID && effectiveRoundNo) }
  );

  const roundData = historyQuery.data?.predict6RoundFixtures;
  const predictions = historyQuery.data?.predict6MyPredictions ?? [];

  const predictionMap = useMemo(() => {
    const map = new Map<string, Predict6Prediction>();
    predictions.forEach(p => map.set(String(p.fixture_id), p));
    return map;
  }, [predictions]);

  const entries = useMemo<PredictHistoryEntry[]>(() => {
    if (!roundData?.fixtures) return [];

    return [...roundData.fixtures]
      .sort((a, b) => a.display_order - b.display_order)
      .map(fixture => {
        const prediction = predictionMap.get(String(fixture.id));
        return {
          fixtureId: fixture.id,
          displayOrder: fixture.display_order,
          datetime: formatPredictDateTime(fixture.starts_at_unix),
          homeTeamName: fixture.home_team_name,
          awayTeamName: fixture.away_team_name,
          homeTeamFlagSrc: fixture.home_team_logo_url || getPredictTeamFlagSrc(fixture.home_team_name),
          awayTeamFlagSrc: fixture.away_team_logo_url || getPredictTeamFlagSrc(fixture.away_team_name),
          actualHomeScore: fixture.home_score,
          actualAwayScore: fixture.away_score,
          hasResult: fixture.has_result,
          predictedHomeScore: prediction?.home_score,
          predictedAwayScore: prediction?.away_score,
          hasPrediction: Boolean(prediction)
        };
      });
  }, [roundData?.fixtures, predictionMap]);

  return {
    entries,
    round: roundData?.round ?? null,
    selectedRoundNo: effectiveRoundNo,
    currentRoundNo,
    isAuthenticated,
    isLoading: historyQuery.isLoading,
    onRoundChange: (roundNo: number) => setSelectedRoundNo(roundNo)
  };
};
