import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  Classroom,
  ClassroomsListResult,
  ClassroomsPaginatedResponse,
} from "@/core/types/classroom.types";
import type {
  Teacher,
  TeachersListResult,
  TeachersPaginatedResponse,
} from "@/core/types/teacher.types";

type LikedListParams = {
  profileId: string | number;
  page?: number;
  per_page?: number;
  signal?: AbortSignal;
};

type PaginatedLikeResponse<T> = {
  data?: T[] | { data?: T[]; classrooms?: T[]; teachers?: T[] };
  classrooms?: T[];
  teachers?: T[];
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
  meta?: Partial<{
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  }>;
};

type LikeListResponse<T> = T[] | PaginatedLikeResponse<T>;

type LikeListResult<T> = {
  items: T[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

function extractItems<T>(response: LikeListResponse<T>): T[] {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response.data)) return response.data;

  if (response.data && typeof response.data === "object") {
    if (Array.isArray(response.data.data)) return response.data.data;
    if (Array.isArray(response.data.classrooms)) return response.data.classrooms;
    if (Array.isArray(response.data.teachers)) return response.data.teachers;
  }

  if (Array.isArray(response.classrooms)) return response.classrooms;
  if (Array.isArray(response.teachers)) return response.teachers;

  return [];
}

/**
 * Likes list endpoints use 0-based `page[number]` (same as teacher "the best").
 */
function normalizeLikeList<T>(
  response: LikeListResponse<T>,
  fallbackPage: number,
  fallbackPerPage: number,
): LikeListResult<T> {
  if (Array.isArray(response)) {
    const total = response.length;
    const lastPage = Math.max(
      0,
      Math.ceil(total / Math.max(fallbackPerPage, 1)) - 1,
    );
    const start = fallbackPage * fallbackPerPage;

    return {
      items: response.slice(start, start + fallbackPerPage),
      currentPage: fallbackPage,
      lastPage,
      perPage: fallbackPerPage,
      total,
    };
  }

  const items = extractItems(response);
  const meta = response.meta ?? {};
  const hasExplicitTotal = meta.total != null || response.total != null;
  const hasExplicitLastPage =
    meta.last_page != null || response.last_page != null;

  const currentPage = Number(
    meta.current_page ?? response.current_page ?? fallbackPage,
  );
  const total = Number(meta.total ?? response.total ?? items.length);

  let lastPage = Number(
    meta.last_page ??
      response.last_page ??
      Math.max(0, Math.ceil(total / Math.max(fallbackPerPage, 1)) - 1),
  );

  if (!hasExplicitLastPage && !hasExplicitTotal) {
    lastPage = items.length >= fallbackPerPage ? currentPage + 1 : currentPage;
  }

  return {
    items,
    currentPage,
    lastPage,
    perPage: Number(meta.per_page ?? response.per_page ?? fallbackPerPage),
    total: hasExplicitTotal ? total : items.length,
  };
}

export const likeService = {
  async likeClassroom(
    profileId: string | number,
    classroomId: string | number,
  ): Promise<void> {
    await clientRequest({
      url: ENDPOINTS.profile.likeClassroom(profileId, classroomId),
      method: "POST",
    });
  },

  async unlikeClassroom(
    profileId: string | number,
    classroomId: string | number,
  ): Promise<void> {
    await clientRequest({
      url: ENDPOINTS.profile.likeClassroom(profileId, classroomId),
      method: "DELETE",
    });
  },

  async likeTeacher(
    profileId: string | number,
    teacherId: string | number,
  ): Promise<void> {
    await clientRequest({
      url: ENDPOINTS.profile.likeTeacher(profileId, teacherId),
      method: "POST",
    });
  },

  async unlikeTeacher(
    profileId: string | number,
    teacherId: string | number,
  ): Promise<void> {
    await clientRequest({
      url: ENDPOINTS.profile.likeTeacher(profileId, teacherId),
      method: "DELETE",
    });
  },

  async listLikedClassrooms(
    params: LikedListParams,
  ): Promise<ClassroomsListResult> {
    const page = params.page ?? 0;
    const perPage = params.per_page ?? 4;

    const response = await clientRequest<
      Classroom[] | ClassroomsPaginatedResponse
    >({
      url: ENDPOINTS.profile.likedClassrooms(params.profileId),
      method: "GET",
      signal: params.signal,
      params: {
        "page[number]": page,
        "page[size]": perPage,
      },
    });

    return normalizeLikeList(response, page, perPage);
  },

  async listLikedTeachers(params: LikedListParams): Promise<TeachersListResult> {
    const page = params.page ?? 0;
    const perPage = params.per_page ?? 5;

    const response = await clientRequest<Teacher[] | TeachersPaginatedResponse>(
      {
        url: ENDPOINTS.profile.likedTeachers(params.profileId),
        method: "GET",
        signal: params.signal,
        params: {
          "page[number]": page,
          "page[size]": perPage,
        },
      },
    );

    return normalizeLikeList(response, page, perPage);
  },
};
