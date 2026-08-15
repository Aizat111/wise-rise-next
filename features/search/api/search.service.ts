import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  Classroom,
  ClassroomsListResult,
  ClassroomsPaginatedResponse,
} from "@/core/types/classroom.types";

import { SEARCH_INITIAL_PAGE, SEARCH_PAGE_SIZE } from "../constants";
import type { SearchListParams } from "../types";

type SearchResponse = Classroom[] | ClassroomsPaginatedResponse;

function normalizeSearchResponse(
  response: SearchResponse,
  fallbackPage: number,
  fallbackPerPage: number,
): ClassroomsListResult {
  if (Array.isArray(response)) {
    return {
      items: response,
      currentPage: fallbackPage,
      lastPage: 1,
      perPage: fallbackPerPage,
      total: response.length,
    };
  }

  const items = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta ?? {};

  return {
    items,
    currentPage: Number(
      meta.current_page ?? response.current_page ?? fallbackPage,
    ),
    lastPage: Number(meta.last_page ?? response.last_page ?? 1),
    perPage: Number(meta.per_page ?? response.per_page ?? fallbackPerPage),
    total: Number(meta.total ?? response.total ?? items.length),
  };
}

export const searchService = {
  async search(params: SearchListParams): Promise<ClassroomsListResult> {
    const page = params.page ?? SEARCH_INITIAL_PAGE;
    const perPage = params.per_page ?? SEARCH_PAGE_SIZE;

    const response = await clientRequest<SearchResponse>({
      url: ENDPOINTS.search,
      method: "GET",
      signal: params.signal,
      params: {
        q: params.q,
        "page[number]": page,
        "page[size]": perPage,
      },
    });

    return normalizeSearchResponse(response, page, perPage);
  },
};
