import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { COMING_SOON_ROUTE, ComingSoonPage } from "@/features/coming-soon";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{ locale: string }>;
};

/** Coming soon listings change infrequently; refresh hourly. */
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "comingSoonPage" });

  const canonical =
    locale === DEFAULT_LOCALE ? COMING_SOON_ROUTE : `/${locale}${COMING_SOON_ROUTE}`;

  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    canonical,
    keywords: [t("title"), "Wise&Rise", "eğitim", "yakında"],
  });
}

export default async function YakindaGeleceklerRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ComingSoonPage />;
}
