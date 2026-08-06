"use client";

import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";
import type { CourseVideoCardProps } from "../types";

export function CourseVideoCard({
  video,
  locked = false,
  isActive = false,
  onClick,
}: CourseVideoCardProps) {
  const t = useTranslations("course");

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "true" : undefined}
      aria-label={
        locked
          ? t("lockedVideoAria", { title: video.name })
          : t("playVideoAria", { title: video.name })
      }
      className={cn(
        "group grid w-full grid-cols-1 gap-4 p-3 text-left",
        "duration-300",
        "hover:border-white/15",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        "md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:gap-5 md:p-4",
        isActive && "rounded-xl bg-white/6 ring-1 ring-primary/50",
      )}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg bg-white/5">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.name}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-105",
              locked && "grayscale",
            )}
          />
        ) : null}

        <span className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full",
              locked ? "bg-black/70 text-white" : "bg-transparent border-2 border-white/90 text-white",
            )}
          >
            <Play className="size-5 fill-white " />
          </span>
        </span>
        <div className="absolute bottom-1 right-2 flex items-center gap-2 text-xs bg-primary px-2.5 py-0.5 font-medium rounded-full">
          {video.duration ? <span>{video.duration}</span> : null}
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-2 ">
        <h3 className="text-base font-semibold text-white lg:text-2xl">
          {video.sectionLabel && `${video.sectionLabel}. `}{video.name}
        </h3>

        {video.description ? (
          <p className=" text-sm leading-6 text-white/85 lg:text-base">
            {video.description}
          </p>
        ) : null}


      </div>
    </button>
  );
}
