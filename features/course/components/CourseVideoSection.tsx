"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import type { CourseVideoSectionProps } from "../types";
import { CourseVideoCard } from "./CourseVideoCard";
import { LockedVideoCard } from "./LockedVideoCard";

export function CourseVideoSection({
  videos,
  isAuthenticated,
  onPlayVideo,
  onLockedClick,
  activeVideoId = null,
  className,
  contained = true,
}: CourseVideoSectionProps) {
  const t = useTranslations("course");

  if (!videos.length) return null;

  return (
    <section
      id="course-videos"
      aria-label={t("courseVideos")}
      className={cn(
        contained &&
          "mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-16 sm:px-6 lg:px-10 lg:pb-24",
        className,
      )}
    >
      <ul className="flex flex-col gap-3 md:gap-4">
        {videos.map((video, index) => {
          const isActive = activeVideoId != null && video.id === activeVideoId;

          return (
            <motion.li
              key={video.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.35,
                delay: Math.min(index * 0.04, 0.24),
              }}
            >
              {isAuthenticated ? (
                <CourseVideoCard
                  video={video}
                  isActive={isActive}
                  onClick={() => onPlayVideo(video)}
                />
              ) : (
                <LockedVideoCard video={video} onClick={onLockedClick} />
              )}
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
