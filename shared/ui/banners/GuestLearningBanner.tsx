"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { BANNER_SHELL_CLASS } from "./constants";
import { GuestRegisterOffer } from "./GuestCta";
import type { GuestLearningBannerProps } from "./types";

function GuestLearningBannerView({ className }: { className?: string }) {
  const t = useTranslations("banners.guestLearning");

  return (
    <section
      className={cn(BANNER_SHELL_CLASS, className)}
      aria-label={t("title")}
    >
      <div className="hidden items-center justify-between gap-8 py-8 md:flex lg:py-10">
        <div className="min-w-0 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            {t("title")} <br /> {t("subtitle")}
          </h2>
        </div>
        <div className="flex shrink-0 items-center">
          <GuestRegisterOffer className="justify-end gap-4 lg:gap-6" />
        </div>
      </div>

      <div className="py-8 text-center md:hidden">
        <h2 className="text-xl font-bold tracking-tight text-white/75">
          {t("title")}
        </h2>
        <p className="mt-4 text-base font-medium text-white">{t("subtitle")}</p>
      </div>
    </section>
  );
}

export function GuestLearningBanner({
  isAuthenticated = false,
  className,
}: GuestLearningBannerProps) {
  if (isAuthenticated) return null;

  return <GuestLearningBannerView className={className} />;
}
