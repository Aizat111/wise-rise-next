import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { ComingSoonContent } from "../components/ComingSoonContent";
import { ComingSoonGridSkeleton } from "../components/ComingSoonGridSkeleton";
import { ComingSoonShell } from "../components/ComingSoonShell";

export async function ComingSoonPage() {
  const t = await getTranslations("comingSoonPage");

  return (
    <ComingSoonShell title={t("title")} subtitle={t("subtitle")}>
      <section aria-label={t("title")}>
        <Suspense fallback={<ComingSoonGridSkeleton label={t("loading")} />}>
          <ComingSoonContent />
        </Suspense>
      </section>
    </ComingSoonShell>
  );
}
