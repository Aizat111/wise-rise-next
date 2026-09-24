"use client";

import { motion } from "framer-motion";

import Image from "@/shared/ui/Images/Image";

export type CategoryHeroProps = {
  title: string;
  subtitle?: string;
  backgroundSrc: string;
  /** Use `p` when the page already has an SEO `h1`. */
  titleAs?: "h1" | "p";
  alt?: string;
};

export function CategoryHero({
  title,
  subtitle,
  backgroundSrc,
  titleAs = "h1",
  alt = "",
}: CategoryHeroProps) {
  const TitleTag = titleAs === "p" ? motion.p : motion.h1;
  return (
    <section className="relative isolate w-full overflow-hidden">
      <div className="relative  w-full min-h-[280px] lg:min-h-[340px]">
        <Image
          src={backgroundSrc}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/55 to-black/55"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <TitleTag
            key={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-w-4xl text-2xl font-semibold tracking-tight text-white sm:text-4xl lg:text-4xl"
          >
            {title}
          </TitleTag>
          {subtitle ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
              className="mt-3 max-w-2xl text-xs text-white sm:mt-4 sm:text-base lg:text-sm"
            >
              {subtitle}
            </motion.p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
