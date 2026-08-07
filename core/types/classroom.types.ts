export type ClassroomPlatform = "wisenrise" | "wetheliving";

export type ClassroomMedia = {
  id: number;
  name: string;
  mimetype: string;
  type: string;
  size: number;
  path: string;
};

export type ClassroomCategory = {
  id: number;
  name: string;
  slug: string;
  order?: number;
  parent_id?: number | null;
  is_active?: number | boolean;
  description?: string | null;
  is_last?: boolean;
  banner?: ClassroomMedia | null;
};

export type ClassroomTeacher = {
  id: string | number;
  name: string;
  slug?: string;
  description?: string | null;
  logo?: ClassroomMedia | null;
  photo?: ClassroomMedia | null;
  is_favorite?: boolean;
  cover?: ClassroomMedia | null;
  galleries?: ClassroomMedia[];
  categories?: ClassroomCategory[];
  view_count?: number | null;
  classrooms?: Classroom[];
};

export type ClassroomVideoTag = {
  id: number;
  name: string;
};

export type ClassroomVideo = {
  id: string | number;
  name: string;
  slug: string;
  duration?: string | null;
  description?: string | null;
  order?: number | null;
  thumbnail?: ClassroomMedia | null;
  tags?: ClassroomVideoTag[];
  raw_file_path?: string | null;
  download_url?: string | null;
  podcast_file_path?: string | null;
  podcast_file?: string | null;
  /** HLS / progressive stream when provided by API. */
  stream_url?: string | null;
  teaser?: string | null;
};

export type Classroom = {
  id: string | number;
  name: string;
  slug: string;
  platform?: ClassroomPlatform | string;
  description?: string | null;
  view_count?: number | null;
  is_favorite?: boolean | null;
  coming_soon?: boolean | null;
  /** ISO date string, e.g. "2026-08-12". */
  coming_soon_date?: string | null;
  classroom_duration?: string | null;
  /** Episode / section count from API (may be numeric). */
  specs?: number | string | null;
  raw_teaser_path?: string | null;
  /** Trailer stream URL (often HLS `.m3u8`). */
  teaser?: string | null;
  created_at?: string | null;
  thumbnail?: ClassroomMedia | null;
  cover?: ClassroomMedia | null;
  banner?: ClassroomMedia | null;
  category?: ClassroomCategory | null;
  teacher?: ClassroomTeacher | null;
  videos?: ClassroomVideo[];
};

export type ClassroomDetailResponse = {
  data: Classroom;
};

export type ClassroomsPaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type ClassroomsPaginatedResponse = {
  data: Classroom[];
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
  meta?: Partial<ClassroomsPaginationMeta>;
};

export type ClassroomsListParams = {
  category_id?: number;
  platform?: ClassroomPlatform | string;
  page?: number;
  per_page?: number;
};

export type ClassroomsListResult = {
  items: Classroom[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};
