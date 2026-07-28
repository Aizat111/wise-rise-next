'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { WORLD_CUP_COMPETITION_ID, WORLD_CUP_SEASON_ID } from '../../screens/world-cup/worldCup.config';
import { DRAW_TABS } from '../../screens/world-cup/worldCup.data';

import { useSeasonSportsbookOverview } from '@/shared/hooks/useSeasonSportsbookOverview';
import {
  type WorldCupDrawRoundLabel,
  buildSeasonSportsbookDrawTabs,
  buildSeasonSportsbookDrawViewModel,
  buildSeasonSportsbookVisibleDrawRounds,
  resolveSeasonSportsbookDrawBracketHeight
} from '@/shared/utils/worldCupUtils';

export const useWorldCupDraw = () => {
  const [activeRound, setActiveRound] = useState<WorldCupDrawRoundLabel>(DRAW_TABS[0]);
  const hasInitializedRound = useRef(false);

  const { overview, isLoading, isError } = useSeasonSportsbookOverview({
    seasonId: WORLD_CUP_SEASON_ID,
    competitionId: WORLD_CUP_COMPETITION_ID
  });

  const viewModel = useMemo(() => buildSeasonSportsbookDrawViewModel(overview), [overview]);
  const availableTabs = useMemo(() => buildSeasonSportsbookDrawTabs(viewModel.rounds), [viewModel.rounds]);
  const visibleRounds = useMemo(
    () => buildSeasonSportsbookVisibleDrawRounds(viewModel.rounds, activeRound),
    [activeRound, viewModel.rounds]
  );
  const bracketHeight = useMemo(() => resolveSeasonSportsbookDrawBracketHeight(visibleRounds), [visibleRounds]);

  useEffect(() => {
    if (hasInitializedRound.current || isLoading) return;

    hasInitializedRound.current = true;
    setActiveRound(viewModel.defaultTab);
  }, [isLoading, viewModel.defaultTab]);

  useEffect(() => {
    if (availableTabs.length === 0) return;
    if (!availableTabs.includes(activeRound)) {
      setActiveRound(availableTabs[0]);
    }
  }, [activeRound, availableTabs]);

  return {
    activeRound,
    setActiveRound,
    availableTabs,
    visibleRounds,
    bracketHeight,
    isLoading,
    isError,
    isEmpty: viewModel.rounds.every(round => round.matches.length === 0)
  };
};
