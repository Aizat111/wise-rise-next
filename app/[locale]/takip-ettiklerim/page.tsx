import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { FOLLOWING_ROUTE, FollowingPage } from "@/features/following";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "followingPage" });

  const canonical =
    locale === DEFAULT_LOCALE
      ? FOLLOWING_ROUTE
      : `/${locale}${FOLLOWING_ROUTE}`;

  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    canonical,
    keywords: [t("title"), "Wise&Rise", "takip", "favori"],
  });
}

export default async function TakipEttiklerimRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FollowingPage />;
}
