"use client";

import { useId } from "react";
import { useReducedMotion } from "framer-motion";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import {
  BUSINESS_SWIPER_AUTOPLAY,
  BUSINESS_SWIPER_BREAKPOINTS,
  BUSINESS_SWIPER_SPEED_MS,
} from "../constants";
import type { BusinessReferencesProps } from "../types";

import "swiper/css";

export function BusinessReferences({
  title,
  logos,
  className,
}: BusinessReferencesProps) {
  const headingId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn("my-8 text-center sm:my-10 lg:my-12", className)}
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="mb-8 text-sm font-semibold uppercase tracking-wide text-primary sm:mb-10 sm:text-lg"
      >
        {title}
      </h2>

      <Swiper
        modules={[Autoplay, A11y, Keyboard]}
        loop
        grabCursor
        allowTouchMove
        slidesPerView={2}
        spaceBetween={24}
        speed={reduceMotion ? 0 : BUSINESS_SWIPER_SPEED_MS}
        autoplay={reduceMotion ? false : { ...BUSINESS_SWIPER_AUTOPLAY }}
        breakpoints={BUSINESS_SWIPER_BREAKPOINTS}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        watchOverflow
        className="w-full"
        aria-labelledby={headingId}
      >
        {logos.map((logo) => (
          <SwiperSlide key={logo.src} className="flex items-center justify-center">
            <div className="flex h-16 items-center justify-center px-2 sm:h-20">
              <Image
                src={logo.src}
                alt={logo.name}
                width={160}
                height={72}
                className="h-10 w-auto max-w-[140px] object-contain sm:h-12"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
