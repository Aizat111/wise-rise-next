import { EducationCardSkeleton } from "@/shared/ui/cards";

import { SEARCH_GRID_CLASS, SEARCH_SKELETON_COUNT } from "../constants";

type SearchResultsGridSkeletonProps = {
  label?: string;
};

export function SearchResultsGridSkeleton({
  label,
}: SearchResultsGridSkeletonProps) {
  return (
    <div className={SEARCH_GRID_CLASS} aria-busy aria-label={label}>
      {Array.from({ length: SEARCH_SKELETON_COUNT }).map((_, index) => (
        <EducationCardSkeleton key={`search-skeleton-${index}`} />
      ))}
    </div>
  );
}
