"use client";

import { cn } from "@/lib/utils";

type ProfileSkeletonProps = {
  count?: number;
  className?: string;
};

export function ProfileSkeleton({
  count = 3,
  className,
}: ProfileSkeletonProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-5xl flex-col items-center gap-8",
        "md:flex-row md:flex-wrap md:justify-center md:gap-x-8 md:gap-y-10",
        className,
      )}
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex w-full max-w-xs flex-col items-center gap-3 md:w-44 md:max-w-44 lg:w-48 lg:max-w-48"
        >
          <div className="size-28 animate-pulse rounded-full bg-white/10 sm:size-32 md:size-36" />
          <div className="h-5 w-24 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}
