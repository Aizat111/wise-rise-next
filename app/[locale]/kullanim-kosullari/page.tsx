import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TermsOfUsePage } from "@/features/information/pages/TermsOfUsePage";
import { INFORMATION_ROUTES } from "@/features/information/constants";
import { buildInformationMetadata } from "@/features/information/utils/build-information-metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "termsOfUse" });

  return buildInformationMetadata({
    locale,
    path: INFORMATION_ROUTES.termsOfUse,
    title: t("title"),
  });
}

export default async function KullanimKosullariRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TermsOfUsePage />;
}
