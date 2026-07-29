"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { Category } from "@/core/api/types";
import { Link } from "@/core/i18n/navigation";

import { authNavLinks, guestNavLinks } from "../constants";
import { CategoryDropdown } from "./CategoryDropdown";

type HeaderNavigationProps = {
  categories: Category[];
  isAuthenticated: boolean;
};

export function HeaderNavigation({
  categories,
  isAuthenticated,
}: HeaderNavigationProps) {
  const t = useTranslations();
  const links = isAuthenticated ? authNavLinks : guestNavLinks;

  return (
    <nav className="hidden items-center gap-1 md:flex">
      <CategoryDropdown categories={categories} />

      {links.map((link) => (
        <Button
          key={link.href}
          nativeButton={false}
          variant="ghost"
          render={<Link href={link.href} />}
          className="text-sm text-foreground/80 hover:text-primary"
        >
          {t(link.label)}
        </Button>
      ))}
    </nav>
  );
}
