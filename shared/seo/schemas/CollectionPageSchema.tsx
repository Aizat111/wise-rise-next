import type { Classroom } from "@/core/types/classroom.types";
import { buildCourseHref } from "@/features/course/api/course.utils";

import JsonLd from "../JsonLd";
import { localizedPath, toAbsoluteUrl } from "../site-url";

type CollectionPageSchemaProps = {
  locale: string;
  path: string;
  name: string;
  description: string;
  classrooms: Classroom[] | null | undefined;
};

function courseItemPaths(classrooms: Classroom[] | null | undefined): string[] {
  if (!classrooms?.length) return [];

  const paths: string[] = [];

  for (const classroom of classrooms) {
    const href = buildCourseHref(classroom.teacher?.slug, classroom.slug);
    if (href) paths.push(href);
  }

  return paths;
}

export default function CollectionPageSchema({
  locale,
  path,
  name,
  description,
  classrooms,
}: CollectionPageSchemaProps) {
  const itemPaths = courseItemPaths(classrooms);
  const pageName = name.trim();

  if (!pageName || itemPaths.length === 0) return null;

  const url = toAbsoluteUrl(localizedPath(locale, path));
  const pageDescription = description.trim();

  return (
    <JsonLd
      id="collection-page-schema"
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${url}#collectionpage`,
        url,
        name: pageName,
        ...(pageDescription ? { description: pageDescription } : {}),
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: itemPaths.length,
          itemListElement: itemPaths.map((itemPath, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: toAbsoluteUrl(localizedPath(locale, itemPath)),
          })),
        },
      }}
    />
  );
}
