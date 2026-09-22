import { SITE } from "@/config/site";
import { SEARCH_QUERY_PARAM, SEARCH_ROUTE } from "@/features/search/constants";

/** Stable entity defined on the homepage and referenced from every other page. */
export const ORGANIZATION_ID = `${SITE.url}/#organization`;

/** Stable website entity defined on the homepage. */
export const WEBSITE_ID = `${SITE.url}/#website`;

/**
 * Sitelinks Searchbox target.
 * `{search_term_string}` must stay literal — do not encode it.
 */
export const SEARCH_ACTION_TARGET = `${SITE.url}${SEARCH_ROUTE}?${SEARCH_QUERY_PARAM}={search_term_string}`;

/** Request header set in `proxy.ts` so server components know the public path. */
export const PATHNAME_HEADER = "x-pathname";

export function webpageId(pageUrl: string) {
  return `${pageUrl}#webpage`;
}

export function breadcrumbId(pageUrl: string) {
  return `${pageUrl}#breadcrumb`;
}
