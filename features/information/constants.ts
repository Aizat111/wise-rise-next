import { COLORS } from "@/core/constants/colors.constants";

import type { InformationPageKey } from "./types";

/** Full-bleed hero background — matches design spec. */
export const INFORMATION_HERO_BG = COLORS.surface;

/**
 * Content width used across the site (header/footer/category sections).
 * Hero itself is full-bleed; inner hero + page content use this shell.
 */
export const INFORMATION_CONTAINER_CLASS =
  "mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10";

/** Route paths for information pages (locale-aware via next-intl Link). */
export const INFORMATION_ROUTES = {
  about: "/hakkimizda",
  contact: "/iletisim",
  faq: "/sss",
  privacyPolicy: "/gizlilik-politikasi",
  userAgreement: "/kullanici-sozlesmesi",
  /** Footer "Şartlar ve Koşullar" — same document as user agreement. */
  termsOfService: "/sartlar-ve-kosullar",
  distanceSales: "/mesafeli-satis-sozlesmesi",
  preInfo: "/on-bilgilendirme-formu",
  cookiePolicy: "/cerez-politikasi",
  kvkk: "/kvkk",
} as const satisfies Record<string, `/${string}`>;

export type InformationRouteKey = keyof typeof INFORMATION_ROUTES;

export const INFORMATION_PAGE_META: Record<
  InformationPageKey,
  { route: `/${string}`; titleKey: string }
> = {
  about: { route: INFORMATION_ROUTES.about, titleKey: "pages.about" },
  contact: { route: INFORMATION_ROUTES.contact, titleKey: "pages.contact" },
  faq: { route: INFORMATION_ROUTES.faq, titleKey: "pages.faq" },
  privacyPolicy: {
    route: INFORMATION_ROUTES.privacyPolicy,
    titleKey: "pages.privacyPolicy",
  },
  userAgreement: {
    route: INFORMATION_ROUTES.userAgreement,
    titleKey: "pages.userAgreement",
  },
  distanceSales: {
    route: INFORMATION_ROUTES.distanceSales,
    titleKey: "pages.distanceSales",
  },
  preInfo: { route: INFORMATION_ROUTES.preInfo, titleKey: "pages.preInfo" },
  cookiePolicy: {
    route: INFORMATION_ROUTES.cookiePolicy,
    titleKey: "pages.cookiePolicy",
  },
  kvkk: { route: INFORMATION_ROUTES.kvkk, titleKey: "pages.kvkk" },
};

/** FAQ item keys present in `faq` translation namespace. */
export const FAQ_ITEM_KEYS = [
  "item1",
  "item2",
  "item3",
  "item4",
  "item5",
  "item6",
  "item7",
  "item8",
  "item9",
  "item10",
  "item11",
  "item12",
  "item13",
  "item14",
  "item15",
  "item16",
  "item17",
] as const;

/** Membership agreement section descriptors for structured rendering. */
export const MEMBERSHIP_SECTIONS = [
  { key: "section1", kind: "description" },
  { key: "section2", kind: "items", itemCount: 6 },
  { key: "section3", kind: "items", itemCount: 11 },
  { key: "section4", kind: "description" },
  { key: "section5", kind: "description" },
  { key: "section6", kind: "description" },
  { key: "section7", kind: "items", itemCount: 3 },
  { key: "section8", kind: "items", itemCount: 3 },
  { key: "section9", kind: "items", itemCount: 2 },
  { key: "section10", kind: "description" },
  { key: "section11", kind: "description" },
  { key: "section12", kind: "description" },
  { key: "section13", kind: "description" },
] as const;
