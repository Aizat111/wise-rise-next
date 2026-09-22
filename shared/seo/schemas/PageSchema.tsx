import JsonLd from "../JsonLd";
import {
  breadcrumbId,
  ORGANIZATION_ID,
  WEBSITE_ID,
  webpageId,
} from "../schema-ids";
import { toAbsoluteUrl } from "../site-url";

import type { BreadcrumbItem } from "./BreadcrumbSchema";

type PageSchemaProps = {
  items: BreadcrumbItem[];
};

/**
 * Non-home pages: BreadcrumbList plus a WebPage that points at the
 * homepage Organization and WebSite entities.
 */
export default function PageSchema({ items }: PageSchemaProps) {
  if (items.length < 2) return null;

  const current = items[items.length - 1];
  const pageUrl = toAbsoluteUrl(current.path);

  return (
    <JsonLd
      id="jsonld-page"
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": webpageId(pageUrl),
            url: pageUrl,
            name: current.name,
            isPartOf: { "@id": WEBSITE_ID },
            publisher: { "@id": ORGANIZATION_ID },
            breadcrumb: { "@id": breadcrumbId(pageUrl) },
          },
          {
            "@type": "BreadcrumbList",
            "@id": breadcrumbId(pageUrl),
            itemListElement: items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: toAbsoluteUrl(item.path),
            })),
          },
        ],
      }}
    />
  );
}
