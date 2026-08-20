import type { TeacherCardData } from "@/shared/ui/cards";

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

export type {
  CardAspectRatio,
  BaseCardProps,
  EducationCardData,
  EducationCardProps,
  EducationProgressCardData,
  EducationProgressCardProps,
  ComingSoonCardData,
  ComingSoonCardProps,
  TeacherCardData,
  TeacherCardProps,
  TeacherDialogProps,
} from "@/shared/ui/cards";

export type {
  ContentSliderProps,
  SliderHeaderProps,
  SliderNavigationProps,
  HeroSlide,
  HeroSliderProps,
} from "@/shared/ui/sliders";
