"use client";

import { cn } from "@/lib/utils";

import {
  CARD_ASPECT_RATIO_CLASS,
  DEFAULT_CARD_ASPECT_RATIO,
} from "./constants";
import type { EducationCardSkeletonProps } from "./types";

export function NoteCardSkeleton({
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
      <div className="absolute top-2.5 left-2.5 h-5 w-16 animate-pulse rounded-full bg-white/20" />
      <div className="absolute inset-x-0 bottom-0 space-y-2 p-3 sm:p-3.5">
        <div className="h-3.5 w-full animate-pulse rounded bg-white/15" />
        <div className="h-3.5 w-[90%] animate-pulse rounded bg-white/10" />
        <div className="h-3.5 w-[70%] animate-pulse rounded bg-white/10" />
        <div className="mt-2 h-3.5 w-[55%] animate-pulse rounded bg-white/15" />
        <div className="h-3 w-[40%] animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
