import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { SITE } from "@/config/site";
import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { HomePage } from "@/features/home/components/HomePage";
import { getDisplayMembershipPlans } from "@/features/plans/api/get-plans";
import FAQSchema from "@/shared/seo/FAQSchema";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";
import { getFaqItems } from "@/shared/seo/getFaqItems";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const canonical = locale === DEFAULT_LOCALE ? "/" : `/${locale}`;

  return buildPageMetadata({
    title: SITE.defaultTitle,
    description: SITE.description,
    canonical,
    absoluteTitle: true,
    keywords: ["online eğitim", "kurs", "abonelik", "Wise&Rise"],
  });
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [faqItems, membershipPlans] = await Promise.all([
    getFaqItems(),
    getDisplayMembershipPlans(),
  ]);

  return (
    <>
      <FAQSchema items={faqItems} />
      <HomePage membershipPlans={membershipPlans} />
    </>
  );
}
