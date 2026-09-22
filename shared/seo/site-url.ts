import { SITE } from "@/config/site";
import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";

/** Production canonical origin. Local dev keeps using the request host. */
export const SITE_URL = SITE.url;

export const CANONICAL_HOSTNAME = "wisenrise.com";

const TRACKING_PARAMS = new Set([
  "fbclid",
  "gclid",
  "gbraid",
  "wbraid",
  "mc_cid",
  "mc_eid",
  "yclid",
  "twclid",
  "ttclid",
  "msclkid",
]);

export function isTrackingParam(key: string) {
  const normalized = key.toLowerCase();
  return normalized.startsWith("utm_") || TRACKING_PARAMS.has(normalized);
}

/** Path for a locale. Default locale stays unprefixed (`/egitmenler`, not `/tr/...`). */
export function localizedPath(locale: string, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

/**
 * Absolute canonical URL on `SITE_URL`.
 * Tracking parameters are removed. Other query keys are preserved only when
 * the caller includes them — indexable pages should pass a path without filters.
 */
export function toAbsoluteUrl(path = "/") {
  const raw = path.startsWith("/") ? path : `/${path}`;
  const withoutHash = raw.split("#")[0] || "/";
  const queryIndex = withoutHash.indexOf("?");
  const pathname =
    queryIndex >= 0 ? withoutHash.slice(0, queryIndex) || "/" : withoutHash;
  const search = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "";
  const params = new URLSearchParams(search);

  for (const key of [...params.keys()]) {
    if (isTrackingParam(key)) params.delete(key);
  }

  const query = params.toString();
  const suffix = pathname === "/" ? "" : pathname;
  return `${SITE_URL}${suffix}${query ? `?${query}` : ""}`;
}
