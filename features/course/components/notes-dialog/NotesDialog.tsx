"use client";

import { useEffect, useMemo, useState } from "react";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { notify } from "@/shared/components/notify/store/notify.store";
import type { VideoNote } from "@/core/types/notes.types";

import { useCourseNotesQuery } from "../../api/notes.queries";
import {
  useDeleteVideoNoteMutation,
  useUpdateVideoNoteMutation,
} from "../../api/notes.mutations";
import type { NotesDialogProps } from "../../types";
import {
  buildNotePlayHref,
  findVideoForNote,
  getNoteVideoId,
} from "../../utils/notePlayback";
import { DeleteNoteDialog } from "./DeleteNoteDialog";
import { NoteCourseHeader } from "./NoteCourseHeader";
import { NoteItem } from "./NoteItem";

function NotesDialogSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      <div className="flex items-start justify-between gap-3 pr-8">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-6 w-2/3 bg-muted" />
          <Skeleton className="h-4 w-1/2 bg-muted" />
        </div>
        <Skeleton className="h-16 w-24 shrink-0 rounded-lg bg-muted sm:h-20 sm:w-28" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-border bg-background/40 p-4"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-14 bg-muted" />
            <Skeleton className="h-7 w-24 bg-muted" />
          </div>
          <Skeleton className="mt-3 h-4 w-1/3 bg-muted" />
          <Skeleton className="mt-2 h-16 w-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function NotesDialog({
  open,
  onOpenChange,
  course,
  videos,
  teacherSlug,
  courseSlug,
}: NotesDialogProps) {
  const t = useTranslations("course");
  const videoIds = useMemo(
    () => videos.map((video) => String(video.id)),
    [videos],
  );

  const {
    notes,
    isLoading,
    isError,
    isFetchingNextPage,
    hasMore,
    refetch,
    fetchNextPage,
  } = useCourseNotesQuery(videoIds, open && videoIds.length > 0);

  const updateNote = useUpdateVideoNoteMutation();
  const deleteNote = useDeleteVideoNoteMutation();

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEditingNoteId(null);
      setPendingDeleteId(null);
    }
  }, [open]);

  useEffect(() => {
    if (open && isError) {
      notify.error(t("notesDialogLoadError"), { id: "course-notes-load-error" });
    }
  }, [open, isError, t]);

  const pendingDeleteNote =
    notes.find((note) => note.id === pendingDeleteId) ?? null;

  const handleSave = async (note: VideoNote, content: string) => {
    try {
      await updateNote.mutateAsync({
        id: note.id,
        content,
        videoId: getNoteVideoId(note),
      });
      setEditingNoteId(null);
      notify.success(t("updateNoteSuccess"));
    } catch {
      notify.error(t("updateNoteError"));
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteNote || deleteNote.isPending) return;

    try {
      await deleteNote.mutateAsync({
        id: pendingDeleteNote.id,
        videoId: getNoteVideoId(pendingDeleteNote),
      });
      setPendingDeleteId(null);
      if (editingNoteId === pendingDeleteNote.id) {
        setEditingNoteId(null);
      }
      notify.success(t("deleteNoteSuccess"));
    } catch {
      notify.error(t("deleteNoteError"));
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className={cn(
            "flex max-h-[90vh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden bg-surface p-0 text-foreground ring-foreground/10 md:max-h-[85vh] sm:max-w-3xl",
          )}
        >
          <DialogHeader className="sticky top-0 z-10 shrink-0 border-b border-border bg-surface px-5 pb-4 pt-5">
            <DialogDescription className="sr-only">
              {t("notesDialogAria")}
            </DialogDescription>
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-3 right-3"
                  aria-label={t("closeNotes")}
                />
              }
            >
              <XIcon className="size-4" />
              <span className="sr-only">{t("closeNotes")}</span>
            </DialogClose>
            <NoteCourseHeader
              title={course.name}
              teacherName={course.teacher?.name ?? ""}
              categoryName={course.category?.name ?? null}
              coverSrc={
                course.cover?.path ??
                course.thumbnail?.path ??
                course.banner?.path ??
                videos[0]?.thumbnail ??
                null
              }
            />
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {isLoading ? <NotesDialogSkeleton /> : null}

            {!isLoading && isError ? (
              <div className="flex flex-col items-start gap-3 rounded-lg border border-border p-4 text-sm text-muted-foreground">
                <p>{t("notesDialogLoadError")}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void refetch()}
                >
                  {t("retry")}
                </Button>
              </div>
            ) : null}

            {!isLoading && !isError && notes.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {t("notesEmpty")}
              </p>
            ) : null}

            {!isLoading && !isError && notes.length > 0 ? (
              <div
                aria-label={t("notesDialogAria")}
                className="flex flex-col gap-3"
              >
                {notes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    lessonName={
                      findVideoForNote(videos, note)?.name?.trim() ?? ""
                    }
                    isEditing={editingNoteId === note.id}
                    isUpdating={
                      updateNote.isPending &&
                      updateNote.variables?.id === note.id
                    }
                    isDeleting={
                      deleteNote.isPending &&
                      deleteNote.variables?.id === note.id
                    }
                    playHref={buildNotePlayHref({
                      note,
                      videos,
                      teacherSlug: teacherSlug || course.teacher?.slug,
                      courseSlug: courseSlug || course.slug,
                    })}
                    onEdit={() => setEditingNoteId(note.id)}
                    onCancelEdit={() => setEditingNoteId(null)}
                    onSave={(content) => void handleSave(note, content)}
                    onDelete={() => setPendingDeleteId(note.id)}
                  />
                ))}

                {hasMore ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isFetchingNextPage}
                    onClick={fetchNextPage}
                    className="mt-1 self-center"
                  >
                    {t("loadMoreNotes")}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <DeleteNoteDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(next) => {
          if (!next) setPendingDeleteId(null);
        }}
        isDeleting={deleteNote.isPending}
        onConfirm={() => void handleConfirmDelete()}
      />
    </>
  );
}
