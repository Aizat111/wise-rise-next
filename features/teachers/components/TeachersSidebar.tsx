"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/core/i18n/navigation";
import { CategoryItem } from "@/features/category/components/CategoryItem";
import { cn } from "@/lib/utils";

import { getTeachersHref } from "../api/teachers.utils";
import type { TeachersSidebarProps } from "../types";

export function TeachersSidebar({
  categories,
  activeCategoryId = null,
  isLoading = false,
}: TeachersSidebarProps) {
  const t = useTranslations("teachersPage");
  const isAllActive = activeCategoryId == null;

  return (
    <aside className="w-full min-w-0">
      <div className="hidden lg:block">
        <Link
          href={getTeachersHref()}
          aria-current={isAllActive ? "page" : undefined}
          className={cn(
            "block text-lg font-semibold tracking-wide transition-colors sm:text-xl",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
            isAllActive ? "text-white" : "text-white/70 hover:text-white",
          )}
        >
          {t("allTeachers")}
        </Link>
        <div aria-hidden className="mt-3 h-px w-full bg-white/15" />

        <nav aria-label={t("allTeachers")} className="mt-4">
          {isLoading ? (
            <div className="space-y-2" aria-hidden>
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 animate-pulse rounded-md bg-white/10"
                />
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-0.5" role="list">
              {categories.map((category) => (
                <li key={category.id}>
                  <CategoryItem
                    label={category.name}
                    href={getTeachersHref(category.id)}
                    isActive={activeCategoryId === category.id}
                  />
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>

      <div className="lg:hidden">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href={getTeachersHref()}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
              isAllActive
                ? "border-primary bg-primary/20 text-white"
                : "border-white/15 text-white/75 hover:border-white/30 hover:text-white",
            )}
          >
            {t("allTeachers")}
          </Link>
          {categories.map((category) => {
            const isActive = activeCategoryId === category.id;
            return (
              <Link
                key={category.id}
                href={getTeachersHref(category.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
                  isActive
                    ? "border-primary bg-primary/20 text-white"
                    : "border-white/15 text-white/75 hover:border-white/30 hover:text-white",
                )}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
