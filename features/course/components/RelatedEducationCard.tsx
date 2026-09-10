"use client";

import { Link } from "@/core/i18n/navigation";
import { FavoriteButton } from "@/features/likes";
import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";
import { BaseCard } from "@/shared/ui/cards";

import type { RelatedEducationCardProps } from "../types";

/** Classroom cover assets are authored at this size. */
const RELATED_COVER_WIDTH = 2340;
const RELATED_COVER_HEIGHT = 1200;

export function RelatedEducationCard({
  cover,
  title,
  authorName,
  categoryName,
  entityId,
  isFavorite = false,
  href,
  className,
}: RelatedEducationCardProps) {
  return (
    <BaseCard
      aria-label={title}
      className={cn("aspect-auto h-auto", className)}
      contentClassName="static inset-auto"
    >
      <div className="relative w-full overflow-hidden rounded-xl">
        <Image
          src={cover}
          alt={title}
          width={RELATED_COVER_WIDTH}
          height={RELATED_COVER_HEIGHT}
          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 33vw, 30vw"
          className="h-auto w-full transition-transform duration-500 md:group-hover:scale-105"
        />

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-[55%]",
            "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
            "transition-[background] duration-300",
            "md:group-hover:from-black/90",
          )}
        />

        {categoryName ? (
          <span
            className={cn(
              "pointer-events-none absolute top-2.5 left-2.5 z-20 max-w-[80%] truncate",
              "rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-medium text-white",
              "sm:text-sm",
            )}
          >
            {categoryName}
          </span>
        ) : null}

        {href ? (
          <Link
            href={href}
            aria-label={title}
            className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          />
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-start px-3 pb-3 text-left sm:px-4 sm:pb-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white sm:text-base">
            {title}
          </h3>
          {authorName ? (
            <p className="mt-1 truncate text-xs text-white/80 sm:text-sm">
              {authorName}
            </p>
          ) : null}
        </div>

        {entityId != null ? (
          <FavoriteButton
            type="classroom"
            entityId={entityId}
            initialLiked={isFavorite}
          />
        ) : null}
      </div>
    </BaseCard>
  );
}
