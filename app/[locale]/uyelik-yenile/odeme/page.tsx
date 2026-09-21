import type { Metadata } from "next";

import { RenewalPaymentStep } from "@/features/membership-plans/components/RenewalPaymentStep";
import { RENEWAL_PAYMENT_ROUTE } from "@/features/membership-plans/constants";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Üyelik Yenileme — Ödeme",
  description: "Wise&Rise üyelik yenileme ödemeni güvenli şekilde tamamla.",
  canonical: RENEWAL_PAYMENT_ROUTE,
  noIndex: true,
});

export default function Page() {
  return <RenewalPaymentStep />;
}
