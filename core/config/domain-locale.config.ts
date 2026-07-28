export const locales = ['tr', 'az'] as const;
export type AppLocale = (typeof locales)[number];

export const DEFAULT_LOCALE: AppLocale = 'tr';

/**
 * Domain → default locale.
 *
 * Azerbaijani is served via the `/az` path prefix on AZ-capable hosts
 * (e.g. `wisenrise.com/az`). Hosts without a path prefix always default to Turkish.
 * Any host not listed here also defaults to Turkish.
 */
export const DOMAIN_DEFAULT_LOCALE: Record<string, AppLocale> = {
  // Türkiye domain'leri (varsayılan)
  'tr.wisenrise.com': 'tr',
  'wisenrise.com': 'tr',
  'www.wisenrise.com': 'tr',
  'wisenrise.com.tr': 'tr',
  'www.wisenrise.com.tr': 'tr',
  'webtest.wisenrise.com': 'tr',
};

/**
 * Hosts that expose Azerbaijani under `/az`:
 * - www.wisenrise.com/az
 * - wisenrise.com/az
 * - wisenrise.com.tr/az
 */
export const AZ_PATH_HOSTS = new Set<string>([
  'www.wisenrise.com',
  'wisenrise.com',
  'wisenrise.com.tr',
]);

export function normalizeHostname(host: string | null | undefined): string {
  if (!host) return '';
  return host.split(':')[0].trim().toLowerCase();
}

/** Default locale for a hostname (no path). Unknown domains → Turkish. */
export function getDefaultLocaleForHost(host: string | null | undefined): AppLocale {
  const hostname = normalizeHostname(host);
  return DOMAIN_DEFAULT_LOCALE[hostname] ?? DEFAULT_LOCALE;
}

export function isAzPathname(pathname: string): boolean {
  return pathname === '/az' || pathname.startsWith('/az/');
}

/**
 * Whether `/az` is allowed on this host.
 * Known TR-only hosts cannot serve Azerbaijani; unknown/dev hosts can.
 */
export function isAzAllowedOnHost(host: string | null | undefined): boolean {
  const hostname = normalizeHostname(host);
  if (!hostname) return true;
  if (!(hostname in DOMAIN_DEFAULT_LOCALE)) return true;
  return AZ_PATH_HOSTS.has(hostname);
}
