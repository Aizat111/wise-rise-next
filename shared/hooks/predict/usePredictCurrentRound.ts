'use client';

import { useEffect, useMemo, useState } from 'react';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { useAppDispatch } from '@/core/redux-toolkit/hooks';
import { setSubmissionDeadlineUnix } from '@/core/redux-toolkit/slices/predictSlice';
import { PREDICT_TOURNAMENT_ID } from '@/screens/predict/predict.config';
import {
  type Predict6RoundFixtures,
  type PredictMatch,
  mapPredictFixtureToMatch
} from '@/screens/predict/predict.data';

export const usePredictCurrentRound = () => {
  const dispatch = useAppDispatch();
  const [nowMs, setNowMs] = useState(() => Date.now());

  const currentRoundQuery = useGraphWsFetcher<{ predict6CurrentRound: Predict6RoundFixtures | null }>(
    GRAPHQL_TYPES.PREDICT6_CURRENT_ROUND_QUERY
  ).render({ tournamentId: PREDICT_TOURNAMENT_ID }, { enabled: Boolean(PREDICT_TOURNAMENT_ID) });

  const roundData = currentRoundQuery.data?.predict6CurrentRound;
  const round = roundData?.round;
  const isGameCompleted = Boolean(roundData && !round);
  const roundNo = round?.round_no;
  const submissionDeadlineUnix = Number(round?.submission_deadline_unix || 0);
  const isBeforeDeadline = !submissionDeadlineUnix || nowMs < submissionDeadlineUnix * 1000;
  const isRoundOpen = round?.status === 'OPEN' && isBeforeDeadline;

  const matches = useMemo<PredictMatch[]>(
    () => roundData?.fixtures?.map(mapPredictFixtureToMatch) ?? [],
    [roundData?.fixtures]
  );

  useEffect(() => {
    if (isGameCompleted) {
      dispatch(setSubmissionDeadlineUnix(0));
      return;
    }
    if (!round?.submission_deadline_unix) return;
    dispatch(setSubmissionDeadlineUnix(Number(round.submission_deadline_unix || 0)));
  }, [dispatch, isGameCompleted, round?.submission_deadline_unix]);

  useEffect(() => {
    if (!submissionDeadlineUnix || round?.status !== 'OPEN') return;
    const intervalId = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, [round?.status, submissionDeadlineUnix]);

  return {
    round,
    roundNo,
    matches,
    isLoading: currentRoundQuery.isLoading,
    submissionDeadlineUnix,
    isBeforeDeadline,
    isRoundOpen,
    isGameCompleted,
    nowMs
  };
};
