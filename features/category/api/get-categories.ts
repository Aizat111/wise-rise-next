import { ENDPOINTS } from "@/core/api/endpoints";
import { serverRequest } from "@/core/api/server";
import type { Category } from "@/core/api/types";

import { normalizeCategories } from "./category.utils";

type CategoriesResponse = Category[] | { data: Category[] };

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await serverRequest<CategoriesResponse>({
      url: ENDPOINTS.category.list,
      method: "GET",
    });

    return normalizeCategories(response);
  } catch {
    return [];
  }
}
