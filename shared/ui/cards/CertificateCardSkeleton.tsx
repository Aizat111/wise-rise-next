"use client";

import { cn } from "@/lib/utils";

import type { EducationCardSkeletonProps } from "./types";

export function CertificateCardSkeleton({
  className,
}: EducationCardSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn("w-full overflow-hidden rounded-xl bg-white/10", className)}
    >
      <div className="aspect-2/3 w-full animate-pulse bg-white/5" />
      <div className="space-y-2 bg-surface p-2.5 sm:p-3">
        <div className="h-3 w-[80%] animate-pulse rounded bg-white/15" />
        <div className="h-2.5 w-[45%] animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
