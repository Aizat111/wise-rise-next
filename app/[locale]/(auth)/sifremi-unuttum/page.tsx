import type { Metadata } from "next";

import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Şifremi Unuttum",
  description: "Wise&Rise şifreni sıfırlamak için e-posta adresini gir.",
  canonical: "/sifremi-unuttum",
  noIndex: true,
});

export default function Page() {
  return <ForgotPasswordPage />;
}
