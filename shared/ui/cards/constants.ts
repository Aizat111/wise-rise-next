import type { CardAspectRatio } from "./types";

/** Default portrait ratio for education-style cards. */
export const DEFAULT_CARD_ASPECT_RATIO: CardAspectRatio = "2/3";

/** Taller portrait used by EducationProgressCard so hover actions fit below progress. */
export const PROGRESS_CARD_ASPECT_RATIO: CardAspectRatio = "9/16";

/** Tall poster ratio for TeacherCard (height ≈ 3× width). */
export const TEACHER_CARD_ASPECT_RATIO: CardAspectRatio = "1/3";

export const EMPTY_CERTIFICATE_IMAGE = "/cards/emty-certificate.jpg";

export const CARD_ASPECT_RATIO_CLASS: Record<CardAspectRatio, string> = {
  "1/3": "aspect-[1/3]",
  "2/3": "aspect-[2/3]",
  "3/4": "aspect-[3/4]",
  "9/16": "aspect-[9/16]",
};
