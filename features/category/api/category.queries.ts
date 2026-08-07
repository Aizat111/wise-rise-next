"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { Category } from "@/core/api/types";
import { categoryService } from "./category.service";

export function useCategoriesQuery(initialData?: Category[]) {
  return useQuery<Category[]>({
    queryKey: QUERY_KEYS.category.all,
    queryFn: () => categoryService.list(),
    initialData:
      initialData && initialData.length > 0 ? initialData : undefined,
    staleTime: 5 * 60 * 1000,
  });
}
