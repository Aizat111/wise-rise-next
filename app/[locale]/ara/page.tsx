import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { SEARCH_ROUTE, SearchPage } from "@/features/search";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
};

function readSearchQuery(q: string | string[] | undefined): string {
  if (Array.isArray(q)) return q[0]?.trim() ?? "";
  return q?.trim() ?? "";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "searchPage" });

  const canonical =
    locale === DEFAULT_LOCALE ? SEARCH_ROUTE : `/${locale}${SEARCH_ROUTE}`;

  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    canonical,
    keywords: [t("title"), "Wise&Rise", "eğitim", "arama"],
  });
}

export default async function AraRoute({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);

  return <SearchPage initialQuery={readSearchQuery(q)} />;
}
