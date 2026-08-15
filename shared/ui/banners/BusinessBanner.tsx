"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BANNER_SHELL_CLASS, BUSINESS_FORM_URL } from "./constants";
import type { BusinessBannerProps } from "./types";

export function BusinessBanner({
  isAuthenticated = false,
  className,
}: BusinessBannerProps) {
  const t = useTranslations("banners.business");

  if (isAuthenticated) return null;

  const cta = (
    <Button
      nativeButton={false}
      render={
        <a
          href={BUSINESS_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
        />
      }
      className="h-11 w-full max-w-xs px-8 text-sm font-bold tracking-wide uppercase text-primary-foreground transition-all duration-200 hover:bg-primary/80 sm:h-12 sm:w-auto sm:px-10 sm:text-base"
    >
      {t("cta")}
    </Button>
  );

  return (
    <section
      className={cn(BANNER_SHELL_CLASS, className)}
      aria-label={t("title")}
    >
      <div className="flex flex-col items-center gap-6  py-8 text-center  md:flex-row md:items-center md:justify-between md:gap-10  md:py-10 md:text-left  lg:py-12">
        <div className="min-w-0 max-w-3xl">
          <h2 className="text-2xl font-semibold  text-white  lg:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm font-medium leading-relaxed text-white/65 sm:mt-4 sm:text-base">
            {t("description")}
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col items-center gap-3 md:w-auto md:items-end">
          {cta}
        </div>
      </div>
    </section>
  );
}
