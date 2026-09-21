import type { Metadata } from "next";
import { notFound } from "next/navigation";

import RegisterEmailPage from "@/features/auth/pages/RegisterEmailPage";
import { parseRegisterCouponCode } from "@/features/auth/lib/register-coupon";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{
    couponCode: string;
  }>;
};

export const metadata: Metadata = buildPageMetadata({
  title: "Hesap Oluştur",
  description: "Wise&Rise'a üye ol, Türkiye'nin en iyilerinden öğrenmeye başla.",
  canonical: "/kayit-ol",
  noIndex: true,
});

export default async function Page({ params }: Props) {
  const { couponCode } = await params;
  const parsed = parseRegisterCouponCode(couponCode);
  if (!parsed) notFound();

  return <RegisterEmailPage couponCode={parsed} />;
}
