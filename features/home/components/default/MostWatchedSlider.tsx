"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/core/i18n/navigation";

import { useMostWatchedClassroomsQuery } from "../../api/classroom.queries";
import {
  filterClassroomsByHomeMode,
  mapClassroomsToEducationCards,
} from "../../api/classroom.utils";
import type { DefaultHomeMode } from "../../types";
import { EducationCard } from "../cards/EducationCard";
import { ContentSlider } from "../sliders/ContentSlider";

type MostWatchedSliderProps = {
  mode: DefaultHomeMode;
};

/**
 * "En Çok İzlenenler" row for DefaultHome ("Tüm İçerikler" / "Wise&Rise").
 * Uses ContentSlider → BaseSlider + EducationCard.
 */
export function MostWatchedSlider({ mode }: MostWatchedSliderProps) {
  const t = useTranslations("home");
  const { data = [], isLoading } = useMostWatchedClassroomsQuery();

  const items = mapClassroomsToEducationCards(
    filterClassroomsByHomeMode(data, mode),
  );

  return (
    <ContentSlider
      title={t("mostViewed")}
      items={items}
      isLoading={isLoading}
      showViewAll={false}
      getItemKey={(item) => item.id}
      renderItem={(item) => {
        const card = (
          <EducationCard
            entityId={item.id}
            thumbnail={item.thumbnail}
            title={item.title}
            authorName={item.authorName}
            authorLogo={item.authorLogo}
            isFavorite={item.is_favorite ?? false}
          />
        );

        if (!item.href) return card;

        return (
          <Link href={item.href} className="block focus-visible:outline-none">
            {card}
          </Link>
        );
      }}
    />
  );
}
