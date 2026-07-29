import type { Metadata } from "next";

import { SITE } from "@/config/site";

interface BuildPageMetadataProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  /** Use absolute title (skip layout `%s | Site` template). */
  absoluteTitle?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  canonical = "",
  keywords = [],
  image = SITE.defaultImage,
  noIndex = false,
  absoluteTitle = false,
}: BuildPageMetadataProps): Metadata {
  const url = canonical
    ? `${SITE.url}${canonical.startsWith("/") ? canonical : `/${canonical}`}`
    : SITE.url;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: [...SITE.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: SITE.twitter,
    },
  };
}

/** @deprecated Prefer `buildPageMetadata` to avoid clashing with Next.js `generateMetadata`. */
export const generateMetadata = buildPageMetadata;
