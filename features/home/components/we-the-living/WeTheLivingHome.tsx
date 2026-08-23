"use client";

import type { DisplayMembershipPlans } from "@/core/types/plan.types";
import { cn } from "@/lib/utils";

import { HomeThemeWrapper } from "../HomeThemeWrapper";
import { WE_THE_LIVING_CONTAINER_CLASS, WE_THE_LIVING_THEME_STYLE } from "./constants";
import { WeTheLivingFeed } from "./WeTheLivingFeed";
import { WeTheLivingVideoHero } from "./WeTheLivingVideoHero";

type WeTheLivingHomeProps = {
  membershipPlans: DisplayMembershipPlans;
};

/**
 * Independent WeTheLiving homepage tree.
 * Video hero and course sliders load separately so one API failure
 * cannot take down the other. Rows alternate: one banner, then one slider.
 */
export function WeTheLivingHome({ membershipPlans }: WeTheLivingHomeProps) {
  return (
    <HomeThemeWrapper
      themeKey="we-the-living"
      themeStyle={WE_THE_LIVING_THEME_STYLE}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col overflow-x-hidden pb-10 sm:pb-14",
          WE_THE_LIVING_CONTAINER_CLASS,
        )}
        aria-live="polite"
      >
        <WeTheLivingVideoHero />
        <div className="mt-8 flex flex-col gap-8 sm:mt-10 sm:gap-10 md:mt-12">
          <WeTheLivingFeed membershipPlans={membershipPlans} />
        </div>
      </div>
    </HomeThemeWrapper>
  );
}
