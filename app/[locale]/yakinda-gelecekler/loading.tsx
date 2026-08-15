import { getTranslations } from "next-intl/server";

import { ComingSoonGridSkeleton } from "@/features/coming-soon/components/ComingSoonGridSkeleton";
import { ComingSoonShell } from "@/features/coming-soon/components/ComingSoonShell";

export default async function YakindaGeleceklerLoading() {
  const t = await getTranslations("comingSoonPage");

  return (
    <ComingSoonShell title={t("title")} subtitle={t("subtitle")}>
      <ComingSoonGridSkeleton label={t("loading")} />
    </ComingSoonShell>
  );
}
