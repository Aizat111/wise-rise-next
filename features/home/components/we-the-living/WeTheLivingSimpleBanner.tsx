"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { getWeTheLivingHref } from "@/features/category/api/selection.utils";
import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import { WeTheLivingBannerCta } from "./WeTheLivingBannerCta";

export type WeTheLivingSimpleBannerProps = {
  image: string;
  title: string;
  subtitle: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

export function WeTheLivingSimpleBanner({
  image,
  title,
  subtitle,
  imageAlt,
  ctaLabel,
  ctaHref,
  className,
}: WeTheLivingSimpleBannerProps) {
  const t = useTranslations("weTheLiving.banner.simple");
  const reduceMotion = useReducedMotion();
  const href = ctaHref ?? getWeTheLivingHref();
  const label = ctaLabel ?? t("cta");

  return (
    <motion.section
      aria-label={title}
      className={cn(
        "w-full max-w-full overflow-hidden rounded-xl bg-white px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-5",
        className,
      )}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Image
            src={image}
            alt={imageAlt ?? title}
            width={72}
            height={72}
            className="size-12 shrink-0 object-contain sm:size-14 md:size-16"
          />
          <div className="min-w-0">
            <h2 className="break-words text-sm font-semibold leading-snug text-[#134533]  sm:text-base md:text-xl">
              {title}
            </h2>
            <p className="mt-0.5 break-words text-xs leading-snug text-[#134533] sm:text-base">
              {subtitle}
            </p>
          </div>
        </div>

        <WeTheLivingBannerCta
          href={href}
          className="w-full justify-center md:w-auto md:shrink-0"
        >
          {label}
        </WeTheLivingBannerCta>
      </div>
    </motion.section>
  );
}
