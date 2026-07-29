"use client";

import { motion } from "framer-motion";
import Image from "@/shared/ui/Images/Image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import type { HomeTabItemConfig } from "../types";

type HomeTabItemProps = {
  tab: HomeTabItemConfig;
  isActive: boolean;
  onSelect: () => void;
};

export function HomeTabItem({ tab, isActive, onSelect }: HomeTabItemProps) {
  const isLogo = tab.type === "logo";

  return (
    <Button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-label={tab.label}
      onClick={onSelect}
      className={cn(
        "relative z-10 flex min-h-10 flex-1 items-center justify-center rounded-full px-2 py-2 transition-colors duration-300 sm:min-h-11 sm:px-3 bg-transparent hover:bg-transparent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#25262b]",
        !isActive && "hover:bg-[#3a3b41]",
      )}
    >
      {isActive ? (
        <motion.span
          layoutId="home-tab-active-pill"
          className="absolute inset-0 rounded-full bg-white"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      ) : null}

      <span className="relative z-10 flex items-center justify-center">
        {isLogo && tab.logoSrc ? (
          <Image
            src={isActive ? tab.darkLogoSrc ?? tab.logoSrc : tab.logoSrc}
            alt={tab.logoAlt ?? tab.label}
            width={120}
            height={32}
            priority
            className={cn(
              "h-5 w-auto object-contain sm:h-6",
            )}
          />
        ) : (
          <span
            className={cn(
              "text-center text-[11px] font-bold uppercase leading-tight tracking-tight transition-colors duration-300 sm:text-xs",
              isActive ? "text-[#18171c]" : "text-white/85",
            )}
          >
            <span className="block">TÜM</span>
            <span className="block">İÇERİKLER</span>
          </span>
        )}
      </span>
    </Button>
  );
}
