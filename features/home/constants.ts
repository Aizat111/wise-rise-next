import type { CSSProperties } from "react";

import type { CardAspectRatio, HomeTabId, HomeTabItemConfig } from "./types";

export const DEFAULT_HOME_TAB: HomeTabId = "all";

/** Default portrait ratio for education-style cards. */
export const DEFAULT_CARD_ASPECT_RATIO: CardAspectRatio = "2/3";

/** Visible slides: 2 on mobile, 4 on desktop (md+). */
export const SLIDER_MOBILE_VISIBLE = 2;
export const SLIDER_DESKTOP_VISIBLE = 4;

/** Default skeleton placeholders while a content slider loads. */
export const SLIDER_DEFAULT_SKELETON_COUNT = 4;

/**
 * Item width formulas keep equal gaps and exact visible counts.
 * Gap must match the slider track `gap-*` utility (default: gap-3 = 0.75rem).
 */
export const SLIDER_ITEM_WIDTH_CLASS =
  "w-[calc((100%-0.75rem)/2)] md:w-[calc((100%-2.25rem)/4)]";

/** Coming Soon slider: always show exactly 2 cards (mobile + desktop). */
export const COMING_SOON_VISIBLE = 2;
export const COMING_SOON_SKELETON_COUNT = 2;
export const COMING_SOON_SLIDER_ITEM_WIDTH_CLASS =
  "w-[calc((100%-0.75rem)/2)]";

/** Teacher slider: 2 on mobile, 5 on desktop (md+). */
export const TEACHER_MOBILE_VISIBLE = 2;
export const TEACHER_DESKTOP_VISIBLE = 5;
export const TEACHER_SKELETON_COUNT = 5;
export const TEACHER_SLIDER_ITEM_WIDTH_CLASS =
  "w-[calc((100%-0.75rem)/2)] md:w-[calc((100%-3rem)/5)]";

/** Tall poster ratio for TeacherCard (height ≈ 3× width). */
export const TEACHER_CARD_ASPECT_RATIO: CardAspectRatio = "1/3";

/** Desktop: ~5% adjacent peek on each side → active hero ~90% wide. */
export const HERO_PEEK_PERCENT = 5;
export const HERO_ACTIVE_PERCENT = 100 - HERO_PEEK_PERCENT * 2;

/** Mobile: ~2.5% peek each side → active hero ~95% wide. */
export const HERO_MOBILE_PEEK_PERCENT = 2.5;
export const HERO_MOBILE_ACTIVE_PERCENT = 100 - HERO_MOBILE_PEEK_PERCENT * 2;

/**
 * Mobile: ~95% of the viewport height (width is 95% via carousel peek).
 * Image uses object-contain so proportions stay intact.
 * Desktop: landscape frame matching common hero assets (1200×480 → 5/2).
 */
export const HERO_ASPECT_RATIO_CLASS = "h-[380px] md:h-auto md:aspect-[5/2]";

export const CARD_ASPECT_RATIO_CLASS: Record<CardAspectRatio, string> = {
  "1/3": "aspect-[1/3]",
  "2/3": "aspect-[2/3]",
  "3/4": "aspect-[3/4]",
};

export const HOME_TABS: HomeTabItemConfig[] = [
  {
    id: "all",
    label: "Tüm İçerikler",
    type: "text",
  },
  {
    id: "wise-rise",
    label: "Wise&Rise",
    type: "logo",
    logoSrc: "/logo/wise&rise.png",
    darkLogoSrc: "/logo/wise&rise_dark.png",
    logoAlt: "Wise&Rise",
  },
  {
    id: "we-the-living",
    label: "WeTheLiving",
    type: "logo",
    logoSrc: "/logo/WTL-LOGO.png",
    darkLogoSrc: "/logo/WTL-LOGO.png",
    logoAlt: "WeTheLiving",
  },
];

export const HOME_THEME_STYLES: Record<HomeTabId, CSSProperties> = {
  all: {
    background: "#000000",
  },
  "wise-rise": {
    background: "#000000",
  },
  "we-the-living": {
    background:
      "linear-gradient(180deg, #045333 0%, #02341f 40%, #011b10 70%, #000000 100%)",
  },
};
