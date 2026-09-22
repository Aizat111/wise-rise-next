import type { Category } from "@/core/api/types";

import {
  CATEGORIES_INDEX_HREF,
  WE_THE_LIVING_LABEL,
  WE_THE_LIVING_PLATFORM,
  WE_THE_LIVING_SLUG,
} from "../constants";
import type { CategorySelection } from "../types";

export function getCategoryPageHref(category: Category) {
  return `/${category.slug}`;
}

export function getWeTheLivingHref() {
  return `/${WE_THE_LIVING_SLUG}`;
}

export function resolveCategorySelection(
  slug: string | null | undefined,
  categories: Category[],
): CategorySelection {
  if (!slug) return { type: "all" };
  if (slug === WE_THE_LIVING_SLUG) return { type: "we-the-living" };

  const category = categories.find((item) => item.slug === slug);
  if (category) return { type: "category", category };

  return { type: "all" };
}

export function isKnownCategorySlug(
  slug: string,
  categories: Category[],
): boolean {
  if (slug === WE_THE_LIVING_SLUG) return true;
  return categories.some((category) => category.slug === slug);
}

export function getSelectionTitle(
  selection: CategorySelection,
  allCategoriesLabel: string,
): string {
  if (selection.type === "all") return allCategoriesLabel;
  if (selection.type === "we-the-living") return WE_THE_LIVING_LABEL;
  return selection.category.name;
}

export function getSelectionHeroBackground(
  selection: CategorySelection,
  fallback: string,
): string {
  if (selection.type === "category") {
    return selection.category.banner?.path || fallback;
  }
  return fallback;
}

export function getSelectionFilters(selection: CategorySelection): {
  categoryId?: number | null;
  platform?: string | null;
} {
  if (selection.type === "category") {
    return { categoryId: selection.category.id, platform: null };
  }
  if (selection.type === "we-the-living") {
    return { categoryId: null, platform: WE_THE_LIVING_PLATFORM };
  }
  return { categoryId: null, platform: null };
}

export function getSelectionCanonical(selection: CategorySelection): string {
  if (selection.type === "all") return CATEGORIES_INDEX_HREF;
  if (selection.type === "we-the-living") return getWeTheLivingHref();
  return getCategoryPageHref(selection.category);
}
