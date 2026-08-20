import type { CSSProperties } from "react";

import type { HomeTabId, HomeTabItemConfig } from "./types";

export const DEFAULT_HOME_TAB: HomeTabId = "all";

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

export {
  DEFAULT_CARD_ASPECT_RATIO,
  TEACHER_CARD_ASPECT_RATIO,
  CARD_ASPECT_RATIO_CLASS,
} from "@/shared/ui/cards";

export {
  SLIDER_MOBILE_VISIBLE,
  SLIDER_DESKTOP_VISIBLE,
  SLIDER_DEFAULT_SKELETON_COUNT,
  SLIDER_ITEM_WIDTH_CLASS,
  COMING_SOON_VISIBLE,
  COMING_SOON_SKELETON_COUNT,
  COMING_SOON_SLIDER_ITEM_WIDTH_CLASS,
  TEACHER_MOBILE_VISIBLE,
  TEACHER_DESKTOP_VISIBLE,
  TEACHER_SKELETON_COUNT,
  TEACHER_SLIDER_ITEM_WIDTH_CLASS,
  HERO_PEEK_PERCENT,
  HERO_ACTIVE_PERCENT,
  HERO_MOBILE_PEEK_PERCENT,
  HERO_MOBILE_ACTIVE_PERCENT,
  HERO_ASPECT_RATIO_CLASS,
} from "@/shared/ui/sliders";
