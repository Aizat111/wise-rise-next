"use client";

import { TeacherSkeleton } from "@/shared/ui/cards";

import { TEACHERS_GRID_CLASS, TEACHERS_SKELETON_COUNT } from "../constants";
import type { TeachersFallbackProps } from "../types";

export function TeachersFallback({ loadingLabel }: TeachersFallbackProps) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      <div className="w-full min-w-0 lg:sticky lg:top-24 lg:w-1/4 lg:self-start">
        <div className="hidden lg:block" aria-hidden>
          <div className="h-7 w-40 animate-pulse rounded bg-white/15" />
          <div className="mt-3 h-px w-full bg-white/10" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="h-8 animate-pulse rounded-md bg-white/10"
              />
            ))}
          </div>
        </div>
        <div
          className="-mx-1 flex gap-2 overflow-hidden px-1 pb-1 lg:hidden"
          aria-hidden
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-8 w-24 shrink-0 animate-pulse rounded-full bg-white/10"
            />
          ))}
        </div>
      </div>

      <div
        className="w-full min-w-0 lg:w-3/4"
        aria-busy
        aria-label={loadingLabel}
      >
        <div className={TEACHERS_GRID_CLASS}>
          {Array.from({ length: TEACHERS_SKELETON_COUNT }).map((_, index) => (
            <div key={index} className="min-w-0">
              <TeacherSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
