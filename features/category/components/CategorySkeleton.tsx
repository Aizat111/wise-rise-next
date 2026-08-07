"use client";

import { EducationCardSkeleton } from "@/features/home/components/cards/EducationCardSkeleton";

import { CATEGORY_GRID_SKELETON_COUNT } from "../constants";

export function CategorySkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <div className="w-full lg:w-1/4" aria-hidden>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="h-7 w-40 animate-pulse rounded bg-white/15" />
            <div className="mt-3 h-px w-full bg-white/10" />
            <div className="mt-4 h-14 animate-pulse rounded-lg bg-white/10" />
            <div className="mt-4 space-y-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 animate-pulse rounded-md bg-white/10"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: CATEGORY_GRID_SKELETON_COUNT }).map(
              (_, index) => (
                <EducationCardSkeleton key={index} />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
