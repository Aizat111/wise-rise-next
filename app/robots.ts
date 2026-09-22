import type { MetadataRoute } from "next";

import { SITE } from "@/config/site";
import {
  localizedPathVariants,
  NOINDEX_PATH_PREFIXES,
} from "@/shared/seo/public-routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: NOINDEX_PATH_PREFIXES.flatMap((path) =>
        localizedPathVariants(path),
      ),
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
