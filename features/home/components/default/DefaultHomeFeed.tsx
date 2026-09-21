"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Link } from "@/core/i18n/navigation";
import { notify } from "@/shared/components/notify";
import { EducationCard } from "@/shared/ui/cards";
import { ContentSlider } from "@/shared/ui/sliders";

import {
  mapClassroomsToComingSoonCards,
  mapClassroomsToEducationCards,
} from "../../api/classroom.utils";
import { useHomeFeedQuery } from "../../api/home.queries";
import {
  getHomeFeedPlatform,
  getHomeListClassrooms,
  getHomeListTeachers,
  isComingSoonHomeList,
  isTeachersHomeList,
} from "../../api/home.utils";
import { mapTeachersToCards } from "../../api/teacher.utils";
import { DEFAULT_HOME_FEED_SKELETON_COUNT } from "../../constants";
import type { DefaultHomeMode, EducationCardData } from "../../types";
import { ComingSoonSection } from "./ComingSoonSection";
import { TeacherSection } from "./TeacherSection";

type DefaultHomeFeedProps = {
  mode: DefaultHomeMode;
};

function HomeEducationSlider({
  title,
  items,
  isLoading = false,
}: {
  title: string;
  items: EducationCardData[];
  isLoading?: boolean;
}) {
  return (
    <ContentSlider
      title={title}
      items={items}
      isLoading={isLoading}
      className="my-10"
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

function DefaultHomeFeedSkeleton() {
  return (
    <>
      {Array.from({ length: DEFAULT_HOME_FEED_SKELETON_COUNT }, (_, index) => (
        <HomeEducationSlider
          key={`default-home-feed-skeleton-${index}`}
          title=""
          items={[]}
          isLoading
        />
      ))}
    </>
  );
}

/**
 * DefaultHome `/home?platform=` sections.
 * Hero stays independent so feed loading/errors cannot take it down.
 */
export function DefaultHomeFeed({ mode }: DefaultHomeFeedProps) {
  const t = useTranslations("home");
  const platform = getHomeFeedPlatform(mode);
  const { data, isLoading, isError, isFetching } = useHomeFeedQuery(
    platform,
    { refetchOnMount: "always" },
  );

  useEffect(() => {
    if (!isError) return;
    notify.error(t("feedLoadError"), { id: "default-home-feed-error" });
  }, [isError, t]);

  if (isLoading || (isFetching && !data)) {
    return <DefaultHomeFeedSkeleton />;
  }

  const lists = data?.lists ?? [];

  return (
    <>
      {lists.map((list, index) => {
        const sectionKey = list.slug || `${list.title}-${index}`;
        const sectionTitle = list.title?.trim() || list.slug;

        if (isTeachersHomeList(list)) {
          const items = mapTeachersToCards(getHomeListTeachers(list));
          if (items.length === 0) return null;

          return (
            <TeacherSection
              key={sectionKey}
              title={sectionTitle}
              items={items}
            />
          );
        }

        if (isComingSoonHomeList(list)) {
          const items = mapClassroomsToComingSoonCards(
            getHomeListClassrooms(list),
          );
          if (items.length === 0) return null;

          return (
            <ComingSoonSection
              key={sectionKey}
              title={sectionTitle}
              items={items}
            />
          );
        }

        const items = mapClassroomsToEducationCards(
          getHomeListClassrooms(list),
        );
        if (items.length === 0) return null;

        return (
          <HomeEducationSlider
            key={sectionKey}
            title={sectionTitle}
            items={items}
          />
        );
      })}
    </>
  );
}
