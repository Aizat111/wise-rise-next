import type { Metadata } from "next";

import SelectProfilePage from "@/features/profile/pages/SelectProfilePage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Profil Seç",
  description: "Wise&Rise'da devam etmek için bir profil seç.",
  canonical: "/profil-sec",
  noIndex: true,
});

export default function Page() {
  return <SelectProfilePage />;
}
