"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { useCategoriesQuery } from "@/features/category/api/category.queries";
import VisuallyHiddenHeading from "@/shared/seo/VisuallyHiddenHeading";

import { getSelectionTitle, resolveCategorySelection } from "../api/selection.utils";
import { getCategoryPageHeading } from "../seo/category-page-seo";
import { CATEGORY_BACKGROUND } from "../constants";
import type { CategoriesPageProps } from "../types";
import { CategoryHero } from "../components/CategoryHero";
import { CategorySection } from "../components/CategorySection";
import { CategorySkeleton } from "../components/CategorySkeleton";

export function CategoriesPage({
  categorySlug = null,
  initialCategories = [],
  initialClassrooms = null,
}: CategoriesPageProps) {
  const t = useTranslations("categories");
  const { data: categories = initialCategories, isLoading } =
    useCategoriesQuery(initialCategories);

  const selection = useMemo(
    () => resolveCategorySelection(categorySlug, categories),
    [categorySlug, categories],
  );

  const allCategoriesLabel = t("allCategories");
  const title = getSelectionTitle(selection, allCategoriesLabel);
  const seoHeading =
    selection.type === "all"
      ? null
      : getCategoryPageHeading(t, selection, allCategoriesLabel);
  const showInitialSkeleton =
    isLoading && initialCategories.length === 0 && Boolean(categorySlug);

  return (
    <div className="bg-background text-foreground">
      {seoHeading ? (
        <VisuallyHiddenHeading>{seoHeading}</VisuallyHiddenHeading>
      ) : null}
      <CategoryHero
        title={title}
        titleAs={seoHeading ? "p" : "h1"}
        subtitle={t("subtitle")}
        backgroundSrc={CATEGORY_BACKGROUND}
        alt={t("alt", { category: title })}
      />

      {showInitialSkeleton ? (
        <CategorySkeleton />
      ) : (
        <CategorySection
          selection={selection}
          categories={categories}
          isCategoriesLoading={isLoading && categories.length === 0}
          initialClassrooms={initialClassrooms}
        />
      )}
    </div>
  );
}
