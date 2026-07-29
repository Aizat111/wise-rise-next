"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HOME_THEME_STYLES } from "../constants";
import type { HomeTabId } from "../types";

type HomeThemeWrapperProps = {
  activeTab: HomeTabId;
  children: ReactNode;
  className?: string;
};

export function HomeThemeWrapper({
  activeTab,
  children,
  className,
}: HomeThemeWrapperProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[calc(100dvh-4rem)] flex-1 flex-col overflow-hidden",
        className,
      )}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={activeTab}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          style={HOME_THEME_STYLES[activeTab]}
          className="pointer-events-none absolute inset-0"
        />
      </AnimatePresence>

      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
