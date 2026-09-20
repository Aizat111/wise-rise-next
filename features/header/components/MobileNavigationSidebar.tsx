"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { LiveLogoLink } from "@/components/layout/live-logo-link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "@/core/i18n/navigation";

import { mobileNavLinks } from "../constants";
import { HeaderLogo } from "./HeaderLogo";

export function MobileNavigationSidebar() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

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
          {mobileNavLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              onClick={close}
              className="rounded-lg px-3 py-3 text-base text-foreground/90 hover:bg-muted hover:text-foreground"
            >
              {t(link.label)}
            </Link>
          ))}
          <LiveLogoLink onClick={close} className="ml-2" />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
