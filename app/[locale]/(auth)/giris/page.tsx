import type { Metadata } from "next";

import LoginPage from "@/features/auth/pages/LoginPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Giriş Yap",
  description: "Wise&Rise hesabına e-posta ve şifre ile giriş yap.",
  canonical: "/giris",
  noIndex: true,
});

export default function Page() {
  return <LoginPage />;
}
