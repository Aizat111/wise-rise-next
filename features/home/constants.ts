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

export const CARD_ASPECT_RATIO_CLASS: Record<CardAspectRatio, string> = {
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
