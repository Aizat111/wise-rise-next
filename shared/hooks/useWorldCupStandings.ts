'use client';

import { useMemo, useState } from 'react';

import { WORLD_CUP_COMPETITION_ID, WORLD_CUP_SEASON_ID } from '../../screens/world-cup/worldCup.config';

import { useSeasonSportsbookOverview } from '@/shared/hooks/useSeasonSportsbookOverview';
import {
  buildSeasonSportsbookStandingsGroupOptions,
  formatSeasonSportsbookGroupLabel,
  getSeasonSportsbookStandingsGroups,
  mapSeasonSportsbookGroupToRows
} from '@/shared/utils/worldCupUtils';

export const useWorldCupStandings = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const { overview, isLoading } = useSeasonSportsbookOverview({
    seasonId: WORLD_CUP_SEASON_ID,
    competitionId: WORLD_CUP_COMPETITION_ID
  });

  const groupOptions = useMemo(() => buildSeasonSportsbookStandingsGroupOptions(overview), [overview]);

  const sortedGroups = useMemo(
    () =>
      [...getSeasonSportsbookStandingsGroups(overview)].sort((left, right) =>
        formatSeasonSportsbookGroupLabel(left).localeCompare(formatSeasonSportsbookGroupLabel(right), undefined, {
          numeric: true
        })
      ),
    [overview]
  );

  const activeGroup = useMemo(() => {
    if (!sortedGroups.length) return undefined;

    if (selectedGroupId) {
      return (
        sortedGroups.find(group => (group.id || formatSeasonSportsbookGroupLabel(group)) === selectedGroupId) ??
        sortedGroups[0]
      );
    }

    return sortedGroups[0];
  }, [sortedGroups, selectedGroupId]);

  const rows = useMemo(() => mapSeasonSportsbookGroupToRows(activeGroup?.entries), [activeGroup]);
  const activeGroupLabel = activeGroup ? formatSeasonSportsbookGroupLabel(activeGroup) : '';
  const resolvedGroupId = activeGroup ? activeGroup.id || activeGroupLabel : null;

  return {
    groupOptions,
    selectedGroupId: resolvedGroupId,
    setSelectedGroupId,
    activeGroupLabel,
    rows,
    isLoading,
    isEmpty: !isLoading && rows.length === 0
  };
};
