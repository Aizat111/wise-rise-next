import { cache } from "react";

import type { ClassroomsListResult } from "@/core/types/classroom.types";
import { classroomService } from "@/features/home/api/classroom.service";

import { CATEGORY_PAGE_SIZE } from "../constants";
import { getSelectionFilters } from "./selection.utils";
import type { CategorySelection } from "../types";

const loadCategoryClassroomPage = cache(async function loadCategoryClassroomPage(
  categoryId: number | null,
  platform: string | null,
): Promise<ClassroomsListResult | null> {
  try {
    return await classroomService.list({
      page: 1,
      per_page: CATEGORY_PAGE_SIZE,
      ...(categoryId != null ? { category_id: categoryId } : {}),
      ...(platform ? { platform } : {}),
    });
  } catch {
    return null;
  }
});

/** First public page of a category listing. Guest response only — no auth token. */
export async function getCategoryClassroomPage(
  selection: CategorySelection,
): Promise<ClassroomsListResult | null> {
  const filters = getSelectionFilters(selection);

  return loadCategoryClassroomPage(
    filters.categoryId ?? null,
    filters.platform ?? null,
  );
}
