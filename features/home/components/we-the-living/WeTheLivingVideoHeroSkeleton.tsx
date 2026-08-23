"use client";

import { cn } from "@/lib/utils";

import { WE_THE_LIVING_VIDEO_HERO_HEIGHT_CLASS } from "./constants";

type WeTheLivingVideoHeroSkeletonProps = {
  className?: string;
};

export function WeTheLivingVideoHeroSkeleton({
  className,
}: WeTheLivingVideoHeroSkeletonProps) {
  return (
    <div
      aria-hidden
      aria-busy="true"
      className={cn(
        "relative w-full overflow-hidden bg-black/30",
        WE_THE_LIVING_VIDEO_HERO_HEIGHT_CLASS,
        className,
      )}
    >
      <div className="absolute inset-0 animate-pulse bg-white/5" />
    </div>
  );
}
