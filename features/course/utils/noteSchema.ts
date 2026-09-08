import { z } from "zod";
import type { useTranslations } from "next-intl";

export function createNoteContentSchema(
  t: ReturnType<typeof useTranslations<"course">>,
) {
  return z.object({
    content: z
      .string()
      .trim()
      .min(1, t("noteRequired"))
      .max(2000, t("noteTooLong")),
  });
}

export type NoteContentValues = z.infer<ReturnType<typeof createNoteContentSchema>>;
