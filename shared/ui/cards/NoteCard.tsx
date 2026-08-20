"use client";

import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";

import { BaseCard } from "./BaseCard";
import { DEFAULT_CARD_ASPECT_RATIO } from "./constants";
import type { NoteCardProps } from "./types";

/**
 * Portrait note card for activity sliders: content, video/course name, and timestamp.
 */
export function NoteCard({
  content,
  duration,
  videoName,
  classroomName,
  teacherName,
  href,
  className,
  aspectRatio = DEFAULT_CARD_ASPECT_RATIO,
}: NoteCardProps) {
  const title = videoName || classroomName || content;

  const body = (
    <BaseCard
      aria-label={title}
      aspectRatio={aspectRatio}
      className={cn(
        !href && "cursor-default md:hover:translate-y-0 md:hover:shadow-none",
        className,
      )}
    >
      <div className="absolute inset-0 bg-linear-to-b from-white/8 via-white/4 to-black" />

      {duration ? (
        <span
          className={cn(
            "absolute top-2 left-2 z-20 w-fit rounded-full",
            "bg-primary/90 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white",
            "sm:text-xs",
          )}
        >
          {duration}
        </span>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 px-3 pb-3 pt-10">
        <p className="line-clamp-5 text-sm leading-relaxed text-white/90 sm:text-base">
          {content}
        </p>

        {videoName || classroomName ? (
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white sm:text-base">
            {videoName || classroomName}
          </h3>
        ) : null}

        {teacherName ? (
          <p className="truncate text-xs text-white/55 sm:text-sm">
            {teacherName}
          </p>
        ) : classroomName && videoName ? (
          <p className="truncate text-xs text-white/55 sm:text-sm">
            {classroomName}
          </p>
        ) : null}
      </div>
    </BaseCard>
  );

  if (!href) return body;

  return (
    <Link href={href} className="block focus-visible:outline-none">
      {body}
    </Link>
  );
}
