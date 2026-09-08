"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2, Pencil, Play, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";
import type { VideoNote } from "@/core/types/notes.types";

import {
  createNoteContentSchema,
  type NoteContentValues,
} from "../../utils/noteSchema";
import {
  formatVideoDuration,
  parseDurationToSeconds,
} from "../../utils/playbackTime";

type NoteItemProps = {
  note: VideoNote;
  lessonName: string;
  isEditing: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  playHref: string | null;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (content: string) => void;
  onDelete: () => void;
};

export function NoteItem({
  note,
  lessonName,
  isEditing,
  isUpdating,
  isDeleting,
  playHref,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: NoteItemProps) {
  const t = useTranslations("course");
  const displayTime = formatVideoDuration(parseDurationToSeconds(note.duration));
  const actionsDisabled = isUpdating || isDeleting;

  const schema = useMemo(() => createNoteContentSchema(t), [t]);
  const resolver = useMemo(() => standardSchemaResolver(schema), [schema]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteContentValues>({
    mode: "onSubmit",
    resolver,
    defaultValues: { content: note.content },
  });

  useEffect(() => {
    if (isEditing) {
      reset({ content: note.content });
    }
  }, [isEditing, note.content, reset]);

  const onSubmit = handleSubmit((values) => {
    onSave(values.content.trim());
  });

  return (
    <article className="rounded-xl border border-border bg-background/40 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex rounded-md bg-destructive px-2 py-0.5 text-xs font-semibold tabular-nums text-white">
          {displayTime}
        </span>

        <div className="flex items-center gap-0.5">
          {playHref && !actionsDisabled ? (
            <Link
              href={playHref}
              title={t("playNote")}
              aria-label={t("playNote")}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "text-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Play className="size-4" />
            </Link>
          ) : (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              title={t("playNote")}
              aria-label={t("playNote")}
              disabled
              className="text-foreground hover:bg-muted hover:text-foreground"
            >
              <Play className="size-4" />
            </Button>
          )}
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            title={t("editNote")}
            aria-label={t("editNote")}
            disabled={actionsDisabled}
            onClick={onEdit}
            className="text-foreground hover:bg-muted hover:text-foreground"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            title={t("deleteNote")}
            aria-label={t("deleteNote")}
            disabled={actionsDisabled}
            aria-busy={isDeleting}
            onClick={onDelete}
            className="text-foreground hover:bg-muted hover:text-foreground"
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {lessonName ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {t("notesLesson", { name: lessonName })}
        </p>
      ) : null}

      {isEditing ? (
        <form onSubmit={onSubmit} className="mt-2 flex flex-col gap-3">
          <label htmlFor={`note-edit-${note.id}`} className="sr-only">
            {t("editNote")}
          </label>
          <textarea
            id={`note-edit-${note.id}`}
            rows={4}
            disabled={isUpdating}
            aria-invalid={Boolean(errors.content)}
            className={cn(
              "min-h-24 w-full resize-y overflow-auto rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none",
              "whitespace-pre-wrap wrap-break-word",
              "focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
              errors.content && "border-destructive aria-invalid:ring-destructive/30",
            )}
            {...register("content")}
          />
          {errors.content ? (
            <p className="text-xs text-destructive" role="alert">
              {errors.content.message}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isUpdating}
              onClick={onCancelEdit}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isUpdating} aria-busy={isUpdating}>
              {isUpdating ? t("noteSaving") : t("saveNote")}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-2 rounded-lg bg-surface p-3">
          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-foreground">
            {note.content}
          </p>
        </div>
      )}
    </article>
  );
}
