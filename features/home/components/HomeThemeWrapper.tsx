"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type HomeThemeWrapperProps = {
  themeKey: string;
  themeStyle: CSSProperties;
  children: ReactNode;
  className?: string;
};

/**
 * Animated full-bleed theme surface for a home variant.
 * Used by DefaultHome / WeTheLivingHome independently — not a content dependency.
 */
export function HomeThemeWrapper({
  themeKey,
  themeStyle,
  children,
  className,
}: HomeThemeWrapperProps) {
  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col overflow-hidden",
        className,
      )}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={themeKey}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          style={themeStyle}
          className="pointer-events-none absolute inset-0"
        />
      </AnimatePresence>

      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
