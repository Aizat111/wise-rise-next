import { SITE } from "@/config/site";
import JsonLd from "../JsonLd";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

type BreadcrumbSchemaProps = {
  items: BreadcrumbItem[];
};

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  if (items.length === 0) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${SITE.url}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
        })),
      }}
    />
  );
}
