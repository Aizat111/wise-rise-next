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

import { LIKED_INITIAL_PAGE } from "../constants";

type LikedListParams = {
  profileId: string | number;
  page?: number;
  per_page?: number;
  signal?: AbortSignal;
};

type PaginationFields = {
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
};

type NestedLikeCollection<T> = PaginationFields & {
  data?: T[];
  classrooms?: T[];
  teachers?: T[];
  items?: T[];
  meta?: Partial<PaginationFields>;
};

type PaginatedLikeResponse<T> = PaginationFields & {
  data?: T[] | NestedLikeCollection<T>;
  classrooms?: T[];
  teachers?: T[];
  items?: T[];
  meta?: Partial<PaginationFields>;
};

type LikeListResponse<T> = T[] | PaginatedLikeResponse<T>;

type LikeListResult<T> = {
  items: T[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function extractItems<T>(response: LikeListResponse<T>): T[] {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.classrooms)) return response.classrooms;
  if (Array.isArray(response.teachers)) return response.teachers;
  if (Array.isArray(response.items)) return response.items;

  if (response.data && typeof response.data === "object") {
    if (Array.isArray(response.data.data)) return response.data.data;
    if (Array.isArray(response.data.classrooms)) return response.data.classrooms;
    if (Array.isArray(response.data.teachers)) return response.data.teachers;
    if (Array.isArray(response.data.items)) return response.data.items;
  }

  return [];
}

function unwrapLikedItem<T extends { id?: string | number }>(
  item: unknown,
  nestedKey: "classroom" | "teacher",
): T | null {
  if (!isRecord(item)) return null;

  const nested = isRecord(item[nestedKey]) ? item[nestedKey] : item;
  if (!isRecord(nested) || nested.id == null) return null;

  return nested as T;
}

function pickPagination(
  response: PaginatedLikeResponse<unknown>,
): PaginationFields {
  const nestedData =
    response.data && typeof response.data === "object" && !Array.isArray(response.data)
      ? response.data
      : undefined;
  const meta = response.meta ?? nestedData?.meta ?? {};

  return {
    current_page:
      meta.current_page ??
      response.current_page ??
      nestedData?.current_page,
    per_page: meta.per_page ?? response.per_page ?? nestedData?.per_page,
    total: meta.total ?? response.total ?? nestedData?.total,
    last_page: meta.last_page ?? response.last_page ?? nestedData?.last_page,
  };
}

/**
 * Likes list endpoints use 1-based `page[number]` (Laravel JSON:API),
 * matching search and category classroom lists.
 */
function normalizeLikeList<T extends { id?: string | number }>(
  response: LikeListResponse<T>,
  fallbackPage: number,
  fallbackPerPage: number,
  nestedKey: "classroom" | "teacher",
): LikeListResult<T> {
  const page = Math.max(LIKED_INITIAL_PAGE, fallbackPage);
  const perPage = Math.max(fallbackPerPage, 1);

  const rawItems = extractItems(response);
  const allItems = rawItems
    .map((item) => unwrapLikedItem<T>(item, nestedKey))
    .filter((item): item is T => item != null);

  if (Array.isArray(response)) {
    const total = allItems.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;

    return {
      items: allItems.slice(start, start + perPage),
      currentPage: page,
      lastPage,
      perPage,
      total,
    };
  }

  const pagination = pickPagination(response);
  const hasExplicitTotal = pagination.total != null;
  const hasExplicitLastPage = pagination.last_page != null;
  const currentPage = Number(pagination.current_page ?? page);

  // API ignored pagination and returned the full list.
  if (!hasExplicitLastPage && !hasExplicitTotal && allItems.length > perPage) {
    const total = allItems.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;

    return {
      items: allItems.slice(start, start + perPage),
      currentPage: page,
      lastPage,
      perPage,
      total,
    };
  }

  const total = Number(pagination.total ?? allItems.length);
  let lastPage = Number(
    pagination.last_page ?? Math.max(1, Math.ceil(total / perPage)),
  );

  if (!hasExplicitLastPage && !hasExplicitTotal) {
    lastPage = allItems.length >= perPage ? currentPage + 1 : currentPage;
  }

  return {
    items: allItems,
    currentPage,
    lastPage,
    perPage: Number(pagination.per_page ?? perPage),
    total: hasExplicitTotal ? total : allItems.length,
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
    const page = params.page ?? LIKED_INITIAL_PAGE;
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

    return normalizeLikeList(response, page, perPage, "classroom");
  },

  async listLikedTeachers(params: LikedListParams): Promise<TeachersListResult> {
    const page = params.page ?? LIKED_INITIAL_PAGE;
    const perPage = params.per_page ?? 5;

    const response = await clientRequest<Teacher[] | TeachersPaginatedResponse>({
      url: ENDPOINTS.profile.likedTeachers(params.profileId),
      method: "GET",
      signal: params.signal,
      params: {
        "page[number]": page,
        "page[size]": perPage,
      },
    });

    return normalizeLikeList(response, page, perPage, "teacher");
  },
};
