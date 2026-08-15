import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { BUSINESS_ROUTE, BusinessPage } from "@/features/business";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "business" });

  const canonical =
    locale === DEFAULT_LOCALE ? BUSINESS_ROUTE : `/${locale}${BUSINESS_ROUTE}`;

  return buildPageMetadata({
    title: t("title"),
    description: t("subtitle"),
    canonical,
    keywords: [t("title"), t("heroTitle"), "Wise&Rise", "iş dünyası"],
  });
}

export default async function BusinessRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BusinessPage />;
}
