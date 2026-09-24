import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import {
  MEMBERSHIP_PLANS_ROUTE,
  MembershipPlansPage,
} from "@/features/membership-plans";
import { getPlans } from "@/features/plans/api/get-plans";
import { selectDisplayPlans } from "@/features/plans/api/plan.utils";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";
import AggregateOfferSchema from "@/shared/seo/schemas/AggregateOfferSchema";

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

  const [monthlyPlans, yearlyPlans] = await Promise.all([
    getPlans("Monthly"),
    getPlans("Yearly"),
  ]);
  const monthly = selectDisplayPlans(monthlyPlans).monthly;
  const yearly = selectDisplayPlans(yearlyPlans).yearly;

  return (
    <>
      <AggregateOfferSchema
        locale={locale}
        monthlyPlan={monthly}
        yearlyPlan={yearly}
      />
      <MembershipPlansPage
        initialPlans={{
          monthly,
          yearly,
        }}
      />
    </>
  );
}
