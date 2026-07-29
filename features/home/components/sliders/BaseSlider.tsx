"use client";

import {
  Children,
  isValidElement,
  useEffect,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

import { SLIDER_ITEM_WIDTH_CLASS } from "../../constants";
import { useSliderScroll } from "./hooks/useSliderScroll";

export type SliderControls = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollLeft: () => void;
  scrollRight: () => void;
  isDragging: boolean;
};

export type BaseSliderProps = {
  children: ReactNode;
  /** Optional header slot with live scroll controls (arrows, etc.). */
  header?: (controls: SliderControls) => ReactNode;
  className?: string;
  trackClassName?: string;
  itemClassName?: string;
  gapClassName?: string;
  /** When false, mouse drag is disabled. */
  dragEnabled?: boolean;
  "aria-label"?: string;
};

/**
 * Low-level horizontal scroller with mouse drag, touch scroll, and page-based navigation.
 * Compose with SliderHeader via the `header` render prop, or use ContentSlider for the full pattern.
 */
export function BaseSlider({
  children,
  header,
  className,
  trackClassName,
  itemClassName,
  gapClassName = "gap-3",
  dragEnabled = true,
  "aria-label": ariaLabel,
}: BaseSliderProps) {
  const {
    scrollerRef,
    isDragging,
    pointerHandlers,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
    updateScrollState,
  } = useSliderScroll({ enabled: dragEnabled });

  const items = Children.toArray(children);

  useEffect(() => {
    updateScrollState();
  }, [items.length, updateScrollState]);

  const controls: SliderControls = {
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
    isDragging,
  };

  return (
    <section
      className={cn("relative w-full", className)}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      aria-busy={!dragEnabled || undefined}
    >
      {header?.(controls)}

      <div
        ref={scrollerRef}
        {...pointerHandlers}
        className={cn(
          "flex w-full touch-pan-x overflow-x-auto scroll-smooth",
          "snap-x snap-mandatory",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          isDragging ? "cursor-grabbing select-none" : "cursor-grab",
          gapClassName,
          trackClassName,
        )}
      >
        {items.map((child, index) => (
          <div
            key={isValidElement(child) && child.key != null ? child.key : index}
            className={cn(
              "shrink-0 snap-start",
              SLIDER_ITEM_WIDTH_CLASS,
              itemClassName,
            )}
          >
            {child}
          </div>
        ))}
      </div>
    </section>
  );
}
