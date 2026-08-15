import { getTranslations } from "next-intl/server";

import { SearchFallback } from "@/features/search/components/SearchFallback";

export default async function AraLoading() {
  const t = await getTranslations("searchPage");

  return (
    <SearchFallback
      title={t("title")}
      subtitle={t("subtitle")}
      emptyMessage={t("emptyPrompt")}
    />
  );
}
