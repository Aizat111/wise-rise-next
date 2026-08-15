import { getTranslations } from "next-intl/server";

import { FollowingFallback } from "@/features/following/components/FollowingFallback";
import { FollowingShell } from "@/features/following/components/FollowingShell";

export default async function TakipEttiklerimLoading() {
  const t = await getTranslations("followingPage");

  return (
    <FollowingShell title={t("title")} subtitle={t("subtitle")}>
      <FollowingFallback
        classroomsTitle={t("classroomsTitle")}
        teachersTitle={t("teachersTitle")}
        loadingLabel={t("loading")}
      />
    </FollowingShell>
  );
}
