"use client";

import { cn } from "@/lib/utils";
import {
  CARD_ASPECT_RATIO_CLASS,
  DEFAULT_CARD_ASPECT_RATIO,
} from "@/shared/ui/cards";

type WeTheLivingCourseCardSkeletonProps = {
  className?: string;
};

export function WeTheLivingCourseCardSkeleton({
  className,
}: WeTheLivingCourseCardSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-white/10",
        CARD_ASPECT_RATIO_CLASS[DEFAULT_CARD_ASPECT_RATIO],
        className,
      )}
    >
      <div className="absolute inset-0 animate-pulse bg-white/5" />
      <div className="absolute inset-x-0 bottom-0 space-y-2 p-3 sm:p-3.5">
        <div className="h-3.5 w-[78%] animate-pulse rounded bg-white/20" />
        <div className="h-3 w-[48%] animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
