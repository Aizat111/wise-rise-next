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
