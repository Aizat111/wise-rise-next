"use client";

import { cn } from "@/lib/utils";

import { COURSE_VIDEO_SKELETON_COUNT } from "../constants";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-lg bg-white/10", className)}
    />
  );
}

export function CourseHeroSkeleton() {
  return (
    <section
      aria-hidden
      className="relative min-h-[100svh] w-full overflow-hidden bg-zinc-950"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-center justify-between px-6 py-16 lg:px-10">
        <div className="flex w-full max-w-xl flex-col gap-5">
          <SkeletonBlock className="h-16 w-56" />
          <SkeletonBlock className="h-12 w-4/5" />
          <SkeletonBlock className="h-24 w-full" />
        </div>
        <div className="hidden flex-col items-center gap-4 md:flex">
          <SkeletonBlock className="size-28 rounded-full" />
          <SkeletonBlock className="h-4 w-36" />
        </div>
      </div>
    </section>
  );
}

export function CourseAboutSkeleton() {
  return (
    <section aria-hidden className="mx-auto w-full max-w-7xl px-5 py-12 lg:px-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.4fr_0.6fr]">
        <SkeletonBlock className="aspect-video w-full rounded-xl" />
        <div className="flex flex-col gap-4">
          <SkeletonBlock className="h-8 w-2/3" />
          <SkeletonBlock className="h-4 w-1/3" />
          <SkeletonBlock className="h-28 w-full" />
          <div className="grid gap-3 sm:grid-cols-2">
            <SkeletonBlock className="h-16" />
            <SkeletonBlock className="h-16" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function CourseVideoListSkeleton({
  count = COURSE_VIDEO_SKELETON_COUNT,
}: {
  count?: number;
}) {
  return (
    <section aria-hidden className="mx-auto w-full max-w-7xl px-5 pb-16 lg:px-10">
      <SkeletonBlock className="mb-6 h-9 w-56" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-4 rounded-xl border border-white/8 p-3 md:grid-cols-[240px_1fr] md:p-4"
          >
            <SkeletonBlock className="aspect-video w-full" />
            <div className="flex flex-col justify-center gap-3 py-1">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-6 w-3/4" />
              <SkeletonBlock className="h-12 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CourseDetailSkeleton() {
  return (
    <div className="bg-background" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <CourseHeroSkeleton />
      <CourseAboutSkeleton />
      <CourseVideoListSkeleton />
    </div>
  );
}
