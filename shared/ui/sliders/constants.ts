/** Visible slides: 2 on mobile, 4 on desktop (md+). */
export const SLIDER_MOBILE_VISIBLE = 2;
export const SLIDER_DESKTOP_VISIBLE = 4;

/** Default skeleton placeholders while a content slider loads. */
export const SLIDER_DEFAULT_SKELETON_COUNT = 4;

/**
 * Item width formulas keep equal gaps and exact visible counts.
 * Gap must match the slider track `gap-*` utility (default: gap-3 = 0.75rem).
 */
export const SLIDER_ITEM_WIDTH_CLASS =
  "w-[calc((100%-0.75rem)/2)] md:w-[calc((100%-2.25rem)/4)]";

/** Coming Soon slider: always show exactly 2 cards (mobile + desktop). */
export const COMING_SOON_VISIBLE = 2;
export const COMING_SOON_SKELETON_COUNT = 2;
export const COMING_SOON_SLIDER_ITEM_WIDTH_CLASS =
  "w-[calc((100%-0.75rem)/2)]";

/** Teacher slider: 2 on mobile, 5 on desktop (md+). */
export const TEACHER_MOBILE_VISIBLE = 2;
export const TEACHER_DESKTOP_VISIBLE = 5;
export const TEACHER_SKELETON_COUNT = 5;
export const TEACHER_SLIDER_ITEM_WIDTH_CLASS =
  "w-[calc((100%-0.75rem)/2)] md:w-[calc((100%-3rem)/5)]";

/** Certificate slider: 2 on mobile, 5 on desktop — slightly smaller than default 4-up cards. */
export const CERTIFICATE_SKELETON_COUNT = 5;
export const CERTIFICATE_SLIDER_ITEM_WIDTH_CLASS =
  "w-[calc((100%-0.75rem)/2)] md:w-[calc((100%-3rem)/5)]";

/** Desktop: ~5% adjacent peek on each side → active hero ~90% wide. */
export const HERO_PEEK_PERCENT = 5;
export const HERO_ACTIVE_PERCENT = 100 - HERO_PEEK_PERCENT * 2;

/** Mobile: ~2.5% peek each side → active hero ~95% wide. */
export const HERO_MOBILE_PEEK_PERCENT = 2.5;
export const HERO_MOBILE_ACTIVE_PERCENT = 100 - HERO_MOBILE_PEEK_PERCENT * 2;

/**
 * Mobile: fixed 380px frame (width is 95% via carousel peek).
 * Desktop: 5/2 landscape. Do not pair this with `md:h-auto` on a box whose
 * children are `position: absolute` — height collapses to 0 and the slide vanishes.
 */
export const HERO_ASPECT_RATIO_CLASS = "h-[380px] md:aspect-[5/2]";
