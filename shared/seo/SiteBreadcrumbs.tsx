import { headers } from "next/headers";

import type { Category } from "@/core/api/types";

import { buildBreadcrumbItems, isHomePath } from "./build-breadcrumb-items";
import BreadcrumbSchema from "./schemas/BreadcrumbSchema";
import { PATHNAME_HEADER } from "./schema-ids";

type SiteBreadcrumbsProps = {
  locale: string;
  categories: Category[];
};

/** BreadcrumbList for every page except the homepage. Route templates do not opt in. */
export default async function SiteBreadcrumbs({
  locale,
  categories,
}: SiteBreadcrumbsProps) {
  const headerList = await headers();
  const pathname = headerList.get(PATHNAME_HEADER) ?? "";
  if (!pathname || isHomePath(pathname)) return null;

  const items = await buildBreadcrumbItems({ pathname, locale, categories });
  if (items.length < 2) return null;

  return <BreadcrumbSchema items={items} />;
}
