"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/core/i18n/navigation";
import { useAppSelector } from "@/store/hooks";

import {
  CourseNotFoundError,
  useCourseDetailQuery,
} from "../api/course.queries";
import {
  buildCourseMetaItems,
  buildVideoHref,
  getTrailerPlaybackUrl,
  mapClassroomVideos,
} from "../api/course.utils";
import type { CourseDetailPageProps, CourseVideoItem } from "../types";
import { CourseAboutSection } from "../components/CourseAboutSection";
import { CourseDetailSkeleton } from "../components/CourseDetailSkeleton";
import { CourseVideoSection } from "../components/CourseVideoSection";
import { LoginRequiredDialog } from "../components/LoginRequiredDialog";
import { TrailerDialog } from "../components/TrailerDialog";
import { CourseHero } from "../components/CourseHero";

export function CourseDetailPage({
  courseSlug,
  teacherSlug,
}: CourseDetailPageProps) {
  const t = useTranslations("course");
  const tLessons = useTranslations("lessonsDetail");
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useCourseDetailQuery(courseSlug);

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  if (error instanceof CourseNotFoundError) {
    notFound();
  }

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-xl font-semibold text-white">{t("loadError")}</h1>
        <p className="text-sm text-white/60">{t("loadErrorDescription")}</p>
        <Button
          onClick={() => void refetch()}
          disabled={isFetching}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  const videos = mapClassroomVideos(data.videos);
  const trailerUrl = getTrailerPlaybackUrl(data);
  const metaItems = buildCourseMetaItems(data, {
    category: tLessons("category"),
    teacher: tLessons("teacher"),
    duration: t("duration"),
    episodes: t("episodes"),
  });

  const handlePlayVideo = (video: CourseVideoItem) => {
    const href = buildVideoHref(teacherSlug, courseSlug, video.slug);
    if (href) router.push(href);
  };

  return (
    <div className="bg-background">
      <CourseHero
        course={data}
        onWatchTrailer={() => setTrailerOpen(true)}
      />

      <CourseAboutSection
        course={data}
        metaItems={metaItems}
        onWatchTrailer={() => setTrailerOpen(true)}
      />

      <CourseVideoSection
        videos={videos}
        isAuthenticated={isAuthenticated}
        onPlayVideo={handlePlayVideo}
        onLockedClick={() => setLoginOpen(true)}
      />

      <TrailerDialog
        open={trailerOpen}
        onOpenChange={setTrailerOpen}
        title={t("watchTrailer")}
        videoUrl={trailerUrl}
      />

      <LoginRequiredDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
