import type { Metadata } from "next";

import { redirect } from "@/core/i18n/navigation";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Kayıt Ol",
  description: "Wise&Rise'a üye ol.",
  canonical: "/kayit",
  noIndex: true,
});

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  redirect({ href: "/kayit-ol", locale });
}
