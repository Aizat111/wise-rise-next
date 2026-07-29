import type { Metadata } from "next";

import RegisterPlanPage from "@/features/auth/pages/RegisterPlanPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Plan Seç",
  description: "Wise&Rise üyelik planını seç ve öğrenmeye başla.",
  canonical: "/kayit-ol/plan-sec",
  noIndex: true,
});

export default function Page() {
  return <RegisterPlanPage />;
}
