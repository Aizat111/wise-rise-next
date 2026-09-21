import type { Classroom, ClassroomPlatform } from "./classroom.types";
import type { Teacher } from "./teacher.types";

export type HomeListType =
  | "manual"
  | "new_added"
  | "category"
  | "teachers"
  | "coming_soon"
  | string;

export type HomeList = {
  slug: string;
  title: string;
  subtitle: string | null;
  type: HomeListType;
  /** Classrooms for education lists; teachers when `type === "teachers"`. */
  data: Classroom[] | Teacher[];
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
