import { getTranslations } from "next-intl/server";

import { InformationLayout } from "../components/InformationLayout";
import { InformationProse } from "../components/InformationProse";

const COOKIE_SECTIONS = [
  "section1",
  "section2",
  "section3",
  "section4",
  "section5",
] as const;

export async function CookiePolicyPage() {
  const t = await getTranslations("information");
  const tCookie = await getTranslations("cookiePolicy");
  const title = t("pages.cookiePolicy");

  return (
    <InformationLayout title={title}>
      <InformationProse>
        <p>{tCookie("intro")}</p>
        {COOKIE_SECTIONS.map((section) => (
          <div key={section}>
            <h2>{tCookie(`${section}.title`)}</h2>
            <p>{tCookie(`${section}.content`)}</p>
          </div>
        ))}
        <p className="pt-4">{tCookie("closing")}</p>
      </InformationProse>
    </InformationLayout>
  );
}
