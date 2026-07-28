import { PROVIDER_LINKS } from '@/core/constants/link.constants';
import type { IGame } from '@/core/types/games.type';
import {
  findStaticProviderBySlug,
  producerSlugsMatchRoute,
  resolveProducerSlugForGames
} from '@/shared/utils/producerUtils';

const CURATED_LIST_SLUGS = new Set(['new-releases', 'popular-games', 'popular_games']);

export const SPORTS_CATEGORY_SLUG = 'sports';

/** Legacy REST provider for sports tiles stored in the old games table. */
export const LEGACY_SPORTS_PROVIDER = 'Toshi Sports';

type GameCategoryRef =
  | {
      slug?: string;
      name?: string;
    }
  | string
  | undefined
  | null;

export const getGameCategorySlug = (category: GameCategoryRef): string | undefined => {
  if (!category) return undefined;
  if (typeof category === 'string') return category.toLowerCase();
  return category.slug?.toLowerCase();
};

export const isSportsCategoryGame = (game: { category?: GameCategoryRef }): boolean => {
  const slug = getGameCategorySlug(game.category);
  if (slug === SPORTS_CATEGORY_SLUG) return true;
  if (game.category && typeof game.category === 'object') {
    return game.category.name?.toLowerCase() === SPORTS_CATEGORY_SLUG;
  }
  return false;
};

type SportsLikeGameRef = {
  category?: GameCategoryRef;
  entryKind?: string;
  type?: string;
  game_type?: string | null;
  pathname?: string;
  slug?: string;
  launchUrl?: string;
};

/** Sports tiles / external sportsbook links (REST often omits category). */
export const isSportsLikeGame = (game: SportsLikeGameRef): boolean => {
  if (isSportsCategoryGame(game)) return true;
  if (game.entryKind === 'external_link') return true;

  const gameType = (game.type || game.game_type || '').toLowerCase();
  if (gameType === SPORTS_CATEGORY_SLUG || gameType.includes('sport')) return true;

  const pathHint = `${game.pathname || ''} ${game.slug || ''} ${game.launchUrl || ''}`.toLowerCase();
  if (pathHint.includes('/sports') || pathHint.includes('sportsbook')) return true;

  return false;
};

export const filterGamesForNewReleases = <T extends SportsLikeGameRef>(games: T[]): T[] =>
  games.filter(game => !isSportsLikeGame(game));

export const filterGamesBySportsCategory = <T extends { category?: GameCategoryRef }>(
  games: T[],
  mode: 'exclude' | 'only'
): T[] => {
  if (mode === 'only') return games.filter(isSportsCategoryGame);
  return games.filter(game => !isSportsCategoryGame(game));
};

const normalizeGameListDedupeKey = (value: string | undefined | null) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getGameListDedupeKey = (game: { id?: string; slug?: string; name?: string; title?: string }) =>
  normalizeGameListDedupeKey(game.slug || game.id || game.name || game.title);

/** Merge game lists, preserving order and skipping duplicates (by slug/id/name). */
export const mergeGameLists = <T extends { id?: string; slug?: string; name?: string; title?: string }>(
  ...lists: T[][]
): T[] => {
  const seen = new Set<string>();
  const merged: T[] = [];

  for (const list of lists) {
    for (const game of list) {
      const key = getGameListDedupeKey(game);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      merged.push(game);
    }
  }

  return merged;
};

type GameReleaseDateRef = {
  releaseDate?: string | null;
  release_date?: string | null;
  createdAt?: string | null;
  created_at?: string | null;
};

const parseReleaseTimestamp = (value: string | null | undefined): number | null => {
  if (!value) return null;
  const ts = Date.parse(value);
  return Number.isNaN(ts) ? null : ts;
};

/** Best available release timestamp for sorting (GraphQL releaseDate or REST release_date). */
export const getGameReleaseTimestamp = (game: GameReleaseDateRef): number => {
  const releaseTs = parseReleaseTimestamp(game.releaseDate) ?? parseReleaseTimestamp(game.release_date);
  if (releaseTs != null) return releaseTs;

  const createdTs = parseReleaseTimestamp(game.createdAt) ?? parseReleaseTimestamp(game.created_at);
  return createdTs ?? 0;
};

export const sortGamesByReleaseDate = <T extends GameReleaseDateRef>(games: T[]): T[] =>
  [...games].sort((a, b) => getGameReleaseTimestamp(b) - getGameReleaseTimestamp(a));

export const mergeAndSortGameListsByReleaseDate = <
  T extends GameReleaseDateRef & {
    id?: string;
    slug?: string;
    name?: string;
    title?: string;
  }
>(
  ...lists: T[][]
): T[] => sortGamesByReleaseDate(mergeGameLists(...lists));

export type LegacyGamesFilters = {
  page: number;
  perPage: number;
  category?: string;
  provider?: string | string[];
  order?: string;
  isMobile?: boolean;
};

/** REST category slugs differ from GraphQL route slugs in some cases. */
const ROUTE_TO_LEGACY_CATEGORY: Record<string, string | undefined> = {
  slots: 'slot',
  'bonus-buy': 'bonus-buy',
  'live-casino': 'live-casino',
  sports: 'sports',
  'new-releases': undefined,
  'popular-games': undefined,
  popular_games: undefined
};

export const resolveLegacyProviderFilter = (producerSlug: string): string | undefined => {
  const resolvedSlug = resolveProducerSlugForGames(producerSlug);
  const staticProvider = findStaticProviderBySlug(producerSlug) ?? findStaticProviderBySlug(resolvedSlug);
  return staticProvider?.filter?.trim() || staticProvider?.name?.trim();
};

const resolveLegacyProviderFilters = (producerSlugs: string[]): string | string[] | undefined => {
  const providers = producerSlugs.map(slug => resolveLegacyProviderFilter(slug)).filter(Boolean) as string[];
  if (!providers.length) return undefined;
  return providers.length === 1 ? providers[0] : providers;
};

const isProducerOnlyLegacyRoute = (routeSlug: string, producerSlugs: string[]) =>
  producerSlugsMatchRoute(routeSlug, producerSlugs);

export const resolveLegacyGamesFilters = (
  routeSlug: string,
  pagination: { page: number; perPage: number },
  options?: { order?: string; isMobile?: boolean; producerSlug?: string; producerSlugs?: string[] }
): LegacyGamesFilters => {
  const producerSlugs = options?.producerSlugs?.length
    ? options.producerSlugs
    : options?.producerSlug
      ? [options.producerSlug]
      : [];

  if (producerSlugs.length && isProducerOnlyLegacyRoute(routeSlug, producerSlugs)) {
    return {
      ...pagination,
      provider: resolveLegacyProviderFilters(producerSlugs),
      order: options?.order,
      isMobile: options?.isMobile
    };
  }

  const producerRoute = PRODUCER_ROUTE_FILTERS[routeSlug];
  if (producerRoute) {
    return {
      ...pagination,
      provider: PROVIDER_LINKS[routeSlug as keyof typeof PROVIDER_LINKS],
      isMobile: options?.isMobile,
      order: options?.order
    };
  }

  if (routeSlug === 'new-releases') {
    return { ...pagination, order: 'latest', isMobile: options?.isMobile };
  }

  if (routeSlug === SPORTS_CATEGORY_SLUG) {
    return {
      ...pagination,
      provider: LEGACY_SPORTS_PROVIDER,
      isMobile: options?.isMobile
    };
  }

  if (isCuratedListSlug(routeSlug) && routeSlug !== 'new-releases') {
    return {
      ...pagination,
      order: options?.order || 'popularity',
      isMobile: options?.isMobile
    };
  }

  const legacyCategory = ROUTE_TO_LEGACY_CATEGORY[routeSlug] ?? resolveCategorySlug(routeSlug);
  const baseFilters: LegacyGamesFilters = {
    ...pagination,
    category: legacyCategory,
    order: options?.order || (routeSlug === 'bonus-buy' ? 'latest' : undefined),
    isMobile: options?.isMobile
  };

  if (!producerSlugs.length) return baseFilters;

  return {
    ...baseFilters,
    provider: resolveLegacyProviderFilters(producerSlugs)
  };
};

type ProducerFilterableGame = IGame & { producer?: { slug?: string } };

export const filterGamesByProducerSlugs = <T extends ProducerFilterableGame>(
  games: T[],
  producerSlugs: string[]
): T[] => {
  if (producerSlugs.length <= 1) return games;

  const matchKeys = new Set<string>();
  for (const slug of producerSlugs) {
    const resolved = resolveProducerSlugForGames(slug);
    matchKeys.add(resolved.toLowerCase());
    matchKeys.add(slug.toLowerCase());

    const legacyName = resolveLegacyProviderFilter(slug);
    if (legacyName) matchKeys.add(legacyName.toLowerCase());

    const staticProvider = findStaticProviderBySlug(slug) ?? findStaticProviderBySlug(resolved);
    if (staticProvider?.slug) matchKeys.add(staticProvider.slug.toLowerCase());
    if (staticProvider?.filter) matchKeys.add(staticProvider.filter.toLowerCase());
    if (staticProvider?.name) matchKeys.add(staticProvider.name.toLowerCase());
  }

  return games.filter(game => {
    const producerSlug = game.producer?.slug?.toLowerCase();
    if (producerSlug && matchKeys.has(producerSlug)) return true;

    const providerSlug = game.providerSlug?.toLowerCase();
    if (providerSlug && matchKeys.has(providerSlug)) return true;

    const providerName =
      typeof game.provider === 'string'
        ? game.provider.toLowerCase()
        : (game.provider?.displayName || game.provider?.name || game.provider?.slug)?.toLowerCase();

    return Boolean(providerName && matchKeys.has(providerName));
  });
};

export const normalizeLegacyGames = <T extends IGame>(games: T[]): T[] =>
  games.map(game => ({
    ...game,
    slug: game.slug || game.pathname || undefined,
    title: game.title || game.name,
    launchUrl: game.launchUrl || (game as { url?: string }).url || undefined
  }));

export type HybridListContext = {
  routeSlug: string;
  isSports?: boolean;
  isSearch?: boolean;
};

export const applyHybridListFilter = <T extends SportsLikeGameRef & { category?: GameCategoryRef }>(
  games: T[],
  context: HybridListContext
): T[] => {
  if (context.isSearch || context.routeSlug === 'new-releases') {
    return filterGamesForNewReleases(games);
  }
  if (context.routeSlug === 'sports') {
    return games;
  }
  if (context.isSports) {
    return filterGamesBySportsCategory(games, 'only');
  }
  return filterGamesBySportsCategory(games, 'exclude');
};

export const combineHybridGameLists = <
  T extends GameReleaseDateRef & { id?: string; slug?: string; name?: string; title?: string }
>(
  routeSlug: string,
  graphqlGames: T[],
  legacyGames: T[]
): T[] => {
  if (routeSlug === 'new-releases') {
    return mergeAndSortGameListsByReleaseDate(graphqlGames, legacyGames);
  }
  return mergeGameLists(graphqlGames, legacyGames);
};

/** Map legacy REST carousel variables to a route slug for hybrid fetching. */
export const resolveRouteSlugFromLegacyVariables = (variables: {
  category?: string;
  provider?: string;
  order?: string;
}): string => {
  if (variables.order === 'latest' && !variables.category && !variables.provider) return 'new-releases';
  if (variables.provider === LEGACY_SPORTS_PROVIDER) return SPORTS_CATEGORY_SLUG;
  if (variables.provider === PROVIDER_LINKS['toshis-dojo']) return 'toshis-dojo';
  if (variables.category === 'slot') return 'slots';
  if (variables.category === 'live-casino') return 'live-casino';
  if (variables.category === 'bonus-buy') return 'bonus-buy';
  if (variables.category === 'sports') return 'sports';
  return variables.category || 'slots';
};

export const NEW_RELEASES_GRAPHQL_PREFETCH_LIMIT = 200;

export const resolveHybridNewReleasesGraphQLVariables = (pagination: {
  limit: number;
  offset: number;
}): GamesListVariables => ({
  ...pagination,
  enabledOnly: true,
  includeExternalLinks: false,
  sortBy: 'release_date',
  sortOrder: 'desc'
});

/** @deprecated Use hybrid merge for all routes — kept for route-specific sort behaviour. */
export const isHybridLegacyCuratedSlug = (routeSlug: string) => routeSlug === 'new-releases';

/** Route slugs that differ from GraphQL category slugs. */
const ROUTE_TO_CATEGORY_SLUG: Record<string, string> = {
  'bonus-buy': 'slots-bonus-buy'
};

/** Category routes that need non-default query flags (e.g. external_link sports). */
const CATEGORY_ROUTE_FILTERS: Record<string, { categorySlug: string; includeExternalLinks: boolean }> = {
  sports: { categorySlug: 'sports', includeExternalLinks: true }
};

/** Routes that filter by game producer instead of category or curated list. */
const PRODUCER_ROUTE_FILTERS: Record<string, { producerSlug: string; includeExternalLinks: boolean }> = {
  'toshis-dojo': { producerSlug: 'toshibet', includeExternalLinks: true }
};

export type GamesListVariables = {
  limit: number;
  offset: number;
  enabledOnly: boolean;
  includeExternalLinks: boolean;
  categorySlug?: string;
  producerSlug?: string;
  providerSlug?: string;
  sortBy?: string;
  sortOrder?: string;
};

export const isCuratedListSlug = (routeSlug: string) => CURATED_LIST_SLUGS.has(routeSlug);

export const isProducerRouteSlug = (routeSlug: string) => routeSlug in PRODUCER_ROUTE_FILTERS;

export const resolveCuratedListSlug = (routeSlug: string) =>
  routeSlug === 'popular_games' ? 'popular-games' : routeSlug;

export const resolveCategorySlug = (routeSlug: string) => ROUTE_TO_CATEGORY_SLUG[routeSlug] ?? routeSlug;

export const resolveGamesListVariables = (
  routeSlug: string,
  pagination: { limit: number; offset: number }
): GamesListVariables => {
  const producerFilter = PRODUCER_ROUTE_FILTERS[routeSlug];
  if (producerFilter) {
    return {
      ...pagination,
      enabledOnly: true,
      includeExternalLinks: producerFilter.includeExternalLinks,
      producerSlug: producerFilter.producerSlug
    };
  }

  const categoryFilter = CATEGORY_ROUTE_FILTERS[routeSlug];
  if (categoryFilter) {
    return {
      ...pagination,
      enabledOnly: true,
      includeExternalLinks: categoryFilter.includeExternalLinks,
      categorySlug: categoryFilter.categorySlug
    };
  }

  return {
    ...pagination,
    enabledOnly: true,
    includeExternalLinks: false,
    categorySlug: resolveCategorySlug(routeSlug)
  };
};
