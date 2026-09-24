import { getTranslations } from "next-intl/server";

import FAQSchema from "@/shared/seo/FAQSchema";

import { FAQ_ITEM_KEYS } from "../constants";
import { FaqAccordion } from "../components/FaqAccordion";
import { InformationLayout } from "../components/InformationLayout";
import type { FaqItem } from "../types";

export async function FaqPage() {
  const tInfo = await getTranslations("information");
  const t = await getTranslations("faq");
  const title = tInfo("pages.faq");

  const items: FaqItem[] = FAQ_ITEM_KEYS.map((key) => ({
    id: key,
    title: t(`${key}.title`),
    description: t(`${key}.description`),
  }));

  return (
    <>
      <FAQSchema
        items={items.map((item) => ({
          question: item.title,
          answer: item.description,
        }))}
      />
      <InformationLayout title={title}>
        <FaqAccordion items={items} />
      </InformationLayout>
    </>
  );
}
