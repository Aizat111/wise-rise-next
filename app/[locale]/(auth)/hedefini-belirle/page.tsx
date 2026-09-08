import type { Metadata } from "next";

import GoalSelectionPage from "@/features/survey/pages/GoalSelectionPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Hedefini Belirle",
  description:
    "Wise&Rise öğrenme hedeflerini belirlemek için kısa anketi tamamla.",
  canonical: "/hedefini-belirle",
  noIndex: true,
});

export default function Page() {
  return <GoalSelectionPage />;
}
