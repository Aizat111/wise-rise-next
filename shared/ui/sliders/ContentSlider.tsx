"use client";

import { Fragment } from "react";

import { cn } from "@/lib/utils";
import { EducationCardSkeleton } from "@/shared/ui/cards/EducationCardSkeleton";

import { SLIDER_DEFAULT_SKELETON_COUNT } from "./constants";
import type { ContentSliderProps } from "./types";
import { BaseSlider } from "./BaseSlider";
import { SliderHeader } from "./SliderHeader";

/**
 * Reusable content row: title + view-all + arrow navigation + horizontal track.
 * Pass any card via `renderItem` — EducationCard, future BusinessCard, etc.
 */
export function ContentSlider<T>({
  title,
  items,
  renderItem,
  getItemKey,
  onViewAll,
  showViewAll = true,
  showNavigation = true,
  viewAllLabel,
  isLoading = false,
  skeletonCount = SLIDER_DEFAULT_SKELETON_COUNT,
  renderSkeleton,
  className,
  gapClassName,
  itemWidthClassName,
  emptyMessage,
}: ContentSliderProps<T>) {
  if (!isLoading && items.length === 0) {
    if (!emptyMessage) return null;

    return (
      <section
        className={cn("relative my-3 w-full", className)}
        aria-label={title}
      >
        <SliderHeader
          title={title}
          showViewAll={showViewAll}
          viewAllLabel={viewAllLabel}
          onViewAll={onViewAll}
          showNavigation={false}
        />
        <p className="text-sm text-white/60 sm:text-base">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <BaseSlider
      className={className}
      gapClassName={gapClassName}
      itemWidthClassName={itemWidthClassName}
      aria-label={title}
      dragEnabled={!isLoading}
      header={({ canScrollLeft, canScrollRight, scrollLeft, scrollRight }) => (
        <SliderHeader
          title={title}
          showViewAll={showViewAll}
          viewAllLabel={viewAllLabel}
          onViewAll={onViewAll}
          showNavigation={showNavigation}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={scrollLeft}
          onScrollRight={scrollRight}
        />
      )}
    >
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, index) => (
            <Fragment key={`skeleton-${index}`}>
              {renderSkeleton?.(index) ?? <EducationCardSkeleton />}
            </Fragment>
          ))
        : items.map((item, index) => (
            <Fragment key={getItemKey?.(item, index) ?? index}>
              {renderItem(item, index)}
            </Fragment>
          ))}
    </BaseSlider>
  );
}
