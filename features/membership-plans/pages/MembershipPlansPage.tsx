import { getTranslations } from "next-intl/server";

import { MembershipPlansShell } from "../components/MembershipPlansShell";
import { MembershipPlansView } from "../components/MembershipPlansView";

export async function MembershipPlansPage() {
  const t = await getTranslations("pracingPlan");

  return (
    <MembershipPlansShell title={t("title")} subtitle={t("subtitle")}>
      <section aria-label={t("title")}>
        <MembershipPlansView />
      </section>
    </MembershipPlansShell>
  );
}
