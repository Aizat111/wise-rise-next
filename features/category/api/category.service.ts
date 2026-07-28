import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type { Category } from "@/core/api/types";

import { normalizeCategories } from "./category.utils";

type CategoriesResponse = Category[] | { data: Category[] };

export const categoryService = {
  async list(): Promise<Category[]> {
    const response = await clientRequest<CategoriesResponse>({
      url: ENDPOINTS.category.list,
      method: "GET",
    });

    return normalizeCategories(response);
  },
};
