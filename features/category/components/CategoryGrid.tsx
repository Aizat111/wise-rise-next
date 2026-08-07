"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/core/i18n/navigation";
import { EducationCardSkeleton } from "@/features/home/components/cards/EducationCardSkeleton";

import { CATEGORY_GRID_SKELETON_COUNT } from "../constants";
import type { CategoryGridProps } from "../types";
import { CategoryEducationCard } from "./CategoryEducationCard";

export function CategoryGrid({
  items,
  isLoading = false,
  isFetchingMore = false,
  hasMore = false,
  onLoadMore,
  emptyMessage,
  loadMoreLabel,
}: CategoryGridProps) {
  const t = useTranslations("categories");

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6"
        aria-busy
        aria-label={t("loading")}
      >
        {Array.from({ length: CATEGORY_GRID_SKELETON_COUNT }).map((_, index) => (
          <EducationCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
        <p className="max-w-md text-sm text-white/65 sm:text-base">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6"
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
          >
            {item.href ? (
              <Link href={item.href} className="block">
                <CategoryEducationCard item={item} />
              </Link>
            ) : (
              <CategoryEducationCard item={item} />
            )}
          </motion.div>
        ))}
      </motion.div>

      {hasMore ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            disabled={isFetchingMore}
            onClick={onLoadMore}
            className="min-w-44 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            {isFetchingMore ? t("loading") : loadMoreLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
