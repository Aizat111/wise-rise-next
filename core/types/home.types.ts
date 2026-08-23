import type { Classroom, ClassroomPlatform } from "./classroom.types";

export type HomeListType = "manual" | "new_added" | "category" | string;

export type HomeList = {
  slug: string;
  title: string;
  subtitle: string | null;
  type: HomeListType;
  data: Classroom[];
};

export type HomeFeed = {
  platform: ClassroomPlatform | string;
  is_member: boolean;
  lists: HomeList[];
};

export type HomeFeedResponse = {
  success?: boolean;
  message?: string | null;
  data: HomeFeed;
  extras?: unknown;
};
