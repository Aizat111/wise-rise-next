"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/core/i18n/navigation";
import { mapClassroomsToEducationCards } from "@/features/home/api/classroom.utils";
import { EducationCard, EducationCardSkeleton } from "@/shared/ui/cards";
import { useLikedClassroomsQuery } from "@/features/likes";
import { notify } from "@/shared/components/notify";

import {
  FOLLOWING_CLASSROOMS_GRID_CLASS,
  FOLLOWING_CLASSROOMS_PAGE_SIZE,
  FOLLOWING_LOAD_MORE_BUTTON_CLASS,
} from "../constants";
import type { FollowedSectionProps } from "../types";
import { FollowingEmptyState } from "./FollowingEmptyState";

export function FollowedClassroomsSection({ profileId }: FollowedSectionProps) {
  const t = useTranslations("followingPage");

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetching,
  } = useLikedClassroomsQuery(profileId, FOLLOWING_CLASSROOMS_PAGE_SIZE);

  useEffect(() => {
    if (!isError) return;
    notify.error(t("classroomsError"), { id: "following-classrooms-error" });
  }, [isError, t]);

  const items = useMemo(() => {
    const classrooms = data?.pages.flatMap((page) => page.items) ?? [];
    return mapClassroomsToEducationCards(classrooms);
  }, [data]);

  const handleLoadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    void fetchNextPage();
  };

  return (
    <section className="space-y-8" aria-label={t("classroomsTitle")}>
      <div>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-white border-l-4 border-primary pl-2 sm:mb-6 sm:text-2xl">
          {t("classroomsTitle")}
        </h2>

        {isLoading ? (
          <div
            className={FOLLOWING_CLASSROOMS_GRID_CLASS}
            aria-busy
            aria-label={t("loading")}
          >
            {Array.from({ length: FOLLOWING_CLASSROOMS_PAGE_SIZE }).map(
              (_, index) => (
                <div
                  key={`followed-classroom-skeleton-${index}`}
                  className={index >= 2 ? "hidden lg:block" : undefined}
                >
                  <EducationCardSkeleton />
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
              {t("classroomsError")}
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
          <FollowingEmptyState message={t("emptyClassrooms")} />
        ) : null}

        {items.length > 0 ? (
          <div className={FOLLOWING_CLASSROOMS_GRID_CLASS}>
            {items.map((item) => {
              const card = (
                <EducationCard
                  entityId={item.id}
                  thumbnail={item.thumbnail}
                  title={item.title}
                  authorName={item.authorName}
                  authorLogo={item.authorLogo}
                  isFavorite={item.is_favorite ?? true}
                />
              );

              if (!item.href) {
                return <div key={item.id}>{card}</div>;
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block focus-visible:outline-none"
                >
                  {card}
                </Link>
              );
            })}
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
    </section>
  );
}
