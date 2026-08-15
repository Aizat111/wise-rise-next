"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { mapClassroomsToEducationCards } from "@/features/home/api/classroom.utils";
import { notify } from "@/shared/components/notify";

import { useSearchClassroomsQuery } from "../api/search.queries";
import type { SearchResultsProps } from "../types";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchResultsGrid } from "./SearchResultsGrid";
import { SearchResultsGridSkeleton } from "./SearchResultsGridSkeleton";
import { SearchResultsHeader } from "./SearchResultsHeader";

export function SearchResults({ query }: SearchResultsProps) {
  const t = useTranslations("searchPage");
  const term = query.trim();
  const hasQuery = term.length > 0;

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useSearchClassroomsQuery(term);

  useEffect(() => {
    if (!isError) return;
    notify.error(t("error"), { id: "search-error" });
  }, [isError, t]);

  const items = useMemo(() => {
    const classrooms = data?.pages.flatMap((page) => page.items) ?? [];
    return mapClassroomsToEducationCards(classrooms);
  }, [data]);

  const total = data?.pages[0]?.total ?? 0;

  if (!hasQuery) {
    return <SearchEmptyState message={t("emptyPrompt")} />;
  }

  if (isLoading) {
    return (
      <section aria-label={t("results")}>
        <SearchResultsHeader title={t("results")} />
        <SearchResultsGridSkeleton label={t("loading")} />
      </section>
    );
  }

  if (isError && items.length === 0) {
    return (
      <section aria-label={t("results")}>
        <SearchResultsHeader title={t("results")} />
        <SearchEmptyState message={t("error")} />
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section aria-label={t("results")}>
        <SearchResultsHeader
          title={t("results")}
          countLabel={t("resultsCount", { count: total })}
        />
        <SearchEmptyState message={t("emptyResults")} />
      </section>
    );
  }

  return (
    <section className="space-y-8" aria-label={t("results")}>
      <div>
        <SearchResultsHeader
          title={t("results")}
          countLabel={t("resultsCount", { count: total })}
        />
        <SearchResultsGrid items={items} />
      </div>

      {hasNextPage ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            disabled={isFetchingNextPage}
            onClick={() => {
              void fetchNextPage();
            }}
            className="min-w-44 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            {isFetchingNextPage ? t("loading") : t("loadMore")}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
