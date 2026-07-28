"use client";

import Image from "@/shared/ui/Images/Image";
import { ChevronDownIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/core/i18n/navigation";
import type { Category } from "@/core/api/types";
import { useTranslations } from "next-intl";

const navLinks = [
  { href: "/plan", label: "header.plan" },
  { href: "/business", label: "header.business" },
  { href: "/yakinda", label: "header.comingSoon" },
] as const;

type SiteHeaderProps = {
  categories: Category[];
};

export function SiteHeader({ categories }: SiteHeaderProps) {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-50  bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-5">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo/wise&rise.png"
              alt="Wise & Rise"
              width={180}
              height={50}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="gap-1 text-sm text-foreground/80  hover:text-foreground"
                  />
                }
              >
                {t("header.categories")}
                <ChevronDownIcon className="size-3.5 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-44">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.slug}
                    render={<Link href={`/kategoriler/${category.slug}`} />}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.map((link) => (
              <Button
                key={link.href}
                nativeButton={false}
                variant="ghost"
                render={<Link href={link.href} />}
                className="text-sm hover:text-foreground text-foreground/80"
              >
                {t(link.label)}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ara"
            className="text-base hover:text-foreground"
          >
            <SearchIcon />
          </Button>

          <Button
            render={<Link href="/giris" />}
            nativeButton={false}
            className="font-medium border-none bg-background hover:bg-background text-lg"
          >
            {t("auth.loginText")}
          </Button>

          <Button
            render={<Link href="/kayit-ol" />}
            nativeButton={false}
            className="px-5 py-5 font-medium text-lg"
          >
            {t("auth.register")}
          </Button>
        </div>
      </div>
    </header>
  );
}
