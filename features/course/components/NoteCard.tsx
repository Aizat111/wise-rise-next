"use client";

import { useTranslations } from "next-intl";

import type { NoteCardProps } from "../types";
import { parseDurationToSeconds } from "../utils/playbackTime";

export function NoteCard({ duration, content, onSeek }: NoteCardProps) {
  const t = useTranslations("course");
  const seconds = parseDurationToSeconds(duration);

  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <button
        type="button"
        onClick={() => onSeek(seconds)}
        aria-label={t("seekToNoteAria", { time: duration })}
        className="mb-2 inline-flex rounded-md bg-primary/20 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary transition-colors hover:bg-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        {duration}
      </button>
      <p className="whitespace-pre-wrap text-sm leading-6 text-white/85">
        {content}
      </p>
    </article>
  );
}
