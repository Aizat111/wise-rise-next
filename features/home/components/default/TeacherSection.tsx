"use client";

import { useState } from "react";

import { TeacherDialog, type TeacherCardData } from "@/shared/ui/cards";

import type { TeacherSectionProps } from "../../types";
import { TeacherSlider } from "./TeacherSlider";

/**
 * Home section for teacher lists from `/home`.
 * Owns the teacher detail dialog; empty lists hide the section.
 */
export function TeacherSection({
  items,
  title,
  isLoading = false,
  onViewAll,
  className,
}: TeacherSectionProps) {
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherCardData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!isLoading && items.length === 0) {
    return null;
  }

  const handleItemClick = (item: TeacherCardData) => {
    setSelectedTeacher(item);
    setDialogOpen(true);
  };

  return (
    <div className={className}>
      <TeacherSlider
        title={title}
        items={items}
        isLoading={isLoading}
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
