import { cn } from "@/lib/utils";

import { CATEGORIES_CARD_CLASS, CATEGORIES_GRID_CLASS, CATEGORIES_SKELETON_COUNT } from "./constants";
import type { CategoriesGridSkeletonProps } from "./types";

export function CategoriesGridSkeleton({ label }: CategoriesGridSkeletonProps) {
  return (
    <div className={CATEGORIES_GRID_CLASS} aria-busy aria-label={label}>
      {Array.from({ length: CATEGORIES_SKELETON_COUNT }).map((_, index) => (
        <div
          key={`category-skeleton-${index}`}
          className={cn(CATEGORIES_CARD_CLASS, "animate-pulse bg-white/10")}
          aria-hidden
        />
      ))}
    </div>
  );
}
