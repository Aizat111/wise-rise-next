"use client";

import { cn } from "@/lib/utils";

import {
  CARD_ASPECT_RATIO_CLASS,
  DEFAULT_CARD_ASPECT_RATIO,
} from "./constants";
import type { EducationCardSkeletonProps } from "./types";

export function EducationCardSkeleton({
  className,
  aspectRatio = DEFAULT_CARD_ASPECT_RATIO,
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
      <div className="absolute inset-x-0 bottom-0 space-y-2.5 p-3 sm:p-3.5">
        <div className="flex items-center gap-2">
          <div className="size-7 animate-pulse rounded-full bg-white/15 sm:size-8" />
          <div className="h-3 w-20 animate-pulse rounded bg-white/15" />
        </div>
        <div className="mx-auto h-px w-10 rounded-full bg-white/10" />
        <div className="mx-auto h-3.5 w-[80%] animate-pulse rounded bg-white/15" />
        <div className="mx-auto h-3.5 w-[60%] animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
