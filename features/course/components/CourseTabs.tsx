"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import type { CourseTabsProps, VideoWatchTabId } from "../types";

const TABS: VideoWatchTabId[] = ["content", "notes"];

export function CourseTabs({ activeTab, onTabChange }: CourseTabsProps) {
  const t = useTranslations("lessonsDetail");

  const labels: Record<VideoWatchTabId, string> = {
    content: t("lessonContent"),
    notes: t("takeNotes"),
  };

  return (
    <LayoutGroup id="course-watch-tabs">
      <div
        role="tablist"
        aria-label={t("lessonContent")}
        className="flex gap-6 border-b border-white/15"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              id={`watch-tab-${tab}`}
              aria-controls={`watch-tabpanel-${tab}`}
              onClick={() => onTabChange(tab)}
              className={cn(
                "relative pb-3 text-sm font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive ? "text-white" : "text-white/55 hover:text-white/80",
              )}
            >
              <span className="relative inline-block">
                {labels[tab]}
                {isActive ? (
                  <motion.span
                    layoutId="course-watch-tab-underline"
                    className="absolute inset-x-0 -bottom-3 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
