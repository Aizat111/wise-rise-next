"use client";

import { cn } from "@/lib/utils";

import { CARD_ASPECT_RATIO_CLASS, TEACHER_CARD_ASPECT_RATIO } from "./constants";
import type { TeacherSkeletonProps } from "./types";

/**
 * Loading placeholder matching TeacherCard layout
 * (tall poster photo + name/category lines below).
 */
export function TeacherSkeleton({
  className,
  aspectRatio = TEACHER_CARD_ASPECT_RATIO,
}: TeacherSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn("flex w-full flex-col gap-2.5", className)}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl bg-white/10",
          CARD_ASPECT_RATIO_CLASS[aspectRatio],
        )}
      >
        <div className="absolute inset-0 animate-pulse bg-white/5" />
        <div className="absolute top-2.5 right-2 size-7 animate-pulse rounded-full bg-white/15" />
      </div>

      <div className="flex flex-col gap-1.5 px-0.5">
        <div className="h-3.5 w-[75%] animate-pulse rounded bg-white/15" />
        <div className="h-3 w-[45%] animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
