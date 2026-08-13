import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { KvkkPage } from "@/features/information/pages/KvkkPage";
import { INFORMATION_ROUTES } from "@/features/information/constants";
import { buildInformationMetadata } from "@/features/information/utils/build-information-metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "information" });

  return buildInformationMetadata({
    locale,
    path: INFORMATION_ROUTES.kvkk,
    title: t("pages.kvkk"),
  });
}

export default async function KvkkRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <KvkkPage />;
}
