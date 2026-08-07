"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/core/i18n/navigation";
import { resolveMediaUrl } from "@/features/course/utils/mediaUrl";
import { useAppSelector } from "@/store/hooks";

import {
  CourseNotFoundError,
  useCourseDetailQuery,
} from "../api/course.queries";
import {
  buildVideoHref,
  findCourseVideoBySlug,
  mapClassroomVideos,
} from "../api/course.utils";
import type { CourseVideoItem, VideoPlayerPageProps } from "../types";
import { CourseVideoSection } from "../components/CourseVideoSection";
import { LoginRequiredDialog } from "../components/LoginRequiredDialog";
import { VideoHeader } from "../components/VideoHeader";
import { VideoPlayer } from "../components/VideoPlayer";
import { VideoSidebar } from "../components/VideoSidebar";
import { VideoWatchSkeleton } from "../components/VideoWatchSkeleton";

export function VideoPlayerPage({
  teacherSlug,
  courseSlug,
  videoSlug,
}: VideoPlayerPageProps) {
  const t = useTranslations("course");
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useCourseDetailQuery(courseSlug);

  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, [videoSlug]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoginOpen(true);
    }
  }, [isAuthenticated]);

  if (error instanceof CourseNotFoundError) {
    notFound();
  }

  if (isLoading) {
    return <VideoWatchSkeleton />;
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
  const activeVideo = findCourseVideoBySlug(videos, videoSlug);

  if (!activeVideo) {
    notFound();
  }

  const teacherName = data.teacher?.name ?? "";
  const teacherPhoto =
    resolveMediaUrl(data.teacher?.photo?.path) ??
    resolveMediaUrl(data.teacher?.logo?.path);
  const categoryName = data.category?.name ?? null;
  const canPlay =
    isAuthenticated && Boolean(activeVideo.playbackUrl);

  const handleSeek = (seconds: number) => {
    const video = playerRef.current;
    if (!video) return;
    video.currentTime = seconds;
    void video.play().catch(() => undefined);
  };

  const handlePlayVideo = (video: CourseVideoItem) => {
    const href = buildVideoHref(teacherSlug, courseSlug, video.slug);
    if (href) router.push(href);
  };

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-6 sm:px-6 lg:px-10 lg:pb-24 lg:pt-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start lg:gap-8">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="overflow-hidden rounded-xl bg-black shadow-lg shadow-black/30">
              <div className="relative aspect-video w-full">
                {canPlay && activeVideo.playbackUrl ? (
                  <VideoPlayer
                    key={activeVideo.id}
                    src={activeVideo.playbackUrl}
                    poster={activeVideo.thumbnail ?? undefined}
                    autoPlay
                    playerRef={playerRef}
                    onTimeUpdate={(time: number) => setCurrentTime(time)}
                    className="absolute inset-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 px-6 text-center">
                    <p className="text-sm text-white/70">
                      {isAuthenticated
                        ? t("videoUnavailable")
                        : t("loginRequiredTitle")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <VideoHeader
              title={activeVideo.name}
              shareUrl={shareUrl || `/${teacherSlug}/${courseSlug}/${videoSlug}`}
            />
          </div>

          <VideoSidebar
            teacherName={teacherName}
            teacherPhoto={teacherPhoto}
            categoryName={categoryName}
            content={activeVideo.description}
            videoId={String(activeVideo.id)}
            currentTime={currentTime}
            onSeek={handleSeek}
            notesEnabled={isAuthenticated}
          />
        </div>

        <div className="mt-10 lg:mt-14">
          <CourseVideoSection
            videos={videos}
            isAuthenticated={isAuthenticated}
            activeVideoId={activeVideo.id}
            onPlayVideo={handlePlayVideo}
            onLockedClick={() => setLoginOpen(true)}
            contained={false}
            className="px-0 pb-0"
          />
        </div>
      </div>

      <LoginRequiredDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
