import type { ReactNode } from "react";

import type { EducationCardData } from "@/shared/ui/cards";

export type SearchListParams = {
  q: string;
  page?: number;
  per_page?: number;
  signal?: AbortSignal;
};

export type SearchHeroProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export type SearchShellProps = {
  title: string;
  subtitle?: string;
  overlay?: ReactNode;
  children: ReactNode;
};

export type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export type SearchResultsHeaderProps = {
  title: string;
  countLabel?: string;
};

export type SearchResultsGridProps = {
  items: EducationCardData[];
};

export type SearchEmptyStateProps = {
  message: string;
};

export type SearchResultsProps = {
  query: string;
};

export type SearchContentProps = {
  title: string;
  subtitle: string;
};
