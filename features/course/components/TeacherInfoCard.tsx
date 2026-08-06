"use client";

import { useTranslations } from "next-intl";

import Image from "@/shared/ui/Images/Image";

import type { TeacherInfoCardProps } from "../types";

export function TeacherInfoCard({
  teacherName,
  teacherPhoto,
  categoryName,
}: TeacherInfoCardProps) {
  const t = useTranslations("lessonsDetail");
  const initials = teacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15">
        {teacherPhoto ? (
          <Image
            src={teacherPhoto}
            alt={teacherName}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex size-full items-center justify-center text-sm font-semibold text-white"
          >
            {initials || "WR"}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-white">
          {teacherName}
        </p>
        {categoryName ? (
          <p className="truncate text-sm text-white/60">
            <span className="sr-only">{t("category")}: </span>
            {categoryName}
          </p>
        ) : null}
      </div>
    </div>
  );
}
