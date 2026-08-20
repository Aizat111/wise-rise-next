import { getTranslations } from "next-intl/server";

import { ActivitiesFallback } from "@/features/activities/components/ActivitiesFallback";
import { ActivitiesShell } from "@/features/activities/components/ActivitiesShell";

export default async function AktivitelerimLoading() {
  const t = await getTranslations("activitiesPage");

  return (
    <ActivitiesShell>
      <ActivitiesFallback
        watchingTitle={t("watchingTitle")}
        watchedTitle={t("watchedTitle")}
        assignedTitle={t("assignedTitle")}
        notesTitle={t("notesTitle")}
        teachersTitle={t("teachersTitle")}
        certificatesTitle={t("certificatesTitle")}
        loadingLabel={t("loading")}
      />
    </ActivitiesShell>
  );
}
