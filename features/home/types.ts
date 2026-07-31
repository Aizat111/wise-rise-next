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
export type CardAspectRatio = "1/3" | "2/3" | "3/4";

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

export type ComingSoonCardData = {
  id: string | number;
  thumbnail: string;
  title: string;
  authorName: string;
  authorLogo?: string | null;
  /** ISO date string from API (`coming_soon_date`). */
  comingSoonDate?: string | null;
};

export type ComingSoonCardProps = {
  thumbnail: string;
  title: string;
  authorName: string;
  authorLogo?: string | null;
  /** Pre-formatted badge label, e.g. "12 Ağustos" / "12 Aug". */
  dateLabel?: string | null;
  className?: string;
  aspectRatio?: CardAspectRatio;
};

export type TeacherCardData = {
  id: string | number;
  name: string;
  photo: string;
  categoryName: string;
  description: string;
  isFavorite?: boolean;
};

export type TeacherCardProps = {
  name: string;
  photo: string;
  categoryName: string;
  isFavorite?: boolean;
  onFavorite?: (nextFavorite: boolean) => void;
  onClick?: () => void;
  className?: string;
  /** Photo aspect ratio; defaults to tall poster (1/3). */
  aspectRatio?: CardAspectRatio;
};

export type TeacherDialogProps = {
  teacher: TeacherCardData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type TeacherSliderProps = {
  items: TeacherCardData[];
  isLoading?: boolean;
  onViewAll?: () => void;
  onItemClick?: (item: TeacherCardData) => void;
  onFavorite?: (item: TeacherCardData, nextFavorite: boolean) => void;
  className?: string;
};

export type TeacherSectionProps = {
  /** Navigates to the full teachers list when "Tümü" is clicked. */
  onViewAll?: () => void;
  className?: string;
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
  itemWidthClassName?: string;
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

export type HeroSlide = {
  id: string | number;
  imageUrl: string;
  mobileImageUrl: string;
  href?: string | null;
  alt?: string | null;
};

export type HeroSliderProps = {
  items: HeroSlide[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
  "aria-label"?: string;
};
