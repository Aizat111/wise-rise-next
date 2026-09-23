import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SITE } from "@/config/site";
import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { getCategories } from "@/features/category/api/get-categories";
import { HomePage } from "@/features/home/components/HomePage";
import { getPublicHomeSeed } from "@/features/home/api/get-public-home";
import { getDisplayMembershipPlans } from "@/features/plans/api/get-plans";
import FAQSchema from "@/shared/seo/FAQSchema";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";
import { getFaqItems } from "@/shared/seo/getFaqItems";
import OrganizationSchema from "@/shared/seo/schemas/OrganizationSchema";
import WebsiteSchema from "@/shared/seo/WebsiteSchema";
import VisuallyHiddenHeading from "@/shared/seo/VisuallyHiddenHeading";

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

  const t = await getTranslations({ locale, namespace: "home" });
  const [faqItems, membershipPlans, categories, homeSeed] = await Promise.all([
    getFaqItems(),
    getDisplayMembershipPlans(),
    getCategories(),
    getPublicHomeSeed(),
  ]);

  return (
    <>
      <VisuallyHiddenHeading>{t("seoHeading")}</VisuallyHiddenHeading>
      <OrganizationSchema />
      <WebsiteSchema />
      <FAQSchema items={faqItems} />
      <HomePage
        membershipPlans={membershipPlans}
        categories={categories}
        initialPlatform={homeSeed.platform}
        initialHeroes={homeSeed.heroes}
        initialFeed={homeSeed.feed}
      />
    </>
  );
}
