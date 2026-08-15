import { SearchEmptyState } from "./SearchEmptyState";
import { SearchInputSkeleton } from "./SearchInputSkeleton";
import { SearchResultsGridSkeleton } from "./SearchResultsGridSkeleton";
import { SearchResultsHeader } from "./SearchResultsHeader";
import { SearchShell } from "./SearchShell";

type SearchFallbackProps = {
  title: string;
  subtitle: string;
  emptyMessage: string;
  resultsTitle?: string;
  loadingLabel?: string;
  showResultsSkeleton?: boolean;
};

export function SearchFallback({
  title,
  subtitle,
  emptyMessage,
  resultsTitle,
  loadingLabel,
  showResultsSkeleton = false,
}: SearchFallbackProps) {
  return (
    <SearchShell
      title={title}
      subtitle={subtitle}
      overlay={<SearchInputSkeleton />}
    >
      {showResultsSkeleton ? (
        <section aria-label={resultsTitle}>
          {resultsTitle ? <SearchResultsHeader title={resultsTitle} /> : null}
          <SearchResultsGridSkeleton label={loadingLabel} />
        </section>
      ) : (
        <SearchEmptyState message={emptyMessage} />
      )}
    </SearchShell>
  );
}
