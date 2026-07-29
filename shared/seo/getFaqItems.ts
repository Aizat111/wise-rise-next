import { getMessages } from "next-intl/server";

import type { FaqItem } from "./FAQSchema";

type FaqMessage = {
  title: string;
  description: string;
};

export async function getFaqItems(): Promise<FaqItem[]> {
  const messages = await getMessages();
  const faq = messages.faq as Record<string, FaqMessage> | undefined;

  if (!faq) return [];

  return Object.values(faq)
    .filter((item) => item?.title && item?.description)
    .map((item) => ({
      question: item.title,
      answer: item.description,
    }));
}
