"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { getWeTheLivingHref } from "@/features/category/api/selection.utils";
import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import { WE_THE_LIVING_IMAGE_BANNER_SRC } from "./constants";
import { WeTheLivingBannerCta } from "./WeTheLivingBannerCta";

export type WeTheLivingImageBannerProps = {
  image?: string;
  title?: string;
  subtitle?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

export function WeTheLivingImageBanner({
  image = WE_THE_LIVING_IMAGE_BANNER_SRC,
  title,
  subtitle,
  imageAlt,
  ctaLabel,
  ctaHref,
  className,
}: WeTheLivingImageBannerProps) {
  const t = useTranslations("weTheLiving.banner.image");
  const reduceMotion = useReducedMotion();
  const href = ctaHref ?? getWeTheLivingHref();
  const resolvedTitle = title ?? t("title");
  const resolvedSubtitle = subtitle ?? t("subtitle");
  const label = ctaLabel ?? t("cta");
  const alt = imageAlt ?? resolvedTitle;

  return (
    <motion.section
      aria-label={resolvedTitle}
      className={cn(
        "relative isolate w-full max-w-full overflow-hidden rounded-2xl",
        className,
      )}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="relative h-[148px] w-full sm:h-[160px] md:h-[172px]">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover object-[78%_center] md:object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent md:bg-linear-to-l md:from-black/30 md:via-transparent md:to-transparent"
        />
        <div className="absolute inset-0 z-10 flex flex-col justify-end px-4 py-4 sm:px-6 sm:py-5 md:items-end md:justify-center md:px-10 md:py-5 lg:px-14">
          <div className="w-full min-w-0 max-w-xs md:pl-20 md:text-left">
            <h2 className="text-base font-semibold leading-tight text-white sm:text-lg md:text-xl">
              {resolvedTitle}
            </h2>
            <p className="mt-1 text-xs leading-snug text-white/85 sm:text-sm">
              {resolvedSubtitle}
            </p>
            <WeTheLivingBannerCta
              href={href}
              className="mt-2.5 h-9 w-full justify-center px-4 text-xs sm:h-10 sm:text-sm md:mt-3 md:w-auto"
            >
              {label}
            </WeTheLivingBannerCta>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
