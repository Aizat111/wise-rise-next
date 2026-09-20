/** Public URL. Served by `app/[locale]/egitmenler` via `proxy.ts` rewrite. */
export const TEACHERS_ROUTE = `/${"eğitmenler".normalize("NFC")}` as const;

export const TEACHERS_CATEGORY_PARAM = "category_id" as const;

export const TEACHERS_PAGE_PARAM = "page" as const;

export const TEACHERS_PAGE_SIZE = 12;

/**
 * Laravel JSON:API pagination is 1-indexed.
 * Live `GET /teachers?page[number]=0` returns `meta.current_page: 1`
 * (same payload as page 1), so sending `0` would make the first two
 * pagination clicks identical. Matches search / category / likes lists.
 */
export const TEACHERS_INITIAL_PAGE = 1;

export const TEACHERS_CONTAINER_CLASS =
  "mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12";

/** Mobile 2 / desktop 3 — matches the categories listing grid. */
export const TEACHERS_GRID_CLASS =
  "grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6";

export const TEACHERS_SKELETON_COUNT = 12;
