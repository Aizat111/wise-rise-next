"use client";

import { motion, useInView } from "framer-motion";
import { MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, type MouseEvent } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouter } from "@/core/i18n/navigation";
import { FavoriteButton } from "@/features/likes";
import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import { BaseCard } from "./BaseCard";
import { PROGRESS_CARD_ASPECT_RATIO } from "./constants";
import type { EducationProgressCardProps } from "./types";

function buildCourseHref(
  teacherSlug?: string | null,
  courseSlug?: string | null,
): string | null {
  if (!teacherSlug || !courseSlug) return null;
  return `/${teacherSlug}/${courseSlug}`;
}

function buildVideoHref(
  teacherSlug?: string | null,
  courseSlug?: string | null,
  videoSlug?: string | null,
): string | null {
  if (!teacherSlug || !courseSlug || !videoSlug) return null;
  return `/${teacherSlug}/${courseSlug}/${videoSlug}`;
}

function clampProgress(value: number | null | undefined): number {
  if (value == null || Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), 100);
}

function stopCardNavigation(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
}

function stopCardPropagation(event: MouseEvent) {
  event.stopPropagation();
}

/**
 * Education card variant with category badge, favorite control, and learning progress.
 * Desktop: hover/focus-within expands actions below the progress bar. Mobile: tap opens the course, 3-dot menu lists actions.
 * Self-contained navigation — do not wrap in a parent Link.
 */
export function EducationProgressCard({
  thumbnail,
  title,
  teacherName,
  categoryName,
  completionRate = 0,
  entityId,
  isFavorite = false,
  teacherSlug,
  courseSlug,
  firstVideoSlug,
  className,
  aspectRatio = PROGRESS_CARD_ASPECT_RATIO,
}: EducationProgressCardProps) {
  const t = useTranslations("cards");
  const router = useRouter();
  const progressRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(progressRef, { once: true, amount: 0.4 });

  const progress = clampProgress(completionRate);
  const detailHref = buildCourseHref(teacherSlug, courseSlug);
  const watchHref = buildVideoHref(teacherSlug, courseSlug, firstVideoSlug);
  const mobileHref = watchHref ?? detailHref;

  const handleMenuNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <BaseCard
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-linear-to-t from-black via-black/55 to-transparent"
      />

      {categoryName ? (
        <span
          className={cn(
            "absolute top-2 left-2 z-20 w-fit max-w-[70%] truncate rounded-full",
            "bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md",
            "sm:text-xs",
          )}
        >
          {categoryName}
        </span>
      ) : null}

      {entityId != null ? (
        <FavoriteButton
          type="classroom"
          entityId={entityId}
          initialLiked={isFavorite}
        />
      ) : null}

      {(watchHref || detailHref) ? (
        <div
          className={cn(
            "absolute top-2 z-20 md:hidden",
            entityId != null ? "right-11" : "right-1.5",
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t("moreActions")}
                  className="size-9 rounded-full bg-transparent text-white hover:bg-black/55"
                  onClick={stopCardNavigation}
                  onPointerDown={stopCardNavigation}
                />
              }
            >
              <MoreVertical className="size-5" aria-hidden />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="min-w-44 border-white/10 bg-zinc-900 text-white"
              onClick={stopCardNavigation}
            >
              {watchHref ? (
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-white/10 focus:text-white"
                  onClick={() => handleMenuNavigate(watchHref)}
                >
                  {t("watchNow")}
                </DropdownMenuItem>
              ) : null}
              {detailHref ? (
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-white/10 focus:text-white"
                  onClick={() => handleMenuNavigate(detailHref)}
                >
                  {t("view")}
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}

      {mobileHref ? (
        <Link
          href={mobileHref}
          aria-label={title}
          className="absolute inset-0 z-10 md:hidden"
        />
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col px-3 pb-3 pt-10">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white sm:text-base">
          {title}
        </h3>
        {teacherName ? (
          <p className="mt-1 truncate text-xs text-white/70 sm:text-sm">
            {teacherName}
          </p>
        ) : null}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold text-white">{progress}%</span>
          <div
            ref={progressRef}
            role="progressbar"
            aria-label={t("progress")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-2 w-full overflow-hidden rounded-full bg-surface"
          >
            <motion.div
              className="h-full origin-left rounded-full bg-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isInView ? progress / 100 : 0 }}
              transition={{ duration: 3.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        <div
          className={cn(
            "hidden md:grid",
            "grid-rows-[0fr]",
            "transition-[grid-template-rows] duration-300 ease-out",
            "md:group-hover:grid-rows-[1fr]",
            "md:group-focus-within:grid-rows-[1fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={cn(
                "flex flex-col items-center gap-1.5 pt-2.5",
                "pointer-events-none translate-y-3 opacity-0",
                "transform-gpu transition-[transform,opacity] duration-300 ease-out",
                "md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100",
                "md:group-focus-within:pointer-events-auto md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100",
              )}
            >
              {watchHref ? (
                <Link
                  href={watchHref}
                  onClick={stopCardPropagation}
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "h-9 w-50 text-sm font-bold",
                  )}
                >
                  {t("watchNow")}
                </Link>
              ) : null}
              {detailHref ? (
                <Link
                  href={detailHref}
                  onClick={stopCardPropagation}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-9 w-50 border-white/25 bg-white/10 text-sm font-bold text-white backdrop-blur-sm",
                    "hover:bg-white/20 hover:text-white",
                  )}
                >
                  {t("view")}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
