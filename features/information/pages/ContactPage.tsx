import { getTranslations } from "next-intl/server";

import { SITE } from "@/config/site";

import { ContactCard } from "../components/ContactCard";
import { InformationLayout } from "../components/InformationLayout";
import { InformationProse } from "../components/InformationProse";

export async function ContactPage() {
    const tInfo = await getTranslations("information");
    const t = await getTranslations("aboutUs");
    const title = tInfo("pages.contact");

    return (
        <InformationLayout title={title}>
            <InformationProse>

                <ContactCard
                    title={title}
                    description={t("contactDescription")}
                    emailLabel={t("email")}
                    email={SITE.email}
                    addressLabel={t("address")}
                    address={SITE.contactAddress}
                    buttonLabel={t("contactButton")}

                />
            </InformationProse>
        </InformationLayout>
    );
}
