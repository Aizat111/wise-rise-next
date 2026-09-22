import type { ReactNode } from "react";

import type { Category } from "@/core/api/types";
import type { TeachersListResult } from "@/core/types/teacher.types";
import type { TeacherCardData } from "@/shared/ui/cards";

export type TeachersPageProps = {
  initialCategories?: Category[];
  initialTeachers?: TeachersListResult | null;
  initialCategoryId?: number | null;
  initialPage?: number;
};

export type TeachersShellProps = {
  title: string;
  homeLabel: string;
  children: ReactNode;
};

export type TeachersContentProps = {
  initialCategories?: Category[];
  initialTeachers?: TeachersListResult | null;
  initialCategoryId?: number | null;
  initialPage?: number;
};

export type TeachersSidebarProps = {
  categories: Category[];
  activeCategoryId?: number | null;
  isLoading?: boolean;
};

export type TeachersGridProps = {
  items: TeacherCardData[];
  isLoading?: boolean;
  emptyMessage: string;
  onItemClick: (item: TeacherCardData) => void;
};

export type TeachersPaginationProps = {
  currentPage: number;
  lastPage: number;
  total: number;
  categoryId?: number | null;
};

export type TeachersFallbackProps = {
  loadingLabel: string;
};
