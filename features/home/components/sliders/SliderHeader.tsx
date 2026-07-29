"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import type { SliderHeaderProps } from "../../types";
import { SliderNavigation } from "./SliderNavigation";

export function SliderHeader({
  title,
  showViewAll = true,
  viewAllLabel,
  onViewAll,
  showNavigation = true,
  canScrollLeft = false,
  canScrollRight = false,
  onScrollLeft,
  onScrollRight,
  className,
}: SliderHeaderProps) {
  const t = useTranslations("home");
  const resolvedViewAllLabel = viewAllLabel ?? t("all");

  return (
    <div
      className={cn(
        "mb-3 flex items-center justify-between gap-3 sm:mb-4",
        className,
      )}
    >
      <h2 className="min-w-0 truncate text-base font-semibold tracking-tight text-white  sm:text-3xl border-l-5 pl-2  border-primary">
        {title}
      </h2>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {showNavigation && onScrollLeft && onScrollRight ? (
          <SliderNavigation
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            onScrollLeft={onScrollLeft}
            onScrollRight={onScrollRight}
            className="hidden sm:flex"
          />
        ) : null}

        {showViewAll && onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            className={cn(
              "text-sm font-medium text-white/75 transition-colors duration-200",
              "hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
            )}
          >
            {resolvedViewAllLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
