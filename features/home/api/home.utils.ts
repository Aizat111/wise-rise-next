import type { Classroom } from "@/core/types/classroom.types";
import type {
  HomeFeed,
  HomeFeedResponse,
  HomeList,
} from "@/core/types/home.types";
import { buildCourseHref } from "@/features/course/api/course.utils";

import type {
  WeTheLivingBannerSection,
  WeTheLivingCourseCardData,
  WeTheLivingHomeSection,
  WeTheLivingSliderSection,
} from "../types";

function isHomeFeed(value: unknown): value is HomeFeed {
  if (!value || typeof value !== "object") return false;
  return Array.isArray((value as HomeFeed).lists);
}

function normalizeHomeList(list: HomeList): HomeList {
  return {
    slug: list.slug,
    title: list.title,
    subtitle: list.subtitle ?? null,
    type: list.type,
    data: Array.isArray(list.data) ? list.data : [],
  };
}

function unwrapHomeFeed(
  response: HomeFeedResponse | HomeFeed | null | undefined,
): HomeFeed | null {
  if (isHomeFeed(response)) return response;
  if (response && "data" in response && isHomeFeed(response.data)) {
    return response.data;
  }
  return null;
}

export function normalizeHomeFeed(
  response: HomeFeedResponse | HomeFeed | null | undefined,
): HomeFeed {
  const feed = unwrapHomeFeed(response);

  if (!feed) {
    return {
      platform: "",
      is_member: false,
      lists: [],
    };
  }

  return {
    platform: feed.platform,
    is_member: Boolean(feed.is_member),
    lists: (feed.lists ?? []).map(normalizeHomeList),
  };
}

export function mapClassroomToWeTheLivingCourseCard(
  classroom: Classroom,
): WeTheLivingCourseCardData {
  return {
    id: classroom.id,
    title: classroom.name,
    teacherName: classroom.teacher?.name ?? "",
    thumbnail: classroom.thumbnail?.path ?? classroom.cover?.path ?? "",
    href: buildCourseHref(classroom.teacher?.slug, classroom.slug),
  };
}

export function mapClassroomsToWeTheLivingCourseCards(
  classrooms: Classroom[],
): WeTheLivingCourseCardData[] {
  return classrooms
    .map(mapClassroomToWeTheLivingCourseCard)
    .filter((card) => Boolean(card.thumbnail));
}

export function mapHomeListsToWeTheLivingSliders(
  lists: HomeList[],
): WeTheLivingSliderSection[] {
  const sliders: WeTheLivingSliderSection[] = [];

  for (const list of lists) {
    const items = mapClassroomsToWeTheLivingCourseCards(list.data);
    if (items.length === 0) continue;

    sliders.push({
      kind: "slider",
      id: list.slug,
      title: list.title?.trim() || list.slug,
      items,
    });
  }

  return sliders;
}

/** Hero is followed by banner, slider, banner, slider. */
export function interleaveWeTheLivingBanners(
  sliders: WeTheLivingSliderSection[],
  banners: WeTheLivingBannerSection[],
): WeTheLivingHomeSection[] {
  const sections: WeTheLivingHomeSection[] = [];
  const length = Math.max(sliders.length, banners.length);

  for (let index = 0; index < length; index += 1) {
    const banner = banners[index];
    const slider = sliders[index];
    if (banner) sections.push(banner);
    if (slider) sections.push(slider);
  }

  return sections;
}

/**
 * Builds the We The Living homepage section list from `/home` lists.
 * Each banner is followed by a slider row.
 */
export function composeWeTheLivingHomeSections(
  lists: HomeList[],
  banners: WeTheLivingBannerSection[] = [],
): WeTheLivingHomeSection[] {
  return interleaveWeTheLivingBanners(
    mapHomeListsToWeTheLivingSliders(lists),
    banners,
  );
}
