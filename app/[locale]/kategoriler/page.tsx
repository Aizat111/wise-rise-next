import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { getCategoryClassroomPage } from "@/features/category/api/get-category-classrooms";
import { getCategories } from "@/features/category/api/get-categories";
import { resolveCategorySelection } from "@/features/category/api/selection.utils";
import { CATEGORIES_INDEX_HREF } from "@/features/category/constants";
import { CategoriesPage } from "@/features/category/pages/CategoriesPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";
import CollectionPageSchema from "@/shared/seo/schemas/CollectionPageSchema";

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

  const t = await getTranslations({ locale, namespace: "categories" });
  const categories = await getCategories();
  const selection = resolveCategorySelection(null, categories);
  const classrooms = await getCategoryClassroomPage(selection);

  return (
    <>
      <CollectionPageSchema
        locale={locale}
        path={CATEGORIES_INDEX_HREF}
        name={t("allCategories")}
        description={t("subtitle")}
        classrooms={classrooms?.items}
      />
      <CategoriesPage
        initialCategories={categories}
        initialClassrooms={classrooms}
        categorySlug={null}
      />
    </>
  );
}
