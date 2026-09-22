"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useCategoriesQuery } from "@/features/category/api/category.queries";
import { useTeachersListQuery } from "@/features/home/api/teacher.queries";
import { useAppSelector } from "@/store/hooks";
import { mapTeachersToCards } from "@/features/home/api/teacher.utils";
import { notify } from "@/shared/components/notify";
import { TeacherDialog, type TeacherCardData } from "@/shared/ui/cards";

import {
  parseTeachersCategoryId,
  parseTeachersPage,
} from "../api/teachers.utils";
import {
  TEACHERS_CATEGORY_PARAM,
  TEACHERS_PAGE_PARAM,
  TEACHERS_PAGE_SIZE,
} from "../constants";
import type { TeachersContentProps } from "../types";
import { TeachersGrid } from "./TeachersGrid";
import { TeachersPagination } from "./TeachersPagination";
import { TeachersSidebar } from "./TeachersSidebar";

export function TeachersContent({
  initialCategories = [],
  initialTeachers = null,
  initialCategoryId = null,
  initialPage = 1,
}: TeachersContentProps) {
  const t = useTranslations("teachersPage");
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const searchParams = useSearchParams();
  const categoryId = parseTeachersCategoryId(
    searchParams.get(TEACHERS_CATEGORY_PARAM),
  );
  const page = parseTeachersPage(searchParams.get(TEACHERS_PAGE_PARAM));
  const matchesInitialSeed =
    categoryId === initialCategoryId && page === initialPage;

  const { data: categories = initialCategories, isLoading: isCategoriesLoading } =
    useCategoriesQuery(initialCategories);

  const { data, isLoading, isError, refetch, isFetching } = useTeachersListQuery(
    {
      categoryId,
      page,
      pageSize: TEACHERS_PAGE_SIZE,
    },
    {
      initialData:
        matchesInitialSeed && initialTeachers ? initialTeachers : undefined,
      refetchOnMount: isAuthenticated ? "always" : undefined,
    },
  );

  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherCardData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!isError) return;
    notify.error(t("error"), { id: "teachers-list-error" });
  }, [isError, t]);

  const items = useMemo(
    () => mapTeachersToCards(data?.items ?? []),
    [data],
  );

  const showLoading = isLoading || (isFetching && items.length === 0);
  const currentPage = data?.currentPage ?? page;
  const lastPage = data?.lastPage ?? 1;
  const total = data?.total ?? 0;

  return (
    <div className="flex min-w-0 flex-col gap-8 overflow-x-hidden lg:flex-row lg:items-start lg:gap-10">
      <div className="w-full min-w-0 lg:sticky lg:top-24 lg:w-1/4 lg:self-start">
        <TeachersSidebar
          categories={categories}
          activeCategoryId={categoryId}
          isLoading={isCategoriesLoading && categories.length === 0}
        />
      </div>

      <div className="w-full min-w-0 space-y-8 lg:w-3/4">
        {isError && items.length === 0 && !showLoading ? (
          <div
            role="alert"
            className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center"
          >
            <p className="max-w-md text-sm text-white/65 sm:text-base">
              {t("error")}
            </p>
            <Button
              type="button"
              variant="ghost"
              disabled={isFetching}
              onClick={() => {
                void refetch();
              }}
              className="cursor-pointer text-white/90 hover:bg-white/10 hover:text-white"
            >
              {t("retry")}
            </Button>
          </div>
        ) : (
          <>
            <TeachersGrid
              items={items}
              isLoading={showLoading}
              emptyMessage={t("empty")}
              onItemClick={(item) => {
                setSelectedTeacher(item);
                setDialogOpen(true);
              }}
            />

            {!showLoading && items.length > 0 ? (
              <TeachersPagination
                currentPage={currentPage}
                lastPage={lastPage}
                total={total}
                categoryId={categoryId}
              />
            ) : null}
          </>
        )}
      </div>

      <TeacherDialog
        teacher={selectedTeacher}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
