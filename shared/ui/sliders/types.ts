import type { ReactNode } from "react";

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
  /** When set, empty sliders keep the title and show this message instead of hiding. */
  emptyMessage?: string;
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

export type CategorySliderProps = {
  title: string;
  children?: ReactNode;
  onViewAll?: () => void;
  showViewAll?: boolean;
  className?: string;
};
