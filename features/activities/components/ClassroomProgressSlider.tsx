"use client";

import { useEffect, useMemo } from "react";

import type { Classroom } from "@/core/types/classroom.types";
import { notify } from "@/shared/components/notify";
import {
  EducationProgressCard,
  EducationProgressCardSkeleton,
  mapClassroomsToEducationProgressCards,
} from "@/shared/ui/cards";
import { ContentSlider } from "@/shared/ui/sliders";

type ClassroomProgressSliderProps = {
  title: string;
  classrooms: Classroom[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  errorId: string;
  emptyMessage: string;
};

export function ClassroomProgressSlider({
  title,
  classrooms,
  isLoading,
  isError,
  errorMessage,
  errorId,
  emptyMessage,
}: ClassroomProgressSliderProps) {
  useEffect(() => {
    if (!isError) return;
    notify.error(errorMessage, { id: errorId });
  }, [errorId, errorMessage, isError]);

  const items = useMemo(
    () => mapClassroomsToEducationProgressCards(classrooms ?? []),
    [classrooms],
  );

  return (
    <ContentSlider
      title={title}
      items={items}
      isLoading={isLoading}
      showViewAll={false}
      emptyMessage={emptyMessage}
      getItemKey={(item) => item.id}
      renderSkeleton={() => <EducationProgressCardSkeleton />}
      renderItem={(item) => (
        <EducationProgressCard
          entityId={item.id}
          thumbnail={item.thumbnail}
          title={item.title}
          teacherName={item.teacherName}
          categoryName={item.categoryName}
          completionRate={item.completionRate}
          isFavorite={item.isFavorite}
          teacherSlug={item.teacherSlug}
          courseSlug={item.courseSlug}
          firstVideoSlug={item.firstVideoSlug}
        />
      )}
    />
  );
}
