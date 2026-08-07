"use client";

import { SITE } from "@/config/site";
import { EducationCard } from "@/features/home/components/cards/EducationCard";

import type { CategoryEducationCardProps } from "../types";
import { CourseActionDropdown } from "./CourseActionDropdown";

export function CategoryEducationCard({ item }: CategoryEducationCardProps) {
  const courseHref = item.href ?? "#";
  const shareUrl = `${SITE.url}${courseHref.startsWith("/") ? courseHref : `/${courseHref}`}`;

  return (
    <EducationCard
      thumbnail={item.thumbnail}
      title={item.title}
      authorName={item.authorName}
      authorLogo={item.authorLogo}
      isFavorite={item.is_favorite ?? false}
      topRightAction={
        <CourseActionDropdown
          courseHref={courseHref}
          shareUrl={shareUrl}
          shareTitle={item.title}
          classroomId={item.id}
          isFavorite={item.is_favorite ?? false}
        />
      }
    />
  );
}
