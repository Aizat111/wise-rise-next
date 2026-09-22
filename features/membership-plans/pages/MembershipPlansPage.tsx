import { getTranslations } from "next-intl/server";

import type { DisplayPlans } from "@/core/types/plan.types";

import { MembershipPlansShell } from "../components/MembershipPlansShell";
import { MembershipPlansView } from "../components/MembershipPlansView";

export async function MembershipPlansPage({
  initialPlans,
}: {
  initialPlans?: DisplayPlans | null;
}) {
  const t = await getTranslations("pracingPlan");

  return (
    <MembershipPlansShell title={t("title")} subtitle={t("subtitle")}>
      <section aria-label={t("title")}>
        <MembershipPlansView initialPlans={initialPlans} />
      </section>
    </MembershipPlansShell>
  );
}
