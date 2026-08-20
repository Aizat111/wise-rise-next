"use client";

import { BaseSlider } from "./BaseSlider";
import { SliderHeader } from "./SliderHeader";
import type { CategorySliderProps } from "./types";

/**
 * Placeholder for category chip / tile rows.
 * Built on BaseSlider so navigation and drag behavior stay consistent.
 */
export function CategorySlider({
  title,
  children,
  onViewAll,
  showViewAll = true,
  className,
}: CategorySliderProps) {
  if (!children) return null;

  return (
    <BaseSlider
      className={className}
      aria-label={title}
      itemClassName="!w-auto"
      header={({ canScrollLeft, canScrollRight, scrollLeft, scrollRight }) => (
        <SliderHeader
          title={title}
          showViewAll={showViewAll}
          onViewAll={onViewAll}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={scrollLeft}
          onScrollRight={scrollRight}
        />
      )}
    >
      {children}
    </BaseSlider>
  );
}
