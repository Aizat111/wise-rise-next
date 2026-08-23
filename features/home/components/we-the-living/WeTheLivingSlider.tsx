"use client";

import { Fragment } from "react";

import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";
import { BaseSlider, SLIDER_ITEM_WIDTH_CLASS } from "@/shared/ui/sliders";

import { WE_THE_LIVING_SLIDER_SKELETON_COUNT } from "./constants";
import type { WeTheLivingCourseCardData } from "./types";
import { WeTheLivingCourseCard } from "./WeTheLivingCourseCard";
import { WeTheLivingCourseCardSkeleton } from "./WeTheLivingCourseCardSkeleton";
import { WeTheLivingSliderNavigation } from "./WeTheLivingSliderNavigation";

type WeTheLivingSliderProps = {
  title: string;
  items: WeTheLivingCourseCardData[];
  isLoading?: boolean;
  className?: string;
};

function WeTheLivingSliderEdgeFade() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-black/70 to-transparent sm:w-45"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-black/70 to-transparent sm:w-45"
      />
    </>
  );
}

export function WeTheLivingSlider({
  title,
  items,
  isLoading = false,
  className,
}: WeTheLivingSliderProps) {
  if (!isLoading && items.length === 0) return null;

  return (
    <BaseSlider
      className={cn("px-2 sm:px-0", className)}
      itemWidthClassName={SLIDER_ITEM_WIDTH_CLASS}
      gapClassName="gap-3"
      dragEnabled={!isLoading}
      aria-label={title}
      trackClassName={
        isLoading
          ? "max-md:[&>*:nth-child(n+3)]:hidden"
          : undefined
      }
      header={() =>
        isLoading && !title.trim() ? (
          <div
            aria-hidden
            className="mb-4 h-7 w-40 animate-pulse rounded bg-white/15 sm:mb-5 sm:h-8 sm:w-56"
          />
        ) : (
          <h2 className="mb-4 text-left text-lg font-semibold font-altun uppercase tracking-tighter  text-white sm:mb-5 sm:text-2xl md:text-4xl">
            {title}
          </h2>
        )
      }
      overlay={({ canScrollLeft, canScrollRight, scrollLeft, scrollRight }) => (
        <>
          <WeTheLivingSliderEdgeFade />
          {isLoading ? null : (
            <WeTheLivingSliderNavigation
              canScrollLeft={canScrollLeft}
              canScrollRight={canScrollRight}
              onScrollLeft={scrollLeft}
              onScrollRight={scrollRight}
            />
          )}
        </>
      )}
    >
      {isLoading
        ? Array.from({ length: WE_THE_LIVING_SLIDER_SKELETON_COUNT }).map(
          (_, index) => (
            <WeTheLivingCourseCardSkeleton key={`skeleton-${index}`} />
          ),
        )
        : items.map((item) => {
          const card = (
            <WeTheLivingCourseCard
              thumbnail={item.thumbnail}
              title={item.title}
              teacherName={item.teacherName}
            />
          );

          if (!item.href) {
            return <Fragment key={item.id}>{card}</Fragment>;
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {card}
            </Link>
          );
        })}
    </BaseSlider>
  );
}
