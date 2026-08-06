import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { courseService } from "@/features/course/api/course.service";
import { CourseDetailPage } from "@/features/course/pages/CourseDetailPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{
    locale: string;
    teacherSlug: string;
    courseSlug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, teacherSlug, courseSlug } = await params;
  const course = await courseService.getBySlugServer(courseSlug);

  if (!course) {
    return buildPageMetadata({
      title: "404",
      description: "",
      noIndex: true,
    });
  }

  const canonicalBase =
    locale === DEFAULT_LOCALE
      ? `/${teacherSlug}/${courseSlug}`
      : `/${locale}/${teacherSlug}/${courseSlug}`;

  return buildPageMetadata({
    title: course.name,
    description: course.description?.trim() || course.name,
    canonical: canonicalBase,
    image:
      course.banner?.path ??
      course.cover?.path ??
      course.thumbnail?.path ??
      undefined,
    keywords: [
      course.name,
      course.teacher?.name ?? "",
      course.category?.name ?? "",
      "online eğitim",
      "Wise&Rise",
    ].filter(Boolean),
  });
}

export default async function CoursePage({ params }: Props) {
  const { locale, teacherSlug, courseSlug } = await params;
  setRequestLocale(locale);

  const course = await courseService.getBySlugServer(courseSlug);
  if (!course) {
    notFound();
  }

  return (
    <CourseDetailPage courseSlug={courseSlug} teacherSlug={teacherSlug} />
  );
}
