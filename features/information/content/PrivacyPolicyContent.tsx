import { getTranslations } from "next-intl/server";

import { HtmlContent } from "../components/HtmlContent";
import { InformationLayout } from "../components/InformationLayout";
import { InformationProse } from "../components/InformationProse";

const PURPOSE_GROUPS = [
  "identityInfo",
  "communicationInfo",
  "transactionSecurityInfo",
  "customerTransactionInfo",
  "financialInfo",
  "legalTransactionInfo",
  "marketingInfo",
] as const;

const PURPOSE_ITEM_COUNTS: Record<(typeof PURPOSE_GROUPS)[number], number> = {
  identityInfo: 10,
  communicationInfo: 10,
  transactionSecurityInfo: 5,
  customerTransactionInfo: 10,
  financialInfo: 10,
  legalTransactionInfo: 10,
  marketingInfo: 5,
};

type PrivacyPolicyContentProps = {
  /** Override page title (e.g. KVKK). Defaults to information.pages.privacyPolicy. */
  titleKey?: "pages.privacyPolicy" | "pages.kvkk";
};

export async function PrivacyPolicyContent({
  titleKey = "pages.privacyPolicy",
}: PrivacyPolicyContentProps) {
  const tInfo = await getTranslations("information");
  const t = await getTranslations("privacyPolicy");
  const title = tInfo(titleKey);

  const rights = [
    "item1",
    "item2",
    "item3",
    "item4",
    "item5",
    "item6",
    "item7",
    "item8",
  ] as const;

  return (
    <InformationLayout title={title}>
      <InformationProse>
        <h2>{t("mainTitle")}</h2>
        <HtmlContent html={t.raw("introduction")} />
        <HtmlContent html={t("introText")} />

        <h2>{t("section1.title")}</h2>
        <p>{t("section1.content")}</p>
        <p>{t("section1.content2")}</p>

        <h2>{t("section2.title")}</h2>
        <p>{t("section2.intro")}</p>
        <br />
        <br />
        <table className="w-full border border-gray-300 border-collapse">
          <thead>
            <tr className="h-15">
              <th className="w-100 border border-gray-300 text-center">{t('section2.table.dataOwner')}</th>
              <th className="w-70  border border-gray-300 text-center">{t('section2.table.dataCategory')}</th>
              <th className=" border border-gray-300 text-center">{t('section2.table.dataTypes')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th rowSpan={3} className="text-center border border-gray-300" style={{ verticalAlign: 'middle' }}>
                {t('section2.table.onlineVisitor')} <span className="text-primary">{t('section2.table.visitor')}</span>
              </th>
              <td className="p-3 border border-gray-300">{t('section2.table.communication')}</td>
              <td className="p-3 border border-gray-300">{t('section2.table.communicationData')}</td>
            </tr>
            <tr>
              <td className="p-3 border border-gray-300">{t('section2.table.transactionSecurity')}</td>
              <td className="p-3 border border-gray-300">
                {t('section2.table.transactionSecurityData')}
              </td>
            </tr>
            <tr>
              <td className="p-3 border border-gray-300">{t('section2.table.marketingInfo')}</td>
              <td className="p-3 border border-gray-300">{t('section2.table.marketingInfoData')}</td>
            </tr>

            <tr>
              <th rowSpan={6} className="text-center border border-gray-300" style={{ verticalAlign: 'middle' }}>
                {t('section2.table.onlineSubscriber')}
                <span className="text-primary">{t('section2.table.member')}</span>
              </th>
              <td className="p-3 border border-gray-300">{t('section2.table.identity')}</td>
              <td className="p-3 border border-gray-300">{t('section2.table.identityData')}</td>
            </tr>
            <tr>
              <td className="p-3 border border-gray-300">{t('section2.table.communication')}</td>
              <td className="p-3 border border-gray-300">{t('section2.table.communicationDataFull')}</td>
            </tr>
            <tr>
              <td className="p-3 border border-gray-300">{t('section2.table.customerTransactionInfo')}</td>
              <td className="p-3 border border-gray-300">{t('section2.table.customerTransactionInfoData')}</td>
            </tr>
            <tr>
              <td className="p-3 border border-gray-300">{t('section2.table.transactionSecurity')}</td>
              <td className="p-3 border border-gray-300">{t('section2.table.transactionSecurityDataFull')}</td>
            </tr>
            <tr>
              <td className="p-3 border border-gray-300">{t('section2.table.legalTransactionInfo')}</td>
              <td>
                <td className="p-3 border border-gray-300">{t('section2.table.legalTransactionInfoData')}</td>
              </td>
            </tr>
            <tr>
              <td className="p-3 border border-gray-300">{t('section2.table.marketingInfo')}</td>
              <td className="p-3 border border-gray-300">{t('section2.table.marketingInfoData')}</td>
            </tr>
          </tbody>
        </table>
        <p>{t("section2.tableNote")}</p>

        {PURPOSE_GROUPS.map((group) => {
          const count = PURPOSE_ITEM_COUNTS[group];
          const items = Array.from({ length: count }, (_, i) => `item${i + 1}`);

          return (
            <div key={group}>
              <h3>{t(`section2.${group}.title`)}</h3>

              <ul>
                {items.map((item) => (
                  <li key={item}>{t(`section2.${group}.${item}`)}</li>
                ))}
              </ul>
            </div>
          );
        })}

        <p>{t("section2.paymentNote")}</p>

        <h2>{t("section3.title")}</h2>
        <p>{t("section3.content")}</p>

        <h2>{t("section4.title")}</h2>
        <h3>{t("section4.domestic.title")}</h3>
        <p>{t("section4.domestic.content1")}</p>
        <p>{t("section4.domestic.content2")}</p>
        <p>{t("section4.domestic.content3")}</p>
        <h3>{t("section4.international.title")}</h3>
        <p>{t("section4.international.content1")}</p>
        <p>{t("section4.international.content2")}</p>
        <p>{t("section4.international.content3")}</p>
        <p>{t("section4.international.content4")}</p>

        <h2>{t("section5.title")}</h2>
        <p>{t("section5.content")}</p>

        <h2>{t("section6.title")}</h2>
        <p>{t("section6.intro")}</p>
        <ul>
          {rights.map((item) => (
            <li key={item}>{t(`section6.rights.${item}`)}</li>
          ))}
        </ul>
        <p>
          {t("section6.applicationInfo")}{" "}
          <span className="font-medium">{t("section6.applicationForm")}</span>{" "}
          {t("section6.applicationAddress")}{" "}
          <a href={`mailto:${t("section6.applicationEmail")}`}>
            {t("section6.applicationEmail")}
          </a>{" "}
          {t("section6.applicationEmail2")}
        </p>
        <p>{t("section6.costInfo")}</p>
        <p>{t("section6.applicationRequirements")}</p>

        <p className="pt-4 text-center"></p>
        <p className="text-center text-white font-bold ">{t("closing.respectfully")} <br /> <span className="text-xl">{t("closing.companyName")}</span></p>
      </InformationProse>
    </InformationLayout>
  );
}
