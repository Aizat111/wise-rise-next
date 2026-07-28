'use client';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import type {
  SeasonSportsbookOverview,
  SeasonSportsbookOverviewResponse,
  SeasonSportsbookOverviewVariables
} from '@/core/types/seasonSportsbook.types';

export const useSeasonSportsbookOverview = (
  variables: SeasonSportsbookOverviewVariables,
  options?: { enabled?: boolean }
) => {
  const query = useGraphWsFetcher<SeasonSportsbookOverviewResponse>(
    GRAPHQL_TYPES.SEASON_SPORTSBOOK_OVERVIEW_QUERY
  ).render(variables, {
    enabled: (options?.enabled ?? true) && !!variables.seasonId,
    refetchOnWindowFocus: false
  });

  const overview: SeasonSportsbookOverview | undefined = query.data?.seasonSportsbookOverview;

  return {
    overview,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
};
