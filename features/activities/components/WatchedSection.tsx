"use client";

import { useTranslations } from "next-intl";

import { useWatchedActivitiesQuery } from "../api/activity.queries";
import type { ActivitiesSectionProps } from "../types";
import { ClassroomProgressSlider } from "./ClassroomProgressSlider";

export function WatchedSection({ profileId }: ActivitiesSectionProps) {
  const t = useTranslations("activitiesPage");
  const { data, isLoading, isError } = useWatchedActivitiesQuery(profileId);

  return (
    <ClassroomProgressSlider
      title={t("watchedTitle")}
      classrooms={data}
      isLoading={isLoading}
      isError={isError}
      errorMessage={t("watchedError")}
      errorId="activities-watched-error"
      emptyMessage={t("emptyEducations")}
    />
  );
}
