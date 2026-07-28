'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { WORLD_CUP_COMPETITION_ID, WORLD_CUP_SEASON_ID } from '../../screens/world-cup/worldCup.config';

import { useSeasonSportsbookOverview } from '@/shared/hooks/useSeasonSportsbookOverview';
import {
  type WorldCupFixtureFilterId,
  type WorldCupMatchesViewMode,
  buildSeasonSportsbookFixtureFilterOptions,
  buildSeasonSportsbookMatchesViewModel,
  getSeasonSportsbookFixturesForFilter,
  isWorldCupKnockoutFixtureFilter,
  parseWorldCupMatchweekFixtureFilter,
  resolveSeasonSportsbookDefaultFixtureFilter
} from '@/shared/utils/worldCupUtils';

export const useWorldCupMatches = () => {
  const [viewMode, setViewMode] = useState<WorldCupMatchesViewMode>('date');
  const [selectedFilter, setSelectedFilter] = useState<WorldCupFixtureFilterId | null>(null);
  const hasInitializedFilter = useRef(false);

  const { overview: allOverview, isLoading: isOptionsLoading } = useSeasonSportsbookOverview({
    seasonId: WORLD_CUP_SEASON_ID,
    competitionId: WORLD_CUP_COMPETITION_ID
  });

  const activeFilter = selectedFilter ?? resolveSeasonSportsbookDefaultFixtureFilter(allOverview);
  const isKnockoutFilter = isWorldCupKnockoutFixtureFilter(activeFilter);
  const activeMatchweek = isKnockoutFilter ? undefined : parseWorldCupMatchweekFixtureFilter(activeFilter);

  const { overview: matchweekOverview, isLoading: isMatchweekLoading } = useSeasonSportsbookOverview(
    {
      seasonId: WORLD_CUP_SEASON_ID,
      competitionId: WORLD_CUP_COMPETITION_ID,
      matchweek: activeMatchweek
    },
    { enabled: !isKnockoutFilter && !!activeMatchweek }
  );

  useEffect(() => {
    if (hasInitializedFilter.current || isOptionsLoading) return;

    hasInitializedFilter.current = true;
    setSelectedFilter(resolveSeasonSportsbookDefaultFixtureFilter(allOverview));
  }, [allOverview, isOptionsLoading]);

  const fixtureFilterOptions = useMemo(() => buildSeasonSportsbookFixtureFilterOptions(allOverview), [allOverview]);

  const activeOverview = useMemo(() => {
    if (isKnockoutFilter) {
      return {
        ...allOverview,
        fixtures: getSeasonSportsbookFixturesForFilter(allOverview, activeFilter)
      };
    }

    return matchweekOverview;
  }, [activeFilter, allOverview, isKnockoutFilter, matchweekOverview]);

  const viewModel = useMemo(
    () =>
      buildSeasonSportsbookMatchesViewModel({
        overview: activeOverview,
        standingsOverview: allOverview,
        viewMode,
        isKnockout: isKnockoutFilter
      }),
    [activeOverview, allOverview, isKnockoutFilter, viewMode]
  );

  return {
    viewMode,
    setViewMode,
    selectedFilter: activeFilter,
    setSelectedFilter,
    fixtureFilterOptions,
    matchGroups: viewModel.matchGroups,
    isLoading: selectedFilter === null || isOptionsLoading,
    isFixturesLoading: isKnockoutFilter ? isOptionsLoading : isMatchweekLoading
  };
};
