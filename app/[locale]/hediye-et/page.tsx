import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { GIFT_ROUTE, GiftPage } from "@/features/gift";
import { getDisplayMembershipPlans } from "@/features/plans/api/get-plans";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "giveGift" });

  const canonical =
    locale === DEFAULT_LOCALE ? GIFT_ROUTE : `/${locale}${GIFT_ROUTE}`;

  return buildPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    canonical,
    keywords: [t("metaTitle"), "Wise&Rise", "hediye", "üyelik"],
  });
}

export default async function HediyeEtRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const plans = await getDisplayMembershipPlans();

  return <GiftPage plans={plans} />;
}
