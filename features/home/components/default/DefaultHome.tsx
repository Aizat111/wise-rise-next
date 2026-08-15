"use client";

import { useAppSelector } from "@/store/hooks";
import { HOME_THEME_STYLES } from "../../constants";
import type { DefaultHomeMode } from "../../types";
import { HomeThemeWrapper } from "../HomeThemeWrapper";
import { ComingSoonSection } from "./ComingSoonSection";
import { HomeHeroSlider } from "./HomeHeroSlider";
import { MostWatchedSlider } from "./MostWatchedSlider";
import { TeacherSection } from "./TeacherSection";
import { BusinessBanner } from "@/shared/ui/banners/BusinessBanner";
import { GuestLearningBanner } from "@/shared/ui/banners/GuestLearningBanner";
import { CategoriesSection } from "@/shared/ui/categories";

export type DefaultHomeProps = {
  mode: DefaultHomeMode;
};

/**
 * Shared home layout for "Tüm İçerikler" and "Wise&Rise".
 * Content and optional sections differ by `mode`; UI building blocks stay shared.
 */
export function DefaultHome({ mode }: DefaultHomeProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return (
    <HomeThemeWrapper
      themeKey={mode}
      themeStyle={HOME_THEME_STYLES[mode]}
    >
      <div
        className="flex flex-1 flex-col gap-8 px-4 py-6 sm:gap-10  sm:py-8 "
        aria-live="polite"
      >
        <HomeHeroSlider mode={mode} />
        <div className="px-4 lg:px-25">
          <GuestLearningBanner isAuthenticated={isAuthenticated} />
          <MostWatchedSlider mode={mode} />
          <TeacherSection />
          <CategoriesSection />
          <ComingSoonSection mode={mode} />
          <div className="hidden md:block"><BusinessBanner isAuthenticated={isAuthenticated} className="bg-surface px-15" /></div>
        </div>
      </div>
    </HomeThemeWrapper >
  );
}
