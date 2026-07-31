export type TeacherMedia = {
  id: number;
  name: string;
  mimetype: string;
  type: string;
  size: number;
  path: string;
};

export type TeacherCategory = {
  id: number;
  name: string;
  slug: string;
  order?: number;
  parent_id?: number | null;
  is_active?: number | boolean;
  description?: string | null;
  is_last?: boolean;
  banner?: TeacherMedia | null;
};

export type Teacher = {
  id: string | number;
  name: string;
  slug: string;
  description?: string | null;
  logo?: TeacherMedia | null;
  photo?: TeacherMedia | null;
  galleries?: TeacherMedia[];
  categories?: TeacherCategory[];
  view_count?: number | null;
  is_favorite?: boolean | null;
};

export type TeachersPaginatedResponse = {
  data: Teacher[];
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
};
