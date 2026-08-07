"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { useCategoriesQuery } from "@/features/category/api/category.queries";

import {
  getSelectionHeroBackground,
  getSelectionTitle,
  resolveCategorySelection,
} from "../api/selection.utils";
import { CATEGORY_BACKGROUND } from "../constants";
import type { CategoriesPageProps } from "../types";
import { CategoryHero } from "../components/CategoryHero";
import { CategorySection } from "../components/CategorySection";
import { CategorySkeleton } from "../components/CategorySkeleton";

export function CategoriesPage({
  categorySlug = null,
  initialCategories = [],
}: CategoriesPageProps) {
  const t = useTranslations("categories");
  const { data: categories = initialCategories, isLoading } =
    useCategoriesQuery(initialCategories);

  const selection = useMemo(
    () => resolveCategorySelection(categorySlug, categories),
    [categorySlug, categories],
  );

  const title = getSelectionTitle(selection, t("allCategories"));
  const showInitialSkeleton =
    isLoading && initialCategories.length === 0 && Boolean(categorySlug);

  return (
    <div className="bg-background text-foreground">
      <CategoryHero
        title={title}
        subtitle={t("subtitle")}
        backgroundSrc={CATEGORY_BACKGROUND}
      />

      {showInitialSkeleton ? (
        <CategorySkeleton />
      ) : (
        <CategorySection
          selection={selection}
          categories={categories}
          isCategoriesLoading={isLoading && categories.length === 0}
        />
      )}
    </div>
  );
}
