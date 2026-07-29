"use client";

import { useTranslations } from "next-intl";

import { useMostWatchedClassroomsQuery } from "../../api/classroom.queries";
import {
  filterClassroomsByHomeMode,
  mapClassroomToEducationCard,
} from "../../api/classroom.utils";
import type { DefaultHomeMode } from "../../types";
import { EducationCard } from "../cards/EducationCard";
import { ContentSlider } from "../sliders/ContentSlider";

type MostWatchedSliderProps = {
  mode: DefaultHomeMode;
};

export function MostWatchedSlider({ mode }: MostWatchedSliderProps) {
  const t = useTranslations("home");
  const { data = [], isLoading } = useMostWatchedClassroomsQuery();

  const items = filterClassroomsByHomeMode(data, mode).map(
    mapClassroomToEducationCard,
  );

  return (
    <ContentSlider
      title={t("mostViewed")}
      items={items}
      isLoading={isLoading}
      showViewAll={false}
      getItemKey={(item) => item.id}
      renderItem={(item) => (
        <EducationCard
          thumbnail={item.thumbnail}
          title={item.title}
          authorName={item.authorName}
          authorLogo={item.authorLogo}
          isFavorite={item.is_favorite ?? false}
        />
      )}
    />
  );
}
