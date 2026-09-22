import type { Category } from "@/core/api/types";
import type { ClassroomsListResult } from "@/core/types/classroom.types";
import type { EducationCardData } from "@/shared/ui/cards";

export type CategorySelection =
  | { type: "all" }
  | { type: "we-the-living" }
  | { type: "category"; category: Category };

export type CategoriesPageProps = {
  /** Route slug when on `/{categorySlug}`; null on `/kategoriler`. */
  categorySlug?: string | null;
  /** SSR categories for faster first paint. */
  initialCategories?: Category[];
  /** First page of public classrooms for this selection. */
  initialClassrooms?: ClassroomsListResult | null;
};

export type { CategoryHeroProps } from "@/shared/ui/CategoryHero";

export type CategorySidebarProps = {
  categories: Category[];
  selection: CategorySelection;
  isLoading?: boolean;
};

export type CategoryListProps = {
  categories: Category[];
  activeSlug?: string | null;
};

export type CategoryItemProps = {
  label: string;
  href: string;
  isActive?: boolean;
};

export type CategoryGridProps = {
  items: EducationCardData[];
  isLoading?: boolean;
  isFetchingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  emptyMessage: string;
  loadMoreLabel: string;
};

export type CategorySectionProps = {
  selection: CategorySelection;
  categories: Category[];
  isCategoriesLoading?: boolean;
  initialClassrooms?: ClassroomsListResult | null;
};

export type CategoryEducationCardProps = {
  item: EducationCardData;
};

export type CourseActionDropdownProps = {
  courseHref: string;
  shareUrl: string;
  shareTitle: string;
  classroomId: string | number;
  isFavorite?: boolean;
};

export type ShareDropdownProps = {
  shareUrl: string;
  shareTitle?: string;
};
