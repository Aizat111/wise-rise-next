import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type BuildInformationMetadataArgs = {
  locale: string;
  path: `/${string}`;
  title: string;
  description?: string;
  keywords?: string[];
};

export function buildInformationMetadata({
  locale,
  path,
  title,
  description,
  keywords = [],
}: BuildInformationMetadataArgs) {
  const canonical =
    locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;

  return buildPageMetadata({
    title,
    description: description ?? title,
    canonical,
    keywords: [title, "Wise&Rise", ...keywords],
  });
}
