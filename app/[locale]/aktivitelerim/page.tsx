import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { ACTIVITIES_ROUTE, ActivitiesPage } from "@/features/activities";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "activitiesPage" });

  const canonical =
    locale === DEFAULT_LOCALE
      ? ACTIVITIES_ROUTE
      : `/${locale}${ACTIVITIES_ROUTE}`;

  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    canonical,
    keywords: [t("title"), "Wise&Rise", "aktivite", "sertifika"],
  });
}

export default async function AktivitelerimRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ActivitiesPage />;
}
