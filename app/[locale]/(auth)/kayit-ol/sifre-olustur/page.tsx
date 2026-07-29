import type { Metadata } from "next";

import RegisterPasswordPage from "@/features/auth/pages/RegisterPasswordPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Şifre Oluştur",
  description: "Wise&Rise hesabın için güvenli bir şifre oluştur.",
  canonical: "/kayit-ol/sifre-olustur",
  noIndex: true,
});

export default function Page() {
  return <RegisterPasswordPage />;
}
