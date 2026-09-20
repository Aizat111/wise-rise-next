import {
  TEACHERS_CATEGORY_PARAM,
  TEACHERS_INITIAL_PAGE,
  TEACHERS_PAGE_PARAM,
  TEACHERS_ROUTE,
} from "../constants";

export function getTeachersHref(
  categoryId?: number | null,
  page = TEACHERS_INITIAL_PAGE,
) {
  const params = new URLSearchParams();

  if (categoryId != null) {
    params.set(TEACHERS_CATEGORY_PARAM, String(categoryId));
  }

  if (page > TEACHERS_INITIAL_PAGE) {
    params.set(TEACHERS_PAGE_PARAM, String(page));
  }

  const query = params.toString();
  return query ? `${TEACHERS_ROUTE}?${query}` : TEACHERS_ROUTE;
}

export function parseTeachersCategoryId(
  value: string | null | undefined,
): number | null {
  if (!value) return null;
  if (!/^\d+$/.test(value)) return null;
  return Number(value);
}

export function parseTeachersPage(value: string | null | undefined): number {
  if (!value) return TEACHERS_INITIAL_PAGE;
  const page = Number(value);
  if (!Number.isInteger(page) || page < TEACHERS_INITIAL_PAGE) {
    return TEACHERS_INITIAL_PAGE;
  }
  return page;
}
