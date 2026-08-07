import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { getCategories } from "@/features/category/api/get-categories";
import {
  getSelectionCanonical,
  getSelectionHeroBackground,
  getSelectionTitle,
  isKnownCategorySlug,
  resolveCategorySelection,
} from "@/features/category/api/selection.utils";
import { CATEGORY_BACKGROUND } from "@/features/category/constants";
import { CategoriesPage } from "@/features/category/pages/CategoriesPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{
    locale: string;
    teacherSlug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, teacherSlug } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });
  const categories = await getCategories();

  if (
    categories.length > 0 &&
    !isKnownCategorySlug(teacherSlug, categories)
  ) {
    return buildPageMetadata({
      title: "404",
      description: "",
      noIndex: true,
    });
  }

  const selection = resolveCategorySelection(teacherSlug, categories);
  const title = getSelectionTitle(selection, t("allCategories"));
  const path = getSelectionCanonical(selection);
  const canonical =
    locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;

  return buildPageMetadata({
    title,
    description: t("subtitle"),
    canonical,
    image: getSelectionHeroBackground(selection, CATEGORY_BACKGROUND),
    keywords: [title, t("title"), "Wise&Rise"],
  });
}

export default async function CategorySlugPage({ params }: Props) {
  const { locale, teacherSlug } = await params;
  setRequestLocale(locale);

  const categories = await getCategories();

  if (
    categories.length > 0 &&
    !isKnownCategorySlug(teacherSlug, categories)
  ) {
    notFound();
  }

  return (
    <CategoriesPage
      initialCategories={categories}
      categorySlug={teacherSlug}
    />
  );
}
