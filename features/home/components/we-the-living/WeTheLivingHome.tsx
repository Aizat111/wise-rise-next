"use client";

import type { CSSProperties } from "react";

import { HomeThemeWrapper } from "../HomeThemeWrapper";

/** WeTheLiving-owned theme — kept local so DefaultHome has no coupling. */
const WE_THE_LIVING_THEME_STYLE: CSSProperties = {
  background:
    "linear-gradient(180deg, #045333 0%, #02341f 40%, #011b10 70%, #000000 100%)",
};

/**
 * Independent WeTheLiving homepage tree.
 * Owns its hero, sections, cards, sliders, background, and layout.
 * Shared primitives only (e.g. BaseSlider, BaseCard) may be reused when needed.
 */
export function WeTheLivingHome() {
  return (
    <HomeThemeWrapper
      themeKey="we-the-living"
      themeStyle={WE_THE_LIVING_THEME_STYLE}
    >
      <div
        className="flex flex-1 flex-col gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-8 md:px-8"
        aria-live="polite"
      >
        {/* WeTheLiving-specific sections will live here */}
      </div>
    </HomeThemeWrapper>
  );
}
