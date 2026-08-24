import { getTranslations } from "next-intl/server";

import type { DisplayMembershipPlans } from "@/core/types/plan.types";

import { GIFT_CONTAINER_CLASS } from "../constants";
import { GiftPageClient } from "../components/GiftPageClient";

type GiftPageProps = {
  plans: DisplayMembershipPlans;
};

export async function GiftPage({ plans }: GiftPageProps) {
  const t = await getTranslations("giveGift");

  return (
    <div className={GIFT_CONTAINER_CLASS}>
      <section aria-label={t("metaTitle")} className="min-w-0">
        <GiftPageClient plans={plans} />
      </section>
    </div>
  );
}
