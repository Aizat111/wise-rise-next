import type { Metadata } from "next";
import { notFound } from "next/navigation";

import RegisterPasswordPage from "@/features/auth/pages/RegisterPasswordPage";
import { parseRegisterCouponCode } from "@/features/auth/lib/register-coupon";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{
    couponCode: string;
  }>;
};

export const metadata: Metadata = buildPageMetadata({
  title: "Şifre Oluştur",
  description: "Wise&Rise hesabın için güvenli bir şifre oluştur.",
  canonical: "/kayit-ol/sifre-olustur",
  noIndex: true,
});

export default async function Page({ params }: Props) {
  const { couponCode } = await params;
  const parsed = parseRegisterCouponCode(couponCode);
  if (!parsed) notFound();

  return <RegisterPasswordPage couponCode={parsed} />;
}
