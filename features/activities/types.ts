import type { ReactNode } from "react";

export type ActivitiesShellProps = {
  children: ReactNode;
};

export type ActivitiesContentProps = {
  watchingTitle: string;
  watchedTitle: string;
  assignedTitle: string;
  notesTitle: string;
  teachersTitle: string;
  certificatesTitle: string;
  loadingLabel: string;
};

export type ActivitiesSectionProps = {
  profileId: string | number;
};

export type ActivitiesFallbackProps = {
  watchingTitle: string;
  watchedTitle: string;
  assignedTitle: string;
  notesTitle: string;
  teachersTitle: string;
  certificatesTitle: string;
  loadingLabel?: string;
};

export type CertificateDialogSelection = {
  userId: string | number;
  certificateId: string | number;
  courseName: string;
  categoryName?: string | null;
  teacherLogo?: string | null;
};
