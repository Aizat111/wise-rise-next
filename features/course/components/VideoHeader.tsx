"use client";

import { motion } from "framer-motion";

import type { VideoHeaderProps } from "../types";
import { ShareDropdown } from "./ShareDropdown";

export function VideoHeader({ title, shareUrl }: VideoHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
    >
      <h1 className="min-w-0 flex-1 text-xl font-semibold leading-snug text-white sm:text-2xl lg:text-[1.75rem]">
        {title}
      </h1>
      <div className="shrink-0 self-start sm:self-center">
        <ShareDropdown shareUrl={shareUrl} shareTitle={title} />
      </div>
    </motion.div>
  );
}
