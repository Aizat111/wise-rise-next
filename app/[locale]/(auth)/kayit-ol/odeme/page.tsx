import type { Metadata } from "next";

import RegisterPaymentPage from "@/features/auth/pages/RegisterPaymentPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Ödeme",
  description: "Wise&Rise üyelik ödemeni güvenli şekilde tamamla.",
  canonical: "/kayit-ol/odeme",
  noIndex: true,
});

export default function Page() {
  return <RegisterPaymentPage />;
}
