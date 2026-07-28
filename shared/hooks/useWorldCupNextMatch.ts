'use client';

import { useMemo } from 'react';

import { WORLD_CUP_COMPETITION_ID, WORLD_CUP_SEASON_ID } from '../../screens/world-cup/worldCup.config';

import { useSeasonSportsbookOverview } from '@/shared/hooks/useSeasonSportsbookOverview';
import {
  type WorldCupNextMatchView,
  buildSeasonSportsbookNextMatchView,
  findNextSeasonSportsbookFixture,
  resolveSeasonSportsbookLeagueLabel
} from '@/shared/utils/worldCupUtils';

export const useWorldCupNextMatch = () => {
  const { overview, isLoading } = useSeasonSportsbookOverview({
    seasonId: WORLD_CUP_SEASON_ID,
    competitionId: WORLD_CUP_COMPETITION_ID
  });

  const nextMatch = useMemo((): WorldCupNextMatchView | null => {
    const nextFixture = findNextSeasonSportsbookFixture(overview);
    if (!nextFixture) return null;

    const leagueName = resolveSeasonSportsbookLeagueLabel(overview);
    return buildSeasonSportsbookNextMatchView(nextFixture, overview, leagueName);
  }, [overview]);

  return {
    nextMatch,
    isLoading,
    hasNextMatch: Boolean(nextMatch)
  };
};
