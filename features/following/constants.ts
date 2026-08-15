export const FOLLOWING_ROUTE = "/takip-ettiklerim" as const;

export const FOLLOWING_LOGIN_HREF = "/giris" as const;

export const FOLLOWING_CLASSROOMS_PAGE_SIZE = 4;

export const FOLLOWING_TEACHERS_PAGE_SIZE = 5;

export const FOLLOWING_CONTAINER_CLASS =
  "mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12";

/** Mobile 2 / desktop 4. Tablet follows the site lg breakpoint. */
export const FOLLOWING_CLASSROOMS_GRID_CLASS =
  "grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6";

/** Mobile 2 / desktop 5 — matches TeacherCard slider density. */
export const FOLLOWING_TEACHERS_GRID_CLASS =
  "grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-5 md:gap-6";

export const FOLLOWING_SECTIONS_CLASS =
  "flex flex-col gap-16 lg:gap-20";

export const FOLLOWING_LOAD_MORE_BUTTON_CLASS =
  "min-w-44 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white";
