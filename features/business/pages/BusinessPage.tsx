import { getTranslations } from "next-intl/server";

import { BusinessFeatures } from "../components/BusinessFeatures";
import { BusinessShell } from "../components/BusinessShell";
import {
  BUSINESS_FEATURE_IMAGES,
} from "../constants";
import type { BusinessFeatureItem } from "../types";
import { MostWatchedSlider } from "@/features/home";
import { CategoriesSection } from "@/shared/ui/categories";
import { BusinessBanner } from "@/shared/ui/banners";
import { TeacherShowcaseCard } from "@/shared/ui/banners/TeacherShowcaseCard";


export async function BusinessPage() {
  const t = await getTranslations("business");

  const features: BusinessFeatureItem[] = [
    {
      id: 1,
      type: 1,
      title: t("features.item1.title"),
      text: t("features.item1.text"),
      img: BUSINESS_FEATURE_IMAGES.play,
    },
    {
      id: 2,
      type: 1,
      title: t("features.item2.title"),
      text: t("features.item2.text"),
      img: BUSINESS_FEATURE_IMAGES.flexible,
    },
    {
      id: 3,
      type: 1,
      title: t("features.item3.title"),
      text: t("features.item3.text"),
      img: BUSINESS_FEATURE_IMAGES.lessons,
    },
    {
      id: 4,
      type: 1,
      title: t("features.item4.title"),
      text: t("features.item4.text"),
      img: BUSINESS_FEATURE_IMAGES.interactive,
    },
    {
      id: 5,
      type: 2,
      title: t("features.item5.title"),
      text: t("features.item5.text"),
      img: BUSINESS_FEATURE_IMAGES.saveable,
    },
    {
      id: 6,
      type: 2,
      title: t("features.item6.title"),
      text: t("features.item6.text"),
      img: BUSINESS_FEATURE_IMAGES.identification,
    },
    {
      id: 7,
      type: 2,
      title: t("features.item7.title"),
      text: t("features.item7.text"),
      img: BUSINESS_FEATURE_IMAGES.performance,
    },
    {
      id: 8,
      type: 2,
      title: t("features.item8.title"),
      text: t("features.item8.text"),
      img: BUSINESS_FEATURE_IMAGES.certificate,
    },
  ];

  return (
    <BusinessShell title={t("heroTitle")} subtitle={t("subtitle")} referencesTitle={t("references")}>
      <MostWatchedSlider mode={"all"} />
      <CategoriesSection />
      <TeacherShowcaseCard />
      <BusinessFeatures
        eyebrow={t("properties")}
        title={t("howToWorkWithWiseRise")}
        tabs={[
          { type: 1, label: t("forUsers") },
          { type: 2, label: t("forBusiness") },
        ]}
        features={features}
      />
      <BusinessBanner className="bg-transparent" />
    </BusinessShell>
  );
}
