import { getTranslations } from "next-intl/server";

import { FollowingContent } from "../components/FollowingContent";
import { FollowingShell } from "../components/FollowingShell";

export async function FollowingPage() {
  const t = await getTranslations("followingPage");

  return (
    <FollowingShell title={t("title")} subtitle={t("subtitle")}>
      <FollowingContent
        classroomsTitle={t("classroomsTitle")}
        teachersTitle={t("teachersTitle")}
        loadingLabel={t("loading")}
      />
    </FollowingShell>
  );
}
