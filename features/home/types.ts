export const HOME_TAB_IDS = ["all", "wise-rise", "we-the-living"] as const;

export type HomeTabId = (typeof HOME_TAB_IDS)[number];

export type HomeTabItemConfig = {
  id: HomeTabId;
  label: string;
  type: "text" | "logo";
  logoSrc?: string;
  darkLogoSrc?: string;
  logoAlt?: string;
};
