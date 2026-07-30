"use client";

import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useComingSoonClassroomsQuery } from "../../api/classroom.queries";
import {
  filterClassroomsByHomeMode,
  mapClassroomsToComingSoonCards,
} from "../../api/classroom.utils";
import {
  COMING_SOON_SKELETON_COUNT,
  COMING_SOON_SLIDER_ITEM_WIDTH_CLASS,
} from "../../constants";
import type { DefaultHomeMode } from "../../types";
import { formatComingSoonDate } from "../../utils/formatComingSoonDate";
import { ComingSoonCard } from "../cards/ComingSoonCard";
import { ComingSoonCardSkeleton } from "../cards/ComingSoonCardSkeleton";
import { BaseSlider } from "../sliders/BaseSlider";
import { SliderNavigation } from "../sliders/SliderNavigation";

type ComingSoonSectionProps = {
  mode: DefaultHomeMode;
};

/**
 * "Yakında Gelecekler" home section: copy on the left, 2-card slider on the right.
 * Independent from Education / MostWatched rows; empty list hides the section.
 */
export function ComingSoonSection({ mode }: ComingSoonSectionProps) {
  const t = useTranslations("home");
  const locale = useLocale();
  const { data = [], isLoading } = useComingSoonClassroomsQuery();

  const items = mapClassroomsToComingSoonCards(
    filterClassroomsByHomeMode(data, mode),
  );

  if (!isLoading && items.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-8 grid grid-cols-1 gap-8 sm:mt-10 lg:mt-12 lg:grid-cols-2 lg:items-center lg:gap-10 xl:gap-14"
      aria-label={t("comingSoon")}
      aria-busy={isLoading || undefined}
    >
      <div className="flex flex-col justify-center gap-3 sm:gap-4 lg:pr-1">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase border-l-4 border-primary  pl-2 sm:text-base ">
          {t("comingSoon")}
        </p>

        <h2 className="text-xl font-semibold leading-snug text-white sm:text-2xl sm:leading-snug lg:text-3xl lg:leading-[1.2]">
          <span className="block">{t("everyMonthNewContent")}</span>
          <span className="mt-1 block">
            {t("youNeedToDevelopInTheCategoryYouWant")}
          </span>
        </h2>

        <p className=" text-sm leading-relaxed text-white/60 font-semibold sm:text-base sm:leading-relaxed">
          {t("youCanDevelopYourLifeSkillsInManyCategories")}
        </p>
      </div>

      <div className="min-w-0">
        <BaseSlider
          aria-label={t("comingSoon")}
          dragEnabled={!isLoading}
          itemWidthClassName={COMING_SOON_SLIDER_ITEM_WIDTH_CLASS}
          header={({
            canScrollLeft,
            canScrollRight,
            scrollLeft,
            scrollRight,
          }) => (
            <div className="mb-3 flex justify-end sm:mb-4">
              <SliderNavigation
                canScrollLeft={canScrollLeft}
                canScrollRight={canScrollRight}
                onScrollLeft={scrollLeft}
                onScrollRight={scrollRight}
                className="hidden sm:flex"
              />
            </div>
          )}
        >
          {isLoading
            ? Array.from({ length: COMING_SOON_SKELETON_COUNT }).map(
              (_, index) => (
                <Fragment key={`coming-soon-skeleton-${index}`}>
                  <ComingSoonCardSkeleton />
                </Fragment>
              ),
            )
            : items.map((item) => (
              <Fragment key={item.id}>
                <ComingSoonCard
                  thumbnail={item.thumbnail}
                  title={item.title}
                  authorName={item.authorName}
                  authorLogo={item.authorLogo}
                  dateLabel={formatComingSoonDate(
                    item.comingSoonDate,
                    locale,
                  )}
                />
              </Fragment>
            ))}
        </BaseSlider>
      </div>
    </section>
  );
}
