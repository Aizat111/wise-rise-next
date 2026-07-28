'use client';

import { useMemo } from 'react';

import { useGraphWsFetcher } from '@/core/api/graphql';
import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import {
  NEW_RELEASES_GRAPHQL_PREFETCH_LIMIT,
  applyHybridListFilter,
  combineHybridGameLists,
  filterGamesByProducerSlugs,
  isCuratedListSlug,
  isProducerRouteSlug,
  mergeGameLists,
  normalizeLegacyGames,
  resolveCuratedListSlug,
  resolveGamesListVariables,
  resolveHybridNewReleasesGraphQLVariables,
  resolveLegacyGamesFilters
} from '@/core/constants/game-list.constants';
import type { IGame, IGamesResponse } from '@/core/types/games.type';
import {
  producerRequiresExternalLinks,
  producerSlugsMatchRoute,
  resolveProducerSlugForGames
} from '@/shared/utils/producerUtils';

type SlotegratorGamesData = {
  slotegratorGames?: {
    games: IGame[];
    total?: number;
  };
};

type CuratedGamesData = {
  slotegratorCuratedListGames?: {
    games: IGame[];
    total?: number;
  };
};

const buildProducerGraphqlVariables = (producerSlugValue: string, pagination: { limit: number; offset: number }) => ({
  limit: pagination.limit,
  offset: pagination.offset,
  enabledOnly: true,
  includeExternalLinks: producerRequiresExternalLinks(producerSlugValue),
  producerSlug: producerSlugValue
});

export type UseHybridGamesOptions = {
  routeSlug?: string;
  producerSlug?: string;
  producerSlugs?: string[];
  searchTerm?: string;
  graphqlLimit: number;
  graphqlOffset: number;
  legacyPage: number;
  legacyPerPage: number;
  legacyOrder?: string;
  isMobile?: boolean;
  isSports?: boolean;
  enabled?: boolean;
};

export const useHybridGames = ({
  routeSlug = 'slots',
  producerSlug,
  producerSlugs,
  searchTerm,
  graphqlLimit,
  graphqlOffset,
  legacyPage,
  legacyPerPage,
  legacyOrder,
  isMobile,
  isSports = false,
  enabled = true
}: UseHybridGamesOptions) => {
  const isSearch = Boolean(searchTerm?.trim());
  const isNewReleases = routeSlug === 'new-releases';
  const isCurated = isCuratedListSlug(routeSlug) && !isNewReleases;

  const selectedProducerSlugs = useMemo(() => {
    if (producerSlugs?.length) return producerSlugs;
    if (producerSlug) return [producerSlug];
    return [];
  }, [producerSlug, producerSlugs]);

  const resolvedProducerSlugs = useMemo(
    () => selectedProducerSlugs.map(slug => resolveProducerSlugForGames(slug)),
    [selectedProducerSlugs]
  );

  const isProducerOnlyRoute = useMemo(
    () => isProducerRouteSlug(routeSlug) || producerSlugsMatchRoute(routeSlug, selectedProducerSlugs),
    [routeSlug, selectedProducerSlugs]
  );

  const secondaryProducerSlug =
    isProducerOnlyRoute && resolvedProducerSlugs.length > 1 ? resolvedProducerSlugs[1] : undefined;

  const graphqlEnabled = enabled && (!isNewReleases || graphqlOffset === 0);
  const graphqlPagination = { limit: graphqlLimit, offset: graphqlOffset };

  const categoryGraphqlVariables = useMemo(() => {
    if (isSearch) {
      return {
        search: searchTerm?.trim(),
        limit: graphqlLimit,
        offset: graphqlOffset,
        enabledOnly: true,
        includeExternalLinks: false
      };
    }

    if (isNewReleases) {
      return resolveHybridNewReleasesGraphQLVariables({
        limit: NEW_RELEASES_GRAPHQL_PREFETCH_LIMIT,
        offset: 0
      });
    }

    if (isProducerOnlyRoute && resolvedProducerSlugs.length >= 1) {
      return buildProducerGraphqlVariables(resolvedProducerSlugs[0], graphqlPagination);
    }

    const baseVariables = resolveGamesListVariables(routeSlug, { limit: graphqlLimit, offset: graphqlOffset });

    if (resolvedProducerSlugs.length === 1) {
      const producerSlugValue = resolvedProducerSlugs[0];
      return {
        ...baseVariables,
        producerSlug: producerSlugValue,
        includeExternalLinks: baseVariables.includeExternalLinks || producerRequiresExternalLinks(producerSlugValue)
      };
    }

    return baseVariables;
  }, [
    graphqlLimit,
    graphqlOffset,
    isNewReleases,
    isProducerOnlyRoute,
    isSearch,
    resolvedProducerSlugs,
    routeSlug,
    searchTerm
  ]);

  const secondaryGraphqlVariables = useMemo(
    () => (secondaryProducerSlug ? buildProducerGraphqlVariables(secondaryProducerSlug, graphqlPagination) : null),
    [graphqlLimit, graphqlOffset, secondaryProducerSlug]
  );

  const curatedGraphqlVariables = useMemo(
    () => ({
      slug: resolveCuratedListSlug(routeSlug),
      limit: graphqlLimit,
      offset: graphqlOffset
    }),
    [graphqlLimit, graphqlOffset, routeSlug]
  );

  const legacyFilters = useMemo(
    () =>
      isSearch
        ? { term: searchTerm?.trim(), isMobile }
        : resolveLegacyGamesFilters(
            routeSlug,
            { page: legacyPage, perPage: legacyPerPage },
            {
              order: legacyOrder,
              isMobile,
              producerSlugs: selectedProducerSlugs.length ? selectedProducerSlugs : undefined
            }
          ),
    [isMobile, isSearch, legacyOrder, legacyPage, legacyPerPage, routeSlug, searchTerm, selectedProducerSlugs]
  );

  const { data: categoryGraphqlData, isFetching: isCategoryGraphqlFetching } = useGraphWsFetcher<SlotegratorGamesData>(
    GRAPHQL_TYPES.GET_GAME_LIST_QUERY
  ).render(categoryGraphqlVariables, { enabled: graphqlEnabled && !isCurated });

  const { data: secondaryGraphqlData, isFetching: isSecondaryGraphqlFetching } =
    useGraphWsFetcher<SlotegratorGamesData>(GRAPHQL_TYPES.GET_GAME_LIST_QUERY).render(secondaryGraphqlVariables ?? {}, {
      enabled: graphqlEnabled && !isCurated && Boolean(secondaryGraphqlVariables)
    });

  const { data: curatedGraphqlData, isFetching: isCuratedGraphqlFetching } = useGraphWsFetcher<CuratedGamesData>(
    GRAPHQL_TYPES.GET_GAME_ALL_LIST_QUERY
  ).render(curatedGraphqlVariables, { enabled: graphqlEnabled && isCurated });

  const { data: legacySearchData, isFetching: isLegacySearchFetching } = useFetcher<IGamesResponse>(
    TYPES.GET_GAME_SEARCH
  ).render(legacyFilters, { enabled: enabled && isSearch });

  const { data: legacyGamesData, isFetching: isLegacyGamesFetching } = useFetcher<IGamesResponse>(
    TYPES.GET_GAMES
  ).render(legacyFilters, { enabled: enabled && !isSearch });

  const rawGraphqlGames = useMemo(() => {
    if (isCurated) return curatedGraphqlData?.slotegratorCuratedListGames?.games;

    const primaryGames = categoryGraphqlData?.slotegratorGames?.games;
    const secondaryGames = secondaryGraphqlData?.slotegratorGames?.games;

    if (primaryGames === undefined && secondaryGames === undefined) return undefined;
    if (!secondaryGames?.length) return primaryGames;

    return mergeGameLists(primaryGames ?? [], secondaryGames);
  }, [categoryGraphqlData, curatedGraphqlData, isCurated, secondaryGraphqlData]);

  const rawLegacyGames = isSearch ? legacySearchData?.games : legacyGamesData?.games;

  const pageGames = useMemo(() => {
    if (rawGraphqlGames === undefined && rawLegacyGames === undefined) return undefined;

    const merged = combineHybridGameLists(
      isSearch ? 'search' : routeSlug,
      rawGraphqlGames ?? [],
      normalizeLegacyGames(rawLegacyGames ?? [])
    );

    const filtered = applyHybridListFilter(merged, { routeSlug, isSports, isSearch });
    return filterGamesByProducerSlugs(filtered, selectedProducerSlugs);
  }, [isSearch, isSports, rawGraphqlGames, rawLegacyGames, routeSlug, selectedProducerSlugs]);

  const graphqlTotal = isCurated ? curatedGraphqlData?.slotegratorCuratedListGames?.total : undefined;

  const isFetching =
    (graphqlEnabled &&
      (isCurated ? isCuratedGraphqlFetching : isCategoryGraphqlFetching || isSecondaryGraphqlFetching)) ||
    (isSearch ? isLegacySearchFetching : isLegacyGamesFetching);

  const legacyPageLength = rawLegacyGames?.length ?? 0;

  const producerGraphqlHasMore = (games: IGame[] | undefined, total: number | undefined) =>
    total != null ? graphqlOffset + graphqlLimit < total : (games?.length ?? 0) === graphqlLimit;

  const primaryGraphqlHasMore = producerGraphqlHasMore(
    categoryGraphqlData?.slotegratorGames?.games,
    categoryGraphqlData?.slotegratorGames?.total
  );
  const secondaryGraphqlHasMore = producerGraphqlHasMore(
    secondaryGraphqlData?.slotegratorGames?.games,
    secondaryGraphqlData?.slotegratorGames?.total
  );

  const graphqlHasMore = secondaryProducerSlug
    ? primaryGraphqlHasMore || secondaryGraphqlHasMore
    : isCurated
      ? producerGraphqlHasMore(
          curatedGraphqlData?.slotegratorCuratedListGames?.games,
          curatedGraphqlData?.slotegratorCuratedListGames?.total
        )
      : primaryGraphqlHasMore;
  const legacyHasMore = legacyPageLength === legacyPerPage;

  const hasMore = isNewReleases
    ? legacyHasMore || (graphqlOffset === 0 && graphqlHasMore)
    : legacyHasMore || graphqlHasMore;

  return {
    pageGames,
    isFetching,
    hasMore,
    graphqlTotal,
    legacyPageLength,
    graphqlPageLength: rawGraphqlGames?.length ?? 0
  };
};
