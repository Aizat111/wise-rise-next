import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  Teacher,
  TeachersListParams,
  TeachersListResult,
  TeachersPaginatedResponse,
} from "@/core/types/teacher.types";

type TeachersListResponse = Teacher[] | TeachersPaginatedResponse;

function normalizeTeachers(response: TeachersListResponse): Teacher[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  return [];
}

function normalizePaginated(
  response: TeachersListResponse,
  fallbackPage: number,
  fallbackPerPage: number,
): TeachersListResult {
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

  const allItems = normalizeTeachers(response);
  const meta = response.meta ?? {};
  const currentPage = Number(
    meta.current_page ?? response.current_page ?? fallbackPage,
  );
  const hasExplicitTotal = meta.total != null || response.total != null;
  const hasExplicitLastPage =
    meta.last_page != null || response.last_page != null;

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

  if (!hasExplicitLastPage && !hasExplicitTotal) {
    lastPage =
      allItems.length >= fallbackPerPage ? currentPage + 1 : currentPage;
  }

  return {
    items: allItems,
    currentPage,
    lastPage,
    perPage: Number(meta.per_page ?? response.per_page ?? fallbackPerPage),
    total: hasExplicitTotal ? total : allItems.length,
  };
}

export type ListBestTeachersParams = {
  page?: number;
  pageSize?: number;
};

export const teacherService = {
  async list(params: TeachersListParams = {}): Promise<TeachersListResult> {
    const page = params.page ?? 1;
    const perPage = params.per_page ?? 12;

    const response = await clientRequest<TeachersListResponse>({
      url: ENDPOINTS.teacher.list,
      method: "GET",
      params: {
        "page[number]": page,
        "page[size]": perPage,
        ...(params.category_id != null
          ? { category_id: params.category_id }
          : {}),
      },
    });

    return normalizePaginated(response, page, perPage);
  },

  async listTheBest({
    page = 0,
    pageSize = 12,
  }: ListBestTeachersParams = {}): Promise<Teacher[]> {
    const response = await clientRequest<TeachersListResponse>({
      url: ENDPOINTS.teacher.theBest,
      method: "GET",
      params: {
        "page[number]": page,
        "page[size]": pageSize,
      },
    });

    return normalizeTeachers(response);
  },
};
