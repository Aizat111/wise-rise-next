"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { useVideoNotesQuery } from "../api/notes.queries";
import type { NotesTabProps } from "../types";
import { NoteCard } from "./NoteCard";
import { NoteEditor } from "./NoteEditor";

function NotesListSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-lg border border-white/10 bg-white/5 p-3"
        >
          <div className="mb-2 h-5 w-16 rounded bg-white/10" />
          <div className="h-4 w-full rounded bg-white/10" />
          <div className="mt-2 h-4 w-3/4 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export function NotesTab({
  videoId,
  currentTime,
  onSeek,
  enabled = true,
}: NotesTabProps) {
  const t = useTranslations("course");
  const tLessons = useTranslations("lessonsDetail");
  const { data: notes = [], isLoading, isError, refetch } = useVideoNotesQuery(
    videoId,
    enabled && Boolean(videoId),
  );

  return (
    <div
      role="tabpanel"
      id="watch-tabpanel-notes"
      aria-labelledby="watch-tab-notes"
      className="flex flex-col gap-5 pt-4"
    >
      <h2 className="text-base font-semibold text-white">
        {tLessons("takeNotes")}
      </h2>

      {enabled ? (
        <NoteEditor videoId={videoId} currentTime={currentTime} />
      ) : (
        <p className="text-sm text-white/60">{t("loginRequiredTitle")}</p>
      )}

      <div aria-label={t("notesListAria")} className="flex flex-col gap-3">
        {!enabled ? null : isLoading ? <NotesListSkeleton /> : null}

        {enabled && isError ? (
          <div className="rounded-lg border border-white/10 p-3 text-sm text-white/70">
            <p>{t("notesLoadError")}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-2 text-primary underline-offset-2 hover:underline"
            >
              {t("retry")}
            </button>
          </div>
        ) : null}

        {enabled && !isLoading && !isError && notes.length === 0 ? (
          <p className="text-sm text-white/50">{t("noNotes")}</p>
        ) : null}

        <AnimatePresence initial={false}>
          {enabled
            ? notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <NoteCard
                    duration={note.duration}
                    content={note.content}
                    onSeek={onSeek}
                  />
                </motion.div>
              ))
            : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
