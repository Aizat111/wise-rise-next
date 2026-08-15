export type CategoriesSectionItem = {
  id: number | string;
  name: string;
  slug: string;
};

export type CategoriesSectionProps = {
  /** When omitted, categories are loaded via the existing categories query. */
  categories?: CategoriesSectionItem[];
  className?: string;
};

export type CategoryCardProps = {
  category: CategoriesSectionItem;
};

export type CategoriesEmptyProps = {
  message: string;
};

export type CategoriesGridSkeletonProps = {
  label?: string;
};
