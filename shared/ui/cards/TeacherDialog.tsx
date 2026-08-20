"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import type { TeacherDialogProps } from "./types";

/**
 * Teacher detail modal: photo on the left, bio on the right (stacked on mobile).
 * Uses shadcn Dialog — ESC + overlay click close, fade + scale enter animation.
 */
export function TeacherDialog({
  teacher,
  open,
  onOpenChange,
}: TeacherDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "gap-0 overflow-hidden p-0 sm:max-w-3xl",
          "bg-zinc-950 text-white ring-white/10",
        )}
        aria-describedby={
          teacher?.description ? "teacher-dialog-description" : undefined
        }
      >
        {teacher ? (
          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
            <div className="relative aspect-2/3 w-full overflow-hidden sm:aspect-auto sm:min-h-105">
              <Image
                src={teacher.photo}
                alt={teacher.name}
                fill
                sizes="(max-width: 640px) 100vw, 40vw"
                className="object-cover object-top"
              />
            </div>

            <div className="flex flex-col gap-3 p-5 sm:gap-4 sm:p-7">
              <DialogHeader className="gap-2 pr-8">
                <DialogTitle className="text-xl font-bold leading-tight text-white sm:text-2xl">
                  {teacher.name}
                </DialogTitle>
                {teacher.categoryName ? (
                  <p className="text-sm text-white/55 sm:text-base">
                    {teacher.categoryName}
                  </p>
                ) : null}
              </DialogHeader>

              {teacher.description ? (
                <DialogDescription
                  id="teacher-dialog-description"
                  className="max-h-[40vh] overflow-y-auto text-sm leading-relaxed text-white/75 sm:max-h-[50vh] sm:text-[15px] sm:leading-7"
                >
                  {teacher.description}
                </DialogDescription>
              ) : null}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
