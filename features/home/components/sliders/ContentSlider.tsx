"use client";

import { Fragment } from "react";

import { EducationCardSkeleton } from "../cards/EducationCardSkeleton";
import { SLIDER_DEFAULT_SKELETON_COUNT } from "../../constants";
import type { ContentSliderProps } from "../../types";
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
}: ContentSliderProps<T>) {
  if (!isLoading && items.length === 0) {
    return null;
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
