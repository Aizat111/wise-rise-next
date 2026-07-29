import type { Metadata } from "next";

import CreateProfilePage from "@/features/profile/pages/CreateProfilePage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Profil Ekle",
  description: "Wise&Rise hesabına yeni bir profil ekle.",
  canonical: "/profil-ekle",
  noIndex: true,
});

export default function Page() {
  return <CreateProfilePage />;
}
