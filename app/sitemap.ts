import type { MetadataRoute } from "next";

import { SITE } from "@/config/site";
import { DEFAULT_LOCALE, locales } from "@/core/config/domain-locale.config";

function localizedPath(locale: string, path: string) {
  const normalized = path === "/" ? "" : path;
  if (locale === DEFAULT_LOCALE) {
    return `${SITE.url}${normalized || "/"}`;
  }
  return `${SITE.url}/${locale}${normalized}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPaths = ["/"];

  return publicPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: localizedPath(locale, path),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
  );
}
