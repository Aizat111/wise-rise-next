"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { mapClassroomsToEducationCards } from "@/features/home/api/classroom.utils";

import { useCategoryClassroomsQuery } from "../api/classroom.queries";
import { getSelectionFilters } from "../api/selection.utils";
import type { CategorySectionProps } from "../types";
import { CategoryGrid } from "./CategoryGrid";
import { CategorySidebar } from "./CategorySidebar";

export function CategorySection({
  selection,
  categories,
  isCategoriesLoading = false,
}: CategorySectionProps) {
  const t = useTranslations("categories");
  const filters = getSelectionFilters(selection);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useCategoryClassroomsQuery(filters);

  const items = useMemo(() => {
    const classrooms = data?.pages.flatMap((page) => page.items) ?? [];
    return mapClassroomsToEducationCards(classrooms);
  }, [data]);

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <div className="w-full lg:sticky lg:top-24 lg:w-1/4 lg:self-start">
          <CategorySidebar
            categories={categories}
            selection={selection}
            isLoading={isCategoriesLoading}
          />
        </div>

        <div className="w-full lg:w-3/4">
          <CategoryGrid
            items={items}
            isLoading={isLoading}
            isFetchingMore={isFetchingNextPage}
            hasMore={Boolean(hasNextPage)}
            onLoadMore={() => {
              void fetchNextPage();
            }}
            emptyMessage={t("emptyCategory")}
            loadMoreLabel={t("loadMore")}
          />
        </div>
      </div>
    </div>
  );
}
