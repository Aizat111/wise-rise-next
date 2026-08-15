export const CATEGORIES_GRID_CLASS = "grid grid-cols-2 gap-3 sm:gap-5 lg:gap-6";

export const CATEGORIES_CARD_CLASS =
  "relative flex min-h-[60px] items-center overflow-hidden rounded-xl bg-surface px-4 py-5 sm:min-h-[70px] sm:px-6 sm:py-7 lg:min-h-[80px] lg:px-8";

export const CATEGORIES_SKELETON_COUNT = 8;

export const CATEGORIES_MOTION = {
  duration: 1.2,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const CATEGORY_TITLE_COLOR = "#ffffff";
export const CATEGORY_TITLE_HOVER_COLOR = "var(--primary)";

export function getCategoryHref(slug: string) {
  return `/${slug.replace(/^\/+/, "")}`;
}
