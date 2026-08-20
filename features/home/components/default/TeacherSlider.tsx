"use client";

import { useTranslations } from "next-intl";

import { TeacherCard, TeacherSkeleton } from "@/shared/ui/cards";
import {
  ContentSlider,
  TEACHER_SKELETON_COUNT,
  TEACHER_SLIDER_ITEM_WIDTH_CLASS,
} from "@/shared/ui/sliders";

import type { TeacherSliderProps } from "../../types";

/**
 * "Türkiye'nin En İyileri" content row built on ContentSlider → BaseSlider.
 * 2 cards on mobile, 5 on desktop; drag / swipe / arrow nav; no loop / autoplay.
 */
export function TeacherSlider({
  items,
  isLoading = false,
  onViewAll,
  onItemClick,
  className,
}: TeacherSliderProps) {
  const t = useTranslations("home");

  return (
    <ContentSlider
      title={t("turkeysBest")}
      items={items}
      isLoading={isLoading}
      showViewAll
      onViewAll={onViewAll}
      skeletonCount={TEACHER_SKELETON_COUNT}
      itemWidthClassName={TEACHER_SLIDER_ITEM_WIDTH_CLASS}
      className={className}
      getItemKey={(item) => item.id}
      renderSkeleton={() => <TeacherSkeleton />}
      renderItem={(item) => (
        <TeacherCard
          entityId={item.id}
          name={item.name}
          photo={item.photo}
          categoryName={item.categoryName}
          isFavorite={item.isFavorite ?? false}
          onClick={() => onItemClick?.(item)}
        />
      )}
    />
  );
}
