"use client";

import { useState } from "react";
import { ChevronDownIcon, MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Category } from "@/core/api/types";
import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";

import {
  authNavLinks,
  getCategoryHref,
  guestNavLinks,
} from "../constants";
import { HeaderLogo } from "./HeaderLogo";

type MobileNavigationSidebarProps = {
  categories: Category[];
  isAuthenticated: boolean;
};

export function MobileNavigationSidebar({
  categories,
  isAuthenticated,
}: MobileNavigationSidebarProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const links = isAuthenticated ? authNavLinks : guestNavLinks;

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("header.menu")}
        className="text-base hover:text-foreground"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </Button>

      <SheetContent
        side="left"
        showCloseButton
        className="w-full max-w-none gap-0 border-0 p-0 sm:max-w-none"
      >
        <SheetHeader className="border-b border-border px-4 py-5">
          <SheetTitle className="sr-only">{t("header.menu")}</SheetTitle>
          <HeaderLogo width={160} height={44} onClick={close} />
        </SheetHeader>

        <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-4">
          <div>
            <button
              type="button"
              onClick={() => setCategoriesOpen((value) => !value)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-base text-foreground/90 hover:bg-muted"
            >
              {t("header.categories")}
              <ChevronDownIcon
                className={cn(
                  "size-4 opacity-70 transition-transform",
                  categoriesOpen && "rotate-180",
                )}
              />
            </button>

            {categoriesOpen ? (
              <div className="mb-1 space-y-0.5 pl-2">
                {categories.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    {t("header.noCategories")}
                  </p>
                ) : (
                  categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={getCategoryHref(category)}
                      onClick={close}
                      className="block rounded-lg px-3 py-2.5 text-sm text-foreground/80 hover:bg-muted hover:text-foreground"
                    >
                      {category.name}
                    </Link>
                  ))
                )}
              </div>
            ) : null}
          </div>

          <Separator className="my-2" />

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="rounded-lg px-3 py-3 text-base text-foreground/90 hover:bg-muted hover:text-foreground"
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
