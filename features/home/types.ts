import type { ReactNode } from "react";

export const HOME_TAB_IDS = ["all", "wise-rise", "we-the-living"] as const;

export type HomeTabId = (typeof HOME_TAB_IDS)[number];

/** Shared DefaultHome views: "Tüm İçerikler" and "Wise&Rise". */
export type DefaultHomeMode = Extract<HomeTabId, "all" | "wise-rise">;

export type HomeTabItemConfig = {
  id: HomeTabId;
  label: string;
  type: "text" | "logo";
  logoSrc?: string;
  darkLogoSrc?: string;
  logoAlt?: string;
};

/** Portrait card aspect ratios used across home content cards. */
export type CardAspectRatio = "2/3" | "3/4";

export type BaseCardProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  contentClassName?: string;
  aspectRatio?: CardAspectRatio;
  disabled?: boolean;
  "aria-label"?: string;
};

export type EducationCardData = {
  id: string | number;
  thumbnail: string;
  title: string;
  authorName: string;
  authorLogo?: string | null;
  is_favorite?: boolean;
};

export type EducationCardProps = {
  thumbnail: string;
  title: string;
  authorName: string;
  authorLogo?: string | null;
  isFavorite?: boolean;
  onFavorite?: (nextFavorite: boolean) => void;
  onClick?: () => void;
  className?: string;
  aspectRatio?: CardAspectRatio;
};

export type ContentSliderProps<T> = {
  title: string;
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
  onViewAll?: () => void;
  showViewAll?: boolean;
  showNavigation?: boolean;
  viewAllLabel?: string;
  isLoading?: boolean;
  skeletonCount?: number;
  renderSkeleton?: (index: number) => ReactNode;
  className?: string;
  gapClassName?: string;
};

export type SliderNavigationProps = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  className?: string;
};

export type SliderHeaderProps = {
  title: string;
  showViewAll?: boolean;
  viewAllLabel?: string;
  onViewAll?: () => void;
  showNavigation?: boolean;
  canScrollLeft?: boolean;
  canScrollRight?: boolean;
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
  className?: string;
};
