import { getTranslations } from "next-intl/server";

import { MEMBERSHIP_SECTIONS } from "../constants";
import { HtmlContent } from "../components/HtmlContent";
import { InformationLayout } from "../components/InformationLayout";
import { InformationProse } from "../components/InformationProse";

export async function UserAgreementPage() {
  const tInfo = await getTranslations("information");
  const t = await getTranslations("membershipAgreement");
  const title = tInfo("pages.userAgreement");

  function getSectionNumber(key: string): number | null {
    const match = key.match(/\d+/);
    return match ? Number(match[0]) : null;
  }

  return (
    <InformationLayout title={title}>
      <InformationProse>
        {MEMBERSHIP_SECTIONS.map((section) => {
          const heading = t(`${section.key}.title`);

          if (section.kind === "description") {
            return (
              <div key={section.key}>
                <h2> {getSectionNumber(section.key)}.{heading}</h2>
                <HtmlContent html={t.raw(`${section.key}.description`)} />
              </div>
            );
          }

          const items = Array.from(
            { length: section.itemCount },
            (_, i) => `item${i + 1}`,
          );

          return (
            <div key={section.key}>
              <h2>{getSectionNumber(section.key)}.{heading}</h2>
              <ol className="list-none p-0">
                {items.map((item, index) => {
                  const sectionNumber = getSectionNumber(section.key);

                  return (
                    <li key={item} className="flex p-0 m-0 ">
                      <span className=" font-bold text-white">
                        {sectionNumber}.{index + 1}.{' '}
                      </span>

                      <HtmlContent
                        html={t.raw(`${section.key}.${item}`)}
                        as="span"
                      />
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </InformationProse>
    </InformationLayout>
  );
}
