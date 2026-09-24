import type { Classroom } from "@/core/types/classroom.types";
import { MEMBERSHIP_PLANS_ROUTE } from "@/features/membership-plans/constants";
import { getCourseCoverImage } from "@/features/course/api/course.utils";

import JsonLd from "../JsonLd";
import { ORGANIZATION_ID, teacherPersonId } from "../schema-ids";
import { localizedPath, toAbsoluteUrl } from "../site-url";

type CourseSchemaProps = {
  course: Classroom;
  locale: string;
  teacherSlug: string;
  courseSlug: string;
};

function toPlainText(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Converts `HH:MM:SS` or `MM:SS` into an ISO 8601 duration (`PT1H55M36S`). */
function toIso8601Duration(duration: string | null | undefined): string | null {
  if (!duration) return null;

  const parts = duration
    .trim()
    .split(":")
    .map((part) => Number(part));

  if (
    parts.length < 2 ||
    parts.length > 3 ||
    parts.some((part) => !Number.isFinite(part) || part < 0)
  ) {
    return null;
  }

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
  } else {
    [minutes, seconds] = parts;
  }

  const totalSeconds = Math.floor(hours * 3600 + minutes * 60 + seconds);
  if (totalSeconds <= 0) return null;

  const isoHours = Math.floor(totalSeconds / 3600);
  const isoMinutes = Math.floor((totalSeconds % 3600) / 60);
  const isoSeconds = totalSeconds % 60;

  let result = "PT";
  if (isoHours > 0) result += `${isoHours}H`;
  if (isoMinutes > 0) result += `${isoMinutes}M`;
  if (isoSeconds > 0) result += `${isoSeconds}S`;
  return result;
}

function courseTeaches(course: Classroom): string[] {
  const names = [...(course.videos ?? [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((video) => toPlainText(video.name))
    .filter(Boolean);

  return [...new Set(names)];
}

export default function CourseSchema({
  course,
  locale,
  teacherSlug,
  courseSlug,
}: CourseSchemaProps) {
  const url = toAbsoluteUrl(
    localizedPath(locale, `/${teacherSlug}/${courseSlug}`),
  );
  const description = toPlainText(course.description) || course.name;
  const image = getCourseCoverImage(course);
  const duration = toIso8601Duration(course.classroom_duration);
  const teaches = courseTeaches(course);
  const about = toPlainText(course.category?.name) || course.name;
  const teacherName = toPlainText(course.teacher?.name);
  const teacherSlugForId = course.teacher?.slug?.trim() || teacherSlug;

  return (
    <JsonLd
      id="course-schema"
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": `${url}#course`,
        name: course.name,
        description,
        url,
        ...(image ? { image } : {}),
        provider: {
          "@id": ORGANIZATION_ID,
        },
        ...(teacherName
          ? {
              instructor: {
                "@type": "Person",
                "@id": teacherPersonId(teacherSlugForId),
                name: teacherName,
              },
            }
          : {}),
        about,
        ...(teaches.length > 0 ? { teaches } : {}),
        ...(duration ? { timeRequired: duration } : {}),
        inLanguage: locale,
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          ...(duration ? { courseWorkload: duration } : {}),
        },
        offers: {
          "@type": "Offer",
          category: "Subscription",
          price: "0",
          priceCurrency: "TRY",
          availability: course.coming_soon
            ? "https://schema.org/PreOrder"
            : "https://schema.org/InStock",
          url: toAbsoluteUrl(localizedPath(locale, MEMBERSHIP_PLANS_ROUTE)),
        },
      }}
    />
  );
}
