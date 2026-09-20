"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { TeacherCard, TeacherSkeleton } from "@/shared/ui/cards";

import { TEACHERS_GRID_CLASS, TEACHERS_SKELETON_COUNT } from "../constants";
import type { TeachersGridProps } from "../types";

export function TeachersGrid({
  items,
  isLoading = false,
  emptyMessage,
  onItemClick,
}: TeachersGridProps) {
  const t = useTranslations("teachersPage");

  if (isLoading) {
    return (
      <div className={TEACHERS_GRID_CLASS} aria-busy aria-label={t("loading")}>
        {Array.from({ length: TEACHERS_SKELETON_COUNT }).map((_, index) => (
          <div key={index} className="min-w-0">
            <TeacherSkeleton />
          </div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className={TEACHERS_GRID_CLASS}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
          className="min-w-0"
        >
          <TeacherCard
            entityId={item.id}
            name={item.name}
            photo={item.photo}
            categoryName={item.categoryName}
            isFavorite={item.isFavorite}
            onClick={() => onItemClick(item)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
