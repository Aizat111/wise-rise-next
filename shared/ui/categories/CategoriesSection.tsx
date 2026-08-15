"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";

import { useCategoriesQuery } from "@/features/category/api/category.queries";
import { cn } from "@/lib/utils";

import { CategoriesEmpty } from "./CategoriesEmpty";
import { CategoriesGridSkeleton } from "./CategoriesGridSkeleton";
import { CategoryCard } from "./CategoryCard";
import { CATEGORIES_GRID_CLASS } from "./constants";
import type { CategoriesSectionItem, CategoriesSectionProps } from "./types";

function toSectionItems(
  categories: CategoriesSectionItem[],
): CategoriesSectionItem[] {
  return categories.filter((category) => category.slug && category.name);
}

export function CategoriesSection({
  categories: categoriesProp,
  className,
}: CategoriesSectionProps) {
  const t = useTranslations("categoriesSection");
  const titleId = useId();
  const isControlled = categoriesProp !== undefined;
  const { data = [], isLoading } = useCategoriesQuery(undefined, {
    enabled: !isControlled,
  });

  const categories = toSectionItems(isControlled ? categoriesProp : data);
  const showLoading = !isControlled && isLoading && categories.length === 0;

  return (
    <section
      className={cn("my-8 sm:my-10 lg:my-12", className)}
      aria-labelledby={titleId}
      aria-busy={showLoading || undefined}
    >
      <header className="mb-6 sm:mb-8 lg:mb-10">
        <p className="text-sm font-semibold uppercase text-primary text-center sm:text-lg my-2">
          {t("categories")}
        </p>
        <h2
          id={titleId}
          className="text-xl font-semibold tracking-tight text-white text-center sm:text-3xl lg:text-4xl"
        >
          {t("title")}
        </h2>
        <p className="my-3 text-sm leading-relaxed text-white/85 text-center  sm:text-base">
          {t("description1")}
          <br />
          {t("description2")}
        </p>
      </header>

      {showLoading ? (
        <CategoriesGridSkeleton label={t("loading")} />
      ) : categories.length === 0 ? (
        <CategoriesEmpty message={t("empty")} />
      ) : (
        <div className={CATEGORIES_GRID_CLASS}>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}
