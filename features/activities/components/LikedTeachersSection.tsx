"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { mapTeachersToCards } from "@/features/home/api/teacher.utils";
import { useLikedTeachersQuery } from "@/features/likes";
import {
  TeacherCard,
  TeacherDialog,
  TeacherSkeleton,
  type TeacherCardData,
} from "@/shared/ui/cards";
import {
  ContentSlider,
  TEACHER_SKELETON_COUNT,
  TEACHER_SLIDER_ITEM_WIDTH_CLASS,
} from "@/shared/ui/sliders";
import { notify } from "@/shared/components/notify";

import { ACTIVITIES_SLIDER_PAGE_SIZE } from "../constants";
import type { ActivitiesSectionProps } from "../types";

export function LikedTeachersSection({ profileId }: ActivitiesSectionProps) {
  const t = useTranslations("activitiesPage");
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherCardData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isError } = useLikedTeachersQuery(
    profileId,
    ACTIVITIES_SLIDER_PAGE_SIZE,
  );

  useEffect(() => {
    if (!isError) return;
    notify.error(t("teachersError"), { id: "activities-teachers-error" });
  }, [isError, t]);

  const items = useMemo(() => {
    const teachers = data?.pages.flatMap((page) => page.items) ?? [];
    return mapTeachersToCards(teachers).map((teacher) => ({
      ...teacher,
      isFavorite: teacher.isFavorite ?? true,
    }));
  }, [data]);

  return (
    <>
      <ContentSlider
        title={t("teachersTitle")}
        items={items}
        isLoading={isLoading}
        showViewAll={false}
        emptyMessage={t("emptyTeachers")}
        skeletonCount={TEACHER_SKELETON_COUNT}
        itemWidthClassName={TEACHER_SLIDER_ITEM_WIDTH_CLASS}
        getItemKey={(item) => item.id}
        renderSkeleton={() => <TeacherSkeleton />}
        renderItem={(item) => (
          <TeacherCard
            entityId={item.id}
            name={item.name}
            photo={item.photo}
            categoryName={item.categoryName}
            isFavorite={item.isFavorite ?? true}
            onClick={() => {
              setSelectedTeacher(item);
              setDialogOpen(true);
            }}
          />
        )}
      />

      <TeacherDialog
        teacher={selectedTeacher}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
