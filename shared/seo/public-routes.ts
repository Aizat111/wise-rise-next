import { ACTIVITIES_ROUTE } from "@/features/activities/constants";
import {
  FREE_CAMPAIGN_INTERNAL_PREFIX,
  FREE_CAMPAIGN_TYPES,
} from "@/features/auth/lib/free-campaign";
import { BUSINESS_ROUTE } from "@/features/business/constants";
import { COMING_SOON_ROUTE } from "@/features/coming-soon/constants";
import { FOLLOWING_ROUTE } from "@/features/following/constants";
import { GIFT_REDEEM_ROUTE, GIFT_ROUTE } from "@/features/gift/constants";
import { INFORMATION_ROUTES } from "@/features/information/constants";
import {
  MEMBERSHIP_PLANS_ROUTE,
  RENEWAL_ROUTE,
} from "@/features/membership-plans/constants";
import { SEARCH_ROUTE } from "@/features/search/constants";
import { TEACHERS_ROUTE } from "@/features/teachers/constants";
import { locales } from "@/core/config/domain-locale.config";

import { localizedPath } from "./site-url";

/**
 * Static routes that have a public `page.tsx`, return 200, and are indexable.
 * Dynamic category and course URLs are added from the API in `app/sitemap.ts`.
 */
export const INDEXABLE_STATIC_PATHS = [
  "/",
  BUSINESS_ROUTE,
  "/kategoriler",
  TEACHERS_ROUTE,
  COMING_SOON_ROUTE,
  MEMBERSHIP_PLANS_ROUTE,
  GIFT_ROUTE,
  INFORMATION_ROUTES.about,
  INFORMATION_ROUTES.contact,
  "/sikca-sorulan-sorular",
  INFORMATION_ROUTES.privacyPolicy,
  INFORMATION_ROUTES.termsOfUse,
  INFORMATION_ROUTES.termsOfService,
  INFORMATION_ROUTES.distanceSales,
  INFORMATION_ROUTES.preInfo,
  "/ticari-elektronik-ileti-onay-metni",
] as const;

/**
 * Prefixes that must not be crawled or indexed.
 * Each value matches a real route (or a public campaign rewrite).
 */
export const NOINDEX_PATH_PREFIXES = [
  "/giris",
  "/kayit",
  "/kayit-ol",
  "/sifremi-unuttum",
  "/profil-ekle",
  "/profil-sec",
  "/survey",
  "/hedefini-belirle",
  FREE_CAMPAIGN_INTERNAL_PREFIX,
  ...FREE_CAMPAIGN_TYPES.map((type) => `/${type}`),
  ACTIVITIES_ROUTE,
  FOLLOWING_ROUTE,
  SEARCH_ROUTE,
  RENEWAL_ROUTE,
  GIFT_REDEEM_ROUTE,
  "/hediye-kuponu",
] as const;

export function localizedPathVariants(path: string) {
  return locales.map((locale) => localizedPath(locale, path));
}
