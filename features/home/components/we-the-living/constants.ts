export const WE_THE_LIVING_PLATFORM = "wetheliving";

export const WE_THE_LIVING_THEME_STYLE = {
  background:
    "linear-gradient(180deg, #045333 0%, #02341f 40%, #011b10 70%, #000000 100%)",
} as const;

/** Matches DefaultHome inner content inset (`lg:px-25`). */
export const WE_THE_LIVING_CONTAINER_CLASS = "px-4 lg:px-25";

/** Video hero: viewport-aware, never a fragile fixed pixel height. */
export const WE_THE_LIVING_VIDEO_HERO_HEIGHT_CLASS =
  "h-[min(48dvh,calc(100dvh-11rem))] min-h-[30dvh] max-h-[70dvh] md:h-[min(56dvh,calc(100dvh-10rem))]";

export const WE_THE_LIVING_FEED_SKELETON_COUNT = 3;

export const WE_THE_LIVING_SLIDER_SKELETON_COUNT = 4;

export const WE_THE_LIVING_SIMPLE_BANNER_IMAGES = {
  item1: "/wetheliving/icon-1.png",
  item2: "/wetheliving/icon-2.png",
} as const;

/** Library background composed for right-side copy. */
export const WE_THE_LIVING_IMAGE_BANNER_SRC = "/wetheliving/wtl_banner.png";

export const WE_THE_LIVING_MEMBERSHIP_IMAGES = {
  monthly: "/wetheliving/monthly_plan.png",
  yearly: "/wetheliving/yearly_plan.png",
} as const;

export const WE_THE_LIVING_HOME_BANNERS = [
  {
    kind: "banner" as const,
    id: "wtl-membership",
    variant: "membership" as const,
  },
  {
    kind: "banner" as const,
    id: "wtl-simple-item1",
    variant: "simple" as const,
    itemKey: "item1" as const,
    image: WE_THE_LIVING_SIMPLE_BANNER_IMAGES.item1,
  },
  {
    kind: "banner" as const,
    id: "wtl-image",
    variant: "image" as const,
  },
  {
    kind: "banner" as const,
    id: "wtl-simple-item2",
    variant: "simple" as const,
    itemKey: "item2" as const,
    image: WE_THE_LIVING_SIMPLE_BANNER_IMAGES.item2,
  },
];

export function getWeTheLivingHomeBanners(isAuthenticated: boolean) {
  if (isAuthenticated) {
    return WE_THE_LIVING_HOME_BANNERS.filter(
      (banner) => banner.variant !== "membership",
    );
  }

  return WE_THE_LIVING_HOME_BANNERS;
}
