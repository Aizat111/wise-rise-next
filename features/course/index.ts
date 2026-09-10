export type {
  CourseDetail,
  CourseVideoItem,
  CourseMetaItem,
  CourseHeroProps,
  TrailerButtonProps,
  TrailerDialogProps,
  VideoPlayerProps,
  CourseAboutSectionProps,
  CourseVideoSectionProps,
  CourseVideoCardProps,
  LockedVideoCardProps,
  LoginRequiredDialogProps,
  CourseMetaProps,
  CourseDetailPageProps,
  VideoPlayerPageProps,
  VideoWatchTabId,
  VideoHeaderProps,
  ShareDropdownProps,
  TeacherInfoCardProps,
  CourseTabsProps,
  CourseContentTabProps,
  NotesTabProps,
  NoteEditorProps,
  NoteCardProps,
  VideoSidebarProps,
  NotesDialogProps,
  NoteCourseHeaderProps,
  RelatedEducationCardData,
  RelatedEducationCardProps,
  RelatedCoursesSectionProps,
} from "./types";

export {
  COURSE_MEDIA_CDN,
  MOBILE_DESCRIPTION_MAX_CHARS,
  COURSE_VIDEO_SKELETON_COUNT,
  VIDEO_WATCH_PROGRESS_INTERVAL_MS,
  VIDEO_RESUME_MIN_SECONDS,
  VIDEO_RESTART_NEAR_END_SECONDS,
  VIDEO_RESTART_PERCENT,
  NOTES_PAGE_SIZE,
  RELATED_COURSES_PAGE_SIZE,
  NOTE_SEEK_QUERY_PARAM,
} from "./constants";

export {
  useCourseDetailQuery,
  CourseNotFoundError,
} from "./api/course.queries";
export { useRelatedClassroomsQuery } from "./api/related-classrooms.queries";
export { courseService } from "./api/course.service";
export { useVideoNotesQuery, useCourseNotesQuery } from "./api/notes.queries";
export {
  useCreateVideoNoteMutation,
  useUpdateVideoNoteMutation,
  useDeleteVideoNoteMutation,
} from "./api/notes.mutations";
export { notesService } from "./api/notes.service";
export { useProfileVideoWatchesQuery } from "./api/watch-progress.queries";
export { useReportVideoWatchProgressMutation } from "./api/watch-progress.mutations";
export { watchProgressService } from "./api/watch-progress.service";
export {
  buildCourseHref,
  buildVideoHref,
  buildCourseMetaItems,
  findCourseVideoBySlug,
  getCourseAboutImage,
  getCourseCoverImage,
  getCourseHeroImage,
  getTeacherLogo,
  getTrailerPlaybackUrl,
  mapClassroomVideos,
  mapClassroomToRelatedEducationCard,
  mapClassroomsToRelatedEducationCards,
  patchClassroomVideoWatchDuration,
  truncateDescription,
} from "./api/course.utils";

export { CourseDetailPage } from "./pages/CourseDetailPage";
export { VideoPlayerPage } from "./pages/VideoPlayerPage";
export { CourseHero } from "./components/CourseHero";
export { TrailerButton } from "./components/TrailerButton";
export { TrailerDialog } from "./components/TrailerDialog";
export { VideoPlayer } from "./components/VideoPlayer";
export { useVideoWatchProgress } from "./hooks/useVideoWatchProgress";
export { CourseAboutSection } from "./components/CourseAboutSection";
export { CourseVideoSection } from "./components/CourseVideoSection";
export { RelatedCoursesSection } from "./components/RelatedCoursesSection";
export { RelatedEducationCard } from "./components/RelatedEducationCard";
/** Alias — reuses the existing video list component. */
export { CourseVideoSection as CourseVideoList } from "./components/CourseVideoSection";
export { CourseVideoCard } from "./components/CourseVideoCard";
export { LockedVideoCard } from "./components/LockedVideoCard";
export { LoginRequiredDialog } from "./components/LoginRequiredDialog";
export { VideoHeader } from "./components/VideoHeader";
export { ShareDropdown } from "./components/ShareDropdown";
export { TeacherInfoCard } from "./components/TeacherInfoCard";
export { CourseTabs } from "./components/CourseTabs";
export { CourseContentTab } from "./components/CourseContentTab";
export { NotesTab } from "./components/NotesTab";
export { NoteEditor } from "./components/NoteEditor";
export { NoteCard } from "./components/NoteCard";
export { VideoSidebar } from "./components/VideoSidebar";
export { NotesDialog } from "./components/notes-dialog/NotesDialog";
export { NoteCourseHeader } from "./components/notes-dialog/NoteCourseHeader";
export {
  CourseDetailSkeleton,
  CourseHeroSkeleton,
  CourseAboutSkeleton,
  CourseVideoListSkeleton,
} from "./components/CourseDetailSkeleton";
export {
  VideoWatchSkeleton,
  VideoPlayerSkeleton,
  VideoSidebarSkeleton,
} from "./components/VideoWatchSkeleton";
