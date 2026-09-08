export type ReportVideoWatchProgressRequest = {
  duration: string;
};

export type ReportVideoWatchProgressVariables = {
  profileId: string | number;
  videoId: string | number;
  duration: string;
  courseSlug?: string;
};

export type ProfileVideoWatch = {
  videoId: string;
  duration: string | null;
  percent: number | null;
};
