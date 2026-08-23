"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";

import type { MembershipPlan } from "@/core/types/plan.types";
import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import { WeTheLivingBannerCta } from "./WeTheLivingBannerCta";

type WeTheLivingMembershipCardProps = {
  plan: MembershipPlan;
  variant: "monthly" | "yearly";
  title: string;
  image: string;
  imageAlt: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
};

function formatWtlPrice(price: number, locale: string): string {
  const intlLocale = locale === "az" ? "az-AZ" : "tr-TR";
  return `${new Intl.NumberFormat(intlLocale, {
    maximumFractionDigits: 0,
  }).format(price)}₺`;
}

function RombIcon() {
  return (
    <span
      aria-hidden
      className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-current"
    />
  );
}

export function WeTheLivingMembershipCard({
  plan,
  variant,
  title,
  image,
  imageAlt,
  features,
  ctaLabel,
  ctaHref,
}: WeTheLivingMembershipCardProps) {
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const isYearly = variant === "yearly";

  return (
    <motion.article
      aria-label={title}
      className={cn(
        "flex h-full min-w-0 flex-col gap-5 overflow-hidden rounded-2xl px-5 py-5 sm:px-6 sm:py-6",
        isYearly
          ? "bg-[linear-gradient(180deg,#0b2f27_0%,#084e3a_35%,#077153_70%,#068a6c_100%)] text-white"
          : "bg-white text-[#0b2f27]",
      )}
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.015 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <Image
          src={image}
          alt={imageAlt}
          width={72}
          height={72}
          className="size-14 shrink-0 object-contain sm:size-16"
        />
        <div className="min-w-0 ">
          <div className="flex ">
            <h3
              className={cn(
                "text-sm font-bold uppercase   sm:text-base md:text-xl",
                isYearly ? "text-white" : "text-[#134533]",
              )}
            >
              {title}
            </h3>
            <p className=" flex min-w-0 flex-wrap  gap-2 tabular-nums">
              <span
                className={cn(
                  "text-sm font-medium  pl-2 line-through mt-0.5 sm:text-base",
                  isYearly ? "text-white/55" : "text-[#134533]/75",
                )}
              >
                {formatWtlPrice(plan.oldPrice, locale)}
              </span>
              <span
                className={cn(
                  "text-xl font-bold sm:text-2xl",
                  isYearly ? "text-white" : "text-[#134533]",
                )}
              >
                {formatWtlPrice(plan.price, locale)}
              </span>
            </p>
          </div>
          <WeTheLivingBannerCta
            href={ctaHref}
            className="w-full justify-center"
          >
            {ctaLabel}
          </WeTheLivingBannerCta>
          <ul className="flex flex-col gap-2.5 mt-2">
            {features.map((feature) => (
              <li
                key={feature}
                className={cn(
                  "flex items-start gap-2.5 text-sm font-medium leading-snug sm:text-[0.9375rem]",
                  isYearly ? "text-white" : "text-[#0b2f27]/85",
                )}
              >
                <RombIcon />
                <span className="min-w-0 break-words">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>




    </motion.article>
  );
}
