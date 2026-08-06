"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
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
        className="grid grid-cols-2 gap-1 rounded-full bg-white/5 p-1"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              id={`watch-tab-${tab}`}
              aria-controls={`watch-tabpanel-${tab}`}
              onClick={() => onTabChange(tab)}
              className={cn(
                "relative z-10 h-auto rounded-full bg-transparent px-3 py-2.5 text-sm font-semibold hover:bg-transparent",
                "focus-visible:ring-2 focus-visible:ring-white/40",
                !isActive && "hover:bg-white/5",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="course-watch-tab-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10",
                  isActive ? "text-white" : "text-white/70",
                )}
              >
                {labels[tab]}
              </span>
            </Button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
