"use client";

import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/core/api/types";
import { Link } from "@/core/i18n/navigation";

import { getCategoryHref } from "../constants";

type CategoryDropdownProps = {
  categories: Category[];
};

export function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="gap-1 text-sm text-foreground/80 hover:text-foreground"
          />
        }
      >
        {t("header.categories")}
        <ChevronDownIcon className="size-3.5 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        {categories.length === 0 ? (
          <DropdownMenuItem disabled>
            {t("header.noCategories")}
          </DropdownMenuItem>
        ) : (
          categories.map((category) => (
            <DropdownMenuItem
              key={category.slug}
              render={<Link href={getCategoryHref(category)} />}
            >
              {category.name}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
