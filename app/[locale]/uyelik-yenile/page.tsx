import type { Metadata } from "next";

import { RenewalPlanStep } from "@/features/membership-plans/components/RenewalPlanStep";
import { RENEWAL_ROUTE } from "@/features/membership-plans/constants";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Üyelik Yenileme",
  description: "Wise&Rise üyeliğini yenile ve eğitimlere kesintisiz erişmeye devam et.",
  canonical: RENEWAL_ROUTE,
  noIndex: true,
});

export default function Page() {
  return <RenewalPlanStep />;
}
