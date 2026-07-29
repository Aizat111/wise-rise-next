"use client";

import { HOME_THEME_STYLES } from "../../constants";
import type { DefaultHomeMode } from "../../types";
import { HomeThemeWrapper } from "../HomeThemeWrapper";
import { MostWatchedSlider } from "./MostWatchedSlider";

export type DefaultHomeProps = {
  mode: DefaultHomeMode;
};

/**
 * Shared home layout for "Tüm İçerikler" and "Wise&Rise".
 * Content and optional sections differ by `mode`; UI building blocks stay shared.
 */
export function DefaultHome({ mode }: DefaultHomeProps) {
  return (
    <HomeThemeWrapper
      themeKey={mode}
      themeStyle={HOME_THEME_STYLES[mode]}
    >
      <div
        className="flex flex-1 flex-col gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-8 md:px-25"
        aria-live="polite"
      >
        <MostWatchedSlider mode={mode} />
      </div>
    </HomeThemeWrapper>
  );
}
