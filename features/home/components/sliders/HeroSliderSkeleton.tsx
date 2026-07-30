"use client";

import { cn } from "@/lib/utils";

import { HERO_ASPECT_RATIO_CLASS } from "../../constants";

type HeroSliderSkeletonProps = {
  className?: string;
};

export function HeroSliderSkeleton({ className }: HeroSliderSkeletonProps) {
  return (
    <div
      aria-hidden
      aria-busy="true"
      className={cn("relative w-full", className)}
    >
      <div
        className={cn(
          "relative mx-auto w-[95%] overflow-hidden rounded-xl bg-white/10 md:mx-[5%] md:w-[90%]",
          HERO_ASPECT_RATIO_CLASS,
        )}
      >
        <div className="absolute inset-0 animate-pulse bg-white/5" />
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <span
            key={index}
            className="size-2 animate-pulse rounded-full bg-white/25"
          />
        ))}
      </div>
    </div>
  );
}
