"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { Category } from "@/core/api/types";
import { categoryService } from "./category.service";

export function useCategoriesQuery() {
  return useQuery<Category[]>({
    queryKey: QUERY_KEYS.category.all,
    queryFn: () => categoryService.list(),
    staleTime: 5 * 60 * 1000,
  });
}
