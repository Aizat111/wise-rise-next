import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { getCategories } from "@/features/category/api/get-categories";
import { teacherService } from "@/features/home/api/teacher.service";
import { TEACHERS_ROUTE, TeachersPage } from "@/features/teachers";
import {
  parseTeachersCategoryId,
  parseTeachersPage,
} from "@/features/teachers/api/teachers.utils";
import { TEACHERS_PAGE_SIZE } from "@/features/teachers/constants";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category_id?: string | string[];
    page?: string | string[];
  }>;
};

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

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

export default async function EgitmenlerRoute({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const categoryId = parseTeachersCategoryId(
    firstQueryValue(query.category_id),
  );
  const page = parseTeachersPage(firstQueryValue(query.page));

  const [categories, teachers] = await Promise.all([
    getCategories(),
    teacherService
      .list({
        page,
        per_page: TEACHERS_PAGE_SIZE,
        ...(categoryId != null ? { category_id: categoryId } : {}),
      })
      .catch(() => null),
  ]);

  return (
    <TeachersPage
      initialCategories={categories}
      initialTeachers={teachers}
      initialCategoryId={categoryId}
      initialPage={page}
    />
  );
}
