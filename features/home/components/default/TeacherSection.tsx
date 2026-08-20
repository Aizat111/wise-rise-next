"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { TeacherDialog, type TeacherCardData } from "@/shared/ui/cards";
import { cn } from "@/lib/utils";

import { useBestTeachersQuery } from "../../api/teacher.queries";
import { mapTeachersToCards } from "../../api/teacher.utils";
import type { TeacherSectionProps } from "../../types";
import { TeacherSlider } from "./TeacherSlider";

/**
 * Home section for "Türkiye'nin En İyileri".
 * Owns data fetching, empty/error/loading states, and the teacher detail dialog.
 */
export function TeacherSection({
  onViewAll,
  className,
}: TeacherSectionProps) {
  const t = useTranslations("home");
  const { data = [], isLoading, isError, refetch, isFetching } =
    useBestTeachersQuery();

  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherCardData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const items = mapTeachersToCards(data);

  const showLoading = isLoading || (isFetching && items.length === 0);

  if (!showLoading && !isError && items.length === 0) {
    return null;
  }

  const handleItemClick = (item: TeacherCardData) => {
    setSelectedTeacher(item);
    setDialogOpen(true);
  };

  if (isError && items.length === 0) {
    return (
      <section
        className={cn("mt-2", className)}
        aria-label={t("turkeysBest")}
      >
        <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
          <h2 className="min-w-0 truncate border-l-5 border-primary pl-2 text-base font-semibold tracking-tight text-white sm:text-3xl">
            {t("turkeysBest")}
          </h2>
        </div>

        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white/5 px-4 py-12 text-center"
        >
          <p className="text-sm text-white/70">{t("teachersLoadError")}</p>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              void refetch();
            }}
            className="cursor-pointer text-white/90 hover:bg-white/10 hover:text-white"
          >
            {t("retry")}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className={className}>
      <TeacherSlider
        items={items}
        isLoading={showLoading}
        onViewAll={onViewAll}
        onItemClick={handleItemClick}
      />

      <TeacherDialog
        teacher={selectedTeacher}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
