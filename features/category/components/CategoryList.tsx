"use client";

import { getCategoryPageHref } from "../api/selection.utils";
import type { CategoryListProps } from "../types";
import { CategoryItem } from "./CategoryItem";

export function CategoryList({ categories, activeSlug }: CategoryListProps) {
  return (
    <ul className="flex flex-col gap-0.5" role="list">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryItem
            label={category.name}
            href={getCategoryPageHref(category)}
            isActive={activeSlug === category.slug}
          />
        </li>
      ))}
    </ul>
  );
}
