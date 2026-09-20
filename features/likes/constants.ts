export const PROFILE_SELECT_HREF = "/profil-sec" as const;

/**
 * Laravel JSON:API pagination is 1-indexed. Sending `page[number]=0`
 * is coerced to page 1, so "load more" would refetch the same page.
 * Matches search / category classroom lists.
 */
export const LIKED_INITIAL_PAGE = 1;

export const FAVORITE_BUTTON_CLASS =
  "absolute top-2 right-1.5 z-20 inline-flex size-9 items-center justify-center rounded-full bg-transparent text-white transition-colors duration-200 hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 md:hover:scale-110 disabled:opacity-70";
