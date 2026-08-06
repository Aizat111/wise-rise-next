"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import type { VideoSidebarProps, VideoWatchTabId } from "../types";
import { CourseContentTab } from "./CourseContentTab";
import { CourseTabs } from "./CourseTabs";
import { NotesTab } from "./NotesTab";
import { TeacherInfoCard } from "./TeacherInfoCard";

export function VideoSidebar({
  teacherName,
  teacherPhoto,
  categoryName,
  content,
  videoId,
  currentTime,
  onSeek,
  notesEnabled = true,
}: VideoSidebarProps) {
  const [activeTab, setActiveTab] = useState<VideoWatchTabId>("content");

  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/3 p-4 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto lg:self-start">
      <TeacherInfoCard
        teacherName={teacherName}
        teacherPhoto={teacherPhoto}
        categoryName={categoryName}
      />

      <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.22 }}
        >
          {activeTab === "content" ? (
            <CourseContentTab content={content} />
          ) : (
            <NotesTab
              videoId={videoId}
              currentTime={currentTime}
              onSeek={onSeek}
              enabled={notesEnabled}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
