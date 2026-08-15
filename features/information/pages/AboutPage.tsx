import { getTranslations } from "next-intl/server";
import { InformationLayout } from "../components/InformationLayout";
import { InformationProse } from "../components/InformationProse";
import { ContactCard } from "../components/ContactCard";
import { SITE } from "@/config/site";

export async function AboutPage() {
  const tInfo = await getTranslations("information");
  const t = await getTranslations("aboutUs");
  const title = tInfo("pages.about");
  const contact = tInfo("pages.contact")

  return (
    <InformationLayout title={title}>
      <InformationProse>
        <p>{t("description1")}</p>
        <p>{t("description2")}</p>
        <ContactCard
          title={contact}
          description={t("contactDescription")}
          emailLabel={t("email")}
          email={SITE.email}
          addressLabel={t("address")}
          address={SITE.contactAddress}
          buttonLabel={t("contactButton")}
          className="mt-10 lg:mt-20 bg-surface backdrop-blur-sm rounded-lg p-20 py-30"
        />
      </InformationProse>
    </InformationLayout>
  );
}
