import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import {
  MEMBERSHIP_PLANS_ROUTE,
  MembershipPlansPage,
} from "@/features/membership-plans";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pracingPlan" });

  const canonical =
    locale === DEFAULT_LOCALE
      ? MEMBERSHIP_PLANS_ROUTE
      : `/${locale}${MEMBERSHIP_PLANS_ROUTE}`;

  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    canonical,
    keywords: [t("title"), "Wise&Rise", "üyelik", "plan"],
  });
}

export default async function UyelikPlanlariRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MembershipPlansPage />;
}
