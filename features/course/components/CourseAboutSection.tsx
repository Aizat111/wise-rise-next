"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import { getCourseAboutImage } from "../api/course.utils";
import type { CourseAboutSectionProps } from "../types";

export function CourseAboutSection({
  course,
  metaItems,
  onWatchTrailer,
}: CourseAboutSectionProps) {
  const t = useTranslations("course");
  const aboutImage = course?.banner?.path;
  const description = course.description?.trim() ?? "";

  return (
    <section
      aria-labelledby="course-about-heading"
      className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:px-10 lg:py-16"
    >
      <h2
        id="course-about-heading"
        className="mb-6 font-heading text-2xl font-semibold text-white border-l-4 border-primary pl-2 lg:text-3xl"
      >
        {t("aboutCourse")}
      </h2>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)] lg:gap-12">
        <motion.button
          type="button"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          onClick={onWatchTrailer}
          aria-label={t("watchTrailer")}
          className={cn(
            "group relative aspect-video w-full overflow-hidden rounded-xl bg-white/5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
          )}
        >
          {aboutImage ? (
            <Image
              src={aboutImage}
              alt={course.name}
              fill
              sizes="(max-width: 1440px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}



          <span className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex size-16 items-center justify-center rounded-full bg-primary text-white shadow-[0_10px_30px_rgba(190,22,26,0.4)] transition-transform duration-300 group-hover:scale-110">
              <Play className="size-7 fill-white" />
            </span>
          </span>
        </motion.button>

        <div
          className="flex flex-col gap-2"
        >
          <div className="hidden lg:block">
            <h2 className="mt-2 font-heading text-2xl  font-semibold text-white uppercase lg:text-4xl">
              {course.name}
            </h2>
          </div>





          {description ? (
            <p className="max-w-prose text-sm  text-white/75 sm:text-base ">
              {description}
            </p>
          ) : null}
          <div className="flex flex-col gap-2 mt-3 text-base">
            {course.teacher?.name ? (
              <p className=" text-white font-semibold">
                <span className="text-white/60 mr-5 ">{t("teacher")}: </span>
                {course.teacher.name}
              </p>
            ) : null}
            {course.category?.name ? (
              <p className=" text-white font-semibold">
                <span className="text-white/60 mr-5">{t("category")}: </span>
                {course.category.name}
              </p>
            ) : null}
          </div>

        </div>
      </div>
    </section>
  );
}
