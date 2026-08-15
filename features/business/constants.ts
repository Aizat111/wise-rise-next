export const BUSINESS_ROUTE = "/business" as const;

/** Match header/footer/category content width. */
export const BUSINESS_CONTAINER_CLASS =
  "mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12";

/**
 * Feature cards: 1 / 2 / 4.
 * Breakpoints follow the site scale (md tablet, lg desktop).
 */
export const BUSINESS_FEATURES_GRID_CLASS =
  "grid grid-cols-1 gap-8 sm:gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12";

export const BUSINESS_FEATURE_ICON_SIZE = 40;

export const BUSINESS_FEATURE_IMAGES = {
  play: "/business/features/play.svg",
  flexible: "/business/features/flexible.svg",
  lessons: "/business/features/lessons.svg",
  interactive: "/business/features/interactive.svg",
  saveable: "/business/features/saveable.svg",
  identification: "/business/features/identification.svg",
  performance: "/business/features/performance.svg",
  certificate: "/business/features/certificate.svg",
} as const;

export const BUSINESS_REFERENCE_LOGOS = [
  { src: "/business/ant.svg", name: "ANT" },
  { src: "/business/atu.svg", name: "ATÜ" },
  { src: "/business/dalgakiran.svg", name: "Dalgakıran" },
  { src: "/business/ds.svg", name: "DS" },
  { src: "/business/flo.svg", name: "FLO" },
  { src: "/business/granti.svg", name: "Granti" },
  { src: "/business/kronik.svg", name: "Kronik" },
  { src: "/business/tt.svg", name: "TT" },
] as const;

export const BUSINESS_SWIPER_BREAKPOINTS = {
  640: { slidesPerView: 3, spaceBetween: 28 },
  768: { slidesPerView: 4, spaceBetween: 32 },
  1024: { slidesPerView: 5, spaceBetween: 36 },
  1280: { slidesPerView: 6, spaceBetween: 40 },
} as const;

export const BUSINESS_SWIPER_AUTOPLAY = {
  delay: 0,
  disableOnInteraction: false,
  pauseOnMouseEnter: true,
} as const;

export const BUSINESS_SWIPER_SPEED_MS = 1500;
