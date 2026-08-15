import { getTranslations } from "next-intl/server";

import { MembershipPlansShell } from "@/features/membership-plans/components/MembershipPlansShell";
import { PlanSkeleton } from "@/features/membership-plans/components/PlanSkeleton";

export default async function UyelikPlanlariLoading() {
  const t = await getTranslations("pracingPlan");

  return (
    <MembershipPlansShell title={t("title")} subtitle={t("subtitle")}>
      <PlanSkeleton count={2} label={t("loading")} />
    </MembershipPlansShell>
  );
}
