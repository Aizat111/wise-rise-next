import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  Classroom,
  ClassroomsListParams,
  ClassroomsListResult,
  ClassroomsPaginatedResponse,
} from "@/core/types/classroom.types";

type ClassroomsListResponse = Classroom[] | ClassroomsPaginatedResponse;

function normalizeClassrooms(response: ClassroomsListResponse): Classroom[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  return [];
}

function normalizePaginated(
  response: ClassroomsListResponse,
  fallbackPage: number,
  fallbackPerPage: number,
): ClassroomsListResult {
  // Plain array: page client-side so "load more" still works.
  if (Array.isArray(response)) {
    const total = response.length;
    const lastPage = Math.max(1, Math.ceil(total / Math.max(fallbackPerPage, 1)));
    const start = (fallbackPage - 1) * fallbackPerPage;
    const items = response.slice(start, start + fallbackPerPage);

    return {
      items,
      currentPage: fallbackPage,
      lastPage,
      perPage: fallbackPerPage,
      total,
    };
  }

  const allItems = normalizeClassrooms(response);
  const meta = response.meta ?? {};
  const currentPage = Number(
    meta.current_page ?? response.current_page ?? fallbackPage,
  );
  const hasExplicitTotal = meta.total != null || response.total != null;
  const hasExplicitLastPage =
    meta.last_page != null || response.last_page != null;

  // API ignored pagination and returned the full list inside `data`.
  if (
    !hasExplicitLastPage &&
    !hasExplicitTotal &&
    allItems.length > fallbackPerPage
  ) {
    const total = allItems.length;
    const lastPage = Math.max(
      1,
      Math.ceil(total / Math.max(fallbackPerPage, 1)),
    );
    const start = (fallbackPage - 1) * fallbackPerPage;

    return {
      items: allItems.slice(start, start + fallbackPerPage),
      currentPage: fallbackPage,
      lastPage,
      perPage: fallbackPerPage,
      total,
    };
  }

  const total = Number(meta.total ?? response.total ?? allItems.length);
  let lastPage = Number(
    meta.last_page ??
      response.last_page ??
      Math.max(1, Math.ceil(total / Math.max(fallbackPerPage, 1))),
  );

  // Full page without pagination meta → another page may exist.
  if (!hasExplicitLastPage && !hasExplicitTotal) {
    lastPage =
      allItems.length >= fallbackPerPage ? currentPage + 1 : currentPage;
  }

  return {
    items: allItems,
    currentPage,
    lastPage,
    perPage: fallbackPerPage,
    total: hasExplicitTotal ? total : allItems.length,
  };
}

export const classroomService = {
  async listMostWatched(): Promise<Classroom[]> {
    const response = await clientRequest<ClassroomsListResponse>({
      url: ENDPOINTS.course.mostWatched,
      method: "GET",
    });

    return normalizeClassrooms(response);
  },

  async listComingSoon(): Promise<Classroom[]> {
    const response = await clientRequest<ClassroomsListResponse>({
      url: ENDPOINTS.course.comingSoon,
      method: "GET",
    });

    return normalizeClassrooms(response);
  },

  async list(params: ClassroomsListParams = {}): Promise<ClassroomsListResult> {
    const page = params.page ?? 1;
    const perPage = params.per_page ?? 12;

    const response = await clientRequest<ClassroomsListResponse>({
      url: ENDPOINTS.course.list,
      method: "GET",
      params: {
        "page[number]": page,
        "page[size]": perPage,
        ...(params.category_id != null
          ? { category_id: params.category_id }
          : {}),
        ...(params.platform ? { platform: params.platform } : {}),
      },
    });

    return normalizePaginated(response, page, perPage);
  },
};
