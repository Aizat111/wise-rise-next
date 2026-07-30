"use client";

import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import { DEFAULT_CARD_ASPECT_RATIO } from "../../constants";
import type { ComingSoonCardProps } from "../../types";
import { BaseCard } from "./BaseCard";

/**
 * Non-interactive portrait card for upcoming classrooms.
 * Same dimensions as EducationCard; date badge replaces the favorite control.
 */
export function ComingSoonCard({
  thumbnail,
  title,
  authorName,
  authorLogo,
  dateLabel,
  className,
  aspectRatio = DEFAULT_CARD_ASPECT_RATIO,
}: ComingSoonCardProps) {
  return (
    <BaseCard
      aria-label={title}
      aspectRatio={aspectRatio}
      className={cn(
        "cursor-default md:hover:translate-y-0 md:hover:shadow-none",
        className,
      )}
    >
      <Image
        src={thumbnail}
        alt={title}
        fill
        sizes="(max-width: 1024px) 50vw, 25vw"
        className="object-cover object-[center_10%]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/80 via-black/40 to-transparent"
      />

      {dateLabel ? (
        <span
          className={cn(
            "absolute top-2.5 left-2.5 z-20 rounded-full bg-primary px-2.5 py-1",
            "text-[11px] font-semibold leading-none text-white sm:text-xs",
          )}
        >
          {dateLabel}
        </span>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center pb-4">
        {authorLogo ? (
          <div className="relative mt-3 h-12 w-50 md:w-75 xl:h-24 xl:w-85">
            <Image
              src={authorLogo}
              alt={authorName}
              fill
              sizes="(max-width: 768px) 200px, 340px"
              className="object-contain px-4"
            />
          </div>
        ) : authorName ? (
          <p className="mt-3 truncate px-3 text-xs font-medium text-white/90 sm:text-sm">
            {authorName}
          </p>
        ) : null}

        <div aria-hidden className="mt-2 h-1 w-15 bg-white xl:mt-4" />

        <h3 className="mx-2 my-2 line-clamp-2 text-center text-sm font-semibold leading-snug text-white/85 sm:text-base xl:mx-3 xl:my-4">
          {title}
        </h3>
      </div>
    </BaseCard>
  );
}
