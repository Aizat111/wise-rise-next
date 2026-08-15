import type { SearchResultsHeaderProps } from "../types";

export function SearchResultsHeader({
  title,
  countLabel,
}: SearchResultsHeaderProps) {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-4 sm:mb-6">
      <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
        {title}
      </h2>
      {countLabel ? (
        <p className="shrink-0 text-xs text-white/60 sm:text-sm">{countLabel}</p>
      ) : null}
    </div>
  );
}
