import { WE_THE_LIVING_SLUG } from "../constants";
import type { CategorySelection } from "../types";
import { getSelectionTitle } from "../api/selection.utils";

type CategorySeoTranslator = {
  (key: string, values?: Record<string, string | number>): string;
  has: (key: string) => boolean;
};

export type SelectedCategorySeo = {
  title: string;
  description: string;
  heading: string;
};

function selectionSlug(selection: CategorySelection): string | null {
  if (selection.type === "category") return selection.category.slug;
  if (selection.type === "we-the-living") return WE_THE_LIVING_SLUG;
  return null;
}

function categoryValueProp(t: CategorySeoTranslator, slug: string) {
  const key = `seo.valueProps.${slug}`;
  return t.has(key) ? t(key) : t("seo.valueProps.default");
}

export function getCategoryPageHeading(
  t: CategorySeoTranslator,
  selection: CategorySelection,
  allCategoriesLabel: string,
) {
  if (selection.type === "all") return allCategoriesLabel;

  return t("seo.heading", {
    category: getSelectionTitle(selection, allCategoriesLabel),
  });
}

export function buildSelectedCategorySeo(
  t: CategorySeoTranslator,
  selection: CategorySelection,
  allCategoriesLabel: string,
  courseCount: number | null,
): SelectedCategorySeo | null {
  const slug = selectionSlug(selection);
  if (!slug) return null;

  const category = getSelectionTitle(selection, allCategoriesLabel);
  const value = categoryValueProp(t, slug);
  const heading = t("seo.heading", { category });
  const hasCount = courseCount != null && Number.isFinite(courseCount);

  if (!hasCount) {
    return {
      heading,
      title: t("seo.titleFallback", { category }),
      description: t("seo.descriptionFallback", { category, value }),
    };
  }

  const count = Math.max(0, Math.trunc(courseCount));

  return {
    heading,
    title: t("seo.title", { category, count }),
    description: t("seo.description", { category, count, value }),
  };
}
