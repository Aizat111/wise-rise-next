export type ClassroomPlatform = "wisenrise" | "wetheliving";

export type ClassroomMedia = {
  id: number;
  name: string;
  mimetype: string;
  type: string;
  size: number;
  path: string;
};

export type ClassroomTeacher = {
  id: string | number;
  name: string;
  slug?: string;
  logo?: ClassroomMedia | null;
  photo?: ClassroomMedia | null;
  is_favorite?: boolean;
};

export type Classroom = {
  id: string | number;
  name: string;
  slug: string;
  platform: ClassroomPlatform | string;
  description?: string | null;
  view_count?: number;
  is_favorite?: boolean | null;
  coming_soon?: boolean | null;
  /** ISO date string, e.g. "2026-08-12". */
  coming_soon_date?: string | null;
  thumbnail?: ClassroomMedia | null;
  cover?: ClassroomMedia | null;
  banner?: ClassroomMedia | null;
  teacher?: ClassroomTeacher | null;
};

export type ClassroomsPaginatedResponse = {
  data: Classroom[];
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
};
