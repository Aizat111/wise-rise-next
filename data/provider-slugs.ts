/** Provider URL slugs — safe for Edge/middleware (no React imports). */
export const PROVIDER_SLUGS = [
  'pragmatic-play',
  'pragmatic-play-live',
  'evolution',
  'hacksaw',
  'toshis-dojo',
  'nolimit-city',
  'backseat-gaming',
  'bullshark-games',
  'avatarux',
  'pg-soft',
  'popiplay',
  'bgaming',
  'bgmng',
  'game-art',
  'marbles',
  'fantasma',
  '3-oaks-gaming',
  'wazdan',
  'red-rake-gaming',
  'gamomat',
  'onetouch',
  'live-88',
  '155-io'
] as const;

export type ProviderSlug = (typeof PROVIDER_SLUGS)[number];

export function isKnownProviderSlug(slug: string): slug is ProviderSlug {
  return (PROVIDER_SLUGS as readonly string[]).includes(slug);
}
