"use client";

import { useTranslations } from "next-intl";

import { useAssignedClassroomsQuery } from "../api/activity.queries";
import type { ActivitiesSectionProps } from "../types";
import { ClassroomProgressSlider } from "./ClassroomProgressSlider";

export function AssignedSection({ profileId }: ActivitiesSectionProps) {
  const t = useTranslations("activitiesPage");
  const { data, isLoading, isError } = useAssignedClassroomsQuery(profileId);

  return (
    <ClassroomProgressSlider
      title={t("assignedTitle")}
      classrooms={data}
      isLoading={isLoading}
      isError={isError}
      errorMessage={t("assignedError")}
      errorId="activities-assigned-error"
      emptyMessage={t("emptyEducations")}
    />
  );
}
