import { SITE } from "@/config/site";
import JsonLd from "./JsonLd";

export default function WebsiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        name: SITE.name,
        alternateName: SITE.shortName,
        url: SITE.url,
        description: SITE.description,
        inLanguage: ["tr", "az"],
        publisher: {
          "@id": `${SITE.url}/#organization`,
        },
      }}
    />
  );
}
