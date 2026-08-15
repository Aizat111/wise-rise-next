import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { SearchContent } from "../components/SearchContent";
import { SearchFallback } from "../components/SearchFallback";

type SearchPageProps = {
  initialQuery?: string;
};

export async function SearchPage({ initialQuery = "" }: SearchPageProps) {
  const t = await getTranslations("searchPage");
  const hasQuery = initialQuery.trim().length > 0;

  return (
    <Suspense
      fallback={
        <SearchFallback
          title={t("title")}
          subtitle={t("subtitle")}
          emptyMessage={t("emptyPrompt")}
          resultsTitle={t("results")}
          loadingLabel={t("loading")}
          showResultsSkeleton={hasQuery}
        />
      }
    >
      <SearchContent title={t("title")} subtitle={t("subtitle")} />
    </Suspense>
  );
}
