import { getTranslations } from "next-intl/server";

import { InformationLayout } from "../components/InformationLayout";
import { InformationProse } from "../components/InformationProse";

const PRE_INFO_PARAGRAPHS = [
  "paragraph1",
  "paragraph2",
  "paragraph3",
  "paragraph4",
  "paragraph5",
  "paragraph6",
  "paragraph7",
  "paragraph8",
  "paragraph9",
] as const;

const PRE_INFO_FEATURES = [
  "feature1",
  "feature2",
  "feature3",
  "feature4",
  "feature5",
  "feature6",
] as const;

export async function PreInfoFormPage() {
  const tInfo = await getTranslations("information");
  const t = await getTranslations("preliminaryInformationForm");
  const title = tInfo("pages.preInfo");

  return (
    <InformationLayout title={title} breadcrumbCurrent={t("breadcrumbCurrent")}>
      <InformationProse>
        {PRE_INFO_PARAGRAPHS.slice(0, 4).map((key) => (
          <p key={key}>{t(key)}</p>
        ))}

        <p>
          <strong>{t("table.cash")}</strong>
          {" / "}
          <strong>{t("table.installment")}</strong>
        </p>
        <p>{t("table.accountProfile")}</p>
        <ul>
          {PRE_INFO_FEATURES.map((key) => (
            <li key={key}>{t(`table.${key}`)}</li>
          ))}
        </ul>

        {PRE_INFO_PARAGRAPHS.slice(4).map((key) => (
          <p key={key}>{t(key)}</p>
        ))}

        <p className="pt-4">{t("signature")}</p>
        <p className="font-semibold">{t("companyName")}</p>
      </InformationProse>
    </InformationLayout>
  );
}
