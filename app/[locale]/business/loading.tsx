import { getTranslations } from "next-intl/server";

import { BusinessShell } from "@/features/business/components/BusinessShell";
import { BUSINESS_FEATURES_GRID_CLASS } from "@/features/business/constants";

export default async function BusinessLoading() {
  const t = await getTranslations("business");

  return (
    <BusinessShell title={t("heroTitle")} subtitle={t("subtitle")}>
      <div
        className="my-8 sm:my-10 lg:my-12"
        aria-busy
        aria-label={t("title")}
      >
        <div className="mx-auto mb-10 h-5 w-40 animate-pulse rounded bg-white/10 sm:mb-12" />
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`business-logo-skeleton-${index}`}
              className="h-12 w-28 shrink-0 animate-pulse rounded bg-white/10 sm:h-14 sm:w-32"
            />
          ))}
        </div>
        <div className={`${BUSINESS_FEATURES_GRID_CLASS} mt-16`}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`business-feature-skeleton-${index}`}
              className="flex flex-col gap-3"
            >
              <div className="size-10 animate-pulse rounded bg-white/10" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-16 w-full animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </BusinessShell>
  );
}
