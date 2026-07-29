import type { MetadataRoute } from "next";

import { SITE } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/giris",
        "/kayit",
        "/kayit-ol",
        "/sifremi-unuttum",
        "/profil-ekle",
        "/profil-sec",
        "/survey",
        "/az/giris",
        "/az/kayit",
        "/az/kayit-ol",
        "/az/sifremi-unuttum",
        "/az/profil-ekle",
        "/az/profil-sec",
        "/az/survey",
      ],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
