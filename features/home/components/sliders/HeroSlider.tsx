"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type HeroSliderProps = {
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
};

/**
 * Placeholder for the full-bleed hero carousel.
 * Wire media slides here in a later iteration; reuse BaseSlider patterns as needed.
 */
export function HeroSlider({
  children,
  className,
  "aria-label": ariaLabel = "Hero",
}: HeroSliderProps) {
  if (!children) return null;

  return (
    <section
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      className={cn("relative w-full overflow-hidden", className)}
    >
      {children}
    </section>
  );
}
