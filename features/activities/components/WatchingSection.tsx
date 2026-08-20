"use client";

import { useTranslations } from "next-intl";

import { useWatchingActivitiesQuery } from "../api/activity.queries";
import type { ActivitiesSectionProps } from "../types";
import { ClassroomProgressSlider } from "./ClassroomProgressSlider";

export function WatchingSection({ profileId }: ActivitiesSectionProps) {
  const t = useTranslations("activitiesPage");
  const { data, isLoading, isError } = useWatchingActivitiesQuery(profileId);

  return (
    <ClassroomProgressSlider
      title={t("watchingTitle")}
      classrooms={data}
      isLoading={isLoading}
      isError={isError}
      errorMessage={t("watchingError")}
      errorId="activities-watching-error"
      emptyMessage={t("emptyEducations")}
    />
  );
}
