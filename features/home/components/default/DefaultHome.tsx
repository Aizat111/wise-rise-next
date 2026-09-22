"use client";

import { useAppSelector } from "@/store/hooks";

import type { Category } from "@/core/api/types";
import type { Hero } from "@/core/types/hero.types";
import type { HomeFeed } from "@/core/types/home.types";
import type { DisplayMembershipPlans } from "@/core/types/plan.types";
import { BusinessBanner } from "@/shared/ui/banners/BusinessBanner";
import { GuestLearningBanner } from "@/shared/ui/banners/GuestLearningBanner";
import { MembershipHeroBanner } from "@/shared/ui/banners/MembershipHeroBanner";
import { CategoriesSection } from "@/shared/ui/categories";

import { HOME_THEME_STYLES } from "../../constants";
import type { DefaultHomeMode } from "../../types";
import { HomeThemeWrapper } from "../HomeThemeWrapper";
import { DefaultHomeFeed } from "./DefaultHomeFeed";
import { HomeHeroSlider } from "./HomeHeroSlider";

export type DefaultHomeProps = {
  mode: DefaultHomeMode;
  membershipPlans: DisplayMembershipPlans;
  categories?: Category[];
  initialPlatform?: string;
  initialHeroes?: Hero[];
  initialFeed?: HomeFeed | null;
};

/**
 * Shared home layout for "Tüm İçerikler" and "Wise&Rise".
 * Content and optional sections differ by `mode`; UI building blocks stay shared.
 */
export function DefaultHome({
  mode,
  membershipPlans,
  categories,
  initialPlatform,
  initialHeroes,
  initialFeed,
}: DefaultHomeProps) {
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
        <HomeHeroSlider
          key={mode}
          mode={mode}
          initialHeroes={initialHeroes}
          initialPlatform={initialPlatform}
        />
        <div className="px-4 lg:px-25">
          {!isAuthenticated && (
            <GuestLearningBanner isAuthenticated={isAuthenticated} />
          )}
          <DefaultHomeFeed
            key={mode}
            mode={mode}
            initialFeed={initialFeed}
            initialPlatform={initialPlatform}
          />
          <div className="hidden md:block">
            <BusinessBanner
              isAuthenticated={isAuthenticated}
              className="bg-surface px-15"
            />
          </div>
          {!isAuthenticated && (
            <>
              <MembershipHeroBanner
                monthlyPlan={membershipPlans.monthly}
                yearlyPlan={membershipPlans.yearly}
                className="my-15"
              />
              <CategoriesSection
                categories={categories?.length ? categories : undefined}
              />
            </>
          )}

        </div>
      </div>
    </HomeThemeWrapper>
  );
}
