export const SEARCH_ROUTE = "/ara" as const;

export const SEARCH_QUERY_PARAM = "q" as const;

export const SEARCH_PAGE_SIZE = 16;

/**
 * Laravel JSON:API pagination is 1-indexed. Sending `page[number]=0`
 * is coerced to page 1, so the first real next page is 2.
 * Matches `useCategoryClassroomsQuery` / classroom list.
 */
export const SEARCH_INITIAL_PAGE = 1;

export const SEARCH_DEBOUNCE_MS = 400;

/** Match header/footer/category content width. */
export const SEARCH_CONTAINER_CLASS =
  "mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10";

/**
 * Half the overlapping input (`translate-y-1/2`) plus gap before results.
 * `--search-input-height` is set on the page shell.
 */
export const SEARCH_RESULTS_PADDING_CLASS =
  "pt-[calc(var(--search-input-height)/2+1.5rem)] pb-8 sm:pt-[calc(var(--search-input-height)/2+2rem)] sm:pb-10 lg:pb-12";

/** Mobile 2 / desktop 4. Tablet follows the site lg breakpoint. */
export const SEARCH_GRID_CLASS =
  "grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6";

export const SEARCH_SKELETON_COUNT = 4;
