import type { Category } from "@/core/api/types";

type CategoriesResponse = Category[] | { data: Category[] };

export function normalizeCategories(response: CategoriesResponse): Category[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}
