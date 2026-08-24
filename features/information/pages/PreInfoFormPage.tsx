import { getTranslations } from "next-intl/server";

import { InformationLayout } from "../components/InformationLayout";
import { InformationProse } from "../components/InformationProse";
import { CircleCheckIcon } from "lucide-react";

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

        <table className="border border-white w-full my-10">
          <thead >
            <tr className="">
              <th className="border border-white w-50 text-center p-3"><CircleCheckIcon className="mx-auto" /></th>
              <th className="border border-white w-50 text-center p-3"><CircleCheckIcon className="mx-auto" /></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="w-50 text-center border border-white p-3">{t("table.cash")}</td>
              <td className="w-50 text-center border border-white">{t("table.installment")}</td>
            </tr>
            <tr>
              <td className="w-50 text-center border border-white p-3">{t("table.accountProfile")}</td>
              <td className="w-50 text-center border border-white">{t("table.accountProfile")}</td>
            </tr>
            <tr>
              <td className="w-50 text-center border border-white p-3">
                <ul className="list-disc list-inside text-center">
                  {PRE_INFO_FEATURES.map((key) => (
                    <li key={key} className="">{t(`table.${key}`)}</li>
                  ))}
                </ul>
              </td>
              <td className="w-50 text-center border border-white">
                <ul className="list-disc list-inside text-center">
                  {PRE_INFO_FEATURES.map((key) => (
                    <li key={key} className="">{t(`table.${key}`)}</li>
                  ))}
                </ul>
              </td>
            </tr>
          </tbody>


        </table>

        {PRE_INFO_PARAGRAPHS.slice(4).map((key) => (
          <p key={key}>{t(key)}</p>
        ))}
        <div className="w-full text-center text-white font-semibold mt-5">
          <p className="">{t("signature")}</p>
          <p className="text-lg lg:text-2xl">{t("companyName")}</p>
        </div>

      </InformationProse>
    </InformationLayout>
  );
}
