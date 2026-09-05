import { getTranslations } from "next-intl/server";
import { CircleCheckIcon } from "lucide-react";

import { HtmlContent } from "../components/HtmlContent";
import { InformationLayout } from "../components/InformationLayout";
import { InformationProse } from "../components/InformationProse";

const TERMS_SECTIONS = [
  { key: "section1", paragraphs: 4 },
  { key: "section2", paragraphs: 7 },
  { key: "section3", kind: "plans" as const },
  { key: "section4", paragraphs: 2 },
  { key: "section5", paragraphs: 2 },
  { key: "section6", paragraphs: 2 },
  { key: "section7", paragraphs: 2 },
  { key: "section8", paragraphs: 3 },
  { key: "section9", paragraphs: 3 },
  { key: "section10", paragraphs: 3 },
  { key: "section11", paragraphs: 7 },
] as const;

const PLAN_FEATURES = [
  "feature1",
  "feature2",
  "feature3",
  "feature4",
  "feature5",
  "feature6",
  "feature7",
] as const;

export async function TermsOfUsePage() {
  const t = await getTranslations("termsOfUse");

  return (
    <InformationLayout
      title={t("title")}
      breadcrumbCurrent={t("breadcrumbCurrent")}
      homeLabel={t("breadcrumbHome")}
    >
      <InformationProse>
        {TERMS_SECTIONS.map((section) =>
          "kind" in section ? (
            <PlansSection key={section.key} t={t} />
          ) : (
            <TermsSection
              key={section.key}
              sectionKey={section.key}
              paragraphCount={section.paragraphs}
              t={t}
            />
          ),
        )}

        <div className="w-full text-center text-white font-semibold mt-5">
          <p>{t("signature")}</p>
          <p className="text-lg lg:text-2xl">{t("companyName")}</p>
        </div>
      </InformationProse>
    </InformationLayout>
  );
}

type TermsOfUseT = Awaited<ReturnType<typeof getTranslations<"termsOfUse">>>;

function TermsSection({
  sectionKey,
  paragraphCount,
  t,
}: {
  sectionKey: string;
  paragraphCount: number;
  t: TermsOfUseT;
}) {
  return (
    <>
      <h2>{t(`${sectionKey}.title`)}</h2>
      {Array.from({ length: paragraphCount }, (_, i) => {
        const paragraphKey = `${sectionKey}.paragraph${i + 1}`;

        return (
          <HtmlContent key={paragraphKey} html={t.raw(paragraphKey)} as="p" />
        );
      })}
    </>
  );
}

function PlansSection({ t }: { t: TermsOfUseT }) {
  return (
    <>
      <h2>{t("section3.title")}</h2>
      <table className="border border-white w-full my-10">
        <tbody>
          <tr>
            <td className="w-50 text-center border border-white p-3">
              {t("section3.table.cash")}
            </td>
            <td className="w-50 text-center border border-white">
              {t("section3.table.installment")}
            </td>
          </tr>
          <tr>
            <td className="w-50 text-center border border-white p-3">
              {t("section3.table.accountProfile")}
            </td>
            <td className="w-50 text-center border border-white">
              {t("section3.table.accountProfile")}
            </td>
          </tr>
          <tr>
            <td className="w-50 text-center border border-white p-3">
              <ul className="list-disc list-inside text-center">
                {PLAN_FEATURES.map((key) => (
                  <li key={key}>{t(`section3.table.${key}`)}</li>
                ))}
              </ul>
            </td>
            <td className="w-50 text-center border border-white">
              <ul className="list-disc list-inside text-center">
                {PLAN_FEATURES.map((key) => (
                  <li key={key}>{t(`section3.table.${key}`)}</li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <p>{t("section3.annualPlanTitle")}</p>
      <ul>
        <li>{t("section3.annualPlanFeature1")}</li>
        <li>{t("section3.annualPlanFeature2")}</li>
      </ul>
    </>
  );
}
