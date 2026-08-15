import type { SearchEmptyStateProps } from "../types";

export function SearchEmptyState({ message }: SearchEmptyStateProps) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
      <p className="max-w-md text-sm text-white/65 sm:text-base">{message}</p>
    </div>
  );
}
