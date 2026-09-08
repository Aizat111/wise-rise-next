import { GOAL_SELECTION_HREF } from "@/features/profile/constants";

export const SURVEY_ROUTE = GOAL_SELECTION_HREF;

export const SURVEY_TOTAL_STEPS = 2;

export const SURVEY_LOGIN_HREF = "/giris" as const;

export const SURVEY_CONTAINER_CLASS =
  "container flex w-full flex-col py-10 sm:py-14 lg:py-16";

export const SURVEY_GRID_CLASS =
  "grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:items-stretch";

export const SURVEY_GUARD_EXCLUDED_PATHS = [
  "/giris",
  "/kayit",
  "/kayit-ol",
  "/sifremi-unuttum",
  "/profil-ekle",
  "/profil-sec",
  "/hedefini-belirle",
  "/survey",
  "/hediye-kullan",
  "/hediye-kuponu",
] as const;

export function isSurveyGuardExcludedPath(pathname: string) {
  return SURVEY_GUARD_EXCLUDED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
