/** CloudFront media host used for relative API media paths. */
export const COURSE_MEDIA_CDN =
  process.env.NEXT_PUBLIC_MEDIA_CDN_URL ??
  "https://d2n3smj2dajpcu.cloudfront.net";

/** Max visible characters for the course description on mobile hero. */
export const MOBILE_DESCRIPTION_MAX_CHARS = 50;

export const COURSE_VIDEO_SKELETON_COUNT = 4;
