import type { ReactNode } from "react";

import type { ComingSoonCardData } from "@/features/home/types";

export type ComingSoonGridItem = ComingSoonCardData & {
  dateLabel?: string | null;
};

export type ComingSoonGridProps = {
  items: ComingSoonGridItem[];
};

export type ComingSoonEmptyProps = {
  message: string;
};

export type ComingSoonShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};
