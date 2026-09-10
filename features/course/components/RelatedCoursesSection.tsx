"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import {
  BaseSlider,
  RELATED_COURSES_SKELETON_COUNT,
  RELATED_COURSES_SLIDER_ITEM_WIDTH_CLASS,
  SliderNavigation,
} from "@/shared/ui/sliders";

import { mapClassroomsToRelatedEducationCards } from "../api/course.utils";
import { useRelatedClassroomsQuery } from "../api/related-classrooms.queries";
import type { RelatedCoursesSectionProps } from "../types";
import { RelatedEducationCard } from "./RelatedEducationCard";

export function RelatedCoursesSection({
  categoryId,
  currentCourseId,
}: RelatedCoursesSectionProps) {
  const t = useTranslations("course");
  const { data = [], isLoading, isError } = useRelatedClassroomsQuery(
    categoryId,
  );

  const items = mapClassroomsToRelatedEducationCards(data, currentCourseId);

  if (isError) return null;
  if (!isLoading && items.length === 0) return null;

  const sectionTitle = t("relatedCoursesAria");

  return (
    <section
      aria-labelledby="related-courses-heading"
      className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:px-10 lg:py-16"
    >
      <BaseSlider
        className="my-0"
        gapClassName="gap-3"
        itemWidthClassName={RELATED_COURSES_SLIDER_ITEM_WIDTH_CLASS}
        dragEnabled={!isLoading}
        aria-label={sectionTitle}
        trackClassName={cn(
          "my-0",
          isLoading && "max-md:[&>*:nth-child(n+2)]:hidden",
        )}
        header={({
          canScrollLeft,
          canScrollRight,
          scrollLeft,
          scrollRight,
        }) => (
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col items-center text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">
                {t("relatedCoursesEyebrow")}
              </p>
              <h2
                id="related-courses-heading"
                className="mt-2 font-heading text-2xl font-semibold text-white sm:text-3xl lg:text-4xl"
              >
                {t("relatedCoursesTitle")}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-xl">
                {t("relatedCoursesSubtitle")}
              </p>
            </div>
            {isLoading ? null : (
              <div className="mt-6 flex justify-end sm:mt-8">
                <SliderNavigation
                  canScrollLeft={canScrollLeft}
                  canScrollRight={canScrollRight}
                  onScrollLeft={scrollLeft}
                  onScrollRight={scrollRight}
                  className="hidden sm:flex"
                />
              </div>
            )}
          </div>
        )}
      >
        {isLoading
          ? Array.from({ length: RELATED_COURSES_SKELETON_COUNT }).map(
            (_, index) => (
              <Fragment key={`related-course-skeleton-${index}`}>
                <div
                  aria-hidden
                  className="relative aspect-[2340/1200] w-full overflow-hidden rounded-xl bg-white/10"
                >
                  <div className="absolute inset-0 animate-pulse bg-white/5" />
                </div>
              </Fragment>
            ),
          )
          : items.map((item) => (
            <RelatedEducationCard
              key={item.id}
              entityId={item.id}
              cover={item.cover}
              title={item.title}
              authorName={item.authorName}
              categoryName={item.categoryName}
              isFavorite={item.isFavorite}
              href={item.href}
            />
          ))}
      </BaseSlider>
    </section>
  );
}
