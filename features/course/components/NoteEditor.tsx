"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { notify } from "@/shared/components/notify/store/notify.store";
import { cn } from "@/lib/utils";

import { useCreateVideoNoteMutation } from "../api/notes.mutations";
import type { NoteEditorProps } from "../types";
import { formatSecondsToDuration } from "../utils/playbackTime";

function createNoteSchema(t: ReturnType<typeof useTranslations<"course">>) {
  return z.object({
    content: z
      .string()
      .trim()
      .min(1, t("noteRequired"))
      .max(2000, t("noteTooLong")),
  });
}

type NoteFormValues = z.infer<ReturnType<typeof createNoteSchema>>;

export function NoteEditor({ videoId, currentTime }: NoteEditorProps) {
  const t = useTranslations("course");
  const createNote = useCreateVideoNoteMutation();

  const schema = useMemo(() => createNoteSchema(t), [t]);
  const resolver = useMemo(() => standardSchemaResolver(schema), [schema]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormValues>({
    mode: "onSubmit",
    resolver,
    defaultValues: { content: "" },
  });

  const isLoading = createNote.isPending || isSubmitting;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createNote.mutateAsync({
        content: values.content.trim(),
        duration: formatSecondsToDuration(currentTime),
        video_id: videoId,
      });
      reset({ content: "" });
      notify.success(t("noteSaved"));
    } catch {
      notify.error(t("noteSaveError"));
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label htmlFor="video-note-content" className="sr-only">
        {t("notePlaceholder")}
      </label>
      <textarea
        id="video-note-content"
        rows={4}
        placeholder={t("notePlaceholder")}
        disabled={isLoading}
        aria-invalid={Boolean(errors.content)}
        className={cn(
          "min-h-24 w-full resize-y rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none",
          "placeholder:text-white/40",
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
      <Button
        type="submit"
        disabled={isLoading}
        className="h-auto self-end bg-primary px-5 py-2.5 text-sm text-white hover:bg-primary/90"
      >
        {isLoading ? t("noteSaving") : t("saveNote")}
      </Button>
    </form>
  );
}
