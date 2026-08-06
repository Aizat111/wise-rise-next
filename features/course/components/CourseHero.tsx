"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/core/i18n/navigation";
import Image from "@/shared/ui/Images/Image";
import { useAppSelector } from "@/store/hooks";

import {
  buildVideoHref,
  mapClassroomVideos,
} from "../api/course.utils";
import type { CourseHeroProps } from "../types";
import { TrailerButton } from "./TrailerButton";

function CertificateBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 self-center rounded-full border border-primary/45 bg-primary/20 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
      <Award className="size-3.5 shrink-0 text-primary" strokeWidth={2.5} />
      {label}
    </span>
  );
}

function TeacherLogo({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 256px, 384px"
        className="object-contain object-center"
      />
    </div>
  );
}

function AuthActions({
  watchHref,
  notesHref,
  watchLabel,
  notesLabel,
  className,
}: {
  watchHref: string;
  notesHref: string;
  watchLabel: string;
  notesLabel: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Button
        size="lg"
        className="h-auto px-6 py-3 text-base text-white hover:bg-primary/90 lg:text-lg"
        render={<Link href={watchHref} />}
      >
        {watchLabel}
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="h-auto border-white/20 bg-transparent px-6 py-3 text-base text-white hover:bg-white/10 hover:text-white lg:text-lg"
        render={<Link href={notesHref} />}
      >
        {notesLabel}
      </Button>
    </div>
  );
}

export function CourseHero({ course, onWatchTrailer }: CourseHeroProps) {
  const t = useTranslations("course");
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Desktop: teacher photo · Mobile: course cover
  const desktopBg =
    course?.cover?.path;
  const mobileBg =
    course.teacher?.photo?.path;
  const teacherLogo = course.teacher?.logo?.path;
  const description = course.description?.trim() ?? "";
  const teacherName = course.teacher?.name ?? "";
  const firstVideo = mapClassroomVideos(course.videos)[0];
  const teacherSlug = course.teacher?.slug ?? null;
  const watchHref =
    buildVideoHref(teacherSlug, course.slug, firstVideo?.slug) ??
    "#course-videos";
  const notesHref = watchHref;

  return (
    <section
      aria-label={course.name}
      className="relative isolate w-full overflow-hidden"
    >
      {desktopBg ? (
        <Image
          src={desktopBg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-top md:block"
        />
      ) : (
        <div className="absolute inset-0 hidden bg-zinc-900 md:block" />
      )}

      {mobileBg ? (
        <Image
          src={mobileBg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:hidden"
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900 md:hidden" />
      )}

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20 md:via-black/45 md:to-black/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent max-md:hidden"
      />

      {/* Desktop */}
      <div className="relative z-10 mx-auto hidden min-h-[100svh] w-full max-w-7xl items-center justify-around gap-10 px-6 py-16 md:flex lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex max-w-xl flex-col items-center justify-center gap-5 text-center"
        >
          {teacherLogo ? (
            <TeacherLogo
              src={teacherLogo}
              alt={teacherName}
              className="h-16 w-64 lg:h-32 lg:w-96"
            />
          ) : teacherName ? (
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
              {teacherName}
            </p>
          ) : null}

          <h1 className="mt-4 font-heading text-xl font-medium uppercase leading-tight text-white lg:mt-8">
            {course.name}
          </h1>

          <CertificateBadge label={t("certificateOpportunity")} />

          {description ? (
            <p className="mt-1 max-w-prose text-sm text-white/80 lg:text-base">
              {description}
            </p>
          ) : null}

          {isAuthenticated ? (
            <AuthActions
              watchHref={watchHref}
              notesHref={notesHref}
              watchLabel={t("watchToStart")}
              notesLabel={t("notes")}
              className="mt-2 flex flex-row items-center justify-center gap-4"
            />
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          className="shrink-0"
        >
          <TrailerButton onClick={onWatchTrailer} label={t("watchTrailer")} />
        </motion.div>
      </div>

      {/* Mobile */}
      <div className="relative z-10 flex min-h-[70svh] flex-col items-center justify-center px-5 text-center md:hidden">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex w-full max-w-md flex-col items-center gap-4"
        >
          {teacherLogo ? (
            <TeacherLogo
              src={teacherLogo}
              alt={teacherName}
              className="h-14 w-48"
            />
          ) : null}

          <h1 className="mt-4 font-heading text-xl font-medium uppercase leading-tight text-white">
            {course.name}
          </h1>

          <CertificateBadge label={t("certificateOpportunity")} />

          {description ? (
            <p className="line-clamp-2 text-sm font-semibold leading-6 text-white/90">
              {description}
            </p>
          ) : null}

          {isAuthenticated ? (
            <AuthActions
              watchHref={watchHref}
              notesHref={notesHref}
              watchLabel={t("watchToStart")}
              notesLabel={t("notes")}
              className="mt-2 flex flex-row items-center gap-4"
            />
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
