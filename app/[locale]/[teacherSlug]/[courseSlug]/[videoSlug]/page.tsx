import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";
import { courseService } from "@/features/course/api/course.service";
import {
  findCourseVideoBySlug,
  mapClassroomVideos,
} from "@/features/course/api/course.utils";
import { VideoPlayerPage } from "@/features/course/pages/VideoPlayerPage";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{
    locale: string;
    teacherSlug: string;
    courseSlug: string;
    videoSlug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, teacherSlug, courseSlug, videoSlug } = await params;
  const course = await courseService.getBySlugServer(courseSlug);

  if (!course) {
    return buildPageMetadata({
      title: "404",
      description: "",
      noIndex: true,
    });
  }

  const video = findCourseVideoBySlug(
    mapClassroomVideos(course.videos),
    videoSlug,
  );

  if (!video) {
    return buildPageMetadata({
      title: "404",
      description: "",
      noIndex: true,
    });
  }

  const canonicalBase =
    locale === DEFAULT_LOCALE
      ? `/${teacherSlug}/${courseSlug}/${videoSlug}`
      : `/${locale}/${teacherSlug}/${courseSlug}/${videoSlug}`;

  return buildPageMetadata({
    title: `${video.name} | ${course.name}`,
    description: video.description || course.description?.trim() || video.name,
    canonical: canonicalBase,
    image: video.thumbnail ?? course.thumbnail?.path ?? undefined,
    keywords: [
      video.name,
      course.name,
      course.teacher?.name ?? "",
      course.category?.name ?? "",
      "online eğitim",
      "Wise&Rise",
    ].filter(Boolean),
  });
}

export default async function VideoPage({ params }: Props) {
  const { locale, teacherSlug, courseSlug, videoSlug } = await params;
  setRequestLocale(locale);

  const course = await courseService.getBySlugServer(courseSlug);
  if (!course) {
    notFound();
  }

  const video = findCourseVideoBySlug(
    mapClassroomVideos(course.videos),
    videoSlug,
  );
  if (!video) {
    notFound();
  }

  return (
    <VideoPlayerPage
      teacherSlug={teacherSlug}
      courseSlug={courseSlug}
      videoSlug={videoSlug}
    />
  );
}
