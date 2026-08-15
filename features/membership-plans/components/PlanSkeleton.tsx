import { Skeleton } from "@/components/ui/skeleton";

import { MEMBERSHIP_PLAN_GRID_CLASS } from "../constants";
import type { PlanSkeletonProps } from "../types";

export function PlanSkeleton({ count = 2, label }: PlanSkeletonProps) {
  return (
    <div
      className={count === 1 ? "grid grid-cols-1 gap-4" : MEMBERSHIP_PLAN_GRID_CLASS}
      aria-busy
      aria-label={label}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`plan-skeleton-${index}`}
          className="flex w-full flex-col gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-5"
        >
          <Skeleton className="h-5 w-20 bg-white/10" />
          <Skeleton className="h-4 w-40 bg-white/10" />
          <Skeleton className="h-8 w-32 bg-white/10" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-5/6 bg-white/10" />
            <Skeleton className="h-4 w-4/6 bg-white/10" />
            <Skeleton className="h-4 w-3/4 bg-white/10" />
          </div>
          <Skeleton className="mt-2 h-10 w-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}
