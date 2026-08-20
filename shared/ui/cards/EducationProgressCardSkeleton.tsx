"use client";

import { cn } from "@/lib/utils";

import {
  CARD_ASPECT_RATIO_CLASS,
  PROGRESS_CARD_ASPECT_RATIO,
} from "./constants";
import type { EducationCardSkeletonProps } from "./types";

export function EducationProgressCardSkeleton({
  className,
  aspectRatio = PROGRESS_CARD_ASPECT_RATIO,
}: EducationCardSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-white/10",
        CARD_ASPECT_RATIO_CLASS[aspectRatio],
        className,
      )}
    >
      <div className="absolute inset-0 animate-pulse bg-white/5" />
      <div className="absolute top-2.5 left-2.5 h-5 w-16 animate-pulse rounded-full bg-white/20" />
      <div className="absolute top-2.5 right-2 size-7 animate-pulse rounded-full bg-white/15" />
      <div className="absolute inset-x-0 bottom-0 space-y-2 p-3 sm:p-3.5">
        <div className="h-3.5 w-[85%] animate-pulse rounded bg-white/15" />
        <div className="h-3.5 w-[60%] animate-pulse rounded bg-white/10" />
        <div className="h-3 w-[45%] animate-pulse rounded bg-white/10" />
        <div className="mt-1 h-1 w-full rounded-full bg-white/10" />
      </div>
    </div>
  );
}
