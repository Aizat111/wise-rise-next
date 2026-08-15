import { getLocale, getTranslations } from "next-intl/server";

import { mapClassroomsToComingSoonCards } from "@/features/home/api/classroom.utils";
import { formatComingSoonDate } from "@/features/home/utils/formatComingSoonDate";

import { getComingSoonClassrooms } from "../api/get-coming-soon";
import { ComingSoonEmpty } from "./ComingSoonEmpty";
import { ComingSoonGrid } from "./ComingSoonGrid";

export async function ComingSoonContent() {
  const [locale, t, classrooms] = await Promise.all([
    getLocale(),
    getTranslations("comingSoonPage"),
    getComingSoonClassrooms(),
  ]);

  const items = mapClassroomsToComingSoonCards(classrooms).map((item) => ({
    ...item,
    dateLabel: formatComingSoonDate(item.comingSoonDate, locale),
  }));

  if (items.length === 0) {
    return <ComingSoonEmpty message={t("empty")} />;
  }

  return <ComingSoonGrid items={items} />;
}
