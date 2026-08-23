"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";
import { BaseCard, DEFAULT_CARD_ASPECT_RATIO } from "@/shared/ui/cards";

import type { WeTheLivingCourseCardProps } from "./types";

export function WeTheLivingCourseCard({
  thumbnail,
  title,
  teacherName,
  className,
}: WeTheLivingCourseCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <BaseCard
      aria-label={title}
      aspectRatio={DEFAULT_CARD_ASPECT_RATIO}
      className={cn(

        "md:hover:translate-y-0 md:hover:shadow-none",
        "md:hover:ring-1 md:hover:ring-white/20",
        className,
      )}
    >
      <motion.div
        className="absolute inset-0"
        whileHover={
          reduceMotion ? undefined : { scale: 1.04, filter: "brightness(1.08)" }
        }
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="h-full w-full object-cover object-[15%_15%]"
        />
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-linear-to-t from-black/80 via-black/35 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-0.5 px-3 pb-3 sm:px-3.5 sm:pb-3.5">
        <h3 className="line-clamp-2 text-center text-sm font-semibold font-palatino uppercase text-white sm:text-2xl">
          {title}
        </h3>
        {teacherName ? (
          <p className="line-clamp-1 text-left text-xs font-medium font-apple-chancery text-white/70 sm:text-base">
            {teacherName}
          </p>
        ) : null}
      </div>
    </BaseCard>
  );
}
