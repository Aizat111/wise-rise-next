import { SITE } from "@/config/site";

import JsonLd from "./JsonLd";
import {
  ORGANIZATION_ID,
  SEARCH_ACTION_TARGET,
  WEBSITE_ID,
} from "./schema-ids";

export default function WebsiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE.name,
        alternateName: SITE.shortName,
        url: SITE.url,
        description: SITE.description,
        inLanguage: ["tr", "az"],
        publisher: {
          "@id": ORGANIZATION_ID,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: SEARCH_ACTION_TARGET,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}
