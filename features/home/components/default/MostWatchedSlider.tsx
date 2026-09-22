"use client";

import { useTranslations } from "next-intl";

import type { Classroom } from "@/core/types/classroom.types";
import { Link } from "@/core/i18n/navigation";
import { EducationCard } from "@/shared/ui/cards";
import { ContentSlider } from "@/shared/ui/sliders";

import { useMostWatchedClassroomsQuery } from "../../api/classroom.queries";
import {
  filterClassroomsByHomeMode,
  mapClassroomsToEducationCards,
} from "../../api/classroom.utils";
import type { DefaultHomeMode } from "../../types";

type MostWatchedSliderProps = {
  mode: DefaultHomeMode;
  initialClassrooms?: Classroom[];
};

/**
 * "En Çok İzlenenler" row for DefaultHome ("Tüm İçerikler" / "Wise&Rise").
 * Uses ContentSlider → BaseSlider + EducationCard.
 */
export function MostWatchedSlider({
  mode,
  initialClassrooms,
}: MostWatchedSliderProps) {
  const t = useTranslations("home");
  const { data = [], isLoading } = useMostWatchedClassroomsQuery(
    true,
    initialClassrooms,
  );

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
