import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { getCategories } from "@/features/category/api/get-categories";
import { TEACHERS_ROUTE, TeachersPage } from "@/features/teachers";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "teachersPage" });

  const canonical =
    locale === DEFAULT_LOCALE ? TEACHERS_ROUTE : `/${locale}${TEACHERS_ROUTE}`;

  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    canonical,
    keywords: [t("title"), t("allTeachers"), "Wise&Rise"],
  });
}

export default async function EgitmenlerRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories = await getCategories();

  return <TeachersPage initialCategories={categories} />;
}
