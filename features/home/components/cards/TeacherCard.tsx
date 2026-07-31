"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { KeyboardEvent, MouseEvent } from "react";

import { Button } from "@/components/ui/button";
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
  isFavorite = false,
  onFavorite,
  onClick,
  className,
  aspectRatio = TEACHER_CARD_ASPECT_RATIO,
}: TeacherCardProps) {
  const isInteractive = Boolean(onClick);

  const handleFavoriteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onFavorite?.(!isFavorite);
  };

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

        <Button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
          aria-pressed={isFavorite}
          className={cn(
            "absolute top-2 right-1.5 z-20 inline-flex size-9 items-center justify-center rounded-full",
            "bg-transparent text-white transition-colors duration-200",
            "hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
            "md:hover:scale-110",
          )}
        >
          <motion.span
            key={isFavorite ? "on" : "off"}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="inline-flex"
          >
            <Heart
              className={cn(
                "size-5 transition-colors duration-200 sm:size-6",
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "fill-none text-white",
              )}
              strokeWidth={2}
            />
          </motion.span>
        </Button>
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
