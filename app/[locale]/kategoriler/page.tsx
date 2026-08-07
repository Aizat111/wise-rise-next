import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { getCategories } from "@/features/category/api/get-categories";
import { CategoriesPage } from "@/features/category/pages/CategoriesPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  const canonical =
    locale === DEFAULT_LOCALE ? "/kategoriler" : `/${locale}/kategoriler`;

  return buildPageMetadata({
    title: t("allCategories"),
    description: t("subtitle"),
    canonical,
    keywords: [t("title"), t("allCategories"), "Wise&Rise"],
  });
}

export default async function KategorilerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories = await getCategories();

  return <CategoriesPage initialCategories={categories} categorySlug={null} />;
}
