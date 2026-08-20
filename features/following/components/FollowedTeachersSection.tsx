"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { mapTeachersToCards } from "@/features/home/api/teacher.utils";
import {
  TeacherCard,
  TeacherDialog,
  TeacherSkeleton,
  type TeacherCardData,
} from "@/shared/ui/cards";
import { useLikedTeachersQuery } from "@/features/likes";
import { notify } from "@/shared/components/notify";

import {
  FOLLOWING_LOAD_MORE_BUTTON_CLASS,
  FOLLOWING_TEACHERS_GRID_CLASS,
  FOLLOWING_TEACHERS_PAGE_SIZE,
} from "../constants";
import type { FollowedSectionProps } from "../types";
import { FollowingEmptyState } from "./FollowingEmptyState";

export function FollowedTeachersSection({ profileId }: FollowedSectionProps) {
  const t = useTranslations("followingPage");
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherCardData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetching,
  } = useLikedTeachersQuery(profileId, FOLLOWING_TEACHERS_PAGE_SIZE);

  useEffect(() => {
    if (!isError) return;
    notify.error(t("teachersError"), { id: "following-teachers-error" });
  }, [isError, t]);

  const items = useMemo(() => {
    const teachers = data?.pages.flatMap((page) => page.items) ?? [];
    return mapTeachersToCards(teachers).map((teacher) => ({
      ...teacher,
      isFavorite: teacher.isFavorite ?? true,
    }));
  }, [data]);

  const handleLoadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    void fetchNextPage();
  };

  const handleItemClick = (item: TeacherCardData) => {
    setSelectedTeacher(item);
    setDialogOpen(true);
  };

  return (
    <section className="space-y-8" aria-label={t("teachersTitle")}>
      <div>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-white border-l-4 border-primary pl-2 sm:mb-6 sm:text-2xl">
          {t("teachersTitle")}
        </h2>

        {isLoading ? (
          <div
            className={FOLLOWING_TEACHERS_GRID_CLASS}
            aria-busy
            aria-label={t("loading")}
          >
            {Array.from({ length: FOLLOWING_TEACHERS_PAGE_SIZE }).map(
              (_, index) => (
                <div
                  key={`followed-teacher-skeleton-${index}`}
                  className={index >= 2 ? "hidden md:block" : undefined}
                >
                  <TeacherSkeleton />
                </div>
              ),
            )}
          </div>
        ) : null}

        {!isLoading && isError && items.length === 0 ? (
          <div
            role="alert"
            className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center"
          >
            <p className="max-w-md text-sm text-white/65 sm:text-base">
              {t("teachersError")}
            </p>
            <Button
              type="button"
              variant="ghost"
              disabled={isFetching}
              onClick={() => {
                void refetch();
              }}
              className="cursor-pointer text-white/90 hover:bg-white/10 hover:text-white"
            >
              {t("retry")}
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && items.length === 0 ? (
          <FollowingEmptyState message={t("emptyTeachers")} />
        ) : null}

        {items.length > 0 ? (
          <div className={FOLLOWING_TEACHERS_GRID_CLASS}>
            {items.map((item) => (
              <TeacherCard
                key={item.id}
                entityId={item.id}
                name={item.name}
                photo={item.photo}
                categoryName={item.categoryName}
                isFavorite={item.isFavorite ?? true}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        ) : null}
      </div>

      {items.length > 0 && hasNextPage ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            disabled={isFetchingNextPage}
            onClick={handleLoadMore}
            className={FOLLOWING_LOAD_MORE_BUTTON_CLASS}
          >
            {isFetchingNextPage ? t("loading") : t("loadMore")}
          </Button>
        </div>
      ) : null}

      <TeacherDialog
        teacher={selectedTeacher}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  );
}
