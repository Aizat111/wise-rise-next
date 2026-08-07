"use client";

import Image from "@/shared/ui/Images/Image";
import { useTranslations } from "next-intl";

import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";

import { getWeTheLivingHref } from "../api/selection.utils";
import {
  CATEGORIES_INDEX_HREF,
  WE_THE_LIVING_LABEL,
  WE_THE_LIVING_LOGO,
} from "../constants";
import type { CategorySidebarProps } from "../types";
import { CategoryList } from "./CategoryList";

export function CategorySidebar({
  categories,
  selection,
  isLoading = false,
}: CategorySidebarProps) {
  const t = useTranslations("categories");
  const isAllActive = selection.type === "all";
  const isWtlActive = selection.type === "we-the-living";
  const activeSlug =
    selection.type === "category" ? selection.category.slug : null;

  return (
    <aside className="w-full">
      {/* Desktop sticky sidebar panel */}
      <div className="hidden lg:block">
        <Link
          href={CATEGORIES_INDEX_HREF}
          aria-current={isAllActive ? "page" : undefined}
          className={cn(
            "block text-lg font-semibold tracking-wide transition-colors sm:text-xl",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
            isAllActive
              ? "text-white"
              : "text-white/70 hover:text-white",
          )}
        >
          {t("allCategories")}
        </Link>
        <div aria-hidden className="mt-3 h-px w-full bg-white/15" />

        <div className="mt-4">
          <Link
            href={getWeTheLivingHref()}
            aria-current={isWtlActive ? "page" : undefined}
            className={cn(
              "flex items-center justify-center rounded-lg border px-3 py-3 transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
              isWtlActive
                ? "border-emerald-500/60 bg-emerald-500/15"
                : "border-white/10 bg-black/20 hover:border-white/25 hover:bg-white/5",
            )}
          >
            <Image
              src={WE_THE_LIVING_LOGO}
              alt={WE_THE_LIVING_LABEL}
              width={140}
              height={36}
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        <nav aria-label={t("allCategories")} className="mt-4">
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
            <CategoryList categories={categories} activeSlug={activeSlug} />
          )}
        </nav>
      </div>

      {/* Mobile / tablet horizontal filter strip */}
      <div className="lg:hidden">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href={CATEGORIES_INDEX_HREF}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
              isAllActive
                ? "border-primary bg-primary/20 text-white"
                : "border-white/15 text-white/75 hover:border-white/30 hover:text-white",
            )}
          >
            {t("allCategories")}
          </Link>
          <Link
            href={getWeTheLivingHref()}
            className={cn(
              "inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 transition-colors",
              isWtlActive
                ? "border-emerald-500/70 bg-emerald-500/20"
                : "border-white/15 hover:border-white/30",
            )}
            aria-label={WE_THE_LIVING_LABEL}
          >
            <Image
              src={WE_THE_LIVING_LOGO}
              alt=""
              width={96}
              height={24}
              className="h-5 w-auto object-contain"
            />
          </Link>
          {categories.map((category) => {
            const isActive =
              selection.type === "category" &&
              selection.category.slug === category.slug;
            return (
              <Link
                key={category.id}
                href={`/${category.slug}`}
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
