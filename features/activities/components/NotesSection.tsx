"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

import { NoteCard, NoteCardSkeleton } from "@/shared/ui/cards";
import { ContentSlider } from "@/shared/ui/sliders";
import { notify } from "@/shared/components/notify";

import { useProfileNotesQuery } from "../api/notes.queries";
import { mapProfileNotesToCards } from "../api/notes.utils";
import { ACTIVITIES_SLIDER_PAGE_SIZE } from "../constants";
import type { ActivitiesSectionProps } from "../types";

export function NotesSection({ profileId }: ActivitiesSectionProps) {
  const t = useTranslations("activitiesPage");
  const { data, isLoading, isError } = useProfileNotesQuery(
    profileId,
    ACTIVITIES_SLIDER_PAGE_SIZE,
  );

  useEffect(() => {
    if (!isError) return;
    notify.error(t("notesError"), { id: "activities-notes-error" });
  }, [isError, t]);

  const items = useMemo(
    () => mapProfileNotesToCards(data ?? []),
    [data],
  );

  return (
    <ContentSlider
      title={t("notesTitle")}
      items={items}
      isLoading={isLoading}
      showViewAll={false}
      emptyMessage={t("emptyNotes")}
      getItemKey={(item) => item.id}
      renderSkeleton={() => <NoteCardSkeleton />}
      renderItem={(item) => (
        <NoteCard
          id={item.id}
          content={item.content}
          duration={item.duration}
          videoName={item.videoName}
          classroomName={item.classroomName}
          teacherName={item.teacherName}
          href={item.href}
        />
      )}
    />
  );
}
