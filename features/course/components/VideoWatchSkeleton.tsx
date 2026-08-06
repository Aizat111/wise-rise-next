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

export function VideoPlayerSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-black">
      <SkeletonBlock className="aspect-video w-full rounded-none" />
    </div>
  );
}

export function VideoSidebarSkeleton() {
  return (
    <aside
      aria-hidden
      className="flex flex-col gap-4 rounded-xl border border-white/10 p-4"
    >
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <SkeletonBlock className="size-12 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <SkeletonBlock className="h-4 w-2/3" />
          <SkeletonBlock className="h-3 w-1/3" />
        </div>
      </div>
      <SkeletonBlock className="h-11 w-full rounded-full" />
      <SkeletonBlock className="h-4 w-1/2" />
      <SkeletonBlock className="h-28 w-full" />
      <div className="flex flex-col gap-3 pt-2">
        <SkeletonBlock className="h-20 w-full" />
        <SkeletonBlock className="h-20 w-full" />
      </div>
    </aside>
  );
}

function VideoListSkeleton({
  count = COURSE_VIDEO_SKELETON_COUNT,
}: {
  count?: number;
}) {
  return (
    <div aria-hidden className="flex flex-col gap-4">
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
  );
}

export function VideoWatchSkeleton() {
  return (
    <div className="bg-background" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-6 sm:px-6 lg:px-10 lg:pb-24 lg:pt-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-8">
          <div className="flex min-w-0 flex-col gap-5">
            <VideoPlayerSkeleton />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SkeletonBlock className="h-8 w-2/3" />
              <SkeletonBlock className="h-10 w-28" />
            </div>
          </div>
          <VideoSidebarSkeleton />
        </div>

        <div className="mt-10 lg:mt-14">
          <VideoListSkeleton />
        </div>
      </div>
    </div>
  );
}
