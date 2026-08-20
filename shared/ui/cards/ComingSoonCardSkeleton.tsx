"use client";

import { cn } from "@/lib/utils";

import {
  CARD_ASPECT_RATIO_CLASS,
  DEFAULT_CARD_ASPECT_RATIO,
} from "./constants";
import type { ComingSoonCardSkeletonProps } from "./types";

export function ComingSoonCardSkeleton({
  className,
  aspectRatio = DEFAULT_CARD_ASPECT_RATIO,
}: ComingSoonCardSkeletonProps) {
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

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center space-y-2.5 p-3 sm:p-3.5">
        <div className="h-8 w-28 animate-pulse rounded bg-white/15 sm:h-10 sm:w-36" />
        <div className="h-1 w-10 rounded bg-white/10" />
        <div className="mx-auto h-3.5 w-[80%] animate-pulse rounded bg-white/15" />
        <div className="mx-auto h-3.5 w-[55%] animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
