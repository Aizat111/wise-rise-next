import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { GIFT_REDEEM_ROUTE } from "@/features/gift/constants";
import { GiftRedeemPage } from "@/features/gift/pages/GiftRedeemPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "useGift" });

  const canonical =
    locale === DEFAULT_LOCALE
      ? GIFT_REDEEM_ROUTE
      : `/${locale}${GIFT_REDEEM_ROUTE}`;

  return buildPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    canonical,
    keywords: [t("metaTitle"), "Wise&Rise", "hediye", "kupon"],
  });
}

export default async function HediyeKullanRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GiftRedeemPage />;
}
