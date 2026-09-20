"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";
import { DOTS, usePagination } from "@/shared/utils/usePagination";

import { getTeachersHref } from "../api/teachers.utils";
import { TEACHERS_PAGE_SIZE } from "../constants";
import type { TeachersPaginationProps } from "../types";

export function TeachersPagination({
  currentPage,
  lastPage,
  total,
  categoryId = null,
}: TeachersPaginationProps) {
  const t = useTranslations("teachersPage");
  const paginationRange = usePagination(
    total,
    TEACHERS_PAGE_SIZE,
    1,
    currentPage,
  );

  if (lastPage <= 1 || !paginationRange || paginationRange.length === 0) {
    return null;
  }

  const previousHref = getTeachersHref(categoryId, currentPage - 1);
  const nextHref = getTeachersHref(categoryId, currentPage + 1);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < lastPage;

  return (
    <nav
      aria-label={t("pagination")}
      className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
    >
      {canGoPrevious ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("previousPage")}
          nativeButton={false}
          render={<Link href={previousHref} />}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft className="size-5 text-primary sm:size-6" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t("previousPage")}
          disabled
          className="text-white/80 disabled:opacity-30"
        >
          <ChevronLeft className="size-5 text-primary sm:size-6" />
        </Button>
      )}

      {paginationRange.map((page, index) => {
        if (page === DOTS) {
          return (
            <span
              key={`dots-${index}`}
              className="px-1.5 text-sm text-white/40"
              aria-hidden
            >
              {DOTS}
            </span>
          );
        }

        const pageNumber = Number(page);
        const isActive = pageNumber === currentPage;

        return (
          <Button
            key={pageNumber}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            nativeButton={false}
            render={
              <Link
                href={getTeachersHref(categoryId, pageNumber)}
                aria-current={isActive ? "page" : undefined}
              />
            }
            className={cn(
              "min-w-8",
              isActive
                ? "text-primary-foreground"
                : "text-white/80 hover:bg-white/10 hover:text-white",
            )}
          >
            {pageNumber}
          </Button>
        );
      })}

      {canGoNext ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("nextPage")}
          nativeButton={false}
          render={<Link href={nextHref} />}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ChevronRight className="size-5 text-primary sm:size-6" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t("nextPage")}
          disabled
          className="text-white/80 disabled:opacity-30"
        >
          <ChevronRight className="size-5 text-primary sm:size-6" />
        </Button>
      )}
    </nav>
  );
}
