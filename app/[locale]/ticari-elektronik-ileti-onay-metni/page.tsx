import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { INFORMATION_ROUTES } from "@/features/information/constants";
import { buildInformationMetadata } from "@/features/information/utils/build-information-metadata";
import { CommercialElectronicMessagePage } from "@/features/information/pages/CommercialElectronicMessage";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "information" });

    return buildInformationMetadata({
        locale,
        path: INFORMATION_ROUTES.distanceSales,
        title: t("pages.distanceSales"),
    });
}

export default async function MesafeliSatisRoute({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <CommercialElectronicMessagePage />;
}
