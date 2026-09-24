import type { SubscriptionPlan } from "@/core/types/plan.types";
import { MEMBERSHIP_PLANS_ROUTE } from "@/features/membership-plans/constants";
import { toSafePrice } from "@/shared/ui/banners/format-plan-price";

import JsonLd from "../JsonLd";
import { localizedPath, toAbsoluteUrl } from "../site-url";

type AggregateOfferSchemaProps = {
  locale: string;
  monthlyPlan: SubscriptionPlan | null;
  yearlyPlan: SubscriptionPlan | null;
};

function schemaPrice(price: number): string {
  return Number.isInteger(price) ? String(price) : price.toFixed(2);
}

export default function AggregateOfferSchema({
  locale,
  monthlyPlan,
  yearlyPlan,
}: AggregateOfferSchemaProps) {
  const monthlyPrice = toSafePrice(monthlyPlan?.price);
  const yearlyPrice = toSafePrice(yearlyPlan?.price);

  const offers = [
    monthlyPrice == null
      ? null
      : {
          "@type": "Offer",
          name: "Aylık Plan",
          price: schemaPrice(monthlyPrice),
          priceCurrency: "TRY",
          availability: "https://schema.org/InStock",
          billingIncrement: "P1M",
        },
    yearlyPrice == null
      ? null
      : {
          "@type": "Offer",
          name: "Yıllık Plan",
          price: schemaPrice(yearlyPrice),
          priceCurrency: "TRY",
          availability: "https://schema.org/InStock",
          billingIncrement: "P1Y",
        },
  ].filter((offer) => offer != null);

  if (offers.length === 0) return null;

  const prices = offers.map((offer) => Number(offer.price));
  const url = toAbsoluteUrl(localizedPath(locale, MEMBERSHIP_PLANS_ROUTE));

  return (
    <JsonLd
      id="aggregate-offer-schema"
      data={{
        "@context": "https://schema.org",
        "@type": "AggregateOffer",
        "@id": `${url}#offers`,
        url,
        priceCurrency: "TRY",
        lowPrice: schemaPrice(Math.min(...prices)),
        highPrice: schemaPrice(Math.max(...prices)),
        offerCount: String(offers.length),
        offers,
      }}
    />
  );
}
