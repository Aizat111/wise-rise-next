import type { RefObject } from "react";

import type { Classroom, ClassroomVideo } from "@/core/types/classroom.types";

export type CourseDetail = Classroom;

export type CourseVideoItem = {
  id: string | number;
  name: string;
  slug: string;
  description: string;
  duration: string | null;
  thumbnail: string | null;
  order: number | null;
  /** Episode / bölüm label derived from tags or order. */
  sectionLabel: string | null;
  /** Progressive / stream URL for authenticated playback. */
  playbackUrl: string | null;
  isTrailer?: boolean;
};

export type CourseMetaItem = {
  key: string;
  label: string;
  value: string;
};

export type CourseHeroProps = {
  course: CourseDetail;
  onWatchTrailer: () => void;
};

export type TrailerButtonProps = {
  onClick: () => void;
  label: string;
  className?: string;
};

export type TrailerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  videoUrl: string | null;
  /** Fired with the max watch % when the dialog closes or the video ends. */
  onWatchProgress?: (percent: number) => void;
};

export type VideoPlayerProps = {
  /** Playback URL — progressive (mp4/webm/…) or HLS (.m3u8). */
  src: string;
  poster?: string;
  autoPlay?: boolean;
  playsInline?: boolean;
  className?: string;
  /** Ref to the underlying HTML5 video element. */
  playerRef?: RefObject<HTMLVideoElement | null>;
  /** Live updates whenever the max reached watch % increases. */
  onProgress?: (percent: number) => void;
  /** Fired on each native timeupdate with currentTime (seconds). */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  /**
   * Called once when the player unmounts (user closed) or the video ends.
   * Ends → 100; otherwise → max percentage reached.
   */
  onClose?: (percent: number) => void;
};

export type CourseAboutSectionProps = {
  course: CourseDetail;
  metaItems: CourseMetaItem[];
  onWatchTrailer: () => void;
};

export type CourseVideoSectionProps = {
  videos: CourseVideoItem[];
  isAuthenticated: boolean;
  onPlayVideo: (video: CourseVideoItem) => void;
  onLockedClick: () => void;
  /** Highlights the currently playing episode in the list. */
  activeVideoId?: string | number | null;
  className?: string;
  /** When false, omits the outer max-width container (parent provides it). */
  contained?: boolean;
};

export type CourseVideoCardProps = {
  video: CourseVideoItem;
  locked?: boolean;
  isActive?: boolean;
  onClick: () => void;
};

export type VideoPlayerPageProps = {
  teacherSlug: string;
  courseSlug: string;
  videoSlug: string;
};

export type VideoWatchTabId = "content" | "notes";

export type VideoHeaderProps = {
  title: string;
  shareUrl: string;
};

export type ShareDropdownProps = {
  shareUrl: string;
  shareTitle?: string;
};

export type TeacherInfoCardProps = {
  teacherName: string;
  teacherPhoto: string | null;
  categoryName: string | null;
};

export type CourseTabsProps = {
  activeTab: VideoWatchTabId;
  onTabChange: (tab: VideoWatchTabId) => void;
};

export type CourseContentTabProps = {
  content: string;
};

export type NotesTabProps = {
  videoId: string;
  currentTime: number;
  onSeek: (seconds: number) => void;
  enabled?: boolean;
};

export type NoteEditorProps = {
  videoId: string;
  currentTime: number;
};

export type NoteCardProps = {
  duration: string;
  content: string;
  onSeek: (seconds: number) => void;
};

export type VideoSidebarProps = {
  teacherName: string;
  teacherPhoto: string | null;
  categoryName: string | null;
  content: string;
  videoId: string;
  currentTime: number;
  onSeek: (seconds: number) => void;
  notesEnabled?: boolean;
};

export type LockedVideoCardProps = {
  video: CourseVideoItem;
  onClick: () => void;
};

export type LoginRequiredDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type CourseMetaProps = {
  items: CourseMetaItem[];
  className?: string;
};

export type CourseDetailPageProps = {
  courseSlug: string;
  teacherSlug: string;
};

export type { ClassroomVideo };
