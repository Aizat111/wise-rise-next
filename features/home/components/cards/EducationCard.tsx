"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { MouseEvent } from "react";

import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import { DEFAULT_CARD_ASPECT_RATIO } from "../../constants";
import type { EducationCardProps } from "../../types";
import { BaseCard } from "./BaseCard";
import { Button } from "@/components/ui/button";

export function EducationCard({
  thumbnail,
  title,
  authorName,
  authorLogo,
  isFavorite = false,
  onFavorite,
  onClick,
  className,
  aspectRatio = DEFAULT_CARD_ASPECT_RATIO,
}: EducationCardProps) {
  const handleFavoriteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onFavorite?.(!isFavorite);
  };

  return (
    <BaseCard
      onClick={onClick}
      aria-label={title}
      aspectRatio={aspectRatio}
      className={className}
    >
      <Image
        src={thumbnail}
        alt={title}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover object-[center_10%]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/80 via-black/40 to-transparent"
      />

      <Button
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
        aria-pressed={isFavorite}
        className={cn(
          "absolute top-2 right-1.5 z-20 inline-flex size-9 items-center justify-center rounded-full",
          " text-white bg-transparent transition-colors duration-200",
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
              "size-6 transition-colors duration-200",
              isFavorite ? "fill-red-500 text-red-500" : "fill-none text-white",
            )}
            strokeWidth={2}
          />
        </motion.span>
      </Button>
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
