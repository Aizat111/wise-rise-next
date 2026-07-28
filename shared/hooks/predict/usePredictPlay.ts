'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { usePredictCurrentRound } from './usePredictCurrentRound';
import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { PREDICT_TOURNAMENT_ID } from '@/screens/predict/predict.config';
import { type Predict6Prediction, type PredictScoreDraft } from '@/screens/predict/predict.data';
import { useModalManager } from '@/shared/hooks/useModal';

export const usePredictPlay = () => {
  const t = useTranslations('predict.play.hints');
  const [scores, setScores] = useState<PredictScoreDraft>({});
  const [showIncompleteScoresMessage, setShowIncompleteScoresMessage] = useState(false);
  const { isAuthenticated } = useAppSelector(state => state.user);
  const { openModal } = useModalManager();

  const {
    matches,
    roundNo,
    round,
    isLoading,
    submissionDeadlineUnix,
    isBeforeDeadline,
    isRoundOpen,
    isGameCompleted,
    nowMs
  } = usePredictCurrentRound();

  const myPredictionsQuery = useGraphWsFetcher<{ predict6MyPredictions: Predict6Prediction[] }>(
    GRAPHQL_TYPES.PREDICT6_MY_PREDICTIONS_QUERY
  ).render(roundNo ? { tournamentId: PREDICT_TOURNAMENT_ID, roundNo } : undefined, {
    enabled: Boolean(isAuthenticated && PREDICT_TOURNAMENT_ID && roundNo)
  });

  const submitPredictions = useGraphWsFetcher<{
    predict6SubmitPredictions: { accepted: boolean; submitted_at_unix: string };
  }>(GRAPHQL_TYPES.PREDICT6_SUBMIT_PREDICTIONS_MUTATION).action();

  const predictions = myPredictionsQuery.data?.predict6MyPredictions;
  const predictionsQueryEnabled = Boolean(isAuthenticated && PREDICT_TOURNAMENT_ID && roundNo);
  const predictionsReady = !predictionsQueryEnabled || !myPredictionsQuery.isLoading;
  const submittedFixtureIds = useMemo(
    () => new Set((predictions ?? []).map(prediction => String(prediction.fixture_id))),
    [predictions]
  );

  useEffect(() => {
    if (!matches.length || !predictionsReady) return;

    setShowIncompleteScoresMessage(false);

    setScores(current => {
      const next = matches.reduce<PredictScoreDraft>((acc, match) => {
        const fixtureId = match.fixtureId ?? match.id;
        acc[fixtureId] = current[fixtureId] ?? { home: '', away: '' };
        return acc;
      }, {});

      if (predictions?.length) {
        predictions.forEach(prediction => {
          next[prediction.fixture_id] = {
            home: String(prediction.home_score),
            away: String(prediction.away_score)
          };
        });
      }

      return next;
    });
  }, [matches, predictions, predictionsReady]);

  const isMatchLocked = (match: (typeof matches)[number]) => {
    if (!predictionsReady) return true;

    const fixtureId = match.fixtureId ?? match.id;
    const kickoffMs = Number(match.kickoffUnix || 0) * 1000;
    return (
      submittedFixtureIds.has(String(fixtureId)) || Boolean(match.hasResult) || Boolean(kickoffMs && nowMs >= kickoffMs)
    );
  };

  const availableMatches = matches.filter(match => isRoundOpen && !isMatchLocked(match));
  const submittablePredictions = availableMatches
    .filter(match => {
      const fixtureId = match.fixtureId ?? match.id;
      return (
        scores[fixtureId]?.home !== undefined &&
        scores[fixtureId]?.home !== '' &&
        scores[fixtureId]?.away !== undefined &&
        scores[fixtureId]?.away !== ''
      );
    })
    .map(match => {
      const fixtureId = match.fixtureId ?? match.id;
      const score = scores[fixtureId]!;
      return {
        fixture_id: fixtureId,
        home_score: Number(score.home),
        away_score: Number(score.away)
      };
    });
  const hasAnySubmitted = Boolean(predictions?.length);
  const hasAvailableMatches = availableMatches.length > 0;

  const playHint = !isAuthenticated
    ? t('loginToSubmit')
    : isGameCompleted
      ? 'PREDICT6 has finished. Thanks for playing.'
      : !isRoundOpen
        ? submissionDeadlineUnix && !isBeforeDeadline
          ? t('deadlinePassed')
          : t('roundStatus', {
              status: round?.status?.toLowerCase() ?? t('roundNotOpen')
            })
        : !hasAvailableMatches && hasAnySubmitted
          ? t('lockedIn')
          : t('predictBeforeDeadline');

  const handleScoreChange = (fixtureId: string, side: 'home' | 'away', value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(0, 2);

    setShowIncompleteScoresMessage(false);

    setScores(current => ({
      ...current,
      [fixtureId]: {
        home: current[fixtureId]?.home ?? '',
        away: current[fixtureId]?.away ?? '',
        [side]: sanitized
      }
    }));
  };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      openModal('auth', 'login');
      return;
    }

    if (!roundNo || !isRoundOpen) return;

    if (!submittablePredictions.length) {
      setShowIncompleteScoresMessage(true);
      return;
    }

    submitPredictions.mutate({
      tournamentId: PREDICT_TOURNAMENT_ID,
      roundNo,
      predictions: submittablePredictions
    });
  };

  return {
    matches,
    scores,
    isLoading,
    isSubmitting: submitPredictions.isPending,
    hasSubmitted: hasAnySubmitted && !hasAvailableMatches,
    disabled: !isRoundOpen || !predictionsReady || !hasAvailableMatches || isGameCompleted,
    isGameCompleted,
    hint: playHint,
    showIncompleteScoresMessage,
    isMatchLocked,
    onScoreChange: handleScoreChange,
    onSubmit: handleSubmit
  };
};
