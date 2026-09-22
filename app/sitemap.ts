import { unstable_cache } from "next/cache";
import type { MetadataRoute } from "next";

import type { Category } from "@/core/api/types";
import type { Classroom } from "@/core/types/classroom.types";
import { WE_THE_LIVING_SLUG } from "@/features/category/constants";
import { getCategories } from "@/features/category/api/get-categories";
import { buildCourseHref } from "@/features/course/api/course.utils";
import { classroomService } from "@/features/home/api/classroom.service";
import { locales } from "@/core/config/domain-locale.config";

import {
  INDEXABLE_STATIC_PATHS,
} from "@/shared/seo/public-routes";
import { localizedPath, toAbsoluteUrl } from "@/shared/seo/site-url";

/** Refresh the URL list weekly. Generation still runs on demand after expiry. */
export const revalidate = 604800;

const SITEMAP_PAGE_SIZE = 100;
const SITEMAP_MAX_PAGES = 20;

function collectCategoryPaths(categories: Category[]): string[] {
  const paths: string[] = [];

  for (const category of categories) {
    const active = category.is_active !== 0;
    if (category.slug && category.slug !== WE_THE_LIVING_SLUG && active) {
      paths.push(`/${category.slug}`);
    }
    if (category.children?.length) {
      paths.push(...collectCategoryPaths(category.children));
    }
  }

  return paths;
}

async function listPublicClassrooms(): Promise<Classroom[]> {
  const items: Classroom[] = [];
  const seenPage = new Set<string>();
  let page = 1;
  let lastPage = 1;

  while (page <= lastPage && page <= SITEMAP_MAX_PAGES) {
    const result = await classroomService.list({
      page,
      per_page: SITEMAP_PAGE_SIZE,
    });
    if (result.items.length === 0) break;

    const marker = String(result.items[0]?.id ?? "");
    if (seenPage.has(marker)) break;
    seenPage.add(marker);

    items.push(...result.items);
    lastPage = Math.max(result.lastPage, 1);
    if (result.currentPage >= result.lastPage) break;
    page += 1;
  }

  return items;
}

function coursePaths(classrooms: Classroom[]) {
  const paths = new Set<string>();

  for (const classroom of classrooms) {
    if (classroom.coming_soon) continue;
    const href = buildCourseHref(classroom.teacher?.slug, classroom.slug);
    if (href) paths.add(href);
  }

  return [...paths];
}

function toSitemapEntries(paths: string[]): MetadataRoute.Sitemap {
  const urls = new Set<string>();

  for (const path of paths) {
    for (const locale of locales) {
      urls.add(toAbsoluteUrl(localizedPath(locale, path)));
    }
  }

  const homeUrls = new Set([
    toAbsoluteUrl("/"),
    toAbsoluteUrl(localizedPath("az", "/")),
  ]);

  return [...urls].map((url) => ({
    url,
    changeFrequency: homeUrls.has(url) ? ("daily" as const) : ("weekly" as const),
    priority: homeUrls.has(url) ? 1 : 0.7,
  }));
}

const getSitemapSources = unstable_cache(
  async () => {
    const [categories, classrooms] = await Promise.all([
      getCategories().catch(() => [] as Category[]),
      listPublicClassrooms().catch(() => [] as Classroom[]),
    ]);

    return { categories, classrooms };
  },
  ["sitemap-sources"],
  { revalidate },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, classrooms } = await getSitemapSources();

  return toSitemapEntries([
    ...INDEXABLE_STATIC_PATHS,
    ...collectCategoryPaths(categories),
    ...coursePaths(classrooms),
  ]);
}
