"use client";

import type { KeyboardEvent } from "react";

import { FavoriteButton } from "@/features/likes";
import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import {
  CARD_ASPECT_RATIO_CLASS,
  TEACHER_CARD_ASPECT_RATIO,
} from "../../constants";
import type { TeacherCardProps } from "../../types";

/**
 * Portrait teacher card: full-bleed photo with favorite control,
 * name + category below the image (no overlay text).
 * Reusable across any teacher slider / grid.
 */
export function TeacherCard({
  name,
  photo,
  categoryName,
  entityId,
  isFavorite = false,
  onClick,
  className,
  aspectRatio = TEACHER_CARD_ASPECT_RATIO,
}: TeacherCardProps) {
  const isInteractive = Boolean(onClick);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!isInteractive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <article
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={name}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        "group flex w-full flex-col gap-2.5 outline-none",
        isInteractive && "cursor-pointer",
        "focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl bg-white/5 h-100 lg:h-140",
          "transition-[transform,box-shadow] duration-300 ease-out",
          isInteractive &&
          "md:group-hover:-translate-y-0.5 md:group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
          CARD_ASPECT_RATIO_CLASS[aspectRatio],
        )}
      >
        <Image
          src={photo}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover object-top"

        />

        {entityId != null ? (
          <FavoriteButton
            type="teacher"
            entityId={entityId}
            initialLiked={isFavorite}
            iconClassName="size-5 sm:size-6"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-0.5 px-0.5">
        <h3 className="truncate text-sm font-semibold leading-snug text-white sm:text-base">
          {name}
        </h3>
        {categoryName ? (
          <p className="truncate text-xs text-white/55 italic sm:text-base">
            {categoryName}
          </p>
        ) : null}
      </div>
    </article>
  );
}
