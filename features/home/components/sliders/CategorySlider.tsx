"use client";

import type { ReactNode } from "react";

import { BaseSlider } from "./BaseSlider";
import { SliderHeader } from "./SliderHeader";

type CategorySliderProps = {
  title: string;
  children?: ReactNode;
  onViewAll?: () => void;
  showViewAll?: boolean;
  className?: string;
};

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
