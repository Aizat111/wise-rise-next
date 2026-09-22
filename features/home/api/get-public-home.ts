import type { Classroom, ClassroomMedia } from "@/core/types/classroom.types";
import type { Hero } from "@/core/types/hero.types";
import type { HomeFeed, HomeList } from "@/core/types/home.types";
import type { Teacher } from "@/core/types/teacher.types";

import { heroService } from "./hero.service";
import { getHomeFeedPlatform } from "./home.utils";
import { homeService } from "./home.service";

export type PublicHomeSeed = {
  /** Guest feed/hero platform for the default tab. Personalized data stays client-side. */
  platform: string;
  heroes: Hero[];
  feed: HomeFeed | null;
};

function slimMedia(media: ClassroomMedia | null | undefined) {
  if (!media?.path) return null;
  return {
    id: media.id,
    name: media.name,
    mimetype: media.mimetype,
    type: media.type,
    size: media.size,
    path: media.path,
  };
}

/** Card fields only. Full classroom graphs (videos, teasers, galleries) stay off the HTML payload. */
function slimClassroom(classroom: Classroom): Classroom {
  const teacher = classroom.teacher;
  return {
    id: classroom.id,
    name: classroom.name,
    slug: classroom.slug,
    platform: classroom.platform,
    is_favorite: classroom.is_favorite ?? false,
    coming_soon: classroom.coming_soon,
    coming_soon_date: classroom.coming_soon_date,
    thumbnail: slimMedia(classroom.thumbnail),
    cover: slimMedia(classroom.cover),
    teacher: teacher
      ? {
          id: teacher.id,
          name: teacher.name,
          slug: teacher.slug,
          logo: slimMedia(teacher.logo),
          photo: slimMedia(teacher.photo),
        }
      : undefined,
  };
}

function slimTeacher(teacher: Teacher): Teacher {
  return {
    id: teacher.id,
    name: teacher.name,
    slug: teacher.slug,
    description: teacher.description,
    is_favorite: teacher.is_favorite,
    photo: teacher.photo,
    categories: teacher.categories?.slice(0, 1).map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    })),
  };
}

function slimHomeList(list: HomeList): HomeList {
  if (list.type === "teachers") {
    return {
      ...list,
      data: (list.data as Teacher[]).map(slimTeacher),
    };
  }

  return {
    ...list,
    data: (list.data as Classroom[]).map(slimClassroom),
  };
}

function slimHomeFeed(feed: HomeFeed): HomeFeed {
  return {
    platform: feed.platform,
    is_member: false,
    lists: feed.lists.map(slimHomeList),
  };
}

function slimHero(hero: Hero): Hero {
  return {
    id: hero.id,
    platform: hero.platform,
    media_type: hero.media_type,
    title: hero.title,
    description: hero.description,
    button_text: hero.button_text,
    button_url: hero.button_url,
    order: hero.order,
    is_active: hero.is_active,
    show_on_homepage: hero.show_on_homepage,
    image_url: hero.image_url,
    mobile_image_url: hero.mobile_image_url,
    video_url: null,
  };
}

export async function getPublicHomeSeed(): Promise<PublicHomeSeed> {
  const platform = getHomeFeedPlatform("all");

  const [heroes, feed] = await Promise.all([
    heroService
      .list({ platform, mediaType: "image" })
      .catch(() => [] as Hero[]),
    homeService.getFeed(platform).catch(() => null),
  ]);

  return {
    platform,
    heroes: heroes.map(slimHero),
    feed: feed ? slimHomeFeed(feed) : null,
  };
}
