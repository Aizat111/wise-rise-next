import { getTranslations } from "next-intl/server";

import { ActivitiesContent } from "../components/ActivitiesContent";
import { ActivitiesShell } from "../components/ActivitiesShell";

export async function ActivitiesPage() {
  const t = await getTranslations("activitiesPage");

  return (
    <ActivitiesShell>
      <ActivitiesContent
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
