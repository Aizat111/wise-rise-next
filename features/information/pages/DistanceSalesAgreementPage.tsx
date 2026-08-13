import { getTranslations } from "next-intl/server";

import { Link } from "@/core/i18n/navigation";

import { INFORMATION_ROUTES } from "../constants";
import { HtmlContent } from "../components/HtmlContent";
import { InformationLayout } from "../components/InformationLayout";
import { InformationProse } from "../components/InformationProse";

const PLAN_FEATURES = [
  "feature1",
  "feature2",
  "feature3",
  "feature4",
  "feature5",
  "feature6",
  "feature7",
] as const;

/** Paragraph counts per article (onlineConditions namespace). */
const ARTICLE_PARAGRAPH_COUNTS: Record<number, number> = {
  5: 30,
  6: 4,
  7: 3,
  8: 2,
  9: 7,
  10: 2,
};

type NestedParagraph = {
  title?: string;
  text?: string;
  text2?: string;
  website?: string;
  link?: string;
  intro?: string;
  [key: string]: string | undefined;
};

export async function DistanceSalesAgreementPage() {
  const tInfo = await getTranslations("information");
  const t = await getTranslations("onlineConditions");
  const title = tInfo("pages.distanceSales");

  return (
    <InformationLayout title={title}>
      <InformationProse>
        <h2>{t("subtitle")}</h2>

        <h2>{t("article1.title")}</h2>
        <HtmlContent html={t("article1.p1")} />
        <HtmlContent html={t("article1.p2")} />
        <p>{t("article1.p3")}</p>
        <p>{t("article1.p4")}</p>

        <h2>{t("article2.title")}</h2>
        <h3>{t("article2.sellerTitle")}</h3>
        <SellerBuyerDetails
          rows={[
            [t("article2.commercialTitle"), t("article2.commercialValue")],
            [t("article2.taxNo"), t("article2.taxNoValue")],
            [t("article2.mersisNo"), t("article2.mersisNoValue")],
            [t("article2.address"), t("article2.addressValue")],
            [t("article2.email"), t("article2.emailValue"), true],
          ]}
        />
        <h3>{t("article2.buyerTitle")}</h3>
        <SellerBuyerDetails
          rows={[
            [t("article2.nameSurname"), ""],
            [t("article2.tcNo"), ""],
            [t("article2.phone"), ""],
            [t("article2.email"), ""],
            [t("article2.address"), ""],
          ]}
        />

        <h2>{t("article3.title")}</h2>
        <p>{t("article3.p1")}</p>
        <p>{t("article3.p2")}</p>
        <p>{t("article3.p3")}</p>

        <h2>{t("article4.title")}</h2>
        <p>
          <strong>{t("article4.cash")}</strong>
          {" / "}
          <strong>{t("article4.installment")}</strong>
        </p>
        <p>{t("article4.accountProfile")}</p>
        <ul>
          {PLAN_FEATURES.map((key) => (
            <li key={key}>{t(`article4.${key}`)}</li>
          ))}
        </ul>
        <p>
          {t("article4.bankCard")} / {t("article4.creditCard")}
        </p>

        {Object.entries(ARTICLE_PARAGRAPH_COUNTS).map(([num, count]) => (
          <NestedArticle
            key={num}
            articleNum={Number(num)}
            paragraphCount={count}
            t={t}
          />
        ))}

        <h3>{t("article10.sellerProvider")}</h3>
        <SellerBuyerDetails
          rows={[
            [t("article10.commercialTitle"), t("article10.commercialValue")],
            [t("article10.taxNo"), t("article10.taxNoValue")],
            [t("article10.mersisNo"), t("article10.mersisNoValue")],
            [t("article10.address"), t("article10.addressValue")],
            [t("article10.email"), t("article10.emailValue"), true],
          ]}
        />
        <h3>{t("article10.buyer")}</h3>
        <SellerBuyerDetails
          rows={[
            [t("article10.nameSurname"), ""],
            [t("article10.tcNo"), ""],
          ]}
        />
      </InformationProse>
    </InformationLayout>
  );
}

type OnlineConditionsT = Awaited<
  ReturnType<typeof getTranslations<"onlineConditions">>
>;

function NestedArticle({
  articleNum,
  paragraphCount,
  t,
}: {
  articleNum: number;
  paragraphCount: number;
  t: OnlineConditionsT;
}) {
  const articleKey = `article${articleNum}`;

  return (
    <div>
      <h2>{t(`${articleKey}.title`)}</h2>
      {Array.from({ length: paragraphCount }, (_, i) => {
        const pKey = `p${i + 1}`;
        const raw = t.raw(`${articleKey}.${pKey}`) as string | NestedParagraph;

        if (typeof raw === "string") {
          return <HtmlContent key={pKey} html={raw} />;
        }

        if (!raw || typeof raw !== "object") return null;

        const listItems = Object.keys(raw)
          .filter((k) => k.startsWith("li"))
          .sort()
          .map((k) => raw[k])
          .filter(Boolean) as string[];

        return (
          <div key={pKey} className="space-y-2">
            {raw.title ? <h3>{raw.title}</h3> : null}
            {raw.intro ? <p>{raw.intro}</p> : null}
            {raw.text ? (
              <p>
                <HtmlContent html={raw.text} as="span" />
                {raw.link ? (
                  <>
                    {" "}
                    <Link href={INFORMATION_ROUTES.cookiePolicy}>
                      {raw.link}
                    </Link>
                  </>
                ) : null}
                {raw.website ? (
                  <>
                    {" "}
                    <a
                      href={`https://${raw.website.replace(/^https?:\/\//, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {raw.website}
                    </a>
                  </>
                ) : null}
                {raw.text2 ? <> {raw.text2}</> : null}
              </p>
            ) : raw.text2 ? (
              <p>{raw.text2}</p>
            ) : null}
            {listItems.length > 0 ? (
              <ul>
                {listItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function SellerBuyerDetails({
  rows,
}: {
  rows: Array<[string, string, boolean?]>;
}) {
  return (
    <ul className="list-none space-y-1 pl-0">
      {rows.map(([label, value, isEmail]) => (
        <li key={label}>
          <strong>{label}</strong>{" "}
          {isEmail && value ? (
            <a href={`mailto:${value}`}>{value}</a>
          ) : (
            value
          )}
        </li>
      ))}
    </ul>
  );
}
