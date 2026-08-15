import type { ReactNode } from "react";

export type FollowingShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export type FollowingContentProps = {
  classroomsTitle: string;
  teachersTitle: string;
  loadingLabel: string;
};

export type FollowedSectionProps = {
  profileId: string | number;
};

export type FollowingFallbackProps = {
  classroomsTitle: string;
  teachersTitle: string;
  loadingLabel?: string;
};

export type FollowingEmptyStateProps = {
  message: string;
};
