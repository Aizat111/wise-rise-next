export type {
  CategoriesPageProps,
  CategorySelection,
  CategoryHeroProps,
  CategorySidebarProps,
  CategoryListProps,
  CategoryItemProps,
  CategoryGridProps,
  CategorySectionProps,
  CategoryEducationCardProps,
  CourseActionDropdownProps,
  ShareDropdownProps,
} from "./types";

export {
  CATEGORY_BACKGROUND,
  CATEGORY_PAGE_SIZE,
  CATEGORIES_INDEX_HREF,
  WE_THE_LIVING_SLUG,
  WE_THE_LIVING_PLATFORM,
  WE_THE_LIVING_LABEL,
  WE_THE_LIVING_LOGO,
} from "./constants";

export {
  getCategoryPageHref,
  getWeTheLivingHref,
  resolveCategorySelection,
  isKnownCategorySlug,
  getSelectionTitle,
  getSelectionHeroBackground,
  getSelectionFilters,
  getSelectionCanonical,
} from "./api/selection.utils";

export { useCategoriesQuery } from "./api/category.queries";
export { useCategoryClassroomsQuery } from "./api/classroom.queries";
export {
  useAddFavoriteMutation,
  useToggleFavoriteMutation,
} from "./api/favorite.mutations";

export { CategoryHero } from "./components/CategoryHero";
export { CategorySidebar } from "./components/CategorySidebar";
export { CategoryList } from "./components/CategoryList";
export { CategoryItem } from "./components/CategoryItem";
export { CategoryGrid } from "./components/CategoryGrid";
export { CategorySection } from "./components/CategorySection";
export { CategoryEducationCard } from "./components/CategoryEducationCard";
export { CourseActionDropdown } from "./components/CourseActionDropdown";
export { ShareDropdown } from "./components/ShareDropdown";
export { CategorySkeleton } from "./components/CategorySkeleton";
export { CategoriesPage } from "./pages/CategoriesPage";
