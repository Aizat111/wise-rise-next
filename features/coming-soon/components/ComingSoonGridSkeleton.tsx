import { ComingSoonCardSkeleton } from "@/features/home/components/cards/ComingSoonCardSkeleton";

import {
  COMING_SOON_GRID_CLASS,
  COMING_SOON_SKELETON_COUNT,
} from "../constants";

type ComingSoonGridSkeletonProps = {
  label?: string;
};

export function ComingSoonGridSkeleton({ label }: ComingSoonGridSkeletonProps) {
  return (
    <div className={COMING_SOON_GRID_CLASS} aria-busy aria-label={label}>
      {Array.from({ length: COMING_SOON_SKELETON_COUNT }).map((_, index) => (
        <ComingSoonCardSkeleton key={`coming-soon-skeleton-${index}`} />
      ))}
    </div>
  );
}
