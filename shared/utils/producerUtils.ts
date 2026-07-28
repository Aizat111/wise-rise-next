import { Provider, providers } from '@/data/providers';

export type GameProducer = {
  id: string;
  name: string;
  displayName: string;
  slug: string;
  enabled: boolean;
  gameCount?: number | null;
};

const PRODUCER_IMAGE_BY_SLUG: Record<string, string> = {
  '3-oaks-gaming': '3-oaks.svg',
  '155-io': '155svg.svg',
  'backseat-gaming': 'backseatgaming.svg',
  'bullshark-games': 'bullsharkgames.svg',
  'evolution-gaming': 'evolution.svg',
  'game-art': 'gameart.svg',
  'live-88': 'live88.svg',
  live88: 'live88.svg',
  'nolimit-city': 'nolimit.svg',
  'pg-soft': 'pgsoft.svg',
  pgsoft: 'pgsoft.svg',
  'pragmatic-play': 'pragmatic.svg',
  'red-rake-gaming': 'redrakegaming.svg',
  bgmng: 'bgaming.svg',
  toshibet: 'toshisdojo.svg',
  'toshis-dojo': 'toshisdojo.svg'
};

export const resolveProducerImage = (slug: string) => {
  const mappedFile = PRODUCER_IMAGE_BY_SLUG[slug];
  if (mappedFile) return `/assets/providers/${mappedFile}`;

  return `/assets/providers/${slug}.svg`;
};

export const mapProducerToProvider = (producer: GameProducer, gameCount?: number | null): Provider => ({
  name: producer.displayName || producer.name,
  slug: producer.slug,
  filter: producer.slug,
  image: resolveProducerImage(producer.slug),
  gameCount: gameCount ?? producer.gameCount ?? null
});

export const sortProducersByName = (producers: GameProducer[]) =>
  [...producers].sort((a, b) => {
    const aName = a.displayName || a.name;
    const bName = b.displayName || b.name;
    return aName.localeCompare(bName, undefined, { sensitivity: 'base' });
  });

const ROUTE_TO_PRODUCER_SLUG: Record<string, string> = {
  evolution: 'evolution-gaming',
  'live-88': 'live88',
  'pg-soft': 'pgsoft',
  'toshis-dojo': 'toshibet'
};

/** GraphQL producer slugs that map to an existing static provider card. */
const PRODUCER_TO_STATIC_SLUG: Record<string, string> = {
  'evolution-gaming': 'evolution',
  live88: 'live-88',
  pgsoft: 'pg-soft',
  toshibet: 'toshis-dojo'
};

export const resolveProducerSlugForGames = (routeSlug: string) => ROUTE_TO_PRODUCER_SLUG[routeSlug] ?? routeSlug;

/** Provider routes that aggregate multiple GraphQL/legacy producers under one URL. */
const MERGED_PRODUCER_ROUTE_SLUGS: Record<string, string[]> = {
  'pragmatic-play': ['pragmatic-play', 'pragmatic-play-live']
};

export const resolveProducerSlugsForRoute = (routeSlug: string): string[] =>
  MERGED_PRODUCER_ROUTE_SLUGS[routeSlug] ?? [routeSlug];

export const producerSlugsMatchRoute = (routeSlug: string, producerSlugs: string[]) => {
  const expectedSlugs = resolveProducerSlugsForRoute(routeSlug);
  if (producerSlugs.length !== expectedSlugs.length) return false;

  return expectedSlugs.every(
    (expectedSlug, index) =>
      resolveProducerSlugForGames(expectedSlug) === resolveProducerSlugForGames(producerSlugs[index] ?? '')
  );
};

export const findStaticProviderBySlug = (routeSlug: string) => providers.find(provider => provider.slug === routeSlug);

export const findGraphqlProducerByRouteSlug = (routeSlug: string, graphqlProducers: GameProducer[]) => {
  const producerSlug = resolveProducerSlugForGames(routeSlug);
  return graphqlProducers.find(producer => producer.slug === producerSlug || producer.slug === routeSlug);
};

export const resolveProviderDisplay = (
  routeSlug: string,
  graphqlProducers: GameProducer[] = []
): Pick<Provider, 'name' | 'image' | 'slug'> | null => {
  const staticProvider = findStaticProviderBySlug(routeSlug);
  if (staticProvider) {
    return {
      name: staticProvider.name.trim(),
      slug: staticProvider.slug,
      image: staticProvider.image
    };
  }

  const producer = findGraphqlProducerByRouteSlug(routeSlug, graphqlProducers);
  return producer ? mapProducerToProvider(producer) : null;
};

export const producerMatchesStaticProvider = (producer: GameProducer, staticProvider: Provider) => {
  if (producer.slug === staticProvider.slug) return true;

  const mappedStaticSlug = PRODUCER_TO_STATIC_SLUG[producer.slug];
  if (mappedStaticSlug === staticProvider.slug) return true;

  const producerName = (producer.displayName || producer.name).toLowerCase();
  return producerName === staticProvider.filter.toLowerCase() || producerName === staticProvider.name.toLowerCase();
};

export const mergeStaticAndGraphqlProviders = (
  staticProviders: Provider[],
  producers: GameProducer[],
  gameCountsBySlug: Record<string, number> = {}
) => {
  const additionalProducers = sortProducersByName(
    producers.filter(
      producer =>
        producer.enabled &&
        !staticProviders.some(staticProvider => producerMatchesStaticProvider(producer, staticProvider))
    )
  ).map(producer => mapProducerToProvider(producer, gameCountsBySlug[producer.slug]));

  return [...staticProviders, ...additionalProducers].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );
};

export const producerRequiresExternalLinks = (producerSlug: string) => producerSlug === 'toshibet';
