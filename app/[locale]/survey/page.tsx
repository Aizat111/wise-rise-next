import type { Metadata } from "next";

import SurveyPage from "@/features/auth/pages/SurveyPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Anket",
  description: "Wise&Rise öğrenme hedeflerini belirlemek için kısa anketi tamamla.",
  canonical: "/survey",
  noIndex: true,
});

export default function Page() {
  return <SurveyPage />;
}
