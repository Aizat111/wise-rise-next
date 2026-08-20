import { getTranslations } from "next-intl/server";

import { Link } from "@/core/i18n/navigation";

import { INFORMATION_ROUTES } from "../constants";
import { HtmlContent } from "../components/HtmlContent";
import { InformationLayout } from "../components/InformationLayout";
import { InformationProse } from "../components/InformationProse";


export async function CommercialElectronicMessagePage() {
  const tInfo = await getTranslations("information");
  const t = await getTranslations("commercialElectronicMessage");


  return (
    <InformationLayout title={t("title")}>
      <InformationProse>
        <p>{t("paragraph1")}</p>
        <HtmlContent html={t.raw("paragraph2")} />
        <p>{t("paragraph3")}</p>
        <HtmlContent html={t.raw("paragraph4")} />
        <div className="mb-3 px-5">
          <ol>
            <li>
              {t('paragraph5')} (
              <a href="https://vatandas.iys.org.tr" target="_blank">
                https://vatandas.iys.org.tr
              </a>
              ){' '}
            </li>
            <li>
              <a href="mailto:info@wisenrise.com">info@wisenrise.com </a>üzerinden
            </li>
            <li> {t('paragraph7')} </li>
          </ol>
          <br />
        </div>
        <p>{t("closing")}</p>
        <p>{t("companyName")}</p>



      </InformationProse>
    </InformationLayout>
  );
}

