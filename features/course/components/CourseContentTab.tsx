"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import type { CourseContentTabProps } from "../types";

export function CourseContentTab({ content }: CourseContentTabProps) {
  const t = useTranslations("course");
  const tLessons = useTranslations("lessonsDetail");
  const trimmed = content.trim();

  return (
    <div
      role="tabpanel"
      id="watch-tabpanel-content"
      aria-labelledby="watch-tab-content"
      className="pt-4"
    >
      <h2 className="mb-3 text-base font-semibold text-white">
        {tLessons("lessonContent")}
      </h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={trimmed ? "content" : "empty"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
        >
          {trimmed ? (
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-sm leading-7 text-white/80 lg:text-[0.95rem]">
                {trimmed}
              </p>
            </div>
          ) : (
            <p className="text-sm text-white/50">{t("noVideoContent")}</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
