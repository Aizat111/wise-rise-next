/** CloudFront media host used for relative API media paths. */
export const COURSE_MEDIA_CDN =
  process.env.NEXT_PUBLIC_MEDIA_CDN_URL ??
  "https://d2n3smj2dajpcu.cloudfront.net";

/** Max visible characters for the course description on mobile hero. */
export const MOBILE_DESCRIPTION_MAX_CHARS = 50;

export const COURSE_VIDEO_SKELETON_COUNT = 4;

/** How often to POST the max reached playback position while a lesson is playing. */
export const VIDEO_WATCH_PROGRESS_INTERVAL_MS = 10_000;

/** Skip resume if the saved position is shorter than this. */
export const VIDEO_RESUME_MIN_SECONDS = 3;

/** Restart from the beginning when the viewer left this close to the end. */
export const VIDEO_RESTART_NEAR_END_SECONDS = 5;

/** Restart from the beginning when watch progress is at or above this percent. */
export const VIDEO_RESTART_PERCENT = 95;

/** Default page size for GET /notes pagination. */
export const NOTES_PAGE_SIZE = 12;

/** Query param used to seek the video player to a note timestamp (seconds). */
export const NOTE_SEEK_QUERY_PARAM = "t";
