import { SITE } from "@/config/site";
import JsonLd from "../JsonLd";

type ArticleSchemaProps = {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
};

export default function ArticleSchema({
  title,
  description,
  url,
  image = SITE.defaultImage,
  datePublished,
  dateModified,
  authorName = SITE.name,
}: ArticleSchemaProps) {
  const imageUrl = image.startsWith("http") ? image : `${SITE.url}${image}`;
  const pageUrl = url.startsWith("http") ? url : `${SITE.url}${url}`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image: imageUrl,
        url: pageUrl,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        author: {
          "@type": "Person",
          name: authorName,
        },
        publisher: {
          "@type": "Organization",
          name: SITE.name,
          logo: {
            "@type": "ImageObject",
            url: `${SITE.url}${SITE.logo}`,
          },
        },
      }}
    />
  );
}
