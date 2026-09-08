"use client";

import { Folder, User } from "lucide-react";
import { useTranslations } from "next-intl";

import { DialogTitle } from "@/components/ui/dialog";
import Image from "@/shared/ui/Images/Image";

import type { NoteCourseHeaderProps } from "../../types";

export function NoteCourseHeader({
  title,
  teacherName,
  categoryName,
  coverSrc,
}: NoteCourseHeaderProps) {
  const t = useTranslations("course");
  const metaParts = [teacherName, categoryName].filter(Boolean);

  return (
    <div className="flex items-start justify-between gap-3 pr-8">
      {coverSrc ? (
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-28">
          <Image
            src={coverSrc}
            alt={t("notesCoverAlt", { title })}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <DialogTitle className="font-heading text-lg font-bold leading-tight text-foreground sm:text-xl">
          {title}
        </DialogTitle>

        {metaParts.length > 0 ? (
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            {teacherName ? (
              <span className="inline-flex items-center gap-1.5">
                <User className="size-3.5 shrink-0" aria-hidden />
                <span>{teacherName}</span>
              </span>
            ) : null}
            {teacherName && categoryName ? (
              <span aria-hidden className="text-muted-foreground/70">
                •
              </span>
            ) : null}
            {categoryName ? (
              <span className="inline-flex items-center gap-1.5">
                <Folder className="size-3.5 shrink-0" aria-hidden />
                <span>{categoryName}</span>
              </span>
            ) : null}
          </p>
        ) : null}
      </div>


    </div>
  );
}
