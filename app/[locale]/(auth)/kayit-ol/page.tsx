import type { Metadata } from "next";

import RegisterEmailPage from "@/features/auth/pages/RegisterEmailPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Hesap Oluştur",
  description: "Wise&Rise'a üye ol, Türkiye'nin en iyilerinden öğrenmeye başla.",
  canonical: "/kayit-ol",
  noIndex: true,
});

export default function Page() {
  return <RegisterEmailPage />;
}
