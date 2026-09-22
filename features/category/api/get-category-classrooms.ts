import type { ClassroomsListResult } from "@/core/types/classroom.types";
import { classroomService } from "@/features/home/api/classroom.service";

import { CATEGORY_PAGE_SIZE } from "../constants";
import { getSelectionFilters } from "./selection.utils";
import type { CategorySelection } from "../types";

/** First public page of a category listing. Guest response only — no auth token. */
export async function getCategoryClassroomPage(
  selection: CategorySelection,
): Promise<ClassroomsListResult | null> {
  const filters = getSelectionFilters(selection);

  try {
    return await classroomService.list({
      page: 1,
      per_page: CATEGORY_PAGE_SIZE,
      ...(filters.categoryId != null ? { category_id: filters.categoryId } : {}),
      ...(filters.platform ? { platform: filters.platform } : {}),
    });
  } catch {
    return null;
  }
}
