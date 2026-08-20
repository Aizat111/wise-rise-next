import type { ReactNode } from "react";

/** Portrait card aspect ratios used across content cards. */
export type CardAspectRatio = "1/3" | "2/3" | "3/4" | "9/16";

export type BaseCardProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  contentClassName?: string;
  aspectRatio?: CardAspectRatio;
  disabled?: boolean;
  "aria-label"?: string;
};

export type EducationCardData = {
  id: string | number;
  thumbnail: string;
  title: string;
  authorName: string;
  authorLogo?: string | null;
  is_favorite?: boolean;
  /** Locale-aware detail path: `/{teacherSlug}/{courseSlug}`. */
  href?: string | null;
};

export type EducationCardProps = {
  thumbnail: string;
  title: string;
  authorName: string;
  authorLogo?: string | null;
  /** Classroom ID used by the like API. */
  entityId?: string | number;
  isFavorite?: boolean;
  onFavorite?: (nextFavorite: boolean) => void;
  /** Replaces the default favorite heart when provided. */
  topRightAction?: ReactNode;
  onClick?: () => void;
  className?: string;
  aspectRatio?: CardAspectRatio;
};

export type EducationProgressCardData = {
  id: string | number;
  thumbnail: string;
  title: string;
  teacherName: string;
  categoryName?: string | null;
  completionRate?: number | null;
  isFavorite?: boolean;
  teacherSlug?: string | null;
  courseSlug?: string | null;
  firstVideoSlug?: string | null;
};

export type EducationProgressCardProps = {
  thumbnail: string;
  title: string;
  teacherName: string;
  categoryName?: string | null;
  /** 0–100 progress value from API (`completionRate`). */
  completionRate?: number | null;
  /** Classroom ID used by the like API. */
  entityId?: string | number;
  isFavorite?: boolean;
  teacherSlug?: string | null;
  courseSlug?: string | null;
  firstVideoSlug?: string | null;
  className?: string;
  aspectRatio?: CardAspectRatio;
};

export type ComingSoonCardData = {
  id: string | number;
  thumbnail: string;
  title: string;
  authorName: string;
  authorLogo?: string | null;
  /** ISO date string from API (`coming_soon_date`). */
  comingSoonDate?: string | null;
};

export type ComingSoonCardProps = {
  thumbnail: string;
  title: string;
  authorName: string;
  authorLogo?: string | null;
  /** Pre-formatted badge label, e.g. "12 Ağustos" / "12 Aug". */
  dateLabel?: string | null;
  className?: string;
  aspectRatio?: CardAspectRatio;
};

export type TeacherCardData = {
  id: string | number;
  name: string;
  photo: string;
  categoryName: string;
  description: string;
  isFavorite?: boolean;
};

export type TeacherCardProps = {
  name: string;
  photo: string;
  categoryName: string;
  /** Teacher ID used by the like API. */
  entityId?: string | number;
  isFavorite?: boolean;
  onFavorite?: (nextFavorite: boolean) => void;
  onClick?: () => void;
  className?: string;
  /** Photo aspect ratio; defaults to tall poster (1/3). */
  aspectRatio?: CardAspectRatio;
};

export type TeacherDialogProps = {
  teacher: TeacherCardData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type EducationCardSkeletonProps = {
  className?: string;
  aspectRatio?: CardAspectRatio;
};

export type ComingSoonCardSkeletonProps = {
  className?: string;
  aspectRatio?: CardAspectRatio;
};

export type TeacherSkeletonProps = {
  className?: string;
  aspectRatio?: CardAspectRatio;
};

export type NoteCardData = {
  id: string | number;
  content: string;
  duration?: string | null;
  videoName?: string | null;
  classroomName?: string | null;
  teacherName?: string | null;
  href?: string | null;
};

export type NoteCardProps = NoteCardData & {
  className?: string;
  aspectRatio?: CardAspectRatio;
};

export type CertificateCardData = {
  id: string | number;
  userId: string | number | null;
  certificateId: string | number | null;
  image: string;
  teacherLogo?: string | null;
  courseName: string;
  categoryName?: string | null;
};

export type CertificateCardProps = {
  image: string;
  teacherLogo?: string | null;
  courseName: string;
  categoryName?: string | null;
  onClick?: () => void;
  className?: string;
  aspectRatio?: CardAspectRatio;
};
